export type { SiteVariant } from "../types";
import type { IdentityConfig } from "../types";

/** Shared owner information used when both templates describe the same person. */
export const identity: IdentityConfig = {
  name: "Your Name",
  initials: "YN",
  email: "your.name@example.com",
  github: "",
  location: "City, Country · University or Institution",
  avatar: ""
};
