"use client";

import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  y?: number;
  delay?: number;
  start?: string;
}

export function Reveal({
  children,
  className,
  y = 28,
  delay = 0,
  start = "top 88%",
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      gsap.from(el, {
        y,
        autoAlpha: 0,
        duration: 0.9,
        ease: "power3.out",
        delay,
        scrollTrigger: { trigger: el, start, once: true },
      });
    },
    { scope: ref, dependencies: [y, delay, start] },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
