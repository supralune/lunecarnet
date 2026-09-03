import type { TextBlocks } from "../types";

/** Normalize a single paragraph or paragraph array and discard blank blocks. */
export function textBlocks(value: TextBlocks | undefined) {
  const blocks = typeof value === "string" ? [value] : value ?? [];
  return blocks.filter((block) => Boolean(block.trim()));
}
