import { Reveal } from "@/components/site/motion/Reveal";
import { TextReveal } from "@/components/site/motion/TextReveal";

interface SectionProps {
  id: string;
  index: string;
  heading: string;
  meta?: string;
  children: React.ReactNode;
}

export function Section({ id, index, heading, meta, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-24 py-10 sm:py-20">
      <div className="container-px">
        <div className="flex items-end justify-between gap-4 border-b border-border pb-6">
          <div className="flex items-baseline gap-4">
            <span className="label text-accent">{index}</span>
            <TextReveal
              as="h2"
              text={heading}
              className="serif text-4xl leading-none sm:text-6xl"
            />
          </div>
          {meta ? (
            <span className="label hidden text-muted sm:block">{meta}</span>
          ) : null}
        </div>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}

export function SectionIntro({ children }: { children: React.ReactNode }) {
  return (
    <Reveal>
      <p className="max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
        {children}
      </p>
    </Reveal>
  );
}
