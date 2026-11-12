# Jenish Shobhit — portfolio

An independently maintained version of [Jenish's portfolio](https://my-wispr-hire.emergent.host/), recovered from its publicly served source maps with the owner's authorization. The original design, particle typography, scroll-driven galaxy, eight case studies, AI workflow, voice walkthrough, and video easter egg are preserved.

Requires Node.js 22.12 or later and npm.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. To build and check both distributions:

```sh
npm run build
npm run build:portable
npm test
```

`dist/` is the production website. `npm run preview` serves it locally. `portable/index.html` opens directly in Chrome without a server; keep it beside its `assets/` directory. The portable preview uses hash routes. Production uses normal `/work/project-name` routes.

## Editing

- `src/data/portfolio.js`: profile, project descriptions, links, credentials, and walkthrough.
- `src/components/`: page sections and interactions.
- `src/pages/ProjectPage.jsx`: the shared case-study layout.
- `src/three/`: particle sampling, galaxy rendering, shaders, and scroll states.
- `src/index.css` and `tailwind.config.js`: design and responsive styling.
- `public/assets/previews/`: all sixteen dark/light screenshots, served locally.

The site needs no backend or API keys. Google Fonts supplies typography; YouTube loads only when a visitor opens a video (thumbnails load when visible). Video embeds use YouTube's privacy-enhanced domain. No Emergent runtime or analytics scripts are included.

## Deployment

The production output is static. When setting up AWS hosting, serve `dist/` over HTTPS and configure unknown application paths such as `/work/paneflo` to return `/index.html`. Keep missing asset responses separate from that SPA fallback. Domain selection and AWS provisioning are a subsequent step; this repository does not create billable resources.

See [recovery notes](docs/recovery.md) for source provenance and [verification notes](docs/verification.md) for what was checked.
