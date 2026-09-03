import { academic, education, honors, news, projects, publications, service } from "./academic";
import { blog } from "./blog";
import { identity, showEditingGuides } from "./shared";
import { defineAcademicConfig, defineBlogConfig } from "../types";

/** Consumer-owned data passed into the reusable blog theme components. */
export const blogTemplate = defineBlogConfig({
  blog,
  identity,
  showEditingGuides
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
  showEditingGuides
});
