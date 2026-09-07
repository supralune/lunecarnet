import type { Element, Root } from "hast";
import { visit } from "unist-util-visit";

const externalUrlPattern = /^(?:https?:)?\/\//i;

/** Open external Markdown links in a separate tab without exposing the opener. */
export default function rehypeExternalLinks() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "a") return;
      const href = node.properties.href;
      if (typeof href !== "string" || !externalUrlPattern.test(href)) return;
      node.properties.target = "_blank";
      node.properties.rel = ["noopener", "noreferrer"];
    });
  };
}
