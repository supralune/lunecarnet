import { academic, academicHomeLimits, academicHomeSections, education, honors, news, projects, publications, service } from "./academic";
import { blog, blogPagination } from "./blog";
import { identity } from "./shared";
import { defineAcademicConfig, defineBlogConfig } from "../types";

/** Consumer-owned data passed into the reusable blog theme components. */
export const blogTemplate = defineBlogConfig({
  blog,
  identity,
  pagination: blogPagination
});

/** Consumer-owned data passed into the reusable academic theme components. */
export const academicTemplate = defineAcademicConfig({
  academic,
  identity,
  publications,
  projects,
  news,
  education,
  honors,
  service,
  homeSections: academicHomeSections,
  homeLimits: academicHomeLimits
});
