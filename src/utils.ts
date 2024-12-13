import { parse } from "yaml";
import { formatRule, isValidDirective } from "./helpers";

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

export const createCsp = (yaml: string) => {
  const parsed: Record<string, string[] | Record<string, Array<string>>> =
    parse(yaml);
  const cspString = Object.entries(parsed.csp)
    .filter(([directive, _rules]) => {
      const isValid = isValidDirective(directive)
      if (!isValid) {
        console.warn(`"${directive}" is not a valid CSP directive and has been ignored.`)
      }
      return isValid;
    })
    .map(([directive, rules]) => `${directive} ${processRules(rules)}`);
  return `${cspString.join("; ")};`;
};
