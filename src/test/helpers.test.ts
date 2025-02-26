import {describe, it} from "node:test";
import assert from "node:assert";
import {formatRule} from "../helpers";

describe("Helpers tests", () => {
    describe("formatRule", () => {
        it("Formats special rules with single quotes", () => {
            assert.strictEqual(formatRule("self"), `'self'`);
        });

        it("Returns non-special rules", () => {
            assert.strictEqual(formatRule("google.com"), `google.com`);
        });
    });
});
