# Viral Thumbnail Maker — Free Tool for Indian Creators

Upload your own photo, pick one of 5 templates, type your text, download a **1280×720 PNG**.

Live site: https://pranav-69-69.github.io/creator-tools/

Templates come from 2025–26 thumbnail research (10,000+ thumbnails analysed):
1. **Big Face + Bold Text** — face + text split; faces with strong emotion lift CTR 25–40%.
2. **Before / After** — split-screen transformation.
3. **Number Blast** — giant number + photo (data/number reveal).
4. **Shock + Red Circle** — red circle + bold top text.
5. **Dark Cinematic** — gold text, film look.

Rules baked in: max 2–3 words of text (0–2 words averaged 6.8% CTR vs 4.3% for 6+ words),
bold sans-serif with black stroke, high contrast, max 2–3 elements, never cover the face,
keep the bottom-right corner clear (duration badge). Fully client-side — your photo never
leaves your browser.

Also try our other free tool: **Train Berth Finder** — https://pranav-69-69.github.io/train-berth-finder/

## How it works
- Static site: `index.html` + `app.js`. No server, no build step, no paid APIs.
- Hosted free on GitHub Pages.

## Test
Open `index.html?selftest=1` in a browser — the page runs its own checks and sets the
title to SELFTEST PASS / FAIL.
