# Verification

Checked on 2026-11-13.

## Automated

- `npm run build`: production build passes; animation is a separate lazy-loaded chunk.
- `npm run build:portable`: direct-file preview builds successfully with inline JavaScript and CSS.
- `npm test`: all three checks pass, covering all eight case-study records, sixteen valid PNGs, production asset references, absence of the former hosting runtime, and portable preview packaging.
- `npm ci --dry-run --offline --ignore-scripts`: dependency lock validation passes. Registry URLs and SHA-512 integrity are recorded for all installed packages. Platform-specific optional build packages are included for other operating systems.

## Google Chrome / DevTools

- Inspected the original deployment's DOM and Sources panel and recovered its published source maps.
- Opened the rebuilt portable preview directly from disk.
- Visually checked the desktop particle hero, galaxy background, project presentation, and Paneflo case study.
- Checked the 390 × 844 responsive viewport, two-line particle name, navigation menu opening/closing, and restoration of focus to its opener.
- Confirmed that Chrome exposes the case-study comparison as a labelled slider with its current value.
- Caught and corrected an invalid-particle-coordinate error during viewport resizing. A fresh mobile reload reports zero console messages.

## Improvements over the recovered baseline

- Standalone Vite build, pinned dependencies, lockfile, documentation, and CI checks.
- All project screenshots are local, including dark/light comparisons.
- Keyboard controls and pointer cancellation for comparison sliders.
- Labelled modal dialogs, keyboard focus containment, and focus restoration.
- Graceful animation import failure with a readable fallback.
- Guards for empty particle sampling and zero-sized canvas resizes.
- Direct-file preview for environments where opening a server port is restricted.
- Privacy-enhanced YouTube embeds, loaded when opened.

## Limits

The execution sandbox blocks binding a localhost port, so HTTP serving and the Vite development server could not be verified in this session. Chrome QA used the separately built portable preview. The production build uses normal URL routes and must be served with an SPA fallback. External project links, Google Fonts availability, and YouTube playback depend on their respective services. Not every case study was manually exercised; automated checks cover every case-study record and screenshot.

Domain purchase and AWS provisioning have not been performed.
