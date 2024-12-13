import fs from "fs";
import meow from "meow";
import { createCsp } from "./utils";

const cli = meow("CSPrefabricate", {
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
  help: "Help text goes here",
});

const { inputPath, outputPath } = cli.flags;
const file = fs.readFileSync(inputPath, "utf8");
const cspString = createCsp(file);
fs.writeFileSync(outputPath, cspString);
