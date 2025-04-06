import { describe, it } from "node:test";
import assert from "node:assert";
import { formatRule, isValidDirective } from "../helpers";
import { Directive } from "../types";
describe("Helpers tests", () => {
    describe("isValidDirective", () => {
        it("Returns true if directive is valid", () => {
            assert.strictEqual(isValidDirective(Directive.BASE_URI), true);
            assert.strictEqual(isValidDirective("default-src"), true);
        });
        it("Returns false if directive is invalid", () => {
            assert.strictEqual(isValidDirective("some-src"), false);
        });
    });
    describe("formatRule", () => {
        it("Formats special rules with single quotes", () => {
            assert.strictEqual(formatRule("self"), `'self'`);
        });
        it("Returns non-special rules", () => {
            assert.strictEqual(formatRule("google.com"), `google.com`);
        });
    });
});
