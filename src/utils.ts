import {formatRule, isValidDirective} from "./helpers";
import {ContentSecurityPolicy, Directive, Rules, BasicDirectiveRule} from "./types";

export const processRules = (
    rules: BasicDirectiveRule,
): string => {
    return rules
        .map((rule) => {
            if (typeof rule === "object") {
                return Object.entries(rule).map(([domain, tlds]) =>
                    tlds.map((tld) => `${domain}${tld}`).join(" "),
                );
            } else {
                return formatRule(rule);
            }
        })
        .join(" ");
};

/**
 * Creates a CSP string from a ContentSecurityPolicy object.
 * Filters out invalid directives and formats the CSP string.
 * @param obj - The ContentSecurityPolicy object.
 * @returns The formatted CSP string.
 */
export const create = (obj: ContentSecurityPolicy): string => {
    const entries = Object.entries(obj) as [Directive, Rules][];
    const cspString = entries
        .filter(([directive, _rules]) => {
            const isValid = isValidDirective(directive);
            if (!isValid) {
                console.warn(
                    `"${directive}" is not a valid CSP directive and has been ignored.`,
                );
            }
            return isValid;
        })
        .map(([directive, rules]) => {
            if (Array.isArray(rules) && rules.length > 0) {
                return `${directive} ${processRules(rules)}`;
            }
            return `${directive}`;
        });
    return `${cspString.join("; ")};`;
};
