export type SiteVariant = "blog" | "academic";

export type NavigationItem = {
  key: string;
  label: string;
  href: string;
};

export type IdentityConfig = {
  name: string;
  initials: string;
  email: string;
  github: string;
  location: string;
  avatar?: string;
};

export type BlogConfig = {
  title: string;
  description: string;
  language: string;
  foundedYear: number;
  hero: string;
  intro: string;
  about: string;
  writingPurpose: string;
  coverage: string;
  authorBio: string;
  contactNote: string;
  nav: NavigationItem[];
};

export type AcademicConfig = {
  title: string;
  description: string;
  language: string;
  role: string;
  headline: string;
  bio: string;
  longBio: string;
  topics: string[];
  scholar: string;
  orcid: string;
  cvUrl: string;
  availability: string;
  nav: NavigationItem[];
};

export type PublicationAuthor = {
  name: string;
  self?: boolean;
  corresponding?: boolean;
};

export type Publication = {
  year: number;
  title: string;
  authors: PublicationAuthor[];
  venue: string;
  badge?: string;
  selected?: boolean;
  links: Array<{ label: string; href: string }>;
};

export type Project = {
  title: string;
  period: string;
  description: string;
  tags: string[];
  link: string;
};

export type NewsItem = { date: string; text: string };
export type RecordItem = { period?: string; title: string; detail: string };

export type BlogTemplateConfig = {
  blog: BlogConfig;
  identity: IdentityConfig;
  showEditingGuides?: boolean;
};

export type AcademicTemplateConfig = {
  academic: AcademicConfig;
  identity: IdentityConfig;
  publications: Publication[];
  projects: Project[];
  news: NewsItem[];
  education: RecordItem[];
  honors: RecordItem[];
  service: string[];
  showEditingGuides?: boolean;
};

/** Preserve literal values while checking a consumer-owned template configuration. */
export function defineBlogConfig<const T extends BlogTemplateConfig>(config: T): T {
  return config;
}

/** Preserve literal values while checking a consumer-owned template configuration. */
export function defineAcademicConfig<const T extends AcademicTemplateConfig>(config: T): T {
  return config;
}
