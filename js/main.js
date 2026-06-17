/* =============================================================
   arwidev — interactions, motion, parallax (vanilla JS)
   ============================================================= */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(max-width: 900px)").matches || "ontouchstart" in window;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------- Footer year ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Preloader ---------- */
  window.addEventListener("load", () => {
    const pre = $("#preloader");
    if (pre) setTimeout(() => pre.classList.add("is-done"), 550);
  });

  /* ---------- Scroll progress ---------- */
  const progress = $("#scrollProgress");
  const onScrollProgress = () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
    if (progress) progress.style.width = (scrolled * 100) + "%";
  };

  /* ---------- Nav ---------- */
  const nav = $("#nav");
  const navToggle = $("#navToggle");
  const navLinks = $("#navLinks");
  const onNavScroll = () => { if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 40); };

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

  /* ---------- Active link by section ---------- */
  const linkFor = {};
  $$(".nav__link").forEach((l) => {
    const id = l.getAttribute("href").slice(1);
    if (id) linkFor[id] = l;
  });
  const sectionObserver = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) {
        Object.values(linkFor).forEach((l) => l.classList.remove("is-active"));
        if (linkFor[e.target.id]) linkFor[e.target.id].classList.add("is-active");
      }
    }),
    { rootMargin: "-45% 0px -50% 0px" }
  );
  $$("section[id]").forEach((s) => sectionObserver.observe(s));

  /* ---------- Reveal on scroll (staggered) ---------- */
  const revealObserver = new IntersectionObserver(
    (entries, obs) => entries.forEach((e) => {
      if (e.isIntersecting) {
        const siblings = $$(".reveal", e.target.parentElement);
        const idx = siblings.indexOf(e.target);
        e.target.style.transitionDelay = Math.min(idx, 6) * 0.07 + "s";
        e.target.classList.add("is-visible");
        obs.unobserve(e.target);
      }
    }),
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  $$(".reveal").forEach((el) => revealObserver.observe(el));

  /* ---------- Counters ---------- */
  const animateCount = (el) => {
    const raw = el.dataset.count;
    const suffix = el.dataset.suffix || "";
    const target = parseInt(raw, 10);
    if (isNaN(target)) { el.textContent = raw; return; }
    if (prefersReduced) { el.textContent = target + suffix; return; }
    const dur = 1600, start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const countObserver = new IntersectionObserver(
    (entries, obs) => entries.forEach((e) => {
      if (e.isIntersecting) { animateCount(e.target); obs.unobserve(e.target); }
    }),
    { threshold: 0.6 }
  );
  $$(".stat__num").forEach((el) => countObserver.observe(el));

  /* ---------- Timeline draw ---------- */
  const timeline = $("#timeline");
  if (timeline) {
    new IntersectionObserver(
      (entries, obs) => entries.forEach((e) => {
        if (e.isIntersecting) { timeline.classList.add("is-drawn"); obs.unobserve(e.target); }
      }),
      { threshold: 0.15 }
    ).observe(timeline);
  }

  /* ---------- Hero text rotator ---------- */
  const rotator = $("#rotator");
  if (rotator && !prefersReduced) {
    const words = ["React", "Vue", "Angular", "Node.js", "interfaces", "performance", "clean code"];
    let wi = 0, ci = 0, deleting = false;
    const type = () => {
      const word = words[wi];
      rotator.textContent = word.slice(0, ci);
      if (!deleting && ci < word.length) { ci++; setTimeout(type, 85); }
      else if (!deleting && ci === word.length) { deleting = true; setTimeout(type, 1500); }
      else if (deleting && ci > 0) { ci--; setTimeout(type, 40); }
      else { deleting = false; wi = (wi + 1) % words.length; setTimeout(type, 220); }
    };
    setTimeout(type, 1100);
  }

  /* ---------- Custom cursor + magnetic + hover ---------- */
  const dot = $("#cursorDot"), ring = $("#cursorRing");
  if (!isTouch && dot && ring) {
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    });
    (function loop() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    })();
    $$("a, button, [data-magnetic], .node--leaf").forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("is-hover"));
      el.addEventListener("mouseleave", () => ring.classList.remove("is-hover"));
    });
    $$("[data-magnetic]").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.22}px, ${y * 0.3}px)`;
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });
  }

  /* ---------- Tilt + glow on cards ---------- */
  if (!isTouch) {
    $$("[data-tilt]").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        card.style.setProperty("--mx", px * 100 + "%");
        card.style.setProperty("--my", py * 100 + "%");
        card.style.transform =
          `perspective(900px) rotateX(${(py - 0.5) * -5}deg) rotateY(${(px - 0.5) * 5}deg) translateY(-3px)`;
      });
      card.addEventListener("mouseleave", () => { card.style.transform = ""; });
    });
  }

  /* ---------- Parallax (scroll + mouse) ---------- */
  const parallaxEls = $$("[data-parallax]");
  let mouseX = 0, mouseY = 0;
  const applyParallax = () => {
    const sc = window.scrollY;
    parallaxEls.forEach((el) => {
      const speed = parseFloat(el.dataset.parallax) || 0;
      const ty = sc * speed + mouseY * speed * 70;
      const tx = mouseX * speed * 70;
      el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    });
  };
  if (!prefersReduced) {
    addEventListener("mousemove", (e) => {
      mouseX = (e.clientX / innerWidth - 0.5) * 2;
      mouseY = (e.clientY / innerHeight - 0.5) * 2;
      requestAnimationFrame(applyParallax);
    });
  }

  /* ---------- Scroll loop (rAF) ---------- */
  let ticking = false;
  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        onScrollProgress(); onNavScroll();
        if (!prefersReduced) applyParallax();
        ticking = false;
      });
      ticking = true;
    }
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* =============================================================
     SKILL TREE — SVG connectors + grow
     ============================================================= */
  const tree = $("#tree"), svg = $("#treeLines");

  const buildTreeLines = () => {
    if (!tree || !svg) return;
    const box = tree.getBoundingClientRect();
    svg.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);
    svg.innerHTML = "";
    const center = (el) => {
      const r = el.getBoundingClientRect();
      return { x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2,
               top: r.top - box.top, bottom: r.bottom - box.top };
    };
    const root = $('[data-node="root"]', tree);
    const branches = $$(".node--branch", tree);
    const leaves = $$(".node--leaf", tree);
    if (!root) return;

    const rootC = center(root);
    const paths = [];
    branches.forEach((b) => {
      const c = center(b);
      const midY = (rootC.bottom + c.top) / 2;
      paths.push(`M ${rootC.x} ${rootC.bottom} C ${rootC.x} ${midY}, ${c.x} ${midY}, ${c.x} ${c.top}`);
    });
    leaves.forEach((leaf) => {
      const b = branches.find((x) => x.dataset.node === leaf.dataset.parent);
      if (!b) return;
      const bc = center(b), lc = center(leaf);
      const midY = (bc.bottom + lc.top) / 2;
      paths.push(`M ${bc.x} ${bc.bottom} C ${bc.x} ${midY}, ${lc.x} ${midY}, ${lc.x} ${lc.top}`);
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
    tree.classList.add("is-grown");
    $$("#treeLines path").forEach((p, i) => setTimeout(() => { p.style.strokeDashoffset = 0; }, i * 55));
  };

  if (tree) {
    buildTreeLines();
    new IntersectionObserver(
      (entries, obs) => entries.forEach((e) => {
        if (e.isIntersecting) { growTree(); obs.unobserve(e.target); }
      }),
      { threshold: 0.25 }
    ).observe(tree);

    const branches = $$(".node--branch", tree), leaves = $$(".node--leaf", tree);
    const highlight = (cat) => {
      tree.classList.add("is-dim");
      leaves.forEach((l) => l.classList.toggle("is-hl", l.dataset.parent === cat));
      branches.forEach((b) => b.classList.toggle("is-hl", b.dataset.node === cat));
    };
    const clear = () => {
      tree.classList.remove("is-dim");
      [...leaves, ...branches].forEach((n) => n.classList.remove("is-hl"));
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

    let rt;
    addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(buildTreeLines, 150); });
  }

  /* =============================================================
     HERO — subtle squared "blueprint" field (toned down)
     ============================================================= */
  const canvas = $("#heroCanvas");
  if (canvas && !prefersReduced) {
    const ctx = canvas.getContext("2d");
    const hero = $("#hero");
    let w, h, dpr, dots = [], raf;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = hero.offsetWidth; h = hero.offsetHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + "px"; canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(Math.floor((w * h) / 20000), 80);
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
        s: Math.random() * 2 + 1.5,
      }));
    };

    let px = -999, py = -999;
    hero.addEventListener("mousemove", (e) => {
      const r = hero.getBoundingClientRect(); px = e.clientX - r.left; py = e.clientY - r.top;
    });
    hero.addEventListener("mouseleave", () => { px = -999; py = -999; });

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < dots.length; i++) {
        const p = dots[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        const dx = p.x - px, dy = p.y - py, d = Math.hypot(dx, dy);
        if (d < 110) { p.x += (dx / d) * 0.6; p.y += (dy / d) * 0.6; }

        // small squares (theme) instead of glowing circles
        ctx.fillStyle = "rgba(132, 166, 255, 0.28)";
        ctx.fillRect(p.x - p.s / 2, p.y - p.s / 2, p.s, p.s);

        for (let j = i + 1; j < dots.length; j++) {
          const q = dots[j], ddx = p.x - q.x, ddy = p.y - q.y, dist = Math.hypot(ddx, ddy);
          if (dist < 140) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(91, 140, 255, ${0.08 * (1 - dist / 140)})`;
            ctx.lineWidth = 1; ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };

    resize(); draw();
    let rzt;
    addEventListener("resize", () => { clearTimeout(rzt); rzt = setTimeout(resize, 200); });
    new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { if (!raf) draw(); }
      else { cancelAnimationFrame(raf); raf = null; }
    }), { threshold: 0 }).observe(hero);
  }
})();
