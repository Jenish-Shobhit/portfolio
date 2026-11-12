import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import AgentCursor from "./components/AgentCursor";
import Nav from "./components/Nav";
import Universe from "./components/Universe";
import Home from "./pages/Home";
import ProjectPage from "./pages/ProjectPage";
import { PROJECTS } from "./data/portfolio";
import { scrollTop, startSmoothScroll } from "./lib/smoothScroll";

function Curtain({ path }) {
  const [on, setOn] = useState(true);
  useEffect(() => setOn(true), [path]);
  if (!on) return null;
  return <div key={path} className="page-curtain" aria-hidden="true" onAnimationEnd={() => setOn(false)} />;
}

function Shell() {
  const { pathname, hash } = useLocation();
  useEffect(() => startSmoothScroll(), []);
  useEffect(() => {
    if (!hash) scrollTop();
  }, [pathname, hash]);
  useEffect(() => {
    const p = PROJECTS.find((x) => pathname === `/work/${x.id}`);
    document.title = p ? `${p.name} — Jenish Shobhit` : "Jenish Shobhit";
  }, [pathname]);
  return (
    <div className="relative min-h-screen text-foreground antialiased">
      <Universe />
      <div className="grain" aria-hidden="true" />
      <AgentCursor key={`cursor-${pathname}`} />
      <Nav />
      <Curtain path={pathname} />
      <div key={pathname} className="page-enter relative z-[1]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work/:id" element={<ProjectPage />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}
