# arwidev — Frontend Web Developer

Jednostronicowe (one-page) portfolio zbudowane jako **czysty statyczny HTML + CSS + JS**,
gotowe do hostowania na **GitHub Pages** (`arwidev.github.io`). Bez frameworków, bez build-stepa —
wystarczy, że pliki trafią na branch publikacji.

## ✨ Co jest na stronie
- **Hero** z animowaną siecią cząsteczek (canvas), aurorą i efektem parallax
- **O mnie** z animowanymi licznikami
- **Mój proces tworzenia** — interaktywna oś czasu: Planowanie → Projektowanie → Development → Testowanie → Wdrożenie
- **Drzewko umiejętności** — interaktywne drzewo technologii z liniami rysowanymi przy scrollu
  (HTML, CSS, JS, React, Vue, Angular, Bootstrap, Node.js, MongoDB, MySQL)
- **Kontakt** + stopka
- Custom cursor, magnetyczne przyciski, scroll progress, reveal przy scrollu
- Ciemny motyw z niebieskimi odcieniami
- W pełni responsywne, wspiera `prefers-reduced-motion`

## 📁 Struktura
```
.
├── index.html      # struktura strony
├── css/style.css   # motyw, animacje, parallax, drzewko
├── js/main.js      # cursor, canvas, parallax, liczniki, drzewko
├── .nojekyll       # wyłącza przetwarzanie Jekyll na GitHub Pages
└── README.md
```

## 🚀 Publikacja na GitHub Pages
1. Wejdź w **Settings → Pages** w repozytorium.
2. W sekcji *Build and deployment* wybierz źródło **Deploy from a branch**.
3. Wybierz branch (po zmergowaniu np. `main`) i katalog `/ (root)`.
4. Strona pojawi się pod adresem `https://arwidev.github.io`.

## ⚙️ Personalizacja
- **Treści** — edytuj sekcje w `index.html`.
- **Statystyki** — atrybuty `data-count` w sekcji „O mnie".
- **Poziomy umiejętności** — atrybuty `data-level` oraz `--lvl` przy każdym `node--leaf`.
- **Linki/Kontakt** — sekcja `#contact` oraz stopka (e-mail, GitHub, LinkedIn).
- **Kolory** — zmienne CSS w `:root` (`--blue`, `--cyan`, `--indigo`, gradienty).

## 🧪 Podgląd lokalny
Dowolny statyczny serwer, np.:
```bash
python3 -m http.server 8000
# następnie otwórz http://localhost:8000
```
