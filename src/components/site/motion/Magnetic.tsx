"use client";

import { gsap } from "@/lib/gsap";
import { useRef } from "react";

interface MagneticProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}

export function Magnetic({
  children,
  strength = 0.35,
  className,
}: MagneticProps) {
  const ref = useRef<HTMLSpanElement | null>(null);

  function onMove(event: React.PointerEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = event.clientX - (rect.left + rect.width / 2);
    const y = event.clientY - (rect.top + rect.height / 2);
    gsap.to(el, {
      x: x * strength,
      y: y * strength,
      duration: 0.5,
      ease: "power3.out",
    });
  }

  function onLeave() {
    const el = ref.current;
    if (!el) return;
    gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
  }

  return (
    <span
      ref={ref}
      className={`inline-block ${className ?? ""}`}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </span>
  );
}
