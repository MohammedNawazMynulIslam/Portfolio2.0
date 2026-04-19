"use client";

import gsap from "gsap";
import { useEffect, useMemo, useRef, useState } from "react";

import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

interface WelcomeScreenProps {
  onComplete: () => void;
}

const WELCOME_TEXT = "Welcome.";

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const bootScreenRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const welcomeScreenRef = useRef<HTMLButtonElement | null>(null);
  const nameRef = useRef<HTMLParagraphElement | null>(null);
  const promptRef = useRef<HTMLParagraphElement | null>(null);
  const cursorRef = useRef<HTMLSpanElement | null>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const pulseTweenRef = useRef<gsap.core.Tween | null>(null);
  const cursorTweenRef = useRef<gsap.core.Tween | null>(null);
  const [phase, setPhase] = useState<"boot" | "welcome">("boot");
  const [isLeaving, setIsLeaving] = useState(false);

  const letters = useMemo(() => WELCOME_TEXT.split(""), []);

  useIsomorphicLayoutEffect(() => {
    const bootScreen = bootScreenRef.current;
    const progressBar = progressBarRef.current;

    if (!bootScreen || !progressBar || phase !== "boot") {
      return;
    }

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        onComplete: () => setPhase("welcome"),
      });

      timeline.set(progressBar, { scaleX: 0, transformOrigin: "left center" });
      timeline.to(progressBar, {
        scaleX: 1,
        duration: 2,
        ease: "power1.inOut",
      });
      timeline.to(bootScreen, {
        autoAlpha: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    }, bootScreenRef);

    return () => context.revert();
  }, [phase]);

  useIsomorphicLayoutEffect(() => {
    const welcomeScreen = welcomeScreenRef.current;
    const name = nameRef.current;
    const prompt = promptRef.current;
    const cursor = cursorRef.current;
    const lettersToAnimate = letterRefs.current.filter(Boolean);

    if (
      !welcomeScreen ||
      !name ||
      !prompt ||
      !cursor ||
      lettersToAnimate.length === 0 ||
      phase !== "welcome"
    ) {
      return;
    }

    pulseTweenRef.current?.kill();
    cursorTweenRef.current?.kill();

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        onComplete: () => {
          pulseTweenRef.current = gsap.to(prompt, {
            opacity: 1,
            duration: 1,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
          cursorTweenRef.current = gsap.to(cursor, {
            autoAlpha: 0,
            duration: 0.6,
            repeat: -1,
            yoyo: true,
            ease: "none",
          });
        },
      });

      timeline.set(welcomeScreen, { autoAlpha: 1 });
      timeline.set(cursor, { autoAlpha: 0 });
      timeline.fromTo(
        lettersToAnimate,
        { y: 40, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          stagger: 0.06,
          duration: 0.7,
          ease: "power3.out",
        },
      );
      timeline.to(
        cursor,
        {
          autoAlpha: 1,
          duration: 0.1,
        },
        "-=0.2",
      );
      timeline.fromTo(
        name,
        { autoAlpha: 0, y: 16 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.45,
          ease: "power2.out",
        },
        "-=0.08",
      );
      timeline.fromTo(
        prompt,
        { autoAlpha: 0.4 },
        { autoAlpha: 0.75, duration: 0.3, ease: "power2.out" },
        "-=0.02",
      );
    }, welcomeScreenRef);

    return () => context.revert();
  }, [phase]);

  useEffect(() => {
    return () => {
      pulseTweenRef.current?.kill();
      cursorTweenRef.current?.kill();
    };
  }, []);

  const handleEnter = () => {
    if (phase !== "welcome" || isLeaving || !welcomeScreenRef.current) {
      return;
    }

    setIsLeaving(true);
    pulseTweenRef.current?.kill();

    gsap.to(welcomeScreenRef.current, {
      scale: 1.1,
      autoAlpha: 0,
      duration: 0.6,
      ease: "power2.inOut",
      onComplete,
    });
  };

  return (
    <>
      {phase === "boot" && (
        <div
          ref={bootScreenRef}
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#1a1a1a] text-white"
        >
          <div className="mb-8 flex h-32 w-32 items-center justify-center rounded-[2rem] border border-white/10 bg-white/5 font-georama text-[120px] font-light leading-none text-white/95 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
            M
          </div>
          <div className="h-1.5 w-48 overflow-hidden rounded-full bg-white/12">
            <div
              ref={progressBarRef}
              className="h-full w-full rounded-full bg-white/80"
            />
          </div>
        </div>
      )}

      {phase === "welcome" && (
        <button
          ref={welcomeScreenRef}
          type="button"
          onClick={handleEnter}
          className="fixed inset-0 z-[9999] flex min-h-screen w-full cursor-pointer flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] px-6 text-center text-white"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_30%),radial-gradient(circle_at_bottom,rgba(125,211,252,0.14),transparent_25%)]" />
          <div className="relative z-10 flex flex-col items-center">
            <h1 className="flex flex-wrap justify-center font-georama text-[56px] font-light leading-none tracking-tight text-white sm:text-[72px] md:text-[96px]">
              {letters.map((letter, index) => (
                <span
                  key={`${letter}-${index}`}
                  ref={(element) => {
                    letterRefs.current[index] = element;
                  }}
                  className="inline-block"
                >
                  {letter === " " ? "\u00A0" : letter}
                </span>
              ))}
              <span ref={cursorRef} className="cursor-blink" />
            </h1>
            <p
              ref={nameRef}
              className="mt-5 font-georama text-xl font-medium text-white/85 md:text-2xl"
            >
              Mynul
            </p>
            <p
              ref={promptRef}
              className="mt-8 font-georama text-sm font-medium uppercase tracking-[0.24em] text-white/70 md:text-base"
            >
              Click anywhere to continue
            </p>
          </div>
        </button>
      )}
    </>
  );
}
