# Creator Tools — Free Tools for Indian Creators

Free, no sign-up, no login, no data collected. Built by **True Turns** for Hindi creators.

Live site: https://pranav-69-69.github.io/creator-tools/

## Tool 1 — Hindi Shorts Hook & Title Generator
Type a topic, pick a category (Biography / Motivation / Facts / Story / Money & Business),
choose Hindi or Hinglish, and get **10 viral hooks + 10 titles + hashtags** in seconds.

Hook patterns come from 2025–26 Shorts research (first 2.5 seconds decide; payoff must
match the promise): Number Contrast, Question, Secret/Reveal, "Aaj" Urgency, Mistake Audit,
Result First, Paradox, "Kaise" Curiosity, Twist, Before/After, Lessons, Loop, POV, Challenge.
Optional starting/ending numbers power the Number Contrast hooks — always use real numbers.

## Tool 2 — Viral Thumbnail Maker
Upload your own photo, pick one of 5 templates, type your text, download a **1280×720 PNG**.

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

## How it works
- Static site: `index.html` + `app.js`. No server, no build step, no paid APIs.
- Hosted free on GitHub Pages.

## Test
```bash
node -e "const CT=require('./app.js'); console.log(CT.generateHooks('Ratan Tata','biography','hi','₹15,000','₹75,000 crore'))"
```
Open `index.html?selftest=1` in a browser — the page runs its own checks and sets the
title to SELFTEST PASS / FAIL.
