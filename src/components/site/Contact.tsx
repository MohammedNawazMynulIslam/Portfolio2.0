import { Mail } from "lucide-react";
import Link from "next/link";

import { GithubIcon, LinkedinIcon, XIcon } from "@/components/site/icons";
import { Magnetic } from "@/components/site/motion/Magnetic";
import { Marquee } from "@/components/site/motion/Marquee";
import { TextReveal } from "@/components/site/motion/TextReveal";
import type { Profile } from "@/lib/types";

interface ContactProps {
  profile: Profile;
}

export function Contact({ profile }: ContactProps) {
  const socials = [
    { label: "GitHub", href: profile.social.github, Icon: GithubIcon },
    { label: "LinkedIn", href: profile.social.linkedin, Icon: LinkedinIcon },
    ...(profile.social.twitter
      ? [{ label: "X", href: profile.social.twitter, Icon: XIcon }]
      : []),
  ];

  return (
    <section id="contact" className="py-24 sm:py-32">
      <div className="container-px">
        <p className="label text-accent">(04) — Contact</p>
        <h2 className="serif mt-6 text-[15vw] leading-[0.85] tracking-tight sm:text-[12vw]">
          <TextReveal as="span" text="Let's build" type="chars" className="block" />
          <TextReveal
            as="span"
            text="something."
            type="chars"
            className="block italic-serif text-accent"
          />
        </h2>
      </div>

      <div className="container-px mt-12 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <Magnetic strength={0.3}>
          <Link
            href={`mailto:${profile.social.email}`}
            className="serif link-underline text-3xl text-foreground sm:text-4xl"
            data-cursor="hover"
          >
            {profile.social.email}
          </Link>
        </Magnetic>

        <div className="flex flex-col items-start gap-3 sm:items-end">
          <p className="label text-muted">{profile.availability}</p>
          <div className="flex items-center gap-3">
            {socials.map(({ label, href, Icon }) => (
              <Magnetic key={label} strength={0.5}>
                <Link
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-border-strong text-foreground transition-colors hover:border-accent hover:text-accent"
                  data-cursor="hover"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              </Magnetic>
            ))}
            <Magnetic strength={0.5}>
              <Link
                href={`mailto:${profile.social.email}`}
                aria-label="Email"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-border-strong text-foreground transition-colors hover:border-accent hover:text-accent"
                data-cursor="hover"
              >
                <Mail className="h-4 w-4" />
              </Link>
            </Magnetic>
          </div>
        </div>
      </div>

      <div className="mt-16 border-y border-border py-4">
        <Marquee duration={24}>
          <span className="serif px-8 text-3xl text-foreground">Available for work</span>
          <span className="text-accent">✦</span>
          <span className="italic-serif px-8 text-3xl text-muted">Let&apos;s talk</span>
          <span className="text-accent">✦</span>
          <span className="serif px-8 text-3xl text-foreground">Open to collaborations</span>
          <span className="text-accent">✦</span>
        </Marquee>
      </div>
    </section>
  );
}
