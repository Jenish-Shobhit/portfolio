import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { PROJECTS, DETAILS } from '../src/data/portfolio.js';

test('every case study has complete content and two real, local screenshots', async () => {
  assert.equal(PROJECTS.length, 8);
  assert.equal(new Set(PROJECTS.map(project => project.id)).size, 8);
  for (const project of PROJECTS) {
    assert.ok(DETAILS[project.id]?.chapters.length >= 3, project.id);
    assert.ok(project.problem && project.owned && project.outcome, project.id);
    assert.equal(new URL(project.source).hostname, 'github.com');
    for (const src of [project.img, project.img.replace('-dark.png', '-light.png')]) {
      const data = await readFile(`public${src}`);
      assert.deepEqual([...data.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
      assert.ok(data.length > 1000, src);
    }
  }
});

test('production assets are complete and independent of the original host', async () => {
  const html = await readFile('dist/index.html', 'utf8');
  for (const [, asset] of html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)) {
    assert.ok((await stat(`dist${asset}`)).size > 0, asset);
  }
  const files = await readdir('dist/assets');
  assert.ok(files.some(file => file.startsWith('universe-') && file.endsWith('.js')));
  assert.ok(!files.some(file => file.endsWith('.map')));
  const scripts = await Promise.all(files.filter(file => file.endsWith('.js')).map(file => readFile(`dist/assets/${file}`, 'utf8')));
  const output = html + scripts.join('');
  assert.doesNotMatch(output, /my-wispr-hire\.emergent\.host|assets\.emergent\.sh|ap\.emergent\.sh|__VITE_PRELOAD__/);
});

test('portable preview contains executable inline code and local project media', async () => {
  const html = await readFile('portable/index.html', 'utf8');
  assert.match(html, /<script type="module">/);
  assert.match(html, /<style>/);
  assert.doesNotMatch(html, /<script[^>]+src=|__VITE_PRELOAD__/);
  for (const project of PROJECTS) assert.ok((await stat(`portable${project.img}`)).size > 1000);
});
