import { getCollection, type CollectionEntry } from "astro:content";
import { templatePath } from "../config/runtime";

export type Post = CollectionEntry<"posts">;
export type PaginationSlice<T> = {
  items: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
};

export type CategorySummary = {
  name: string;
  posts: Post[];
  latestPost: Post;
  tags: string[];
  latest: Date;
};

export const defaultBlogPagination = {
  postsPerPage: 8,
  categoryPostsPerPage: 10
} as const;

export function positivePageSize(value: number | undefined, fallback: number) {
  return Number.isInteger(value) && Number(value) > 0 ? Number(value) : fallback;
}

export async function getPublishedPosts() {
  const posts = await getCollection("posts", ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());
}

export function paginateItems<T>(items: readonly T[], currentPage: number, pageSize: number): PaginationSlice<T> {
  const size = positivePageSize(pageSize, defaultBlogPagination.postsPerPage);
  const totalPages = Math.max(1, Math.ceil(items.length / size));
  const page = Math.min(Math.max(1, Math.trunc(currentPage) || 1), totalPages);
  const start = (page - 1) * size;
  return {
    items: items.slice(start, start + size),
    currentPage: page,
    totalPages,
    totalItems: items.length
  };
}

/** Shared static-path contract for the standard blog post route. */
export async function getBlogPostPaths() {
  const posts = await getPublishedPosts();
  return posts.map((post, index) => ({
    params: { slug: post.id.replace(/\.(md|mdx)$/, "") },
    props: { post, previous: posts[index + 1], next: posts[index - 1] }
  }));
}

/** Static paths for `/page/[page]`; page one remains the blog root. */
export async function getBlogPagePaths(pageSize: number = defaultBlogPagination.postsPerPage) {
  const posts = await getPublishedPosts();
  const totalPages = Math.ceil(posts.length / positivePageSize(pageSize, defaultBlogPagination.postsPerPage));
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => {
    const currentPage = index + 2;
    return { params: { page: String(currentPage) }, props: { currentPage } };
  });
}

/** Static paths for category roots and their optional `/page/N` suffixes. */
export async function getBlogCategoryPaths(pageSize: number = defaultBlogPagination.categoryPostsPerPage) {
  const posts = await getPublishedPosts();
  const categories = [...new Set(posts.map((post) => post.data.category))];
  const size = positivePageSize(pageSize, defaultBlogPagination.categoryPostsPerPage);

  return categories.flatMap((category) => {
    const totalPages = Math.ceil(posts.filter((post) => post.data.category === category).length / size);
    return Array.from({ length: totalPages }, (_, index) => {
      const currentPage = index + 1;
      return {
        params: { category, page: currentPage === 1 ? undefined : `page/${currentPage}` },
        props: { category, currentPage }
      };
    });
  });
}

/** Static paths for yearly archive detail pages. */
export async function getBlogArchiveYearPaths() {
  const posts = await getPublishedPosts();
  const years = [...new Set(posts.map((post) => String(post.data.publishDate.getFullYear())))];
  return years.map((year) => ({ params: { year }, props: { year } }));
}

export function postPath(post: Post) {
  return templatePath("blog", `/posts/${post.id.replace(/\.(md|mdx)$/, "")}/`);
}

export function blogPagePath(page: number) {
  return page <= 1 ? templatePath("blog") : templatePath("blog", `/page/${page}/`);
}

export function categoryPath(category: string, page = 1) {
  const root = templatePath("blog", `/categories/${encodeURIComponent(category)}/`);
  return page <= 1 ? root : `${root}page/${page}/`;
}

export function archiveYearPath(year: string | number) {
  return templatePath("blog", `/archive/${year}/`);
}

export function postModifiedDate(post: Post) {
  return post.data.updatedDate ?? post.data.publishDate;
}

export function getCategorySummaries(posts: readonly Post[]): CategorySummary[] {
  const categories = [...new Set(posts.map((post) => post.data.category))];
  return categories.map((name) => {
    const categoryPosts = posts.filter((post) => post.data.category === name);
    const latestPost = [...categoryPosts].sort(
      (a, b) => postModifiedDate(b).valueOf() - postModifiedDate(a).valueOf()
    )[0];
    return {
      name,
      posts: categoryPosts,
      latestPost,
      tags: [...new Set(categoryPosts.flatMap((post) => post.data.tags))].slice(0, 3),
      latest: postModifiedDate(latestPost)
    };
  }).sort((a, b) => b.latest.valueOf() - a.latest.valueOf() || a.name.localeCompare(b.name));
}

export function getArchiveGroups(posts: readonly Post[]) {
  return Object.entries(posts.reduce<Record<string, Post[]>>((years, post) => {
    const year = String(post.data.publishDate.getFullYear());
    (years[year] ??= []).push(post);
    return years;
  }, {})).sort(([a], [b]) => Number(b) - Number(a));
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
