export const PROFILE = {
  name: "Jenish Shobhit",
  role: "Digital Specialist Engineer · Infosys",
  location: "Hyderabad, India",
  email: "jenshobhit@gmail.com",
  linkedin: "https://www.linkedin.com/in/jenish-shobhit/",
  github: "https://github.com/Jenish-Shobhit",
  credly: "https://www.credly.com/badges/3113b5a8-1f0c-42d1-91b8-78d5d4799aab",
};

const PREVIEWS = globalThis.location?.protocol === "file:" ? "./assets/previews" : `${import.meta.env?.BASE_URL ?? "/"}assets/previews`;

export const PROJECTS = [
  {
    id: "paneflo",
    name: "Paneflo",
    meta: "Native macOS · Swift 6 · AppKit",
    img: `${PREVIEWS}/paneflo-dark.png`,
    problem:
      "⌘Tab switches apps, not windows. Two browser windows are one icon, tiling costs a second app, and the Overview reshuffles itself while you use it.",
    owned:
      "Designed and built end to end in Swift 6 and AppKit — live previews, snap areas, tile pairs, an Overview that stays put. Zero third-party packages; CI, releases and docs included.",
    outcome:
      "A menu bar app anyone can download in one click, with a public release trail and a macOS build pipeline keeping it honest.",
    live: { label: "Download", url: "https://jenish-shobhit.github.io/paneflo/" },
    source: "https://github.com/Jenish-Shobhit/paneflo",
  },
  {
    id: "margin",
    name: "Margin",
    meta: "Native macOS · Swift 6 · ScreenCaptureKit",
    img: `${PREVIEWS}/margin-dark.png`,
    problem:
      "Every screenshot on macOS ends in the same tax: a floating preview demanding a decision before you can use the thing you just made.",
    owned:
      "Built the whole loop natively — capture lands on the clipboard, on disk and on a shelf at the edge of the screen in one motion, plus screen recording at Retina resolution straight from the hardware encoder. The app learned to never photograph itself.",
    outcome:
      "Screenshots that wait in the margin instead of interrupting — and a recording studio behind ⇧⌘5.",
    live: { label: "Download", url: "https://jenish-shobhit.github.io/margin/" },
    source: "https://github.com/Jenish-Shobhit/margin",
  },
  {
    id: "incident-response-agent",
    name: "Incident Response Agent",
    meta: "Python · LangGraph · FastAPI · Claude · AWS",
    img: `${PREVIEWS}/incident-dark.png`,
    problem:
      "Nobody trusts a model with production. Logs carry injected instructions, summaries hallucinate, and someone still has to click the button.",
    owned:
      "Designed the multi-agent workflow: a guard that quarantines injected instructions before any model reads them, parallel investigators, briefs where every claim cites evidence, and a human approval gate before anything is final. Built the FastAPI console and deployed the demo on AWS.",
    outcome:
      "A live demo served from CloudFront — a recorded real run replayed in the real console, with no model or key exposed.",
    live: { label: "Live demo", url: "https://dpdduyx82d5bu.cloudfront.net" },
    source: "https://github.com/Jenish-Shobhit/incident-response-agent",
  },
  {
    id: "codemap",
    name: "codeMap",
    meta: "Rust · ratatui · tree-sitter · herdr plugin",
    img: `${PREVIEWS}/codemap-dark.png`,
    problem:
      "Coding agents change more code in a turn than anyone reads line by line — and a diff never shows where the change sits in the codebase.",
    owned:
      "Wrote it in Rust: a popup over the agent's pane with map, flowchart, turn-aware review and history. tree-sitter parsers for five languages, read-only by design — no refs, no stash, no index writes.",
    outcome:
      "Paints the frame in under a millisecond, installs as a herdr plugin, and reviews what the agent just did without leaving the terminal.",
    live: { label: "Release", url: "https://github.com/Jenish-Shobhit/codeMap/releases/latest" },
    source: "https://github.com/Jenish-Shobhit/codeMap",
  },
  {
    id: "visual-dsa",
    name: "Visual DSA",
    meta: "JavaScript · no build step · 38 lessons",
    img: `${PREVIEWS}/visualdsa-dark.png`,
    problem:
      "Algorithms are taught as static diagrams you can't poke. So students memorize instead of predict.",
    owned:
      "Designed and wrote 38 lessons across 7 units — from “what is an algorithm?” to max-flow and NP-completeness — every lab animated, code-synced in pseudocode, JavaScript and Python, able to run backwards, and stopping to ask you to predict the next step.",
    outcome:
      "A full interactive course, live on GitHub Pages, that starts at your first line of code.",
    live: { label: "Open the course", url: "https://jenish-shobhit.github.io/visual-dsa/" },
    source: "https://github.com/Jenish-Shobhit/visual-dsa",
  },
  {
    id: "learntube",
    name: "LearnTube",
    meta: "Chrome extension · Manifest V3 · zero dependencies",
    img: `${PREVIEWS}/learntube-dark.png`,
    problem:
      "YouTube is the world's biggest classroom and its biggest distraction machine — and Shorts is always one scroll away.",
    owned:
      "Built a distraction-free learning layer: nine switches, Subscriptions as a quiet inbox, a Library that tracks playlist progress, playback up to 4×. No build step, no dependencies, no tracking — the source files are the shipped extension.",
    outcome:
      "Published on the Chrome Web Store, installable by anyone in one click.",
    live: {
      label: "Chrome Web Store",
      url: "https://chromewebstore.google.com/detail/jejlhdamaodimmhcomnihmepididhbde",
    },
    source: "https://github.com/Jenish-Shobhit/learntube",
  },
  {
    id: "panemorph",
    name: "paneMorph",
    meta: "Rust · ratatui · herdr plugin",
    img: `${PREVIEWS}/panemorph-dark.png`,
    problem:
      "herdr gives every agent its own pane, but work rarely stays where it started — a test runner belongs beside the agent that broke the tests.",
    owned:
      "Put pane movement behind two keys over herdr's socket API: Send, Fetch, and an Undo that rebuilds closed tabs and spaces — processes, scrollback and working directories never restart.",
    outcome:
      "An installable plugin with prebuilt binaries, and terminals that keep running while everything reorganizes around them.",
    live: { label: "Release", url: "https://github.com/Jenish-Shobhit/paneMorph/releases/latest" },
    source: "https://github.com/Jenish-Shobhit/paneMorph",
  },
  {
    id: "pyspark-three-ways",
    name: "PySpark, Three Ways",
    meta: "PySpark · Spark SQL · printable worksheets",
    img: `${PREVIEWS}/pyspark-dark.png`,
    problem:
      "PySpark is usually learned one paradigm at a time, so RDD, DataFrame and SQL never line up side by side in your head.",
    owned:
      "Authored a five-level path that solves every question three ways — RDD core, DataFrame API, Spark SQL — with interactive notes, revealable answers, printable PDF worksheets and runnable answer scripts.",
    outcome:
      "Live notes on GitHub Pages, from your first RDD to window functions, on paper or on screen.",
    live: { label: "Read the notes", url: "https://jenish-shobhit.github.io/pyspark-three-ways/" },
    source: "https://github.com/Jenish-Shobhit/pyspark-three-ways",
  },
];

