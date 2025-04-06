import { formatRule, isValidDirective } from "./helpers";
export const processRules = (rules) => {
    return rules
        .map((rule) => {
        if (typeof rule === "object") {
            return Object.entries(rule).map(([domain, tlds]) => tlds.map((tld) => `${domain}${tld}`).join(" "));
        }
        else {
            return formatRule(rule);
        }
    })
        .join(" ");
};
export const create = (obj) => {
    const entries = Object.entries(obj);
    const cspString = entries
        .filter(([directive, _rules]) => {
        const isValid = isValidDirective(directive);
        if (!isValid) {
            console.warn(`"${directive}" is not a valid CSP directive and has been ignored.`);
        }
        return isValid;
    })
        .map(([directive, rules]) => `${directive}${rules && rules.length > 0 ? " " + processRules(rules) : ""}`);
    return `${cspString.join("; ")};`;
};
