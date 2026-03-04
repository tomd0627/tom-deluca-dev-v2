/**
 * OG Image Generator — 1200×630
 * Matches the portfolio design system (navy/teal palette, Inter/Plus Jakarta Sans).
 * Run once: node scripts/generate-og.mjs
 */

import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import pkg from '@napi-rs/canvas';

const { createCanvas } = pkg;

const __dirname = dirname(fileURLToPath(import.meta.url));

const W = 1200;
const H = 630;

// ── Palette ────────────────────────────────────────────────────────────────
const NAVY_900 = '#0b1622';
const NAVY_800 = '#132035';
const TEAL     = '#5ef0c8';
const TEXT_BRIGHT = '#e8f1ff';
const TEXT_BASE   = '#c5d0e8';
const TEXT_MUTED  = '#7a8ba8';

// ── Canvas ─────────────────────────────────────────────────────────────────
const canvas = createCanvas(W, H);
const ctx    = canvas.getContext('2d');

// ── Background ─────────────────────────────────────────────────────────────
ctx.fillStyle = NAVY_900;
ctx.fillRect(0, 0, W, H);

// Navy-800 card panel (right 55%)
ctx.fillStyle = NAVY_800;
ctx.fillRect(W * 0.42, 0, W * 0.58, H);

// ── Left teal gradient glow ─────────────────────────────────────────────────
const glow = ctx.createLinearGradient(0, 0, W * 0.65, 0);
glow.addColorStop(0,   'rgba(94, 240, 200, 0.07)');
glow.addColorStop(0.5, 'rgba(94, 240, 200, 0.03)');
glow.addColorStop(1,   'rgba(94, 240, 200, 0)');
ctx.fillStyle = glow;
ctx.fillRect(0, 0, W, H);

// ── Left accent bar (4 px teal) ────────────────────────────────────────────
ctx.fillStyle = TEAL;
ctx.fillRect(64, 140, 4, 310);

// ── Eyebrow label ──────────────────────────────────────────────────────────
ctx.fillStyle = TEAL;
ctx.font      = '600 14px "Courier New", monospace';
ctx.letterSpacing = '0.15em';
ctx.fillText('AVAILABLE FOR HIRE', 88, 176);

// ── Name ───────────────────────────────────────────────────────────────────
ctx.fillStyle = TEXT_BRIGHT;
ctx.font      = '800 72px system-ui, sans-serif';
ctx.fillText('Tom DeLuca', 88, 268);

// ── Title ──────────────────────────────────────────────────────────────────
ctx.fillStyle = TEAL;
ctx.font      = '700 36px system-ui, sans-serif';
ctx.fillText('Senior Front-End Developer', 88, 328);

// ── Subtitle ───────────────────────────────────────────────────────────────
ctx.fillStyle = TEXT_BASE;
ctx.font      = '400 20px system-ui, sans-serif';

const subtitle = '15+ years building enterprise-grade web experiences';
const subtitle2 = 'for Fortune 500 companies.';

ctx.fillText(subtitle,  88, 386);
ctx.fillText(subtitle2, 88, 414);

// ── Tech tags ──────────────────────────────────────────────────────────────
const tags = ['HTML', 'CSS', 'JavaScript', 'React', 'Angular', 'Next.js'];
let tagX = 88;
const tagY = 470;

ctx.font = '500 13px "Courier New", monospace';

for (const tag of tags) {
  const tw = ctx.measureText(tag).width;
  const padX = 14;
  const padY = 8;
  const rw = tw + padX * 2;
  const rh = 32;

  // Border
  ctx.strokeStyle = 'rgba(94, 240, 200, 0.35)';
  ctx.lineWidth = 1;
  ctx.strokeRect(tagX, tagY, rw, rh);

  // Fill
  ctx.fillStyle = 'rgba(94, 240, 200, 0.06)';
  ctx.fillRect(tagX, tagY, rw, rh);

  // Text
  ctx.fillStyle = TEAL;
  ctx.fillText(tag, tagX + padX, tagY + padY + 10);

  tagX += rw + 10;
}

// ── Right panel: decorative code block ────────────────────────────────────
const px = W * 0.42 + 60;
const lineH = 30;
let py = 130;

ctx.font      = '400 15px "Courier New", monospace';
ctx.fillStyle = TEXT_MUTED;

const codeLines = [
  { text: 'const developer = {',    color: TEXT_BASE },
  { text: "  name: 'Tom DeLuca',",  color: TEXT_MUTED },
  { text: "  role: 'Senior FE Dev',", color: TEXT_MUTED },
  { text: "  years: 15,",           color: TEXT_MUTED },
  { text: "  stack: [",             color: TEXT_MUTED },
  { text: "    'React', 'Angular',", color: TEAL },
  { text: "    'Next.js', 'Tailwind',",  color: TEAL },
  { text: "    'Sitecore', 'CSS',",  color: TEAL },
  { text: "  ],",                   color: TEXT_MUTED },
  { text: "  available: true,",     color: TEXT_MUTED },
  { text: '};',                     color: TEXT_BASE },
];

for (const line of codeLines) {
  ctx.fillStyle = line.color;
  ctx.fillText(line.text, px, py);
  py += lineH;
}

// ── Bottom URL ─────────────────────────────────────────────────────────────
ctx.fillStyle = TEXT_MUTED;
ctx.font      = '400 16px system-ui, sans-serif';
ctx.fillText('tomdeluca.dev', 88, H - 52);

// ── Bottom teal line ───────────────────────────────────────────────────────
ctx.fillStyle = TEAL;
ctx.fillRect(0, H - 4, W, 4);

// ── Write PNG ──────────────────────────────────────────────────────────────
const outPath = join(__dirname, '../public/og-image.png');
writeFileSync(outPath, canvas.toBuffer('image/png'));
console.log(`✓ og-image.png written to ${outPath}`);
