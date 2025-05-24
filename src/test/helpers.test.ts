import {describe, it} from "node:test";
import assert from "node:assert";
import {formatRule, isValidDirective} from "../helpers";
import {Directive} from "../types";

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
        });

        void it("Returns non-special rules", () => {
            assert.strictEqual(formatRule("google.com"), `google.com`);
        });
    });
});
