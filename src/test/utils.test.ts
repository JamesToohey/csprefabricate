import {describe, it} from "node:test";
import assert from "node:assert";
import {createCsp, processRules} from "../utils";
import {ContentSecurityPolicy, Directive} from "../types";

describe("Utils tests", () => {
    describe("processRules", () => {
        it("Processes rules provided as an array of strings (simple)", () => {
            const rules = ["self", "*.google.com", "*.google.com.au"];
            assert.strictEqual(
                processRules(rules),
                `'self' *.google.com *.google.com.au`,
            );
        });

        it("Processes rules provided a complex list of tlds", () => {
            const rules = ["self", {"*.google": [".com", ".com.au"]}];
            assert.strictEqual(
                processRules(rules),
                `'self' *.google.com *.google.com.au`,
            );
        });
    });

    describe("createCsp", () => {
        it("Formats a CSP string", () => {
            const csp: ContentSecurityPolicy = {
                [Directive.DEFAULT_SRC]: ["self"],
                [Directive.IMG_SRC]: [
                    "self",
                    {"*.google": [".com", ".com.au"]},
                ],
            };

            const cspString = createCsp(csp);
            assert.strictEqual(
                cspString,
                "default-src 'self'; img-src 'self' *.google.com *.google.com.au;",
            );
        });
    });
});
