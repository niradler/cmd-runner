const exec = require("child_process").exec;
const fs = require("fs-extra");

const run = cmd =>
  new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error !== null) {
        reject(error);
      }
      resolve(stdout);
    });
  });

(async function() {
  await run("node ./index.js ./test.sh");
  const files = fs.readdirSync("./");
  if (files.includes("test")) {
    fs.removeSync("test");
    console.log("test complete!");
    process.exit();
  } else {
    console.log("test failed!");
  }
  console.log(files);
})();
