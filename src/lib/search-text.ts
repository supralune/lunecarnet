function cleanWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

/** Convert consumer-owned Markdown into compact plain text for the local search index. */
export function markdownToSearchText(markdown: string) {
  return cleanWhitespace(markdown
    .replace(/^---[\s\S]*?---\s*/m, " ")
    .replace(/^\s{0,3}>\s*\[![a-z0-9_-]+\][+-]?[ \t]*/gim, "> ")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^\s*```[^\n]*$/gm, " ")
    .replace(/^\s*~~~[^\n]*$/gm, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/^\s{0,3}(?:#{1,6}|>|[-+*]|\d+[.)])\s+/gm, "")
    .replace(/^\s{0,3}(?:#{1,6}|>|[-+*]|\d+[.)])\s+/gm, "")
    .replace(/\$\$[\s\S]*?\$\$/g, " ")
    .replace(/\$[^$\n]+\$/g, " ")
    .replace(/[`*_~|]/g, " "));
}
