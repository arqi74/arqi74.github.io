# ARWI.DEV — portfolio

Nowoczesne, mocno interaktywne portfolio web developera. Czysty **HTML + CSS + JS**
(zero frameworków, zero build-stepu) — gotowe pod **GitHub Pages**. Just publish.

> `< too clean for default UI />`

## ✨ Co jest w środku
- **Boot sequence** — terminalowy ekran ładowania, który „kompiluje” stronę (pomijalny: `ESC`/`skip`).
- **Paleta komend** — `Ctrl/Cmd + K`, nawigacja klawiaturą, fuzzy-search (jak w VS Code).
- **Interaktywny terminal** w hero — wpisz `help`, `whoami`, `stack`, `pipeline`, `neofetch`, `matrix`, `wolf`…
- **Sekcja technologie** — 10 kafelków z efektem 3D-tilt i **popupami** (poziom biegłości, narzędzia):
  Node.js, React, Vue, Angular, HTML, CSS, JavaScript, TypeScript, MongoDB, MySQL.
- **Pipeline produkcyjny** — animowany **schemat blokowy** (SVG): linie rysują się na scroll,
  „pakiety danych” płyną między 8 etapami, każdy blok klikalny → popup.
- **Social** — YouTube, X/Twitter, GitHub, Discord (karty z hover-glow).
- **Kontakt** — CTA do Discorda + kopiowanie nicku.
- **Efekty**: konstelacja w tle (canvas reagujący na mysz), **burst znaków kodu po kliknięciu**,
  własny kursor, magnetyczne przyciski, scroll-progress, reveal-on-scroll.
- **Easter eggi**: tryb Matrix oraz **Wolf mode** (kod Konami `↑↑↓↓←→←→ B A`).
- W pełni **responsywne** i respektuje `prefers-reduced-motion`.

## 📁 Struktura
```
.
├── index.html              # markup + sprite ikon SVG (monochrome)
├── css/style.css           # motyw, animacje, layout, pipeline, responsywność
├── js/main.js              # boot, terminal, paleta komend, pipeline, popupy, fx
├── arwi-dev-white-text.png # logo
└── .nojekyll               # wyłącza Jekyll na GitHub Pages
```

## ⚙️ Personalizacja
Edytuj w `js/main.js`:
- `const TECH = [...]` — technologie, opisy, poziomy, tagi.
- `const PIPE = [...]` — etapy pipeline'u (nazwa, opis, narzędzia, komenda).
- `const DISCORD_URL` i `const DISCORD_NICK` — **wstaw tu swój prawdziwy link/nick Discord**.

Linki do socjali (YouTube / X) podmień w `index.html` w sekcji `#social`
(atrybut `href` — obecnie `#` jako placeholder). GitHub wskazuje na `github.com/arqi74`.

## 🚀 Publikacja na GitHub Pages
1. **Settings → Pages**.
2. *Build and deployment* → **Deploy from a branch**.
3. Wybierz branch + folder `/ (root)` → **Save**.
4. Strona pojawi się pod adresem Pages w ~1–2 min.

## 🧪 Podgląd lokalny
```bash
python3 -m http.server 8000
# otwórz http://localhost:8000
```
