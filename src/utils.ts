import {
    formatRule,
    isValidDirective,
    warnOnCspIssues,
    WarningOptions,
} from "./helpers";
import {
    ContentSecurityPolicy,
    Directive,
    Rules,
    BasicDirectiveRule,
} from "./types";

export const processRules = (rules: BasicDirectiveRule): string => {
    // Flatten and deduplicate rules
    const seen = new Set<string>();
    for (const rule of rules) {
        if (typeof rule === "object") {
            for (const [domain, tlds] of Object.entries(rule)) {
                for (const tld of tlds) {
                    const combined = `${domain}${tld}`;
                    if (combined.includes(";") || combined.includes(",")) {
                        throw new Error(
                            `[CSPrefabricate] Invalid character in rule: ${combined}`,
                        );
                    }
                    seen.add(combined);
                }
            }
        } else {
            const formatted = formatRule(rule);
            if (formatted.includes(";") || formatted.includes(",")) {
                throw new Error(
                    `[CSPrefabricate] Invalid character in rule: ${formatted}`,
                );
            }

            // Validate nonces and hashes
            if (
                formatted.startsWith("'nonce-") ||
                formatted.startsWith("nonce-") ||
                formatted.startsWith("'sha") ||
                formatted.startsWith("sha256-") ||
                formatted.startsWith("sha384-") ||
                formatted.startsWith("sha512-")
            ) {
                const nonceRegex = /^'nonce-[a-zA-Z0-9+/_-]+={0,2}'$/;
                const hashRegex =
                    /^'(sha256|sha384|sha512)-[a-zA-Z0-9+/_-]+={0,2}'$/;

                if (
                    formatted.startsWith("'nonce-") ||
                    formatted.startsWith("nonce-")
                ) {
                    if (!nonceRegex.test(formatted)) {
                        console.warn(
                            `[CSPrefabricate] Invalid nonce format: ${formatted}. Rule dropped.`,
                        );
                        continue;
                    }
                } else {
                    if (!hashRegex.test(formatted)) {
                        console.warn(
                            `[CSPrefabricate] Invalid hash format: ${formatted}. Rule dropped.`,
                        );
                        continue;
                    }
                }
            }

            seen.add(formatted);
        }
    }
    return Array.from(seen).sort().join(" ");
};

/**
 * Creates a CSP string from a ContentSecurityPolicy object.
 * Filters out invalid directives and formats the CSP string.
 * @param obj - The ContentSecurityPolicy object.
 * @returns The formatted CSP string.
 */
export const create = (
    obj: ContentSecurityPolicy,
    warningOptions?: WarningOptions,
): string => {
    warnOnCspIssues(obj, warningOptions);
    const entries = (Object.entries(obj) as [Directive, Rules][]).sort(
        ([a], [b]) => a.localeCompare(b),
    );
    const cspString = entries
        .filter(([directive, _rules]) => {
            const isValid = isValidDirective(directive);
            if (!isValid) {
                console.warn(
                    `[CSPrefabricate] "${directive}" is not a valid CSP directive and has been ignored.`,
                );
            }
            return isValid;
        })
        .map(([directive, rules]) => {
            if (Array.isArray(rules)) {
                // Filter out non-string/object values at runtime
                const filtered: (string | Record<string, string[]>)[] =
                    rules.filter(
                        (r): r is string | Record<string, string[]> =>
                            typeof r === "string" ||
                            (typeof r === "object" && r !== null),
                    );
                const processed = processRules(filtered);
                return processed ? `${directive} ${processed}` : `${directive}`;
            }
            return `${directive}`;
        });
    return cspString.length > 0 ? `${cspString.join("; ")};` : "";
};
