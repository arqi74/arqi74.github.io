/* =============================================================
   arwidev — interakcje, animacje, parallax
   Vanilla JS, bez zależności.
   ============================================================= */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(max-width: 900px)").matches || "ontouchstart" in window;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------- Rok w stopce ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Preloader ---------- */
  window.addEventListener("load", () => {
    const pre = $("#preloader");
    if (pre) setTimeout(() => pre.classList.add("is-done"), 600);
  });

  /* ---------- Pasek postępu scrolla ---------- */
  const progress = $("#scrollProgress");
  const onScrollProgress = () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
    if (progress) progress.style.width = (scrolled * 100) + "%";
  };

  /* ---------- Nawigacja ---------- */
  const nav = $("#nav");
  const navToggle = $("#navToggle");
  const navLinks = $("#navLinks");

  const onNavScroll = () => {
    if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 40);
  };

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("is-open");
      navToggle.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", String(open));
    });
    $$(".nav__link", navLinks).forEach((l) =>
      l.addEventListener("click", () => {
        navLinks.classList.remove("is-open");
        navToggle.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  /* ---------- Aktywny link wg sekcji ---------- */
  const sections = $$("section[id]");
  const linkFor = {};
  $$(".nav__link").forEach((l) => {
    const id = l.getAttribute("href").slice(1);
    if (id) linkFor[id] = l;
  });
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          Object.values(linkFor).forEach((l) => l.classList.remove("is-active"));
          const active = linkFor[e.target.id];
          if (active) active.classList.add("is-active");
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => sectionObserver.observe(s));

  /* ---------- Reveal przy scrollu ---------- */
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          // stagger dla rodzeństwa
          const siblings = $$(".reveal", e.target.parentElement);
          const idx = siblings.indexOf(e.target);
          e.target.style.transitionDelay = Math.min(idx, 6) * 0.07 + "s";
          e.target.classList.add("is-visible");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  $$(".reveal").forEach((el) => revealObserver.observe(el));

  /* ---------- Liczniki ---------- */
  const animateCount = (el) => {
    const raw = el.dataset.count;
    const suffix = el.dataset.suffix || "";
    const target = parseInt(raw, 10);
    if (isNaN(target)) { el.textContent = raw; return; } // np. ∞
    if (prefersReduced) { el.textContent = target + suffix; return; }
    const dur = 1600;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const countObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { animateCount(e.target); obs.unobserve(e.target); }
      });
    },
    { threshold: 0.6 }
  );
  $$(".stat__num").forEach((el) => countObserver.observe(el));

  /* ---------- Timeline draw ---------- */
  const timeline = $("#timeline");
  if (timeline) {
    const tlObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { timeline.classList.add("is-drawn"); obs.unobserve(e.target); }
        });
      },
      { threshold: 0.15 }
    );
    tlObserver.observe(timeline);
  }

  /* ---------- Rotator tekstu w hero ---------- */
  const rotator = $("#rotator");
  if (rotator && !prefersReduced) {
    const words = ["React", "Vue", "Angular", "Node.js", "animacji", "UI/UX", "wydajności"];
    let wi = 0, ci = 0, deleting = false;
    const type = () => {
      const word = words[wi];
      rotator.textContent = word.slice(0, ci);
      if (!deleting && ci < word.length) { ci++; setTimeout(type, 90); }
      else if (!deleting && ci === word.length) { deleting = true; setTimeout(type, 1400); }
      else if (deleting && ci > 0) { ci--; setTimeout(type, 45); }
      else { deleting = false; wi = (wi + 1) % words.length; setTimeout(type, 250); }
    };
    setTimeout(type, 1200);
  }

  /* ---------- Custom cursor + magnetic + hover ---------- */
  const dot = $("#cursorDot");
  const ring = $("#cursorRing");
  if (!isTouch && dot && ring) {
    let mx = innerWidth / 2, my = innerHeight / 2;
    let rx = mx, ry = my;
    addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    });
    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    };
    loop();

    $$("a, button, [data-magnetic], .node--leaf").forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("is-hover"));
      el.addEventListener("mouseleave", () => ring.classList.remove("is-hover"));
    });

    // Magnetic
    $$("[data-magnetic]").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });
  }

  /* ---------- Tilt + glow na kartach procesu ---------- */
  if (!isTouch) {
    $$("[data-tilt]").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.setProperty("--mx", px * 100 + "%");
        card.style.setProperty("--my", py * 100 + "%");
        const rotX = (py - 0.5) * -6;
        const rotY = (px - 0.5) * 6;
        card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
      });
      card.addEventListener("mouseleave", () => { card.style.transform = ""; });
    });
  }

  /* ---------- Parallax (scroll + mysz) ---------- */
  const parallaxEls = $$("[data-parallax]");
  let mouseX = 0, mouseY = 0;
  if (!prefersReduced) {
    addEventListener("mousemove", (e) => {
      mouseX = (e.clientX / innerWidth - 0.5) * 2;
      mouseY = (e.clientY / innerHeight - 0.5) * 2;
    });
  }
  const applyParallax = () => {
    const sc = window.scrollY;
    parallaxEls.forEach((el) => {
      const speed = parseFloat(el.dataset.parallax) || 0;
      const my2 = sc * speed;
      const mxp = mouseX * speed * 60;
      const myp = mouseY * speed * 60;
      el.style.transform = `translate3d(${mxp}px, ${my2 + myp}px, 0)`;
    });
  };

  /* ---------- Rdzeń pętli scroll (rAF) ---------- */
  let ticking = false;
  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        onScrollProgress();
        onNavScroll();
        if (!prefersReduced) applyParallax();
        ticking = false;
      });
      ticking = true;
    }
  };
  addEventListener("scroll", onScroll, { passive: true });
  if (!prefersReduced) addEventListener("mousemove", () => requestAnimationFrame(applyParallax));
  onScroll();

  /* =============================================================
     DRZEWKO — rysowanie linii SVG + wzrost
     ============================================================= */
  const tree = $("#tree");
  const svg = $("#treeLines");

  const buildTreeLines = () => {
    if (!tree || !svg) return;
    const box = tree.getBoundingClientRect();
    svg.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);
    svg.innerHTML = `
      <defs>
        <linearGradient id="treeGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#22d3ee"/>
          <stop offset="50%" stop-color="#3b82f6"/>
          <stop offset="100%" stop-color="#6366f1"/>
        </linearGradient>
      </defs>`;

    const center = (el) => {
      const r = el.getBoundingClientRect();
      return { x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2 };
    };

    const root = $('[data-node="root"]', tree);
    const branches = $$(".node--branch", tree);
    const leaves = $$(".node--leaf", tree);
    if (!root) return;

    const rootC = center(root);
    const paths = [];

    // root -> gałęzie
    branches.forEach((b) => {
      const c = center(b);
      const midY = (rootC.y + c.y) / 2;
      paths.push(`M ${rootC.x} ${rootC.y + 70} C ${rootC.x} ${midY}, ${c.x} ${midY}, ${c.x} ${c.y}`);
    });

    // gałąź -> liście
    leaves.forEach((leaf) => {
      const parent = leaf.dataset.parent;
      const b = branches.find((x) => x.dataset.node === parent);
      if (!b) return;
      const bc = center(b);
      const lc = center(leaf);
      const midY = (bc.y + lc.y) / 2;
      paths.push(`M ${bc.x} ${bc.y} C ${bc.x} ${midY}, ${lc.x} ${midY}, ${lc.x} ${lc.y - 18}`);
    });

    const NS = "http://www.w3.org/2000/svg";
    paths.forEach((d) => {
      const p = document.createElementNS(NS, "path");
      p.setAttribute("d", d);
      svg.appendChild(p);
      const len = p.getTotalLength();
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = tree.classList.contains("is-grown") ? 0 : len;
      p.style.transition = "stroke-dashoffset 1.4s var(--ease)";
    });
  };

  const growTree = () => {
    if (!tree) return;
    tree.classList.add("is-grown");
    $$("#treeLines path").forEach((p, i) => {
      setTimeout(() => { p.style.strokeDashoffset = 0; }, i * 60);
    });
  };

  if (tree) {
    buildTreeLines();
    const treeObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { growTree(); obs.unobserve(e.target); }
        });
      },
      { threshold: 0.25 }
    );
    treeObserver.observe(tree);

    // Podświetlenie gałęzi po najechaniu liścia/gałęzi
    const branches = $$(".node--branch", tree);
    const leaves = $$(".node--leaf", tree);

    const highlight = (cat) => {
      tree.classList.add("is-dim");
      leaves.forEach((l) => l.classList.toggle("is-hl", l.dataset.parent === cat));
      branches.forEach((b) => b.classList.toggle("is-hl", b.dataset.node === cat));
    };
    const clear = () => {
      tree.classList.remove("is-dim");
      leaves.forEach((l) => l.classList.remove("is-hl"));
      branches.forEach((b) => b.classList.remove("is-hl"));
    };

    leaves.forEach((l) => {
      l.addEventListener("mouseenter", () => highlight(l.dataset.parent));
      l.addEventListener("mouseleave", clear);
      l.addEventListener("focus", () => highlight(l.dataset.parent));
      l.addEventListener("blur", clear);
    });
    branches.forEach((b) => {
      b.addEventListener("mouseenter", () => highlight(b.dataset.node));
      b.addEventListener("mouseleave", clear);
    });

    // Przebudowa linii przy zmianie rozmiaru
    let rt;
    addEventListener("resize", () => {
      clearTimeout(rt);
      rt = setTimeout(buildTreeLines, 150);
    });
  }

  /* =============================================================
     HERO — sieć cząsteczek (canvas)
     ============================================================= */
  const canvas = $("#heroCanvas");
  if (canvas && !prefersReduced) {
    const ctx = canvas.getContext("2d");
    let w, h, dpr, particles = [], raf;
    const hero = $("#hero");

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = hero.offsetWidth; h = hero.offsetHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + "px"; canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(Math.floor((w * h) / 14000), 110);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.8 + 0.6,
      }));
    };

    let pointer = { x: -999, y: -999 };
    hero.addEventListener("mousemove", (e) => {
      const r = hero.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
    });
    hero.addEventListener("mouseleave", () => { pointer.x = -999; pointer.y = -999; });

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        // reakcja na kursor
        const dxp = p.x - pointer.x, dyp = p.y - pointer.y;
        const dp = Math.hypot(dxp, dyp);
        if (dp < 120) {
          p.x += (dxp / dp) * 0.8;
          p.y += (dyp / dp) * 0.8;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(125, 211, 252, 0.7)";
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(79, 155, 255, ${0.16 * (1 - dist / 130)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    let rzt;
    addEventListener("resize", () => { clearTimeout(rzt); rzt = setTimeout(resize, 200); });

    // Pauza, gdy hero poza ekranem (oszczędność baterii)
    const heroVisObserver = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { if (!raf) draw(); }
        else { cancelAnimationFrame(raf); raf = null; }
      });
    }, { threshold: 0 });
    heroVisObserver.observe(hero);
  }
})();
