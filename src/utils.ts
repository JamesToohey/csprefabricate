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

const NONCE_REGEX = /^'nonce-[a-zA-Z0-9+/_-]+={0,2}'$/;
const HASH_REGEX = /^'(sha256|sha384|sha512)-[a-zA-Z0-9+/_-]+={0,2}'$/;
const NONCE_PREFIXES = ["'nonce-", "nonce-"];
const HASH_PREFIXES = ["'sha", "sha256-", "sha384-", "sha512-"];
const INVALID_RULE_CHAR_REGEX = /[;,\r\n]|[\u0000-\u001F\u007F]/;
const hasInvalidRuleChars = (rule: string): boolean =>
    INVALID_RULE_CHAR_REGEX.test(rule);

export const processRules = (rules: BasicDirectiveRule): string => {
    // Flatten and deduplicate rules
    const seen = new Set<string>();
    for (const rule of rules) {
        if (typeof rule === "object") {
            for (const [domain, tlds] of Object.entries(rule)) {
                for (const tld of tlds) {
                    const combined = `${domain}${tld}`;
                    if (hasInvalidRuleChars(combined)) {
                        throw new Error(
                            `[CSPrefabricate] Invalid character in rule: ${combined}`,
                        );
                    }
                    seen.add(combined);
                }
            }
        } else {
            const formatted = formatRule(rule);
            if (hasInvalidRuleChars(formatted)) {
                throw new Error(
                    `[CSPrefabricate] Invalid character in rule: ${formatted}`,
                );
            }

            // Validate nonces and hashes
            const isNonce = NONCE_PREFIXES.some((prefix) =>
                formatted.startsWith(prefix),
            );
            const isHash = HASH_PREFIXES.some((prefix) =>
                formatted.startsWith(prefix),
            );

            if (isNonce || isHash) {
                if (isNonce) {
                    if (!NONCE_REGEX.test(formatted)) {
                        console.warn(
                            `[CSPrefabricate] Invalid nonce format: ${formatted}. Rule dropped.`,
                        );
                        continue;
                    }
                } else {
                    if (!HASH_REGEX.test(formatted)) {
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
