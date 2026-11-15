import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { PROJECTS } from './src/data/portfolio.js';

function pagesEntries() {
  return {
    name: 'pages-entries',
    writeBundle(output) {
      const html = readFileSync(resolve(output.dir, 'index.html'), 'utf8');
      for (const { id } of PROJECTS) {
        const dir = resolve(output.dir, 'work', id);
        mkdirSync(dir, { recursive: true });
        writeFileSync(resolve(dir, 'index.html'), html);
      }
    },
  };
}

function portablePreview() {
  return {
    name: 'portable-preview',
    enforce: 'post',
    writeBundle(output, bundle) {
      const htmlPath = resolve(output.dir, 'index.html');
      let html = readFileSync(htmlPath, 'utf8');
      for (const [file, asset] of Object.entries(bundle)) {
        if (asset.type === 'chunk') {
          const code = readFileSync(resolve(output.dir, file), 'utf8');
          html = html.replace(/<script type="module"[^>]*src="[^"]+"[^>]*><\/script>/,
            () => `<script type="module">${code.replace(/<\/script/gi, '<\\/script')}</script>`);
        } else if (file.endsWith('.css')) {
          html = html.replace(/<link rel="stylesheet"[^>]*>/,
            () => `<style>${asset.source}</style>`);
        }
      }
      html = html.replace('href="/favicon.svg"', 'href="./favicon.svg"');
      writeFileSync(htmlPath, html);
    },
  };
}

export default defineConfig(({ mode }) => {
  const portable = mode === 'portable';
  const pages = mode === 'pages';
  return {
    base: portable ? './' : pages ? '/portfolio/' : '/',
    plugins: [react(), ...(portable ? [portablePreview()] : []), ...(pages ? [pagesEntries()] : [])],
    build: {
      sourcemap: false,
      outDir: portable ? 'portable' : 'dist',
      ...(portable ? { rollupOptions: { output: { inlineDynamicImports: true } } } : {}),
    },
  };
});
