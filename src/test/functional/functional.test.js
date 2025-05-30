import {describe, it} from "node:test";
import assert from "node:assert";
import {create, Directive, Baseline} from "../../../dist/index.js";

describe("/dist/ Functional Test", () => {
    it("Should export Directive enum", () => {
        assert.strictEqual(typeof Directive.DEFAULT_SRC, "string");
    });

    it("Should export Baseline object with known CSPs", () => {
        assert.ok(Baseline.BASELINE_STRICT_CSP);
        assert.ok(Baseline.GOOGLE_ANALYTICS_CSP);
        assert.ok(Baseline.GOOGLE_ANALYTICS_WITH_SIGNALS_CSP);
    });

    it("Should allow using create with a Baseline CSP", () => {
        const cspString = create(Baseline.BASELINE_STRICT_CSP);
        assert.strictEqual(typeof cspString, "string");
        assert.ok(cspString.includes("default-src"));
    });
});
