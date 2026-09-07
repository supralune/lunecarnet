import type { Element, ElementContent, Properties, Root, Text } from "hast";
import { visit } from "unist-util-visit";

type IconShape = ["circle" | "path" | "rect", Properties];

const iconShapes = {
  clipboard: [
    ["rect", { x: "8", y: "2", width: "8", height: "4", rx: "1" }],
    ["path", { d: "M9 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3" }],
    ["path", { d: "M9 12h6M9 16h6" }]
  ],
  pencil: [["path", { d: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" }]],
  info: [["circle", { cx: "12", cy: "12", r: "9" }], ["path", { d: "M12 11v5M12 8h.01" }]],
  check: [["circle", { cx: "12", cy: "12", r: "9" }], ["path", { d: "m8 12 2.5 2.5L16 9" }]],
  flame: [["path", { d: "M12 22c4 0 7-3 7-7 0-3-1.5-5.5-4-8 .2 2-1 3.5-2 4-1-3-3-5-5-7 .2 3-3 5.5-3 10 0 4.4 3.1 8 7 8Z" }]],
  question: [["circle", { cx: "12", cy: "12", r: "9" }], ["path", { d: "M9.8 9a2.3 2.3 0 1 1 3.4 2c-.8.5-1.2 1-1.2 2M12 17h.01" }]],
  warning: [["path", { d: "M10.3 3.8 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0ZM12 9v4M12 17h.01" }]],
  x: [["circle", { cx: "12", cy: "12", r: "9" }], ["path", { d: "m9 9 6 6M15 9l-6 6" }]],
  bolt: [["path", { d: "m13 2-9 12h8l-1 8 9-12h-8Z" }]],
  bug: [["rect", { x: "8", y: "8", width: "8", height: "11", rx: "4" }], ["path", { d: "m9 8-2-2M15 8l2-2M3 13h5M16 13h5M4 18l4-2M20 18l-4-2M12 8V4" }]],
  list: [["path", { d: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" }]],
  quote: [["path", { d: "M3 21c3 0 7-1 7-8V5H3v8h4c0 3-1 5-4 6M14 21c3 0 7-1 7-8V5h-7v8h4c0 3-1 5-4 6" }]],
  chevron: [["path", { d: "m6 9 6 6 6-6" }]]
} satisfies Record<string, IconShape[]>;

type IconName = keyof typeof iconShapes;
type CalloutConfig = { title: string; style: string; icon: IconName };

const calloutTypes: Record<string, CalloutConfig> = {
  abstract: { title: "Abstract", style: "abstract", icon: "clipboard" },
  summary: { title: "Summary", style: "abstract", icon: "clipboard" },
  tldr: { title: "TL;DR", style: "abstract", icon: "clipboard" },
  note: { title: "Note", style: "note", icon: "pencil" },
  info: { title: "Info", style: "info", icon: "info" },
  todo: { title: "Todo", style: "info", icon: "check" },
  tip: { title: "Tip", style: "tip", icon: "flame" },
  hint: { title: "Hint", style: "tip", icon: "flame" },
  important: { title: "Important", style: "tip", icon: "flame" },
  success: { title: "Success", style: "success", icon: "check" },
  check: { title: "Check", style: "success", icon: "check" },
  done: { title: "Done", style: "success", icon: "check" },
  question: { title: "Question", style: "question", icon: "question" },
  help: { title: "Help", style: "question", icon: "question" },
  faq: { title: "FAQ", style: "question", icon: "question" },
  warning: { title: "Warning", style: "warning", icon: "warning" },
  caution: { title: "Caution", style: "warning", icon: "warning" },
  attention: { title: "Attention", style: "warning", icon: "warning" },
  failure: { title: "Failure", style: "danger", icon: "x" },
  fail: { title: "Fail", style: "danger", icon: "x" },
  missing: { title: "Missing", style: "danger", icon: "x" },
  danger: { title: "Danger", style: "danger", icon: "bolt" },
  error: { title: "Error", style: "danger", icon: "bolt" },
  bug: { title: "Bug", style: "danger", icon: "bug" },
  example: { title: "Example", style: "example", icon: "list" },
  quote: { title: "Quote", style: "quote", icon: "quote" },
  cite: { title: "Cite", style: "quote", icon: "quote" }
};

const markerPattern = /^\[!([a-z0-9_-]+)\]([+-])?[ \t]*/i;

function element(tagName: string, properties: Properties = {}, children: ElementContent[] = []): Element {
  return { type: "element", tagName, properties, children };
}

function icon(name: IconName, className: string) {
  return element("svg", {
    className: [className], width: 18, height: 18, viewBox: "0 0 24 24", fill: "none",
    stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", ariaHidden: "true"
  }, iconShapes[name].map(([tagName, properties]) => element(tagName, properties)));
}

function isWhitespace(node: ElementContent) {
  return node.type === "text" && /^\s*$/.test(node.value);
}

function parseCallout(node: Element) {
  const paragraphIndex = node.children.findIndex(
    (child) => child.type === "element" && child.tagName === "p"
  );
  if (paragraphIndex < 0) return;

  const paragraph = node.children[paragraphIndex] as Element;
  const markerNode = paragraph.children[0];
  if (markerNode?.type !== "text") return;
  const marker = markerPattern.exec(markerNode.value);
  if (!marker) return;

  const titleChildren: ElementContent[] = [];
  const contentInline: ElementContent[] = [];
  let foundLineBreak = false;

  paragraph.children.forEach((child, index) => {
    const current: ElementContent = index === 0 && child.type === "text"
      ? { ...child, value: child.value.slice(marker[0].length) }
      : child;
    if (foundLineBreak) { contentInline.push(current); return; }
    if (current.type !== "text") { titleChildren.push(current); return; }
    const newline = current.value.indexOf("\n");
    if (newline < 0) { if (current.value) titleChildren.push(current); return; }
    const before = current.value.slice(0, newline);
    const after = current.value.slice(newline + 1);
    if (before) titleChildren.push({ ...current, value: before });
    if (after) contentInline.push({ ...current, value: after });
    foundLineBreak = true;
  });

  const outerContent = node.children.slice(paragraphIndex + 1).filter((child) => !isWhitespace(child));
  const contentChildren = contentInline.length
    ? [element("p", paragraph.properties, contentInline), ...outerContent]
    : outerContent;
  return { requestedType: marker[1].toLowerCase(), fold: marker[2], titleChildren, contentChildren };
}

/** Convert Obsidian callout blockquotes, including `+`/`-` folding, into semantic HTML. */
export default function rehypeObsidianCallouts() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "blockquote") return;
      const callout = parseCallout(node);
      if (!callout) return;

      const config = calloutTypes[callout.requestedType] ?? {
        title: callout.requestedType.charAt(0).toUpperCase() + callout.requestedType.slice(1),
        style: "note",
        icon: "info" as const
      };
      const titleContent: ElementContent[] = callout.titleChildren.length
        ? callout.titleChildren
        : [{ type: "text", value: config.title } satisfies Text];
      const titleChildren: ElementContent[] = [
        icon(config.icon, "callout-title-icon"),
        element("span", { className: ["callout-title-text"] }, titleContent)
      ];
      const properties: Properties = {
        className: ["callout", `callout-${config.style}`],
        dataCallout: callout.requestedType
      };
      const content = element("div", { className: ["callout-content"] }, callout.contentChildren);

      if (callout.fold) {
        node.tagName = "details";
        node.properties = { ...properties, ...(callout.fold === "+" ? { open: true } : {}) };
        node.children = [
          element("summary", { className: ["callout-title"] }, [...titleChildren, icon("chevron", "callout-fold-icon")]),
          content
        ];
        return;
      }

      node.tagName = "aside";
      node.properties = properties;
      node.children = [element("div", { className: ["callout-title"] }, titleChildren), content];
    });
  };
}
