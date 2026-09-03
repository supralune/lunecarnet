export type { SiteVariant } from "../types";
import type { IdentityConfig } from "../types";

/** Set to false after replacing the example content in the enabled templates. */
export const showEditingGuides = true;

/** Shared owner information used when both templates describe the same person. */
export const identity: IdentityConfig = {
  name: "Your Name",
  initials: "YN",
  email: "your.name@example.com",
  github: "",
  location: "City, Country · University or Institution",
  avatar: ""
};
