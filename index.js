#!/usr/bin/env node

const path = require("path");
const exec = require("child_process").exec;
const fs = require("fs");
const readline = require("readline");
const argv = require("minimist")(process.argv.slice(2));

const filePath = argv["_"][0];
const allowedExt = ["bat", "sh"];

const run = cmd =>
  new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error !== null) {
        reject(error);
      }
      resolve(stdout);
    });
  });

(function(filePath) {
  try {
    const ext = filePath.substring(filePath.lastIndexOf(".") + 1);

    if (!allowedExt.includes(ext)) throw new Error("Unsupported extension.");
    if (filePath.split("")[0] === ".") {
      filePath = path.join(process.cwd() + filePath.substring(1));
    }

    const fileInterface = readline.createInterface({
      input: fs.createReadStream(filePath)
    });

    const output = [];
    fileInterface.on("line", async line => {
      const res = await run(line);
      output.push(res);
    });

    fileInterface.on("close", () => {
      console.log(output.join("\n"));
      console.log("runner complete.");
      process.exit(0);
    });
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
})(filePath);
