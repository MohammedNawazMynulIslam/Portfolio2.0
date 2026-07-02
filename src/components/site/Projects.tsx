"use client";

import { ArrowUpRight, ExternalLink, Star } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import { GithubIcon } from "@/components/site/icons";
import { Magnetic } from "@/components/site/motion/Magnetic";
import { TextReveal } from "@/components/site/motion/TextReveal";
import type { Project } from "@/lib/types";

interface ProjectsProps {
  projects: Project[];
}

function ProjectLinks({ project }: { project: Project }) {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      {project.liveUrl ? (
        <Magnetic strength={0.4}>
          <Link
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-background"
            data-cursor="hover"
          >
            <ExternalLink className="h-4 w-4" />
            Live
          </Link>
        </Magnetic>
      ) : null}
      {project.githubUrl ? (
        <Magnetic strength={0.4}>
          <Link
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border-strong px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"
            data-cursor="hover"
          >
            <GithubIcon className="h-4 w-4" />
            Code
          </Link>
        </Magnetic>
      ) : null}
    </div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <article className="group w-full shrink-0 md:w-[80vw] md:max-w-[780px]">
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border">
        <Image
          src={project.image}
          alt={project.name}
          fill
          sizes="(max-width: 768px) 92vw, 80vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
        {project.featured ? (
          <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full border border-accent/40 bg-background/70 px-3 py-1 label text-accent backdrop-blur-md">
            <Star className="h-3 w-3" />
            Featured
          </span>
        ) : null}
        <span className="absolute right-4 top-4 label text-foreground/80">
          0{index + 1}
        </span>
      </div>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="serif text-4xl leading-none text-foreground sm:text-5xl">
            {project.name}
          </h3>
          <p className="mt-2 text-accent">{project.description}</p>
        </div>
        <ArrowUpRight className="mt-1 h-6 w-6 shrink-0 text-muted transition-colors group-hover:text-accent" />
      </div>

      {project.details ? (
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
          {project.details}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {project.techStack.map((tech) => (
          <span
            key={tech}
            className="rounded-full border border-border bg-card px-3 py-1 font-mono text-[11px] text-muted"
          >
            {tech}
          </span>
        ))}
      </div>

      <ProjectLinks project={project} />
    </article>
  );
}

export function Projects({ projects }: ProjectsProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const section = sectionRef.current;
        const track = trackRef.current;
        if (!section || !track) return;
        const getScrollAmount = () =>
          Math.max(0, track.scrollWidth - window.innerWidth);

        gsap.to(track, {
          x: () => -getScrollAmount(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${getScrollAmount()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section id="projects" className="scroll-mt-24 py-24 sm:py-32">
      <div className="container-px flex items-end justify-between gap-4 border-b border-border pb-6">
        <div className="flex items-baseline gap-4">
          <span className="label text-accent">(03)</span>
          <TextReveal as="h2" text="Selected Work" className="serif text-4xl leading-none sm:text-6xl" />
        </div>
        <span className="label hidden text-muted sm:block">Projects</span>
      </div>

      <div ref={sectionRef} className="relative mt-12 md:h-[100svh] md:overflow-hidden">
        <div
          ref={trackRef}
          className="flex flex-col gap-12 px-6 md:h-full md:flex-row md:items-center md:gap-10 md:px-[8vw]"
        >
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
