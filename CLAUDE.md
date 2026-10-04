# CLAUDE.md — tanmay-portfolio

Personal portfolio for **Tanmay Desai** at `tanmaydesai.xyz` (Vercel, auto-deploys `main`). Static HTML/CSS/JS, no build step, no frameworks.

Owner talks casual and direct. Show code first, keep commentary minimal.

## Structure

```
/            index.html + choice/ + assets/   Matrix "choice" page (ported from my_portfolio/matrix_page). Red pill → /red, blue pill → /blue
/red         red/index.html                   Matrix-style portfolio: code-rain hero, name decode, project list, experience, skills, contact
/blue        blue/index.html                  Placeholder. Tanmay builds this side himself
/gods-eye    gods-eye/index.html              Placeholders (one shared template: shared/placeholder.css + .js).
/trinity     trinity/index.html               Tanmay replaces each folder with the project's real site later
/rag         rag/index.html                   (ComicOracle)
/resume.pdf  resume.pdf (repo root)           Until it exists, vercel.json rewrites it to the /resume placeholder
shared/cv.md                                  Site-safe CV facts: the only source of facts on the site
```

`vercel.json` uses `cleanUrls`, so `red/index.html` serves at `/red`. `tanmaydesai.site` 301s to `.xyz`.

## Rules

- **Never edit the project repos** (Gods_Eye, ALGOLEND_AI, TRINITY, ComicOracle, Sweet-Bite). Project buttons go to the live site: AlgoLend → algolend-ai-frontend-v2.vercel.app, Sweet-Bite → sweetbite.tanmaydesai.xyz, the other three → their placeholder route. Each also links its GitHub source.
- **Facts only from `shared/cv.md`** (plus numbers Tanmay gives directly). Never invent metrics.
  - God's Eye: never "sub-second".
  - AlgoLend: no accuracy or utilization numbers.
- **Never on the site:** age, phone number, home address.
- **No 404s:** every link must resolve.
- Works at 375px, respects `prefers-reduced-motion`, visible keyboard focus.
- Check locally with `python3 -m http.server` before opening a PR. Tanmay merges; never merge yourself.
