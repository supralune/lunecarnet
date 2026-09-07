import { unified } from "@astrojs/markdown-remark";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import rehypeExternalLinks from "./lib/rehype-external-links";
import rehypeObsidianCallouts from "./lib/rehype-obsidian-callouts";

/** The Markdown processor used by the template and dependency-mode consumer sites. */
export function createLunecarnetMarkdownProcessor() {
  return unified({
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeObsidianCallouts, [rehypeKatex, { throwOnError: false }], rehypeExternalLinks]
  });
}
