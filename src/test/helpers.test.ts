import { describe, it } from "node:test";
import assert from "node:assert";
import { formatRule, isValidDirective } from "../helpers";

describe("Helpers tests", () => {
  describe("isValidDirective", () => {
    it("Returns false for invalid CSP directives", () => {
      assert.strictEqual(isValidDirective("not valid"), false);
    });

    it("Returns true for valid CSP directives", () => {
      assert.strictEqual(isValidDirective("img-src"), true);
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