export const EXPERIENCE = [
  {
    id: "infosys",
    period: "Aug 2025 — now",
    org: "Infosys",
    title: "Digital Specialist Engineer",
    detail:
      "Agents and agent design — MCP skills, developer tooling. Anthropic Claude Certified Architect.",
  },
  {
    id: "cognizant",
    period: "Feb — May 2025",
    org: "Cognizant",
    title: "Programmer Analyst Trainee",
    detail:
      "Java · Spring Boot — 20+ production-grade REST APIs, integrated with the frontend end to end.",
  },
];

export const CREDENTIALS = [
  {
    id: "claude-architect",
    title: "Anthropic Claude Certified Architect",
    sub: "Foundations · Credly badge",
    url: "https://www.credly.com/badges/3113b5a8-1f0c-42d1-91b8-78d5d4799aab",
    icon: "award",
  },
  {
    id: "genai-professional",
    title: "Infosys Certified Generative AI Professional",
    sub: "Infosys · certification",
    url: null,
    icon: "badge",
  },
  {
    id: "pull-shark",
    title: "GitHub Pull Shark ×2",
    sub: "merged pull requests, twice over",
    url: "https://github.com/Jenish-Shobhit?achievement=pull-shark&tab=achievements",
    icon: "pull",
  },
  {
    id: "pair-extraordinaire",
    title: "GitHub Pair Extraordinaire",
    sub: "co-authored, shipped together",
    url: "https://github.com/Jenish-Shobhit?achievement=pair-extraordinaire&tab=achievements",
    icon: "pair",
  },
];

