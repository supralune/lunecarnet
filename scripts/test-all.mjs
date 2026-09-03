import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const action = process.argv[2] === "check" ? "check" : "test";
const projectRoot = fileURLToPath(new URL("..", import.meta.url));
const runner = fileURLToPath(new URL("./run-astro.mjs", import.meta.url));
const testFile = fileURLToPath(new URL("../tests/site.test.mjs", import.meta.url));
const packageTestFile = fileURLToPath(new URL("../tests/package.test.mjs", import.meta.url));

function run(args, mode) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, {
      cwd: projectRoot,
      env: { ...process.env, SITE_MODE: mode },
      stdio: "inherit"
    });
    child.once("error", reject);
    child.once("exit", (code, signal) => resolve(signal ? 1 : (code ?? 1)));
  });
}

if (action === "test") {
  console.log("\n[package] testing public package contract");
  const packageTestExit = await run(["--test", packageTestFile], "both");
  if (packageTestExit !== 0) process.exit(packageTestExit);
}

for (const mode of ["blog", "academic", "both"]) {
  console.log(`\n[${mode}] ${action === "check" ? "checking" : "building and testing"}`);
  const astroAction = action === "check" ? "check" : "check-build";
  const buildExit = await run([runner, mode, astroAction], mode);
  if (buildExit !== 0) process.exit(buildExit);

  if (action === "test") {
    const testExit = await run(["--test", testFile], mode);
    if (testExit !== 0) process.exit(testExit);
  }
}
