"use client";

import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { ArrowDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import { Marquee } from "@/components/site/motion/Marquee";
import { Magnetic } from "@/components/site/motion/Magnetic";
import { TextReveal } from "@/components/site/motion/TextReveal";
import { useMotion } from "@/components/site/motion/MotionProvider";
import type { Profile } from "@/lib/types";

interface HeroProps {
  profile: Profile;
}

export function Hero({ profile }: HeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const clipRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLDivElement | null>(null);
  const { ready } = useMotion();

  useGSAP(
    () => {
      if (!ready) return;
      const tl = gsap.timeline();
      tl.from(clipRef.current, {
        clipPath: "inset(0 0 100% 0)",
        duration: 1.1,
        ease: "power4.out",
      });
      tl.fromTo(
        imgRef.current,
        { scale: 1.25 },
        { scale: 1, duration: 1.2, ease: "power3.out" },
        0,
      );
      gsap.to(imgRef.current, {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: sectionRef, dependencies: [ready] },
  );

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative flex min-h-[100svh] flex-col justify-between pt-28 pb-6"
    >
      <div className="container-px flex items-start justify-between">
        <span className="flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          <span className="label text-muted">{profile.availability}</span>
        </span>
        {/* <span className="label text-muted">© 2026</span> */}
      </div>

      <div className="container-px grid items-center gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <h1 className="serif text-[19vw] leading-[0.82] tracking-tight sm:text-[15vw] lg:text-[12.5vw]">
            <TextReveal as="span" text={profile.name.split(" ")[0]} type="chars" className="block" />
            <TextReveal
              as="span"
              text={profile.name.split(" ").slice(1).join(" ") || "Islam"}
              type="chars"
              className="block italic-serif text-accent"
            />
          </h1>
        </div>

        <div className="lg:col-span-4">
          <div ref={clipRef} className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden lg:max-w-none">
            <div ref={imgRef} className="absolute inset-[-12%]">
              <Image
                src={profile.heroImage}
                alt={`${profile.name} portrait`}
                fill
                sizes="(max-width: 1024px) 90vw, 33vw"
                className="object-cover"
                priority
              />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
          </div>
        </div>
      </div>

      <div className="container-px flex items-end justify-between gap-6 pb-4">
        <div>
          <p className="serif text-2xl text-foreground sm:text-3xl">{profile.role}</p>
          <p className="mt-2 max-w-md text-sm text-muted sm:text-base">{profile.tagline}</p>
        </div>
        <Magnetic strength={0.5}>
          <Link
            href="#projects"
            className="label flex items-center gap-2 text-foreground"
            data-cursor="hover"
          >
            Selected work
            <ArrowDown className="h-4 w-4 text-accent" />
          </Link>
        </Magnetic>
      </div>

      <div className="border-y border-border py-3">
        <Marquee duration={28}>
          <span className="serif px-8 text-2xl text-foreground">Full Stack Developer</span>
          <span className="text-accent">✦</span>
          <span className="italic-serif px-8 text-2xl text-muted">Available for work</span>
          <span className="text-accent">✦</span>
          <span className="serif px-8 text-2xl text-foreground">Based in {profile.location}</span>
          <span className="text-accent">✦</span>
        </Marquee>
      </div>
    </section>
  );
}
