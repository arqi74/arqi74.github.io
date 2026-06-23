# ARWI.DEV — portfolio

A modern, highly interactive web developer portfolio. Plain **HTML + CSS + JS**
(no frameworks, no build step) — ready for **GitHub Pages**. Just publish.

> `< too clean for default UI />`

## ✨ What's inside
- **Boot sequence** — a terminal-style loading screen that "compiles" the site (skippable: `ESC` / `skip`).
- **Command palette** — `Ctrl/Cmd + K`, keyboard navigation, fuzzy search (VS Code style).
- **Interactive terminal** in the hero — type `help`, `whoami`, `stack`, `pipeline`, `neofetch`, `matrix`, `wolf`…
- **Technologies section** — 10 tiles with a 3D-tilt effect and **detail popups** (proficiency, tools):
  Node.js, React, Vue, Angular, HTML, CSS, JavaScript, TypeScript, MongoDB, MySQL.
- **Production pipeline** — an animated **block diagram** (SVG): lines draw on scroll,
  "data packets" flow between 8 stages, every block is clickable → popup.
- **Social** — YouTube, X/Twitter, GitHub, Discord (cards with a brand accent bar).
- **Contact** — a Discord CTA + one-click username copy.
- **Effects**: background constellation (mouse-reactive canvas), **code-symbol click burst**,
  custom cursor, magnetic buttons, scroll progress, reveal-on-scroll.
- **Easter eggs**: Matrix mode and **Wolf mode** (Konami code `↑↑↓↓←→←→ B A`).
- Fully **responsive** and honours `prefers-reduced-motion`.

## 🎨 Design
Flat, modern, logo-driven palette: deep near-black background, electric blue,
cyan highlight (the wolf's eyes), crisp solid borders and minimal glow.

## 📁 Structure
```
.
├── index.html              # markup + SVG icon sprite (monochrome)
├── css/style.css           # theme, animations, layout, pipeline, responsiveness
├── js/main.js              # boot, terminal, command palette, pipeline, popups, fx
├── arwi-dev-white-text.png # logo
└── .nojekyll               # disables Jekyll on GitHub Pages
```

## ⚙️ Customising
Edit in `js/main.js`:
- `const TECH = [...]` — technologies, descriptions, levels, tags.
- `const PIPE = [...]` — pipeline stages (name, description, tools, command).
- `const DISCORD_URL` and `const DISCORD_NICK` — **put your real Discord link / username here**.

Replace the social links (YouTube / X) in `index.html` under the `#social` section
(`href` attribute — currently `#` placeholders). GitHub points to `github.com/arqi74`.

## 🚀 Publishing on GitHub Pages
1. **Settings → Pages**.
2. *Build and deployment* → **Deploy from a branch**.
3. Pick the branch + the `/ (root)` folder → **Save**.
4. The site goes live at your Pages URL in ~1–2 minutes.

## 🧪 Local preview
```bash
python3 -m http.server 8000
# open http://localhost:8000
```
