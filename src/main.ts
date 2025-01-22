import fs from "fs";
import meow from "meow";
import { createCsp } from "./utils";

const description = `
  CSPrefabricate

  Usage
	  $ csp <input>

  Required
    --input-path, -i path to input yaml
    --output-path, -o path to output txt file
`;

const cli = meow(description, {
  importMeta: import.meta,
  flags: {
    inputPath: {
      type: "string",
      isRequired: true,
      shortFlag: "i",
    },

    outputPath: {
      type: "string",
      isRequired: true,
      shortFlag: "i",
    },
  },
});

const { inputPath, outputPath } = cli.flags;
const file = fs.readFileSync(inputPath, "utf8");
const cspString = createCsp(file);
fs.writeFileSync(outputPath, cspString);
console.info(`CSP successfully generated: ${outputPath}`);
