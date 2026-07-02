"use client";

import { gsap, ScrollTrigger } from "@/lib/gsap";
import Lenis from "lenis";
import { createContext, useContext, useEffect, useRef, useState } from "react";

interface MotionContextValue {
  ready: boolean;
  setReady: (value: boolean) => void;
}

const MotionContext = createContext<MotionContextValue>({
  ready: true,
  setReady: () => {},
});

export function useMotion() {
  return useContext(MotionContext);
}

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(prefersReducedMotion);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", onScroll);
      lenis.destroy();
      gsap.ticker.remove(raf);
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!ready) {
      document.body.style.overflow = "hidden";
      lenis?.stop();
    } else {
      document.body.style.overflow = "";
      lenis?.start();
      ScrollTrigger.refresh();
    }
  }, [ready]);

  useEffect(() => {
    const safety = window.setTimeout(() => setReady(true), 3200);
    return () => window.clearTimeout(safety);
  }, []);

  return (
    <MotionContext.Provider value={{ ready, setReady }}>
      {children}
    </MotionContext.Provider>
  );
}
