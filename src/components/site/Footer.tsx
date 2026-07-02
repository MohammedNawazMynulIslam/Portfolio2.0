import Link from "next/link";

import { GithubIcon, LinkedinIcon, XIcon } from "@/components/site/icons";
import { Marquee } from "@/components/site/motion/Marquee";
import type { Profile } from "@/lib/types";

interface FooterProps {
  profile: Profile;
}

export function Footer({ profile }: FooterProps) {
  const year = new Date().getFullYear();
  const socials = [
    { label: "GitHub", href: profile.social.github, Icon: GithubIcon },
    { label: "LinkedIn", href: profile.social.linkedin, Icon: LinkedinIcon },
    ...(profile.social.twitter
      ? [{ label: "X", href: profile.social.twitter, Icon: XIcon }]
      : []),
  ];

  return (
    <footer className="overflow-hidden">
      <div className="border-y border-border py-6">
        <Marquee duration={30}>
          <span className="serif px-8 text-[14vw] leading-none text-foreground">
            {profile.name}
          </span>
          <span className="serif px-8 text-[14vw] leading-none text-accent">✦</span>
        </Marquee>
      </div>

      <div className="container-px flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="serif text-lg text-foreground">
            {profile.name}
            <span className="text-accent">.</span>
          </p>
          <p className="label mt-1 text-muted">
            © {year} — Built with Next.js, GSAP &amp; Lenis
          </p>
        </div>

        <div className="flex items-center gap-4">
          {socials.map(({ label, href, Icon }) => (
            <Link
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent hover:text-accent"
              data-cursor="hover"
            >
              <Icon className="h-3.5 w-3.5" />
            </Link>
          ))}
          <Link
            href="#top"
            className="label link-underline ml-2 text-foreground"
            data-cursor="hover"
          >
            Back to top ↑
          </Link>
        </div>
      </div>
    </footer>
  );
}
