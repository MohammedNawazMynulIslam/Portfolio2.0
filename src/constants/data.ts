export const CONTACT_LINKS = [
  { label: "Email", href: "mailto:hello@example.com" },
  { label: "GitHub", href: "https://github.com/" },
  { label: "LinkedIn", href: "https://linkedin.com/" },
] as const;

export const PHOTO_ALBUMS = [
  "Workspace",
  "Projects",
  "Travel",
] as const;

import type { FileViewerPayload } from "@/types";

export type FinderItemKind = "folder" | "tsx" | "jsx" | "md";

export interface FinderItem {
  name: string;
  kind: FinderItemKind;
  dateModified: string;
  size: string;
  description?: string;
  techStack?: string[];
  githubUrl?: string;
  liveDemoUrl?: string;
  viewerFile?: FileViewerPayload;
}

export interface FinderDirectory {
  items: FinderItem[];
}

export const FINDER_DATA: Record<string, FinderDirectory> = {
  Home: {
    items: [
      { name: "Projects", kind: "folder", dateModified: "Apr 19, 2026", size: "--" },
      { name: "About", kind: "folder", dateModified: "Apr 18, 2026", size: "--" },
      { name: "Skills", kind: "folder", dateModified: "Apr 17, 2026", size: "--" },
      { name: "Resume", kind: "folder", dateModified: "Apr 16, 2026", size: "--" },
    ],
  },
  "Home/Projects": {
    items: [
      { name: "Web", kind: "folder", dateModified: "Apr 19, 2026", size: "--" },
      { name: "Mobile", kind: "folder", dateModified: "Apr 14, 2026", size: "--" },
      { name: "Fullstack", kind: "folder", dateModified: "Apr 12, 2026", size: "--" },
    ],
  },
  "Home/Projects/Web": {
    items: [
      {
        name: "aero-commerce.tsx",
        kind: "tsx",
        dateModified: "Apr 19, 2026",
        size: "42 KB",
        description:
          "A polished storefront experience with animated product storytelling, cart flows, and Stripe checkout.",
        techStack: ["Next.js 16", "TypeScript", "Tailwind CSS", "GSAP", "Stripe"],
        githubUrl: "https://github.com/mynul/aero-commerce",
        liveDemoUrl: "https://aero-commerce.example.com",
        viewerFile: {
          fileType: "markdown",
          filename: "aero-commerce-README.md",
          size: "6 KB",
          content: `# Aero Commerce

A premium storefront concept built around motion-driven merchandising and clean product storytelling.

## Highlights
- Cinematic landing sections with GSAP transitions
- Fast cart and checkout flow with Stripe
- CMS-ready product modules for editors

## Stack
- Next.js 16
- TypeScript
- Tailwind CSS
- GSAP
- Stripe`,
        },
      },
      {
        name: "studio-grid.jsx",
        kind: "jsx",
        dateModified: "Apr 10, 2026",
        size: "28 KB",
        description:
          "A visual portfolio CMS for a small creative studio with modular case-study blocks and fast editorial workflows.",
        techStack: ["React", "Vite", "Framer Motion", "Sanity"],
        githubUrl: "https://github.com/mynul/studio-grid",
        liveDemoUrl: "https://studio-grid.example.com",
        viewerFile: {
          fileType: "markdown",
          filename: "studio-grid-README.md",
          size: "5 KB",
          content: `# Studio Grid

A modular studio portfolio built for quick publishing and visually rich case studies.

## Highlights
- Flexible blocks for editorial storytelling
- Visual CMS workflow for non-technical teams
- Smooth page transitions and strong mobile polish

## Stack
- React
- Vite
- Framer Motion
- Sanity`,
        },
      },
      {
        name: "pulse-dashboard.tsx",
        kind: "tsx",
        dateModified: "Apr 6, 2026",
        size: "51 KB",
        description:
          "A data-rich analytics dashboard with live charts, keyboard shortcuts, and an opinionated dark/light theme system.",
        techStack: ["Next.js", "TypeScript", "Zustand", "Recharts"],
        githubUrl: "https://github.com/mynul/pulse-dashboard",
        liveDemoUrl: "https://pulse-dashboard.example.com",
        viewerFile: {
          fileType: "markdown",
          filename: "pulse-dashboard-README.md",
          size: "7 KB",
          content: `# Pulse Dashboard

An analytics workspace designed for speed, clarity, and high-density data views.

## Highlights
- Live chart modules with reusable filters
- Keyboard-first interactions for power users
- Opinionated theming system with clean contrast

## Stack
- Next.js
- TypeScript
- Zustand
- Recharts`,
        },
      },
      {
        name: "case-notes.md",
        kind: "md",
        dateModified: "Apr 2, 2026",
        size: "12 KB",
        description:
          "A collection of design and engineering notes documenting process decisions, experiments, and launch retrospectives.",
        techStack: ["Markdown", "MDX", "Contentlayer"],
        githubUrl: "https://github.com/mynul/case-notes",
        liveDemoUrl: "https://case-notes.example.com",
        viewerFile: {
          fileType: "markdown",
          filename: "case-notes.md",
          size: "12 KB",
          content: `# Case Notes

A working notebook of portfolio experiments, design decisions, and post-launch learnings.

## Inside
- UI system notes
- Motion studies
- Retrospectives after shipping

## Format
Written in Markdown and rendered through MDX.`,
        },
      },
    ],
  },
};

