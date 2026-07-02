import { Counter } from "@/components/site/Counter";
import { Reveal } from "@/components/site/motion/Reveal";
import { TextReveal } from "@/components/site/motion/TextReveal";
import { Section, SectionIntro } from "@/components/site/Section";
import type { About as AboutData, SkillGroup } from "@/lib/types";

interface AboutProps {
  about: AboutData;
  skills: SkillGroup[];
}

function parseStat(value: string): { to: number; suffix: string } {
  const match = value.match(/^(\d+)(.*)$/);
  if (!match) return { to: 0, suffix: value };
  return { to: Number(match[1]), suffix: match[2] };
}

export function About({ about, skills }: AboutProps) {
  return (
    <Section id="about" index="(01)" heading="About" meta="Profile / Skills">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <TextReveal
            as="p"
            text={about.currentStatus}
            className="serif text-3xl leading-[1.15] sm:text-5xl sm:leading-[1.12]"
            type="words"
          />
        </div>
        <div className="flex flex-col justify-end lg:col-span-4">
          <SectionIntro>{about.bio}</SectionIntro>
        </div>
      </div>

      <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
        {about.stats.map((stat) => {
          const { to, suffix } = parseStat(stat.value);
          return (
            <div key={stat.id} className="bg-background p-8">
              <p className="serif text-6xl text-foreground sm:text-7xl">
                <Counter to={to} suffix={suffix} />
              </p>
              <p className="mt-3 label text-muted">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-16 grid gap-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <p className="label text-accent">Current status</p>
          <p className="mt-4 text-lg leading-relaxed text-foreground">
            {about.currentStatus}
          </p>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-5">
          <p className="label text-accent">Future goal</p>
          <p className="italic-serif mt-4 text-2xl leading-snug text-foreground sm:text-3xl">
            {about.futureGoal}
          </p>
        </Reveal>
      </div>

      <div className="mt-16">
        <p className="label text-muted">Skill sets</p>
        <div className="mt-6 border-t border-border">
          {skills.map((group) => (
            <Reveal key={group.id}>
              <div className="grid gap-4 border-b border-border py-6 sm:grid-cols-12">
                <p className="serif text-2xl text-foreground sm:col-span-4">
                  {group.category}
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-2 sm:col-span-8">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="link-underline text-base text-muted transition-colors hover:text-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