export const DETAILS = {
  paneflo: {
    tagline: "Windows, not apps.",
    accent: "#38bdf8",
    stack: ["Swift 6", "AppKit", "CI", "Zero packages"],
    chapters: [
      ["The itch", "⌘Tab switches apps, not windows."],
      ["The rule", "Swift 6 and AppKit. Zero third-party packages."],
      ["The craft", "Live previews, snap areas, tile pairs — an Overview that stays put."],
      ["The ship", "CI, releases and docs. One-click menu bar download."],
    ],
  },
  margin: {
    tagline: "Screenshots that wait.",
    accent: "#f43f5e",
    stack: ["Swift 6", "ScreenCaptureKit", "Hardware encoder"],
    chapters: [
      ["The tax", "Every screenshot demanded a decision."],
      ["One motion", "Clipboard, disk and a shelf at the screen's edge — at once."],
      ["Native recording", "Retina resolution straight from the hardware encoder."],
      ["The detail", "The app learned to never photograph itself."],
    ],
  },
  "incident-response-agent": {
    tagline: "Agents propose. Humans approve.",
    accent: "#a3e635",
    stack: ["Python", "LangGraph", "FastAPI", "Claude", "AWS"],
    chapters: [
      ["Guard first", "Injected instructions quarantined before any model reads them."],
      ["Parallel minds", "Investigators run side by side."],
      ["Evidence or nothing", "Every claim in the brief cites its evidence."],
      ["The gate", "A human approves before anything is final. Live on CloudFront."],
    ],
  },
  codemap: {
    tagline: "See where the change lives.",
    accent: "#fbbf24",
    stack: ["Rust", "ratatui", "tree-sitter", "herdr"],
    chapters: [
      ["The gap", "A diff never shows where the change sits."],
      ["The popup", "Map, flowchart, turn-aware review and history over the agent's pane."],
      ["Five parsers", "tree-sitter for five languages. Read-only by design."],
      ["Sub-millisecond", "Paints a frame in under a millisecond."],
    ],
  },
  "visual-dsa": {
    tagline: "Algorithms you can poke.",
    accent: "#38bdf8",
    stack: ["JavaScript", "No build step", "GitHub Pages"],
    chapters: [
      ["The problem", "Static diagrams teach memorizing, not predicting."],
      ["The scope", "38 lessons, 7 units — first algorithm to NP-completeness."],
      ["Three tongues", "Pseudocode, JavaScript and Python, synced. Runs backwards."],
      ["The pause", "Every lab stops and asks you to predict the next step."],
    ],
  },
  learntube: {
    tagline: "YouTube, minus the noise.",
    accent: "#f43f5e",
    stack: ["Manifest V3", "Zero dependencies", "No tracking"],
    chapters: [
      ["The paradox", "Biggest classroom. Biggest distraction."],
      ["Nine switches", "Shorts and the noise, off by choice."],
      ["Quiet inbox", "Subscriptions as an inbox. A Library that tracks playlists. Up to 4×."],
      ["Shipped", "On the Chrome Web Store. The source files are the extension."],
    ],
  },
  panemorph: {
    tagline: "Move panes. Keep processes.",
    accent: "#a3e635",
    stack: ["Rust", "ratatui", "herdr socket API"],
    chapters: [
      ["Work moves", "Panes rarely stay where they started."],
      ["Two keys", "Send and Fetch over herdr's socket API."],
      ["Undo", "Rebuilds closed tabs and spaces."],
      ["Nothing restarts", "Processes, scrollback and working directories survive."],
    ],
  },
  "pyspark-three-ways": {
    tagline: "One question. Three answers.",
    accent: "#fbbf24",
    stack: ["PySpark", "Spark SQL", "PDF worksheets"],
    chapters: [
      ["The split", "RDD, DataFrame and SQL never lined up side by side."],
      ["Three ways", "Every question solved in all three."],
      ["Five levels", "From your first RDD to window functions."],
      ["Paper or screen", "Interactive notes, printable worksheets, runnable answers."],
    ],
  },
};

export const STATS = [
  [8, "tools shipped"],
  [5, "languages in production"],
  [38, "interactive lessons"],
  [2, "companies"],
];

export const STACK = ["Swift", "AppKit", "Rust", "ratatui", "tree-sitter", "Python", "LangGraph", "FastAPI", "Claude", "AWS", "JavaScript", "Java", "Spring Boot", "PySpark"];

export const PRINCIPLES = [
  "Own the problem, not the ticket.",
  "Ship first. Talk about it after.",
  "No dependency I can't explain.",
  "Fast is a feature.",
  "Agents propose. Humans approve.",
];


export const YOUTUBE = {
  channel: "https://www.youtube.com/@jenishshobhit",
  videos: [
    { id: "X-izPrjNuKo", title: "Meet LearnTube" },
    { id: "WVjgvg_NZW4", title: "My Time. Why I built LearnTube." },
  ],
};

export const BUILD_STEPS = [
  {
    title: "The brief",
    said: "“Make a portfolio for me. Clean, minimal, developer-intense.”",
    points: ["Spoken into Wispr Flow", "Eight real projects from GitHub", "Show, don't tell"],
  },
  {
    title: "The agent builds",
    said: "“Make this a masterclass in JavaScript.”",
    points: ["Emergent writes the code", "React, three.js, custom shaders", "Every change from a spoken prompt"],
  },
  {
    title: "Critique, out loud",
    said: "“My name has shifted to the left. The typography is not correct.”",
    points: ["I review like a lead", "Name centered, type rebuilt", "Background calmed below the fold"],
  },
  {
    title: "Verify everything",
    said: "“Test the mobile, the cursor, the typography. Test even the congruency.”",
    points: ["A test agent checks every change", "Phones, tablets, desktop", "An automated test pass every iteration"],
  },
  {
    title: "Ship",
    said: "“This will be our final. Then we'll republish it.”",
    points: ["Published from the same conversation", "Iterate by voice, any time", "Nothing ships without my yes"],
  },
];
