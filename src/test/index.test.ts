import {describe, it} from "node:test";
import assert from "node:assert";
import {create, Directive, Baseline} from "../index";

void describe("Index Exports", () => {
    void it("Should export create function", () => {
        assert.strictEqual(typeof create, "function");
    });

    void it("Should export Directive enum", () => {
        assert.strictEqual(typeof Directive.DEFAULT_SRC, "string");
    });

    void it("Should export Baseline object with known CSPs", () => {
        assert.ok(Baseline.BASELINE_STRICT_CSP);
        assert.ok(Baseline.GOOGLE_ANALYTICS_CSP);
        assert.ok(Baseline.GOOGLE_ANALYTICS_WITH_SIGNALS_CSP);
    });

    void it("Should allow using create with a Baseline CSP", () => {
        const cspString = create(Baseline.BASELINE_STRICT_CSP);
        assert.strictEqual(typeof cspString, "string");
        assert.ok(cspString.includes("default-src"));
    });
});

void describe("README Code Examples", () => {
    void it("TLD Expansion Example Produces Expected String", () => {
        const csp = {
            [Directive.IMG_SRC]: [
                "self",
                {"*.example": [".com", ".co.uk", ".net"]},
            ],
        };
        const cspString = create(csp);
        assert.ok(
            cspString.includes(
                "img-src 'self' *.example.com *.example.co.uk *.example.net;",
            ) ||
                cspString.includes(
                    "img-src 'self' *.example.com *.example.co.uk *.example.net",
                ),
        );
    });
});
