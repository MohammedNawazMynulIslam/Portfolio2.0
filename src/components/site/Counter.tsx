"use client";

import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useEffect, useRef } from "react";

interface CounterProps {
  to: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

export function Counter({
  to,
  suffix = "",
  duration = 1.8,
  className,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      el.textContent = `${to}${suffix}`;
      return;
    }

    const obj = { value: 0 };
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          value: to,
          duration,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = `${Math.round(obj.value)}${suffix}`;
          },
        });
      },
    });
    return () => st.kill();
  }, [to, suffix, duration]);

  return (
    <span ref={ref} className={className}>
      0{suffix}
    </span>
  );
}
