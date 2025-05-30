import {describe, it, beforeEach, after} from "node:test";
import assert from "node:assert";
import {warnOnCspIssues} from "../helpers";
import {
    GOOGLE_ANALYTICS_CSP,
    GOOGLE_ANALYTICS_WITH_SIGNALS_CSP,
    BASELINE_STRICT_CSP,
} from "../baseline";

void describe("Baseline CSPs", () => {
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

    void it("BASELINE_STRICT_CSP should produce no warnings", () => {
        warnOnCspIssues(BASELINE_STRICT_CSP);
        assert.strictEqual(warnings.length, 0);
    });

    void it("GOOGLE_ANALYTICS_CSP should produce no warnings", () => {
        warnOnCspIssues(GOOGLE_ANALYTICS_CSP);
        console.log("Warnings:", warnings);
        assert.strictEqual(warnings.length, 0);
    });

    void it("GOOGLE_ANALYTICS_WITH_SIGNALS_CSP should produce no warnings", () => {
        warnOnCspIssues(GOOGLE_ANALYTICS_WITH_SIGNALS_CSP);
        assert.strictEqual(warnings.length, 0);
    });
});
