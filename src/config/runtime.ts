import type { SiteVariant } from "../types";

export type SiteMode = SiteVariant | "both" | "single";

const configuredMode = import.meta.env.SITE_MODE as SiteMode | undefined;

export const siteMode: SiteMode = configuredMode === "blog" || configuredMode === "academic" || configuredMode === "both"
  ? configuredMode
  : "single";

export const isCombinedSite = siteMode === "both";

/** Convert a template-local route into its public route for the current build mode. */
export function templatePath(template: SiteVariant, path = "/") {
  const cleanPath = path.replace(/^\/+|\/+$/g, "");
  const isFile = /\.[a-z0-9]+$/i.test(cleanPath);
  const normalizedPath = path === "/" ? "/" : `/${cleanPath}${isFile ? "" : "/"}`;
  if (!isCombinedSite) return normalizedPath;
  return normalizedPath === "/" ? `/${template}/` : `/${template}${normalizedPath}`;
}
