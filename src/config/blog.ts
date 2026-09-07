import type { BlogConfig } from "../types";

export const blog: BlogConfig = {
  title: "Lune Carnet",
  description: "A personal blog about ideas, projects, and lessons learned along the way.",
  language: "en",
  foundedYear: 2026,
  hero: "A place to think in public and keep useful notes.",
  intro: "Essays, tutorials, project logs, reading notes, and occasional reflections on work and life.",
  about: "A small personal archive for ideas worth developing, things worth remembering, and lessons worth sharing.",
  writingPurpose: "I use this site to work through unfinished ideas, document what I learn, and leave a clearer trail for my future self. Publishing these notes also makes it easier to exchange useful context with others.",
  coverage: "Expect a mix of practical guides, project notes, reading summaries, essays, and short observations. The exact subjects may change over time; the common thread is an effort to make each entry specific, honest, and reusable.",
  authorBio: "I work across writing, research, and making. This site is where I share ongoing projects, practical notes, and ideas that deserve more than a passing thought.",
  contactNote: "Email is the best way to reach me for questions, corrections, or thoughtful conversations about anything published here."
};

export const blogPagination = {
  postsPerPage: 8,
  categoryPostsPerPage: 10
};
