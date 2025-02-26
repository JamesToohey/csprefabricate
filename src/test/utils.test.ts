import { describe, it } from "node:test";
import assert from "node:assert";
import { createCsp, processRules } from "../utils";
import { ContentSecurityPolicy, Directive } from "../types";

describe("Utils tests", () => {
  describe("processRules", () => {
    it("Processes rules provided as an array of strings (simple)", () => {
      const rules = ["self", "*.google.com", "*.google.com.au"];
      assert.strictEqual(
        processRules(rules),
        `'self' *.google.com *.google.com.au`,
      );
    });

    describe("createCsp", () => {
        it("Formats a CSP string with all rules", () => {
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
            };

            const cspString = createCsp(csp);
            assert.strictEqual(
                cspString,
                "default-src 'self'; script-src 'self' js.example.com; style-src 'self' css.example.com; img-src 'self' *.google.com *.google.com.au; connect-src 'self'; font-src 'self' font.example.com; object-src 'none'; media-src 'self' media.example.com; frame-src 'self'; sandbox allow-scripts; report-uri /my-report-uri; child-src 'self'; form-action 'self'; frame-ancestors 'none'; plugin-types application/pdf; base-uri 'self'; report-to myGroupName; worker-src 'none'; manifest-src 'none'; prefetch-src 'none'; navigate-to example.com; require-trusted-types-for script; trusted-types 'none'; upgrade-insecure-requests; block-all-mixed-content;",
            );
        });

        it("Handles blank directives", () => {
            const csp: ContentSecurityPolicy = {
                [Directive.SANDBOX]: [],
            };

            const cspString = createCsp(csp);
            assert.strictEqual(
                cspString,
                "sandbox;",
            );
        });
    });
  });

  describe("createCsp", () => {
    it("Formats a CSP string", () => {
      const csp: ContentSecurityPolicy = {
        [Directive.DEFAULT_SRC]: ["self"],
        [Directive.IMG_SRC]: ["self", {"*.google": [".com", ".com.au"]}]
      }

      const cspString = createCsp(csp);
      assert.strictEqual(
        cspString,
        "default-src 'self'; img-src 'self' *.google.com *.google.com.au;",
      );
    });
  });
});
