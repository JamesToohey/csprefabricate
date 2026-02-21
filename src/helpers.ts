import {ContentSecurityPolicy, Directive} from "./types";

export interface WarningOptions {
    overlyPermissive?: boolean;
    missingDirectives?: boolean;
    unsafeInline?: boolean;
    missingNonceOrHash?: boolean;
    dataUri?: boolean;
    deprecatedDirectives?: boolean;
}

const DEFAULT_WARNINGS: Required<WarningOptions> = {
    overlyPermissive: true,
    missingDirectives: true,
    unsafeInline: true,
    missingNonceOrHash: true,
    dataUri: true,
    deprecatedDirectives: true,
};

const validDirectives = [
    "default-src",
    "script-src",
    "style-src",
    "img-src",
    "connect-src",
    "font-src",
    "object-src",
    "media-src",
    "frame-src",
    "sandbox",
    "report-uri",
    "child-src",
    "form-action",
    "frame-ancestors",
    "plugin-types",
    "base-uri",
    "report-to",
    "worker-src",
    "manifest-src",
    "prefetch-src",
    "navigate-to",
    "require-trusted-types-for",
    "trusted-types",
    "upgrade-insecure-requests",
    "block-all-mixed-content",
    "script-src-elem",
    "script-src-attr",
    "style-src-elem",
    "style-src-attr",
    "webrtc",
    "fenced-frame-src",
];

const specialRules = [
    "none",
    "self",
    "unsafe-inline",
    "unsafe-eval",
    "strict-dynamic",
    "unsafe-hashes",
    "wasm-unsafe-eval",
    "inline-speculation-rules",
    "unsafe-allow-redirects",
    "trusted-types-eval",
    "report-sample",
    "report-sha256",
    "report-sha384",
    "report-sha512",
    "unsafe-webtransport-hashes",
    "allow",
    "block",
    "script",
];

export function warnOnCspIssues(
    csp: ContentSecurityPolicy,
    overrides: WarningOptions = {},
): void {
    const options = {...DEFAULT_WARNINGS, ...overrides};

    // 1. Overly permissive: * in script-src, style-src, etc.
    if (options.overlyPermissive) {
        (
            [
                Directive.SCRIPT_SRC,
                Directive.STYLE_SRC,
                Directive.IMG_SRC,
                Directive.CONNECT_SRC,
            ] as const
        ).forEach((directive) => {
            const rules = csp[directive];
            if (Array.isArray(rules) && rules.includes("*")) {
                console.warn(
                    `[CSPrefabricate] Overly permissive: '*' found in ${directive}`,
                );
            }
        });
    }

    // 2. Missing important directives
    if (options.missingDirectives) {
        [
            Directive.OBJECT_SRC,
            Directive.BASE_URI,
            Directive.FORM_ACTION,
        ].forEach((directive) => {
            if (!(directive in csp)) {
                console.warn(
                    `[CSPrefabricate] Missing recommended directive: ${directive}`,
                );
            }
        });
    }

    // 3. Unsafe inline
    if (options.unsafeInline) {
        ([Directive.SCRIPT_SRC, Directive.STYLE_SRC] as const).forEach(
            (directive) => {
                const rules = csp[directive];
                if (Array.isArray(rules) && rules.includes("'unsafe-inline'")) {
                    console.warn(
                        `[CSPrefabricate] 'unsafe-inline' found in ${directive}`,
                    );
                }
            },
        );
    }

    // 4. Missing nonce or hash in script-src if 'unsafe-inline' is present
    if (options.missingNonceOrHash) {
        const rules = csp[Directive.SCRIPT_SRC];
        if (Array.isArray(rules) && rules.includes("'unsafe-inline'")) {
            const hasNonceOrHash = rules.some(
                (r: unknown) =>
                    typeof r === "string" &&
                    (r.startsWith("'nonce-") || r.startsWith("'sha")),
            );
            if (!hasNonceOrHash) {
                console.warn(
                    `[CSPrefabricate] 'unsafe-inline' in script-src without nonce or hash`,
                );
            }
        }
    }

    // 5. Permitting data: in img-src or media-src
    if (options.dataUri) {
        ([Directive.IMG_SRC, Directive.MEDIA_SRC] as const).forEach(
            (directive) => {
                const rules = csp[directive];
                if (Array.isArray(rules) && rules.includes("data:")) {
                    console.warn(
                        `[CSPrefabricate] 'data:' allowed in ${directive}`,
                    );
                }
            },
        );
    }

    // 6. Deprecated directives
    if (options.deprecatedDirectives) {
        if (Directive.PLUGIN_TYPES in csp) {
            console.warn(
                `[CSPrefabricate] Directive 'plugin-types' is deprecated and may be removed in future CSP versions. This directive was never widely supported.`,
            );
        }
        if (Directive.REPORT_URI in csp) {
            console.warn(
                `[CSPrefabricate] Directive 'report-uri' is deprecated and may be removed in future CSP versions. Use 'report-to' instead.`,
            );
        }
        if (Directive.BLOCK_ALL_MIXED_CONTENT in csp) {
            console.warn(
                `[CSPrefabricate] Directive 'block-all-mixed-content' is deprecated and may be removed in future CSP versions. Use 'upgrade-insecure-requests' instead.`,
            );
        }
    }
}

export const isValidDirective = (directive: string) =>
    validDirectives.includes(directive);

export const formatRule = (rule: string) =>
    specialRules.includes(rule) ? `'${rule}'` : rule;