export const PHOTOS_LIBRARY = [
  {
    id: "april-hero-1",
    month: "April 2025",
    title: "Commerce Launch Screen",
    caption: "Product storytelling mockup for a luxury storefront redesign.",
    src: "https://picsum.photos/seed/aero-commerce-1/900/720",
  },
  {
    id: "april-hero-2",
    month: "April 2025",
    title: "Finder-style Project Explorer",
    caption: "Desktop-inspired navigation concept for portfolio exploration.",
    src: "https://picsum.photos/seed/finder-portfolio-2/900/1100",
  },
  {
    id: "april-hero-3",
    month: "April 2025",
    title: "Analytics Dashboard Detail",
    caption: "Dense chart composition focused on readability and pace.",
    src: "https://picsum.photos/seed/pulse-dashboard-3/900/760",
  },
  {
    id: "april-hero-4",
    month: "April 2025",
    title: "Editorial Studio Layout",
    caption: "Case-study landing page with flexible image/story modules.",
    src: "https://picsum.photos/seed/studio-grid-4/900/980",
  },
  {
    id: "january-1",
    month: "January 2025",
    title: "Portfolio Identity Board",
    caption: "Color, type, and interface references for the new portfolio system.",
    src: "https://picsum.photos/seed/identity-board-5/900/840",
  },
  {
    id: "january-2",
    month: "January 2025",
    title: "Mobile Commerce Flow",
    caption: "Compact checkout experience designed for fast thumb navigation.",
    src: "https://picsum.photos/seed/mobile-flow-6/900/1120",
  },
  {
    id: "january-3",
    month: "January 2025",
    title: "Creative Dashboard Widgets",
    caption: "Widget variants explored for a modular reporting workspace.",
    src: "https://picsum.photos/seed/widgets-7/900/700",
  },
  {
    id: "january-4",
    month: "January 2025",
    title: "Case Study Image Rail",
    caption: "Immersive image layout for project storytelling.",
    src: "https://picsum.photos/seed/case-rail-8/900/1020",
  },
  {
    id: "january-5",
    month: "January 2025",
    title: "Studio System Notes",
    caption: "Sketches and interface fragments from a systemization pass.",
    src: "https://picsum.photos/seed/system-notes-9/900/780",
  },
  {
    id: "january-6",
    month: "January 2025",
    title: "Landing Page Motion Frames",
    caption: "Frames captured while tuning animation pacing and hierarchy.",
    src: "https://picsum.photos/seed/motion-frames-10/900/1150",
  },
] as const;

export const RESUME_PROFILE = {
  name: "Mynul Islam",
  role: "Full Stack Developer",
  email: "mynul.dev@example.com",
  linkedin: "https://linkedin.com/in/mynul-islam",
  github: "https://github.com/mynul",
} as const;

export const RESUME_EXPERIENCE = [
  {
    company: "Northstar Studio",
    role: "Senior Frontend Engineer",
    period: "2024 - Present",
    bullets: [
      "Led the rebuild of a high-conversion marketing platform in Next.js, improving Lighthouse performance and editorial velocity.",
      "Designed reusable UI patterns across portfolio, commerce, and dashboard surfaces with an emphasis on animation and interaction quality.",
      "Partnered with design and product to ship polished features from concept through launch with strong accessibility defaults.",
    ],
  },
  {
    company: "Blue Orbit Labs",
    role: "Full Stack Developer",
    period: "2022 - 2024",
    bullets: [
      "Built customer-facing SaaS workflows using React, Node.js, and PostgreSQL for project planning and internal operations.",
      "Created API integrations and dashboard tooling that reduced manual reporting work for operations teams.",
      "Introduced component documentation and deployment guardrails that improved release confidence across the team.",
    ],
  },
  {
    company: "Freelance",
    role: "Product Engineer",
    period: "2020 - 2022",
    bullets: [
      "Delivered tailored websites and web apps for startups, agencies, and personal brands with a focus on storytelling and performance.",
      "Scoped, designed, and implemented polished MVPs end to end, from wireframes to production deployment.",
    ],
  },
] as const;

export const RESUME_EDUCATION = [
  {
    school: "University of Dhaka",
    degree: "B.Sc. in Computer Science",
    period: "2018 - 2022",
  },
  {
    school: "Frontend Mentor Collective",
    degree: "Independent UI Engineering Study",
    period: "Ongoing",
  },
] as const;

export const RESUME_SKILLS = {
  Languages: ["JavaScript", "TypeScript", "Python"],
  Frameworks: ["React", "Next.js", "Node.js"],
  Tools: ["Git", "Docker", "Figma"],
} as const;

export const RESUME_PROJECTS = [
  {
    name: "Aero Commerce",
    description:
      "A premium storefront experience focused on motion, merchandising, and fast checkout flows.",
    href: "https://aero-commerce.example.com",
    label: "Live Demo",
  },
  {
    name: "Pulse Dashboard",
    description:
      "An analytics workspace with live charts, quick filters, and elegant keyboard-first workflows.",
    href: "https://pulse-dashboard.example.com",
    label: "Project Link",
  },
  {
    name: "Studio Grid",
    description:
      "A modular CMS-driven portfolio for a creative studio with flexible case-study layouts.",
    href: "https://studio-grid.example.com",
    label: "Case Study",
  },
] as const;

export const CONTACT_PROFILE = {
  name: "Mynul Islam",
  jobTitle: "Full Stack Developer",
  email: "mynul.dev@example.com",
  github: "https://github.com/mynul",
  linkedin: "https://linkedin.com/in/mynul-islam",
  twitter: "https://x.com/mynul",
  location: "Dhaka, Bangladesh",
} as const;
