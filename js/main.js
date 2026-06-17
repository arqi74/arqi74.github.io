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

  /* =============================================================
     PROCESS — flowchart wires + reveal
     ============================================================= */
  const flow = $("#flow"), flowWires = $("#flowWires");
  const NSVG = "http://www.w3.org/2000/svg";

  const flowEdges = [
    { a: "start", b: "planning" },
    { a: "planning", b: "design" },
    { a: "design", b: "d1" },
    { a: "d1", b: "development", label: "Yes", cls: "yes" },
    { a: "development", b: "testing" },
    { a: "testing", b: "d2" },
    { a: "d2", b: "deployment", label: "Yes", cls: "yes" },
    { a: "deployment", b: "end" },
    { a: "d1", b: "design", loop: "left", label: "No", cls: "no" },
    { a: "d2", b: "development", loop: "right", label: "No", cls: "no" },
  ];

  const buildFlow = () => {
    if (!flow || !flowWires) return;
    const box = flow.getBoundingClientRect();
    flowWires.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);
    flowWires.querySelectorAll("path.wire, path.wire--flow").forEach((p) => p.remove());
    flow.querySelectorAll(".flow__label").forEach((l) => l.remove());

    const geo = (key) => {
      const el = $(`[data-flow="${key}"]`, flow);
      const r = el.getBoundingClientRect();
      const x = r.left - box.left, y = r.top - box.top;
      return { cx: x + r.width / 2, top: y, bottom: y + r.height,
               left: x, right: x + r.width, midY: y + r.height / 2 };
    };

    flowEdges.forEach((e, i) => {
      const a = geo(e.a), b = geo(e.b);
      let d, lx, ly;
      if (e.loop === "left") {
        const off = 78;
        d = `M ${a.left} ${a.midY} C ${a.left - off} ${a.midY}, ${b.left - off} ${b.midY}, ${b.left} ${b.midY}`;
        lx = Math.min(a.left, b.left) - off + 6; ly = (a.midY + b.midY) / 2;
      } else if (e.loop === "right") {
        const off = 78;
        d = `M ${a.right} ${a.midY} C ${a.right + off} ${a.midY}, ${b.right + off} ${b.midY}, ${b.right} ${b.midY}`;
        lx = Math.max(a.right, b.right) + off - 6; ly = (a.midY + b.midY) / 2;
      } else {
        d = `M ${a.cx} ${a.bottom} L ${b.cx} ${b.top}`;
        lx = a.cx + 26; ly = (a.bottom + b.top) / 2;
      }

      const base = document.createElementNS(NSVG, "path");
      base.setAttribute("d", d);
      base.setAttribute("class", "wire");
      base.setAttribute("marker-end", "url(#flowArrow)");
      flowWires.appendChild(base);
      const len = base.getTotalLength();
      base.style.setProperty("--len", len);
      base.style.transitionDelay = (i * 0.08) + "s";

      const fl = document.createElementNS(NSVG, "path");
      fl.setAttribute("d", d);
      fl.setAttribute("class", "wire--flow");
      flowWires.appendChild(fl);

      if (e.label) {
        const span = document.createElement("span");
        span.className = "flow__label flow__label--" + e.cls;
        span.textContent = e.label;
        span.style.left = lx + "px";
        span.style.top = ly + "px";
        flow.appendChild(span);
      }
    });
  };

  if (flow) {
    buildFlow();
    window.addEventListener("load", buildFlow);
    let ft;
    addEventListener("resize", () => { clearTimeout(ft); ft = setTimeout(buildFlow, 150); });

    new IntersectionObserver(
      (entries, obs) => entries.forEach((e) => {
        if (e.isIntersecting) {
          flow.classList.add("is-live");
          $$(".flow__node", flow).forEach((n, i) => setTimeout(() => n.classList.add("is-in"), i * 90));
          obs.unobserve(e.target);
        }
      }),
      { threshold: 0.2 }
    ).observe(flow);
  }

  /* =============================================================
     PROCESS — popups (modal)
     ============================================================= */
  const POPUPS = {
    start: { icon: "#f-start", kind: "Start", title: "Brief & Kickoff",
      desc: "Every project begins with a conversation. We align on your vision, your users and the business goals before the process kicks off.",
      groups: [{ h: "We align on", items: ["Vision & goals", "Target audience", "Budget & timeline", "Success metrics"] }] },
    planning: { icon: "#p-plan", kind: "Stage 01 · Planning", title: "Planning",
      desc: "Before a single line of code I map the whole project — turning goals into a clear scope, architecture and roadmap.",
      groups: [
        { h: "Activities", items: ["Requirements gathering", "Market & competitor research", "Scope & timeline", "Sitemap & user flows", "Information architecture"] },
        { h: "Tools", items: ["Notion", "Miro / FigJam", "Google Docs"] },
        { h: "Deliverables", items: ["Project brief", "Sitemap", "Roadmap", "Tech-stack decision"] },
      ], routes: [{ t: "Next → Design", cls: "yes" }] },
    design: { icon: "#p-design", kind: "Stage 02 · Design", title: "Design",
      desc: "I turn the plan into tangible screens — from low-fi wireframes to a polished, interactive prototype built on a reusable design system.",
      groups: [
        { h: "Activities", items: ["Wireframes", "Hi-fi UI", "Interactive prototype", "Design system & tokens", "Responsive layouts", "Contrast / a11y checks"] },
        { h: "Tools", items: ["Figma", "Photoshop", "Illustrator"], tech: true },
        { h: "Deliverables", items: ["Figma file", "Design system", "Clickable prototype"] },
      ], routes: [{ t: "Next → Review", cls: "yes" }] },
    d1: { icon: "#f-end", kind: "Decision gate", title: "Design approved?",
      desc: "A review checkpoint. We validate the design against the brief, usability and brand. No code starts until the direction is locked — if something is off, we loop back and refine.",
      routes: [{ t: "Yes → Development", cls: "yes" }, { t: "No → back to Design", cls: "no" }] },
    development: { icon: "#p-dev", kind: "Stage 03 · Development", title: "Development",
      desc: "The build. I implement the design as clean, component-based code, wire up data and APIs, and craft the interactions that make it feel alive.",
      groups: [
        { h: "Frontend", items: ["HTML5", "CSS3", "JavaScript (ES6+)", "React", "Vue", "Angular", "Bootstrap"], tech: true },
        { h: "Backend & data", items: ["Node.js", "REST APIs", "MongoDB", "MySQL"], tech: true },
        { h: "Tooling", items: ["Git & GitHub", "npm", "Vite / Webpack", "ESLint / Prettier"] },
        { h: "Practices", items: ["Reusable components", "State management", "Responsive-first", "Semantic, accessible markup"] },
      ], routes: [{ t: "Next → Testing", cls: "yes" }] },
    testing: { icon: "#p-test", kind: "Stage 04 · Testing", title: "Testing",
      desc: "Quality assurance across the board — I verify behaviour, responsiveness and performance, then fix and polish until it's rock solid on every device.",
      groups: [
        { h: "Checks", items: ["Responsiveness", "Cross-browser", "Accessibility (WCAG)", "Performance & Lighthouse", "Functional / unit / e2e"] },
        { h: "Tools", items: ["Chrome DevTools", "Lighthouse", "Jest", "Cypress", "BrowserStack"], tech: true },
        { h: "Deliverables", items: ["QA report", "Green Lighthouse", "Bug-free build"] },
      ], routes: [{ t: "Next → QA gate", cls: "yes" }] },
    d2: { icon: "#f-end", kind: "Decision gate", title: "QA passed?",
      desc: "The final quality gate. Only a build that passes performance, accessibility and functional checks moves on to launch. If issues remain, it loops straight back to Development.",
      routes: [{ t: "Yes → Deployment", cls: "yes" }, { t: "No → back to Development", cls: "no" }] },
    deployment: { icon: "#p-deploy", kind: "Stage 05 · Deployment", title: "Deployment",
      desc: "Go live. I ship to production with an automated pipeline, optimise assets, configure the domain and monitoring, then support and iterate.",
      groups: [
        { h: "Activities", items: ["Build & optimisation", "CI/CD pipeline", "Domain & HTTPS", "Monitoring & analytics", "Post-launch support"] },
        { h: "Platforms", items: ["GitHub Pages", "Vercel", "Netlify"], tech: true },
        { h: "Tools", items: ["GitHub Actions", "Cloudflare", "Google Analytics"] },
      ], routes: [{ t: "Next → Launch", cls: "yes" }] },
    end: { icon: "#f-end", kind: "End", title: "Launch & Maintain",
      desc: "The project is live — but it's not the finish line. I monitor, maintain and keep improving it so it grows together with your business.",
      groups: [{ h: "Ongoing", items: ["Monitoring", "Maintenance & updates", "New features", "Performance tuning"] }] },
  };

  const modal = $("#modal");
  if (modal) {
    const mIcon = $("#modalIconUse"), mKind = $("#modalKind"), mTitle = $("#modalTitle"),
          mDesc = $("#modalDesc"), mBody = $("#modalBody"), mFoot = $("#modalFoot"),
          mClose = $("#modalClose");
    let lastFocus = null;

    const render = (d) => {
      mIcon.setAttribute("href", d.icon);
      mKind.textContent = d.kind || "";
      mTitle.textContent = d.title;
      mDesc.textContent = d.desc;
      mBody.innerHTML = (d.groups || []).map((g) =>
        `<div class="modal__group"><h4>${g.h}</h4>` +
        `<ul class="modal__chips${g.tech ? " modal__chips--tech" : ""}">` +
        g.items.map((i) => `<li>${i}</li>`).join("") + `</ul></div>`).join("");
      mFoot.innerHTML = (d.routes || []).map((r) =>
        `<span class="modal__route modal__route--${r.cls}">${r.t}</span>`).join("");
    };
    const openModal = (id) => {
      const d = POPUPS[id]; if (!d) return;
      render(d);
      lastFocus = document.activeElement;
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
      mClose.focus();
    };
    const closeModal = () => {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };

    $$("[data-popup]").forEach((el) =>
      el.addEventListener("click", () => openModal(el.dataset.popup)));
    $$("[data-modal-close]", modal).forEach((el) =>
      el.addEventListener("click", closeModal));
    document.addEventListener("keydown", (e) => {
      if (!modal.classList.contains("is-open")) return;
      if (e.key === "Escape") closeModal();
      if (e.key === "Tab") {
        const f = $$('button, [href], [tabindex]:not([tabindex="-1"])', modal)
          .filter((el) => el.offsetParent !== null);
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
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
