import { About } from "@/components/site/About";
import { Contact } from "@/components/site/Contact";
import { Experience } from "@/components/site/Experience";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/site/Hero";
import { CustomCursor } from "@/components/site/motion/CustomCursor";
import { MotionProvider } from "@/components/site/motion/MotionProvider";
import { Preloader } from "@/components/site/motion/Preloader";
import { ScrollProgress } from "@/components/site/motion/ScrollProgress";
import { Navbar } from "@/components/site/Navbar";
import { Projects } from "@/components/site/Projects";
import { Section, SectionIntro } from "@/components/site/Section";
import { getPortfolio } from "@/lib/data";

export default async function Home() {
  const data = await getPortfolio();

  return (
    <MotionProvider>
      <CustomCursor />
      <ScrollProgress />
      <Preloader name={data.profile.name} role={data.profile.role} />

      <Navbar name={data.profile.name} />
      <main>
        <Hero profile={data.profile} />
        <About about={data.about} skills={data.skills} />
        <Section
          id="experience"
          index="(02)"
          heading="Experience"
          meta="Career"
        >
          <SectionIntro>
            Teams I&apos;ve worked in, what I&apos;m building now, and the
            problems I&apos;ve solved along the way.
          </SectionIntro>
          <Experience experience={data.experience} />
        </Section>
        <Projects projects={data.projects} />
        <Contact profile={data.profile} />
      </main>
      <Footer profile={data.profile} />
    </MotionProvider>
  );
}
