"use client";

import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { useRef, type ElementType } from "react";

type Tag = "span" | "p" | "h1" | "h2" | "h3" | "div";

interface TextRevealProps {
  text: string;
  as?: Tag;
  className?: string;
  type?: "words" | "chars";
  delay?: number;
  stagger?: number;
  start?: string;
}

export function TextReveal({
  text,
  as = "span",
  className,
  type = "words",
  delay = 0,
  stagger,
  start = "top 85%",
}: TextRevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const Tag = as as ElementType;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const targets = el.querySelectorAll<HTMLElement>("[data-r]");
      if (targets.length === 0) return;
      gsap.set(targets, { yPercent: 115 });
      gsap.to(targets, {
        yPercent: 0,
        duration: 0.9,
        ease: "power4.out",
        stagger: stagger ?? (type === "chars" ? 0.025 : 0.06),
        delay,
        scrollTrigger: { trigger: el, start, once: true },
      });
    },
    { scope: ref, dependencies: [text, type, delay, stagger, start] },
  );

  const units =
    type === "chars" ? Array.from(text) : text.split(/(\s+)/).filter(Boolean);

  const children = units.map((unit, index) => {
    if (type === "words" && /^\s+$/.test(unit)) {
      return (
        <span key={`s-${index}`} className="inline-block">
          &nbsp;
        </span>
      );
    }
    return (
      <span
        key={`u-${index}`}
        className="inline-block overflow-hidden align-bottom"
      >
        <span className="inline-block" data-r>
          {unit === " " ? "\u00A0" : unit}
        </span>
      </span>
    );
  });

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
