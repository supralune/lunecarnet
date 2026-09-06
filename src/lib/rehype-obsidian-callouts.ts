import type { Element, ElementContent, Root, Text } from "hast";
import { visit } from "unist-util-visit";

const aliases: Record<string, string> = {
  summary: "abstract",
  tldr: "abstract",
  hint: "tip",
  important: "tip",
  check: "success",
  done: "success",
  help: "question",
  faq: "question",
  caution: "warning",
  attention: "warning",
  fail: "failure",
  missing: "failure",
  error: "danger",
  cite: "quote"
};

const supportedTypes = new Set([
  "note", "abstract", "info", "todo", "tip", "success", "question",
  "warning", "failure", "danger", "bug", "example", "quote"
]);

const icons: Record<string, string> = {
  note: "✎",
  abstract: "≡",
  info: "i",
  todo: "☐",
  tip: "◆",
  success: "✓",
  question: "?",
  warning: "!",
  failure: "×",
  danger: "⚡",
  bug: "◉",
  example: "◇",
  quote: "❝"
};

const markerPattern = /^\[!([a-z][\w-]*)\]([+-])?[ \t]*/i;

function calloutTitle(type: string) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

/** Convert Obsidian `> [!note]` blockquotes into semantic, styled callouts. */
export default function rehypeObsidianCallouts() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "blockquote") return;

      const paragraphIndex = node.children.findIndex(
        (child): child is Element => child.type === "element" && child.tagName === "p"
      );
      if (paragraphIndex < 0) return;

      const paragraph = node.children[paragraphIndex] as Element;
      const firstText = paragraph.children[0];
      if (!firstText || firstText.type !== "text") return;

      const marker = markerPattern.exec(firstText.value);
      if (!marker) return;

      const requestedType = marker[1].toLowerCase();
      const aliasedType = aliases[requestedType] ?? requestedType;
      const type = supportedTypes.has(aliasedType) ? aliasedType : "note";
      const remainder = firstText.value.slice(marker[0].length);
      const newlineIndex = remainder.indexOf("\n");
      const customTitle = (newlineIndex >= 0 ? remainder.slice(0, newlineIndex) : remainder).trim();
      const bodyPrefix = newlineIndex >= 0 ? remainder.slice(newlineIndex + 1) : "";

      const title: Element = {
        type: "element",
        tagName: "div",
        properties: { className: ["callout-title"] },
        children: [
          {
            type: "element",
            tagName: "span",
            properties: { className: ["callout-icon"], ariaHidden: "true" },
            children: [{ type: "text", value: icons[type] }]
          },
          {
            type: "element",
            tagName: "span",
            properties: { className: ["callout-title-text"] },
            children: [{ type: "text", value: customTitle || calloutTitle(type) }]
          }
        ]
      };

      node.tagName = "aside";
      node.properties = {
        ...node.properties,
        className: ["callout", `callout-${type}`],
        dataCallout: type,
        ...(marker[2] ? { dataCalloutFold: marker[2] } : {})
      };

      if (newlineIndex >= 0) {
        (firstText as Text).value = bodyPrefix;
        paragraph.children = paragraph.children.filter(
          (child, index) => index !== 0 || child.type !== "text" || child.value.length > 0
        );
        node.children.splice(paragraphIndex, 0, title as ElementContent);
      } else {
        node.children.splice(paragraphIndex, 1, title as ElementContent);
      }
    });
  };
}
