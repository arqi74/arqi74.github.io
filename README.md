# arwidev — Frontend Web Developer

A one-page portfolio built as **plain static HTML + CSS + JS**, ready to host on
**GitHub Pages**. No frameworks, no build step — just publish the files.

## ✨ Highlights
- **Modern, squared, refined dark theme** with blue accents (toned-down, no heavy neon)
- **Hero** with a subtle animated "blueprint" field (canvas) and **parallax** floating squares
- **About** with animated counters
- **My creative process** — interactive timeline: Planning → Design → Development → Testing → Deployment
- **Skill tree** — interactive tech tree with SVG connectors drawn on scroll
  (HTML, CSS, JavaScript, React, Vue, Angular, Bootstrap, Node.js, MongoDB, MySQL)
- **Custom monochrome SVG icons** (hand-built sprite — no icon-font/CDN dependency)
- **Contact** via Discord
- Squared custom cursor, magnetic buttons, scroll progress, reveal-on-scroll
- Fully responsive, honours `prefers-reduced-motion`

## 📁 Structure
```
.
├── index.html      # markup + inline monochrome SVG icon sprite
├── css/style.css   # theme, motion, parallax, skill tree
├── js/main.js      # cursor, canvas, parallax, counters, tree
├── .nojekyll       # disables Jekyll processing on GitHub Pages
└── README.md
```

## 🚀 Publishing on GitHub Pages
1. Open **Settings → Pages**.
2. Under *Build and deployment* choose **Deploy from a branch**.
3. Pick the branch (`main`) and the `/ (root)` folder → **Save**.
4. The site goes live at your Pages URL within a minute or two.

## ⚙️ Customising
- **Copy** — edit the sections in `index.html`.
- **Stats** — `data-count` attributes in the About section.
- **Skill levels** — `data-level` and `--lvl` on each `.node--leaf`.
- **Icons** — edit the `<symbol>` definitions in the SVG sprite at the top of `index.html`.
- **Contact** — Discord link in the `#contact` section.
- **Colours** — CSS variables in `:root` (`--accent`, `--blue`, `--blue-soft`, lines).

## 🧪 Local preview
```bash
python3 -m http.server 8000
# open http://localhost:8000
```
