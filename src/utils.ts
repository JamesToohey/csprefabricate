import {formatRule, isValidDirective} from "./helpers";
import {ContentSecurityPolicy} from "./types";

export const processRules = (
    rules: Array<string> | Array<string | Record<string, Array<string>>>,
) => {
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

export const createCsp = (obj: ContentSecurityPolicy) => {
    const cspString = Object.entries(obj)
        .filter(([directive, _rules]) => {
            const isValid = isValidDirective(directive);
            if (!isValid) {
                console.warn(
                    `"${directive}" is not a valid CSP directive and has been ignored.`,
                );
            }
            return isValid;
        })
        .map(([directive, rules]) => `${directive} ${processRules(rules)}`);
    return `${cspString.join("; ")};`;
};
