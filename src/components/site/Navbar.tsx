"use client";

import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { num: "01", label: "About", href: "#about" },
  { num: "02", label: "Work", href: "#experience" },
  { num: "03", label: "Projects", href: "#projects" },
  { num: "04", label: "Contact", href: "#contact" },
] as const;

interface NavbarProps {
  name: string;
}

function useClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      );
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, []);
  return time;
}

export function Navbar({ name }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const time = useClock();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useGSAP(
    () => {
      if (!overlayRef.current) return;
      const links = overlayRef.current.querySelectorAll("[data-menu-link]");
      gsap.set(links, { yPercent: 120 });
    },
    { scope: overlayRef },
  );

  function openMenu() {
    setMenuOpen(true);
    const links = overlayRef.current?.querySelectorAll("[data-menu-link]");
    if (links) {
      gsap.fromTo(
        links,
        { yPercent: 120 },
        { yPercent: 0, duration: 0.7, ease: "power4.out", stagger: 0.06, delay: 0.1 },
      );
    }
  }

  function closeMenu() {
    const links = overlayRef.current?.querySelectorAll("[data-menu-link]");
    if (links) {
      gsap.to(links, {
        yPercent: 120,
        duration: 0.4,
        ease: "power3.in",
        stagger: 0.04,
        onComplete: () => setMenuOpen(false),
      });
    } else {
      setMenuOpen(false);
    }
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          scrolled
            ? "border-b border-border bg-background/70 backdrop-blur-xl"
            : "border-b border-transparent"
        }`}
      >
        <nav className="container-px flex h-20 items-center justify-between">
          <Link
            href="#top"
            className="serif text-xl tracking-tight text-foreground"
            data-cursor="hover"
          >
            {name}
            <span className="text-accent">.</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="label flex items-center gap-2 text-muted transition-colors hover:text-foreground"
                data-cursor="hover"
              >
                <span className="text-accent">{link.num}</span>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-5 md:flex">
            <span className="label text-muted">{time}</span>
            <Link
              href="#contact"
              className="link-underline label text-foreground"
              data-cursor="hover"
            >
              Let&apos;s talk
            </Link>
          </div>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => (menuOpen ? closeMenu() : openMenu())}
            className="flex h-10 w-10 items-center justify-center md:hidden"
            data-cursor="hover"
          >
            <div className="flex flex-col items-end gap-1.5">
              <span
                className={`h-px bg-foreground transition-all duration-300 ${
                  menuOpen ? "w-6 translate-y-[7px] rotate-45" : "w-6"
                }`}
              />
              <span
                className={`h-px bg-foreground transition-all duration-300 ${
                  menuOpen ? "w-6 -translate-y-[1px] -rotate-45" : "w-4"
                }`}
              />
            </div>
          </button>
        </nav>
      </header>

      {menuOpen ? (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-40 flex flex-col justify-center bg-background px-6 md:hidden"
        >
          <div className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <div key={link.href} className="overflow-hidden">
                <Link
                  href={link.href}
                  onClick={closeMenu}
                  data-menu-link
                  data-cursor="hover"
                  className="serif flex items-baseline gap-4 text-6xl text-foreground"
                >
                  <span className="label text-accent">{link.num}</span>
                  {link.label}
                </Link>
              </div>
            ))}
          </div>
          <div className="mt-12 overflow-hidden">
            <p data-menu-link className="label text-muted">
              {time} — Dhaka
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
