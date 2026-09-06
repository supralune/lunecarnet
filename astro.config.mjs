import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";
import { createLunecarnetMarkdownProcessor } from "./src/markdown.ts";

const requestedMode = process.env.SITE_MODE;
const siteMode = requestedMode === "blog" || requestedMode === "academic" ? requestedMode : "both";
const sourceDirectory = siteMode === "both" ? "./src/" : `./sites/${siteMode}/`;

const [repositoryOwnerFromSlug, repository] = process.env.GITHUB_REPOSITORY?.split("/") ?? [];
const repositoryOwner = process.env.GITHUB_REPOSITORY_OWNER ?? repositoryOwnerFromSlug;
const projectPages = repository
  && repositoryOwner
  && repository.toLowerCase() !== `${repositoryOwner.toLowerCase()}.github.io`;

const configuredSite = process.env.SITE_URL?.trim();
const configuredBase = process.env.SITE_BASE?.trim();
const inferredSite = repositoryOwner ? `https://${repositoryOwner}.github.io` : "https://example.github.io";
const inferredBase = process.env.GITHUB_ACTIONS === "true" && projectPages ? `/${repository}` : undefined;

function normalizeBase(value) {
  if (value === "/") return undefined;
  return `/${value.replace(/^\/+|\/+$/g, "")}`;
}

export default defineConfig({
  srcDir: sourceDirectory,
  site: configuredSite || inferredSite,
  base: configuredBase ? normalizeBase(configuredBase) : inferredBase,
  output: "static",
  trailingSlash: "always",
  markdown: { processor: createLunecarnetMarkdownProcessor() },
  build: { format: "directory" },
  vite: {
    define: { "import.meta.env.SITE_MODE": JSON.stringify(siteMode) },
    resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } }
  }
});
