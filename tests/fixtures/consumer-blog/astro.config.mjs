import { createLunecarnetMarkdownProcessor } from "@lunecarnet/astro/markdown";

export default {
  site: "https://consumer.example",
  output: "static",
  trailingSlash: "always",
  markdown: { processor: createLunecarnetMarkdownProcessor() }
};
