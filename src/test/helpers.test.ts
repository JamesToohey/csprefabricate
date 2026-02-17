import {describe, it, beforeEach, after} from "node:test";
import assert from "node:assert";
import {
    formatRule,
    isValidDirective,
    warnOnCspIssues,
    WarningOptions,
} from "../helpers";
import {Directive, ContentSecurityPolicy} from "../types";

void describe("Helpers tests", () => {
    void describe("isValidDirective", () => {
        void it("Returns true if directive is valid", () => {
            assert.strictEqual(isValidDirective(Directive.BASE_URI), true);
            assert.strictEqual(isValidDirective("default-src"), true);
        });

        void it("Returns false if directive is invalid", () => {
            assert.strictEqual(isValidDirective("some-src"), false);
        });
    });

    void describe("formatRule", () => {
        void it("Formats special rules with single quotes", () => {
            assert.strictEqual(formatRule("self"), `'self'`);
            assert.strictEqual(formatRule("none"), `'none'`);
            assert.strictEqual(formatRule("unsafe-inline"), `'unsafe-inline'`);
            assert.strictEqual(formatRule("unsafe-eval"), `'unsafe-eval'`);
            assert.strictEqual(
                formatRule("strict-dynamic"),
                `'strict-dynamic'`,
            );
            assert.strictEqual(formatRule("unsafe-hashes"), `'unsafe-hashes'`);
            assert.strictEqual(
                formatRule("wasm-unsafe-eval"),
                `'wasm-unsafe-eval'`,
            );
            assert.strictEqual(
                formatRule("inline-speculation-rules"),
                `'inline-speculation-rules'`,
            );
            assert.strictEqual(
                formatRule("unsafe-allow-redirects"),
                `'unsafe-allow-redirects'`,
            );
            assert.strictEqual(
                formatRule("trusted-types-eval"),
                `'trusted-types-eval'`,
            );
            assert.strictEqual(formatRule("report-sample"), `'report-sample'`);
            assert.strictEqual(
                formatRule("report-sha256"),
                `'report-sha256'`,
            );
            assert.strictEqual(
                formatRule("report-sha384"),
                `'report-sha384'`,
            );
            assert.strictEqual(
                formatRule("report-sha512"),
                `'report-sha512'`,
            );
            assert.strictEqual(
                formatRule("unsafe-webtransport-hashes"),
                `'unsafe-webtransport-hashes'`,
            );
        });

        void it("Returns non-special rules", () => {
            assert.strictEqual(formatRule("google.com"), `google.com`);
        });
    });

    void describe("warnOnCspIssues", () => {
        let warnings: string[] = [];
        const originalWarn = console.warn;

        void beforeEach(() => {
            warnings = [];
            console.warn = (msg: string) => {
                warnings.push(msg);
            };
        });

        void after(() => {
            console.warn = originalWarn;
        });

        void it("Warns on overly permissive *", () => {
            const csp: ContentSecurityPolicy = {
                [Directive.SCRIPT_SRC]: ["*"],
            };
            warnOnCspIssues(csp);
            assert(warnings.some((w) => w.includes("Overly permissive")));
        });

        void it("Warns on missing important directives", () => {
            const csp: ContentSecurityPolicy = {
                [Directive.DEFAULT_SRC]: ["'self'"],
            };
            warnOnCspIssues(csp);
            assert(
                warnings.some((w) =>
                    w.includes("Missing recommended directive: object-src"),
                ),
            );
            assert(
                warnings.some((w) =>
                    w.includes("Missing recommended directive: base-uri"),
                ),
            );
            assert(
                warnings.some((w) =>
                    w.includes("Missing recommended directive: form-action"),
                ),
            );
        });

        void it("Warns on 'unsafe-inline' in script-src", () => {
            const csp: ContentSecurityPolicy = {
                [Directive.SCRIPT_SRC]: ["'unsafe-inline'"],
            };
            warnOnCspIssues(csp);
            assert(
                warnings.some((w) =>
                    w.includes("'unsafe-inline' found in script-src"),
                ),
            );
        });

        void it("Warns on 'unsafe-inline' in script-src without nonce or hash", () => {
            const csp: ContentSecurityPolicy = {
                [Directive.SCRIPT_SRC]: ["'unsafe-inline'"],
            };
            warnOnCspIssues(csp);
            assert(
                warnings.some((w) =>
                    w.includes(
                        "'unsafe-inline' in script-src without nonce or hash",
                    ),
                ),
            );
        });

        void it("Does not warn if nonce is present with 'unsafe-inline'", () => {
            const csp: ContentSecurityPolicy = {
                [Directive.SCRIPT_SRC]: ["'unsafe-inline'", "'nonce-abc'"],
            };
            warnOnCspIssues(csp);
            assert(!warnings.some((w) => w.includes("without nonce or hash")));
        });

        void it("Does not warn if hash is present with 'unsafe-inline'", () => {
            const csp: ContentSecurityPolicy = {
                [Directive.SCRIPT_SRC]: ["'unsafe-inline'", "'sha256-xyz'"],
            };
            warnOnCspIssues(csp);
            assert(!warnings.some((w) => w.includes("without nonce or hash")));
        });

        void it("Warns on data: in img-src", () => {
            const csp: ContentSecurityPolicy = {
                [Directive.IMG_SRC]: ["data:"],
            };
            warnOnCspIssues(csp);
            assert(
                warnings.some((w) => w.includes("'data:' allowed in img-src")),
            );
        });

        void it("Respects warning options to opt out of specific warnings", () => {
            const csp: ContentSecurityPolicy = {
                [Directive.SCRIPT_SRC]: ["*"],
            };
            const opts: WarningOptions = {overlyPermissive: false};
            warnOnCspIssues(csp, opts);
            assert(!warnings.some((w) => w.includes("Overly permissive")));
        });

        void it("Does not warn if all warnings are disabled", () => {
            const csp: ContentSecurityPolicy = {
                [Directive.SCRIPT_SRC]: ["*"],
                [Directive.IMG_SRC]: ["data:"],
            };
            const opts: WarningOptions = {
                overlyPermissive: false,
                missingDirectives: false,
                unsafeInline: false,
                missingNonceOrHash: false,
                dataUri: false,
            };
            warnOnCspIssues(csp, opts);
            assert.strictEqual(warnings.length, 0);
        });

        void it("Warns only for enabled warnings", () => {
            const csp: ContentSecurityPolicy = {
                [Directive.SCRIPT_SRC]: ["*", "'unsafe-inline'"],
                [Directive.IMG_SRC]: ["data:"],
            };
            const opts: WarningOptions = {
                overlyPermissive: false,
                missingDirectives: false,
                unsafeInline: true,
            };
            warnOnCspIssues(csp, opts);
            assert(
                warnings.some((w) =>
                    w.includes("'unsafe-inline' found in script-src"),
                ),
            );
            assert(!warnings.some((w) => w.includes("Overly permissive")));
            assert(
                !warnings.some((w) =>
                    w.includes("Missing recommended directive"),
                ),
            );
        });

        void it("Warns on deprecated plugin-types directive", () => {
            const csp: ContentSecurityPolicy = {
                [Directive.PLUGIN_TYPES]: ["application/pdf"],
            };
            warnOnCspIssues(csp);
            assert(
                warnings.some((w) =>
                    w.includes("Directive 'plugin-types' is deprecated"),
                ),
            );
            assert(warnings.some((w) => w.includes("never widely supported")));
        });

        void it("Warns on deprecated report-uri directive", () => {
            const csp: ContentSecurityPolicy = {
                [Directive.REPORT_URI]: ["/report"],
            };
            warnOnCspIssues(csp);
            assert(
                warnings.some((w) =>
                    w.includes("Directive 'report-uri' is deprecated"),
                ),
            );
            assert(warnings.some((w) => w.includes("Use 'report-to' instead")));
        });

        void it("Warns on deprecated block-all-mixed-content directive", () => {
            const csp: ContentSecurityPolicy = {
                [Directive.BLOCK_ALL_MIXED_CONTENT]: null,
            };
            warnOnCspIssues(csp);
            assert(
                warnings.some((w) =>
                    w.includes(
                        "Directive 'block-all-mixed-content' is deprecated",
                    ),
                ),
            );
            assert(
                warnings.some((w) =>
                    w.includes("Use 'upgrade-insecure-requests' instead"),
                ),
            );
        });

        void it("Warns on multiple deprecated directives in one policy", () => {
            const csp: ContentSecurityPolicy = {
                [Directive.PLUGIN_TYPES]: ["application/pdf"],
                [Directive.REPORT_URI]: ["/report"],
                [Directive.BLOCK_ALL_MIXED_CONTENT]: null,
            };
            warnOnCspIssues(csp);
            assert(
                warnings.some((w) =>
                    w.includes("'plugin-types' is deprecated"),
                ),
            );
            assert(
                warnings.some((w) => w.includes("'report-uri' is deprecated")),
            );
            assert(
                warnings.some((w) =>
                    w.includes("'block-all-mixed-content' is deprecated"),
                ),
            );
            assert.strictEqual(
                warnings.filter((w) => w.includes("deprecated")).length,
                3,
            );
        });

        void it("Respects deprecatedDirectives option to disable warnings", () => {
            const csp: ContentSecurityPolicy = {
                [Directive.PLUGIN_TYPES]: ["application/pdf"],
                [Directive.REPORT_URI]: ["/report"],
            };
            const opts: WarningOptions = {deprecatedDirectives: false};
            warnOnCspIssues(csp, opts);
            assert(!warnings.some((w) => w.includes("deprecated")));
        });
    });
});
