"use client";

import { Calendar, CircleCheck, Users } from "lucide-react";

import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

import { Reveal } from "@/components/site/motion/Reveal";
import type { ExperienceItem } from "@/lib/types";

interface ExperienceProps {
  experience: ExperienceItem[];
}

export function Experience({ experience }: ExperienceProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const fillRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (!fillRef.current || !wrapRef.current) return;
      gsap.fromTo(
        fillRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: wrapRef.current,
            start: "top 65%",
            end: "bottom 75%",
            scrub: true,
          },
        },
      );
    },
    { scope: wrapRef },
  );

  return (
    <div ref={wrapRef} className="relative mt-12 pl-8 sm:pl-12">
      <div className="absolute bottom-2 left-0 top-2 w-px bg-border">
        <div
          ref={fillRef}
          className="absolute inset-0 origin-top bg-accent"
        />
      </div>

      {experience.map((item, index) => (
        <Reveal key={item.id} delay={index * 0.05}>
          <div className="relative pb-16 last:pb-0">
            <span className="absolute left-[-32px] top-2 h-3 w-3 rounded-full bg-accent ring-4 ring-background sm:left-[-48px]" />

            <div className="grid gap-6 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <p className="label flex items-center gap-2 text-muted">
                  <Calendar className="h-3.5 w-3.5" />
                  {item.period}
                </p>
                <h3 className="serif mt-3 text-4xl leading-none text-foreground sm:text-5xl">
                  {item.company}
                </h3>
                <p className="mt-2 text-accent">{item.role}</p>
                <p className="label mt-4 flex items-center gap-2 text-muted">
                  <Users className="h-3.5 w-3.5" />
                  {item.team}
                </p>
              </div>

              <div className="lg:col-span-8 flex flex-col gap-6">
  {item.current ? (
    <span className="inline-flex w-fit items-center rounded-full border border-accent/40 bg-accent-dim px-3 py-1 label text-accent">
      Current
    </span>
  ) : null}

  {item.current && item.currentProject ? (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="label text-accent">Current project</p>
      <p className="mt-2 leading-relaxed text-foreground">
        {item.currentProject}
      </p>
    </div>
  ) : null}

  {item.achievements.length > 0 ? (
    <ul className="space-y-3">
      {item.achievements.map((achievement, i) => (
        <li
          key={i}
          className="flex gap-3 text-sm leading-relaxed text-muted"
        >
          <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
          <span>{achievement}</span>
        </li>
      ))}
    </ul>
  ) : null}
</div>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
