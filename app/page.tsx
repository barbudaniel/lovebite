import {
  Navigation,
  Hero,
  Marquee,
  Process,
  About,
  Earnings,
  LovebiteAI,
  Testimonials,
  FAQ,
  Contact,
  Footer,
} from "@/components/sections";
import { ScrollProgress } from "@/components/motion/smooth-scroll";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Navigation />
      <main>
        <Hero />
        <Marquee />
        <Process />
        <About />
        <Earnings />
        <LovebiteAI />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

