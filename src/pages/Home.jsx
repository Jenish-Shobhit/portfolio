import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import About from "../components/About";
import Footer from "../components/Footer";
import MissionControl from "../components/MissionControl";
import ParticleHero from "../components/ParticleHero";
import Projects from "../components/Projects";
import VoiceBuild from "../components/VoiceBuild";
import Words from "../components/Words";
import { scrollToId } from "../lib/smoothScroll";

export default function Home() {
  const { hash, search } = useLocation();
  useEffect(() => {
    const id = hash.slice(1) || new URLSearchParams(search).get("section");
    if (!id) return;
    const t = setTimeout(() => scrollToId(id, true), 120);
    return () => clearTimeout(t);
  }, [hash, search]);
  return (
    <>
      <main>
        <ParticleHero />
        <Projects />
        <About />
        <MissionControl />
        <Words />
        <VoiceBuild />
      </main>
      <Footer />
    </>
  );
}
