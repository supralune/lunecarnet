import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const [, , mode, requestedCommand = "dev", ...forwardedArgs] = process.argv;
const validModes = new Set(["blog", "academic", "both"]);

if (!validModes.has(mode)) {
  console.error("Usage: node scripts/run-astro.mjs <blog|academic|both> <dev|build|check|preview|check-build>");
  process.exit(1);
}

const commands = requestedCommand === "check-build" ? ["check", "build"] : [requestedCommand];
const astroBin = fileURLToPath(new URL("../node_modules/astro/bin/astro.mjs", import.meta.url));

for (const command of commands) {
  const exitCode = await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [astroBin, command, ...forwardedArgs], {
      cwd: fileURLToPath(new URL("..", import.meta.url)),
      env: { ...process.env, SITE_MODE: mode },
      stdio: "inherit"
    });
    child.once("error", reject);
    child.once("exit", (code, signal) => resolve(signal ? 1 : (code ?? 1)));
  });

  if (exitCode !== 0) process.exit(exitCode);
}
