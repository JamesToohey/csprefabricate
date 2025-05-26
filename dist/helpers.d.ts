import { ContentSecurityPolicy } from "./types";
export interface WarningOptions {
    overlyPermissive?: boolean;
    missingDirectives?: boolean;
    unsafeInline?: boolean;
    missingNonceOrHash?: boolean;
    dataUri?: boolean;
}
export declare function warnOnCspIssues(csp: ContentSecurityPolicy, overrides?: WarningOptions): void;
export declare const isValidDirective: (directive: string) => boolean;
export declare const formatRule: (rule: string) => string;
