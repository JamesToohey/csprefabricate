import { ContentSecurityPolicy } from "./types";
export declare const processRules: (rules: Array<string> | Array<string | Record<string, Array<string>>>) => string;
export declare const create: (obj: ContentSecurityPolicy) => string;
