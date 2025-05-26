import { WarningOptions } from "./helpers";
import { ContentSecurityPolicy, BasicDirectiveRule } from "./types";
export declare const processRules: (rules: BasicDirectiveRule) => string;
/**
 * Creates a CSP string from a ContentSecurityPolicy object.
 * Filters out invalid directives and formats the CSP string.
 * @param obj - The ContentSecurityPolicy object.
 * @returns The formatted CSP string.
 */
export declare const create: (obj: ContentSecurityPolicy, warningOptions?: WarningOptions) => string;
