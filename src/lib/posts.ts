import { getCollection, type CollectionEntry } from "astro:content";
import { templatePath } from "../config/runtime";

export type Post = CollectionEntry<"posts">;

export async function getPublishedPosts() {
  const posts = await getCollection("posts", ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());
}

/** Shared static-path contract for the standard blog post route. */
export async function getBlogPostPaths() {
  const posts = await getPublishedPosts();
  return posts.map((post, index) => ({
    params: { slug: post.id.replace(/\.(md|mdx)$/, "") },
    props: { post, previous: posts[index + 1], next: posts[index - 1] }
  }));
}

export function postPath(post: Post) {
  return templatePath("blog", `/posts/${post.id.replace(/\.(md|mdx)$/, "")}/`);
}

export function formatDate(date: Date, locale = "en-US") {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit"
  }).format(date);
}

export function dateParts(date: Date, locale = "en") {
  return {
    day: String(date.getDate()).padStart(2, "0"),
    month: new Intl.DateTimeFormat(locale, { month: "short" }).format(date).toUpperCase()
  };
}
