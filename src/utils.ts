import {formatRule, isValidDirective, warnOnCspIssues, WarningOptions} from "./helpers";
import {ContentSecurityPolicy, Directive, Rules, BasicDirectiveRule} from "./types";

export const processRules = (
    rules: BasicDirectiveRule,
): string => {
    // Flatten and deduplicate rules
    const seen = new Set<string>();
    for (const rule of rules) {
        if (typeof rule === "object") {
            for (const [domain, tlds] of Object.entries(rule)) {
                for (const tld of tlds) {
                    seen.add(`${domain}${tld}`);
                }
            }
        } else {
            seen.add(formatRule(rule));
        }
    }
    return Array.from(seen).join(" ");
};

/**
 * Creates a CSP string from a ContentSecurityPolicy object.
 * Filters out invalid directives and formats the CSP string.
 * @param obj - The ContentSecurityPolicy object.
 * @returns The formatted CSP string.
 */
export const create = (obj: ContentSecurityPolicy, warningOptions?: WarningOptions): string => {
    warnOnCspIssues(obj, warningOptions);
    const entries = Object.entries(obj) as [Directive, Rules][];
    const cspString = entries
        .filter(([directive, _rules]) => {
            const isValid = isValidDirective(directive);
            if (!isValid) {
                console.warn(
                    `"[CSPrefabricate] ${directive}" is not a valid CSP directive and has been ignored.`,
                );
            }
            return isValid;
        })
        .map(([directive, rules]) => {
            if (Array.isArray(rules)) {
                // Filter out non-string/object values at runtime
                const filtered: (string | Record<string, string[]>)[] = rules.filter(
                    (r): r is string | Record<string, string[]> =>
                        typeof r === "string" || (typeof r === "object" && r !== null)
                );
                const processed = processRules(filtered);
                return processed ? `${directive} ${processed}` : `${directive}`;
            }
            return `${directive}`;
        });
    return cspString.length > 0 ? `${cspString.join("; ")};` : "";
};
