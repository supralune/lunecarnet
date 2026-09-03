export type PublicationAuthor = { name: string; self?: boolean; corresponding?: boolean };

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

export const academic = {
  title: "Your Name",
  description: "Research Area One · Research Area Two · Research Area Three",
  language: "en",
  role: "Your Academic Role · Department, University",
  headline: "A concise sentence describing the broad focus and purpose of your research.",
  bio: "Use two or three sentences to introduce your main research questions, the methods or perspective you bring, and the broader significance of your work.",
  longBio: "Write a fuller academic biography here. You might summarize your educational background, current research agenda, methodological approach, and the kinds of scholarly conversations or collaborations you hope to contribute to.",
  topics: ["Research Area One", "Research Area Two", "Research Area Three"],
  scholar: "",
  orcid: "",
  cvUrl: "",
  availability: "Add your collaboration, supervision, or visiting availability.",
  nav: [
    { key: "home", label: "Home", href: "/" },
    { key: "publications", label: "Publications", href: "/publications/" },
    { key: "projects", label: "Projects", href: "/projects/" },
    { key: "about", label: "About", href: "/about/" }
  ]
};

export const publications: Publication[] = [
  {
    year: 2026,
    title: "Title of Your Selected Publication",
    authors: [
      { name: "Your Name", self: true },
      { name: "Coauthor One" },
      { name: "Coauthor Two", corresponding: true }
    ],
    venue: "Conference or Journal Name, Volume(Issue), Year",
    badge: "Selected",
    selected: true,
    links: [
      { label: "Add paper URL", href: "" },
      { label: "Add code URL", href: "" },
      { label: "Add project URL", href: "" }
    ]
  },
  {
    year: 2025,
    title: "Title of Another Publication",
    authors: [
      { name: "Coauthor One" },
      { name: "Your Name", self: true, corresponding: true }
    ],
    venue: "Conference, Journal, or Preprint Venue, Year",
    badge: "Example",
    selected: true,
    links: [
      { label: "Add paper URL", href: "" },
      { label: "Add BibTeX URL", href: "" }
    ]
  }
];

export const projects: Project[] = [
  {
    title: "Project or Research Initiative Title",
    period: "2025 – present",
    description: "Summarize the question or need behind the project, your role, and the most important output or contribution.",
    tags: ["Method or Technology", "Project Type"],
    link: ""
  },
  {
    title: "Second Project or Collaboration",
    period: "2024 – present",
    description: "Use one or two sentences to describe the work. Add a repository, project page, dataset, demo, or report URL when available.",
    tags: ["Research Topic", "Your Role"],
    link: ""
  }
];

export const news = [
  { date: "Aug 2026", text: "Add a recent update, such as a publication, talk, award, grant, or new position." },
  { date: "May 2026", text: "Add another concise and verifiable academic update." },
  { date: "Jan 2026", text: "Remove this item if you do not need a third update." }
];

export const education = [
  { period: "2024 – present", title: "Degree in Field of Study", detail: "University Name · Department or School · Adviser or Research Group" },
  { period: "2020 – 2024", title: "Previous Degree in Field of Study", detail: "University Name · Department or School" }
];

export const honors = [
  { title: "Award, Honor, Fellowship, or Scholarship", detail: "Granting Organization · Year" },
  { title: "Second Honor or Recognition", detail: "Granting Organization · Year" }
];

export const service = [
  "Reviewer, Editor, or Committee Role · Venue or Organization · Year",
  "Teaching, Mentoring, Community, or Professional Service · Year"
];
