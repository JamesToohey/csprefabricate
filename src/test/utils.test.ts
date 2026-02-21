import {describe, it, afterEach, mock, Mock, beforeEach} from "node:test";
import assert from "node:assert";
import {create, processRules} from "../utils";
import {ContentSecurityPolicy, Directive} from "../types";

void describe("Utils tests", () => {
    let mockWarn: Mock<typeof console.warn>;
    const originalWarn = console.warn;

    void beforeEach(() => {
        mockWarn = mock.method(console, "warn", () => {});
    });

    void afterEach(() => {
        console.warn = originalWarn;
    });

    void describe("processRules", () => {
        void it("Processes rules provided as an array of strings (simple)", () => {
            const rules = ["self", "*.google.com", "*.google.com.au"];
            assert.strictEqual(
                processRules(rules),
                `'self' *.google.com *.google.com.au`,
            );
        });

        void it("Processes rules provided a complex list of tlds", () => {
            const rules = ["self", {"*.google": [".com", ".com.au"]}];
            assert.strictEqual(
                processRules(rules),
                `'self' *.google.com *.google.com.au`,
            );
        });
    });

    void describe("create", () => {
        void it("Formats a CSP string with all rules", () => {
            const csp: ContentSecurityPolicy = {
                [Directive.DEFAULT_SRC]: ["self"],
                [Directive.SCRIPT_SRC]: ["self", "js.example.com"],
                [Directive.STYLE_SRC]: ["self", "css.example.com"],
                [Directive.IMG_SRC]: [
                    "self",
                    {"*.google": [".com", ".com.au"]},
                ],
                [Directive.CONNECT_SRC]: ["self"],
                [Directive.FONT_SRC]: ["self", "font.example.com"],
                [Directive.OBJECT_SRC]: ["none"],
                [Directive.MEDIA_SRC]: ["self", "media.example.com"],
                [Directive.FRAME_SRC]: ["self"],
                [Directive.SANDBOX]: ["allow-scripts"],
                [Directive.REPORT_URI]: ["/my-report-uri"],
                [Directive.CHILD_SRC]: ["self"],
                [Directive.FORM_ACTION]: ["self"],
                [Directive.FRAME_ANCESTORS]: ["none"],
                [Directive.PLUGIN_TYPES]: ["application/pdf"],
                [Directive.BASE_URI]: ["self"],
                [Directive.REPORT_TO]: ["myGroupName"],
                [Directive.WORKER_SRC]: ["none"],
                [Directive.MANIFEST_SRC]: ["none"],
                [Directive.PREFETCH_SRC]: ["none"],
                [Directive.NAVIGATE_TO]: ["example.com"],
                [Directive.REQUIRE_TRUSTED_TYPES_FOR]: ["script"],
                [Directive.TRUSTED_TYPES]: ["none"],
                [Directive.UPGRADE_INSECURE_REQUESTS]: null,
                [Directive.BLOCK_ALL_MIXED_CONTENT]: null,
                [Directive.SCRIPT_SRC_ELEM]: ["self", "scripts.example.com"],
                [Directive.SCRIPT_SRC_ATTR]: ["none"],
                [Directive.STYLE_SRC_ELEM]: ["self", "styles.example.com"],
                [Directive.STYLE_SRC_ATTR]: ["self"],
                [Directive.WEBRTC]: ["allow"],
                [Directive.FENCED_FRAME_SRC]: ["self"],
            };

            const cspString = create(csp);
            assert.strictEqual(
                cspString,
                "base-uri 'self'; block-all-mixed-content; child-src 'self'; connect-src 'self'; default-src 'self'; fenced-frame-src 'self'; font-src 'self' font.example.com; form-action 'self'; frame-ancestors 'none'; frame-src 'self'; img-src 'self' *.google.com *.google.com.au; manifest-src 'none'; media-src 'self' media.example.com; navigate-to example.com; object-src 'none'; plugin-types application/pdf; prefetch-src 'none'; report-to myGroupName; report-uri /my-report-uri; require-trusted-types-for 'script'; sandbox allow-scripts; script-src 'self' js.example.com; script-src-attr 'none'; script-src-elem 'self' scripts.example.com; style-src 'self' css.example.com; style-src-attr 'self'; style-src-elem 'self' styles.example.com; trusted-types 'none'; upgrade-insecure-requests; webrtc 'allow'; worker-src 'none';",
            );
        });

        void it("Ignores invalid directives", () => {
            const csp: ContentSecurityPolicy = {
                [Directive.DEFAULT_SRC]: ["self"],
                // @ts-expect-error deliberate testing of invalid directive
                ["invalid-directive"]: ["self"],
                [Directive.IMG_SRC]: ["my.domain.com"],
            };

            const cspString = create(csp);
            assert.strictEqual(
                cspString,
                "default-src 'self'; img-src my.domain.com;",
            );
        });

        void it("Calls warning helper when invoked", () => {
            const csp: ContentSecurityPolicy = {
                [Directive.DEFAULT_SRC]: ["self"],
            };
            create(csp);

            assert.equal(mockWarn.mock.calls.length, 3);
            const args = mockWarn.mock.calls.map((call) => call.arguments);
            assert.equal(
                args[0][0],
                "[CSPrefabricate] Missing recommended directive: object-src",
            );
            assert.equal(
                args[1][0],
                "[CSPrefabricate] Missing recommended directive: base-uri",
            );
            assert.equal(
                args[2][0],
                "[CSPrefabricate] Missing recommended directive: form-action",
            );
        });
    });

    void describe("Edge cases", () => {
        void it("Handles empty rules array", () => {
            const csp: ContentSecurityPolicy = {
                [Directive.DEFAULT_SRC]: [],
            };
            const cspString = create(csp);
            assert.strictEqual(cspString, "default-src;");
        });

        void it("Handles completely empty policy object", () => {
            const csp: ContentSecurityPolicy = {};
            const cspString = create(csp);
            assert.strictEqual(cspString, "");
        });

        void it("Handles duplicate rules in an array", () => {
            const csp: ContentSecurityPolicy = {
                [Directive.DEFAULT_SRC]: [
                    "self",
                    "self",
                    "example.com",
                    "example.com",
                ],
            };
            const cspString = create(csp);
            assert.strictEqual(cspString, "default-src 'self' example.com;");
        });

        void it("Ignores non-string, non-object values in rules array at runtime", () => {
            const csp = {
                [Directive.DEFAULT_SRC]: ["self", 123, false, null, undefined],
            } as unknown as ContentSecurityPolicy;
            assert.doesNotThrow(() => create(csp));
        });

        void it("Processes CSP Level 3 directives correctly", () => {
            const csp: ContentSecurityPolicy = {
                [Directive.SCRIPT_SRC_ELEM]: ["self", "scripts.example.com"],
                [Directive.SCRIPT_SRC_ATTR]: ["none"],
                [Directive.STYLE_SRC_ELEM]: [
                    "self",
                    "wasm-unsafe-eval",
                    "trusted-types-eval",
                ],
                [Directive.STYLE_SRC_ATTR]: ["unsafe-inline", "report-sample"],
                [Directive.WEBRTC]: ["block"],
                [Directive.SCRIPT_SRC]: [
                    "inline-speculation-rules",
                    "unsafe-allow-redirects",
                    "report-sha256",
                    "report-sha384",
                    "report-sha512",
                    "unsafe-webtransport-hashes",
                ],
            };
            const cspString = create(csp);
            assert.strictEqual(
                cspString,
                "script-src 'inline-speculation-rules' 'report-sha256' 'report-sha384' 'report-sha512' 'unsafe-allow-redirects' 'unsafe-webtransport-hashes'; script-src-attr 'none'; script-src-elem 'self' scripts.example.com; style-src-attr 'report-sample' 'unsafe-inline'; style-src-elem 'self' 'trusted-types-eval' 'wasm-unsafe-eval'; webrtc 'block';",
            );
        });

        void it("Generates deprecation warnings for deprecated directives", () => {
            const csp: ContentSecurityPolicy = {
                [Directive.DEFAULT_SRC]: ["self"],
                [Directive.PLUGIN_TYPES]: ["application/pdf"],
                [Directive.REPORT_URI]: ["/report"],
                [Directive.BLOCK_ALL_MIXED_CONTENT]: null,
            };
            create(csp);

            const deprecationWarnings = mockWarn.mock.calls
                .map((call) => call.arguments[0] as string)
                .filter((msg) => msg.includes("deprecated"));

            assert.strictEqual(deprecationWarnings.length, 3);
            assert(
                deprecationWarnings.some((w: string) =>
                    w.includes("plugin-types"),
                ),
            );
            assert(
                deprecationWarnings.some((w: string) =>
                    w.includes("report-uri"),
                ),
            );
            assert(
                deprecationWarnings.some((w: string) =>
                    w.includes("block-all-mixed-content"),
                ),
            );
        });

        void it("Throws an error on CSP injection attempts (semicolon or comma)", () => {
            const csp1: ContentSecurityPolicy = {
                [Directive.SCRIPT_SRC]: [
                    "self",
                    "example.com; object-src 'none'",
                ],
            };
            assert.throws(() => create(csp1), /Invalid character in rule/);

            const csp2: ContentSecurityPolicy = {
                [Directive.SCRIPT_SRC]: ["self", "example.com, example.org"],
            };
            assert.throws(() => create(csp2), /Invalid character in rule/);

            const csp3: ContentSecurityPolicy = {
                [Directive.IMG_SRC]: [
                    {"*.example": [".com; script-src 'unsafe-inline'"]},
                ],
            };
            assert.throws(() => create(csp3), /Invalid character in rule/);
        });

        void it("Validates nonces and drops invalid ones", () => {
            const csp: ContentSecurityPolicy = {
                [Directive.SCRIPT_SRC]: [
                    "'nonce-validBase64=='",
                    "'nonce-invalid!@#'",
                    "nonce-missingQuotes",
                ],
            };
            const cspString = create(csp);

            assert.strictEqual(cspString, "script-src 'nonce-validBase64==';");

            const warnings = mockWarn.mock.calls.map(
                (call) => call.arguments[0] as string,
            );
            assert(
                warnings.some((w) =>
                    w.includes("Invalid nonce format: 'nonce-invalid!@#'"),
                ),
            );
            assert(
                warnings.some((w) =>
                    w.includes("Invalid nonce format: nonce-missingQuotes"),
                ),
            );
        });

        void it("Validates hashes and drops invalid ones", () => {
            const csp: ContentSecurityPolicy = {
                [Directive.SCRIPT_SRC]: [
                    "'sha256-validBase64=='",
                    "'sha384-validBase64=='",
                    "'sha512-validBase64=='",
                    "'sha256-invalid!@#'",
                    "sha256-missingQuotes",
                    "'sha128-unsupported'",
                ],
            };
            const cspString = create(csp);

            assert.strictEqual(
                cspString,
                "script-src 'sha256-validBase64==' 'sha384-validBase64==' 'sha512-validBase64==';",
            );

            const warnings = mockWarn.mock.calls.map(
                (call) => call.arguments[0] as string,
            );
            assert(
                warnings.some((w) =>
                    w.includes("Invalid hash format: 'sha256-invalid!@#'"),
                ),
            );
            assert(
                warnings.some((w) =>
                    w.includes("Invalid hash format: sha256-missingQuotes"),
                ),
            );
            assert(
                warnings.some((w) =>
                    w.includes("Invalid hash format: 'sha128-unsupported'"),
                ),
            );
        });
    });
});
