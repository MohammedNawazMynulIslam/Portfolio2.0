"use client";

import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

import { useMotion } from "@/components/site/motion/MotionProvider";

export function ScrollProgress() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { ready } = useMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      gsap.set(el, { scaleX: 0, transformOrigin: "left center" });
      ScrollTrigger.create({
        start: 0,
        end: () => document.documentElement.scrollHeight - window.innerHeight,
        onUpdate: (self) => {
          gsap.to(el, {
            scaleX: self.progress,
            duration: 0.15,
            ease: "none",
            overwrite: true,
          });
        },
      });
    },
    { dependencies: [ready] },
  );

  return (
    <div
      ref={ref}
      className="fixed left-0 top-0 z-[60] h-[2px] w-full origin-left scale-x-0 bg-accent"
      aria-hidden="true"
    />
  );
}
