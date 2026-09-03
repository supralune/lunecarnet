import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const manifest = JSON.parse(await readFile(new URL("package.json", root), "utf8"));

test("exposes a Git-installable Astro package contract", async () => {
  assert.equal(manifest.name, "@lunecarnet/astro");
  assert.equal(manifest.private, true);
  assert.equal(manifest.exports["."], "./src/index.ts");
  assert.equal(manifest.exports["./styles.css"], "./src/styles/global.css");
  assert.equal(manifest.exports["./tokens.css"], "./src/styles/tokens.css");
  assert.match(manifest.peerDependencies.astro, /^\^7/);

  await Promise.all(Object.values(manifest.exports)
    .filter((path) => !path.includes("*"))
    .map((path) => access(new URL(path.replace(/^\.\//, ""), root))));
});

test("keeps published source independent from the demo alias", async () => {
  const publishedDirectories = ["src/components", "src/layouts", "src/lib"];
  const files = [];

  for (const directory of publishedDirectories) {
    const entries = await readdir(new URL(`${directory}/`, root), { withFileTypes: true });
    files.push(...entries.filter((entry) => entry.isFile()).map((entry) => `${directory}/${entry.name}`));
  }

  files.push("src/index.ts", "src/types.ts", "src/config/runtime.ts");
  const sources = await Promise.all(files.map((file) => readFile(new URL(file, root), "utf8")));
  sources.forEach((source, index) => assert.doesNotMatch(source, /from\s+["']@\//, `${files[index]} must not depend on the demo @ alias`));
});

test("publishes stable design tokens", async () => {
  const tokens = await readFile(new URL("src/styles/tokens.css", root), "utf8");
  for (const token of ["--lc-color-accent", "--lc-font-serif", "--lc-site-width", "--lc-sidebar-width"]) {
    assert.ok(tokens.includes(token), `missing public token ${token}`);
  }
});
