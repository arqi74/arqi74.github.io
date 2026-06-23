/* =================================================================
   ARWI.DEV — main.js
   Vanilla JS. No dependencies. Organised in small modules.
   ================================================================= */
(() => {
  'use strict';

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =============================================================
     DATA
     ============================================================= */
  const TECH = [
    { id:'html',    icon:'i-html',    name:'HTML5',      cat:'frontend', catLabel:'Frontend', level:96,
      desc:'Semantic, accessible markup — the foundation of every interface. I care about structure, SEO and a11y.',
      tags:['Semantics','ARIA / a11y','SEO','Web Components'] },
    { id:'css',     icon:'i-css',     name:'CSS3',       cat:'frontend', catLabel:'Frontend', level:94,
      desc:'Grid/Flexbox layouts, animations, custom properties and full responsiveness. UI that just works.',
      tags:['Grid / Flex','Animations','Custom props','Sass'] },
    { id:'js',      icon:'i-js',      name:'JavaScript', cat:'language', catLabel:'Language', level:95,
      desc:'ES2023+, async/await, modules, Web APIs. The language that brings every interface to life.',
      tags:['ES2023+','Async','DOM / Web API','Canvas'] },
    { id:'ts',      icon:'i-ts',      name:'TypeScript', cat:'language', catLabel:'Language', level:88,
      desc:'Static typing, safety and scalability for large codebases. Fewer bugs, more confidence.',
      tags:['Types / Generics','Strict mode','tRPC','Zod'] },
    { id:'react',   icon:'i-react',   name:'React',      cat:'frontend', catLabel:'Frontend', level:92,
      desc:'Components, hooks and a rich ecosystem. SPAs and SSR with Next.js — fast and modern.',
      tags:['Hooks','Next.js','Context','React Query'] },
    { id:'vue',     icon:'i-vue',     name:'Vue',        cat:'frontend', catLabel:'Frontend', level:85,
      desc:'Reactivity, Single-File Components and the Composition API. Fast, enjoyable development.',
      tags:['Composition API','Pinia','Nuxt','SFC'] },
    { id:'angular', icon:'i-angular', name:'Angular',    cat:'frontend', catLabel:'Frontend', level:78,
      desc:'A full-featured framework for enterprise apps — RxJS, Dependency Injection, structure that lasts.',
      tags:['RxJS','DI','CLI','Standalone'] },
    { id:'node',    icon:'i-node',    name:'Node.js',    cat:'backend',  catLabel:'Backend', level:87,
      desc:'Backend in JavaScript — REST & GraphQL APIs, real-time over WebSocket, microservices.',
      tags:['Express','REST / GraphQL','WebSocket','JWT'] },
    { id:'mongo',   icon:'i-mongo',   name:'MongoDB',    cat:'database', catLabel:'Database', level:83,
      desc:'A NoSQL database — flexible document schema, aggregations and fast prototyping.',
      tags:['Mongoose','Aggregations','Atlas','Indexes'] },
    { id:'mysql',   icon:'i-mysql',   name:'MySQL',      cat:'database', catLabel:'Database', level:80,
      desc:'A relational database — clean SQL, transactions and integrity. Solid foundations for your data.',
      tags:['SQL','Transactions','Relations','Indexes'] },
  ];

  const PIPE = [
    { id:'brief',  icon:'p-brief',  step:'01', name:'Brief & Idea', cmd:'$ git init',
      desc:'Requirements and business goals.',
      long:'It all starts with a conversation. I gather requirements, learn the business goal and define what “success” means for the project. We agree on scope, budget and timeline.',
      tools:['Notion','FigJam','User stories'] },
    { id:'plan',   icon:'p-plan',   step:'02', name:'Architecture', cmd:'$ npm create',
      desc:'Stack, data models, structure.',
      long:'I design the architecture: stack selection, folder structure, data models and flows. The technical decisions are made here, before the first line of production code.',
      tools:['Excalidraw','ERD','ADR'] },
    { id:'design', icon:'p-design', step:'03', name:'UI / UX Design', cmd:'$ figma open',
      desc:'Design system and prototype.',
      long:'I build a consistent design system and a clickable prototype in Figma. I refine typography, grid, states and micro-interactions — because it has to be “too clean for default UI”.',
      tools:['Figma','Design system','Prototype'] },
    { id:'dev',    icon:'p-dev',    step:'04', name:'Development', cmd:'$ git checkout -b feat',
      desc:'Clean, component-based code.',
      long:'Implementation in feature branches, clean component-based code and a consistent Git flow. Small, readable commits and meaningful naming.',
      tools:['VS Code','Git','ESLint','Prettier'] },
    { id:'review', icon:'p-review', step:'05', name:'Code Review', cmd:'$ gh pr create',
      desc:'Pull requests and standards.',
      long:'Every change goes through a Pull Request. Automated linting, consistent standards and code review keep quality and maintainability in check.',
      tools:['GitHub PR','Conventional Commits'] },
    { id:'test',   icon:'p-test',   step:'06', name:'Tests & QA', cmd:'$ npm test',
      desc:'Unit, E2E and performance audit.',
      long:'Unit and E2E tests, cross-browser verification and a performance & accessibility audit. A green pipeline is the gate to move forward.',
      tools:['Vitest','Playwright','Lighthouse'] },
    { id:'cicd',   icon:'p-cicd',   step:'07', name:'CI / CD', cmd:'$ git push origin',
      desc:'Automated build on every push.',
      long:'GitHub Actions automatically builds, lints and deploys the app on every push. Zero manual deploys, fully reproducible.',
      tools:['GitHub Actions','Docker','Cache'] },
    { id:'deploy', icon:'p-deploy', step:'08', name:'Deploy & Monitor', cmd:'$ vercel --prod',
      desc:'Ship, monitor, iterate.',
      long:'Production deploy in a single push, followed by error and metrics monitoring. Based on the data we iterate and keep growing the product.',
      tools:['Vercel','Analytics','Sentry'] },
  ];

  const DISCORD_URL  = 'https://discord.gg/your-invite';
  const DISCORD_NICK = 'arwi.dev';

  /* =============================================================
     BOOT LOADER
     ============================================================= */
  const Boot = (() => {
    const boot = $('#boot'), log = $('#bootLog'), prog = $('#bootProgress'), skip = $('#bootSkip');
    const lines = [
      { t:'$ arwi-dev/portfolio :: boot', cls:'b' },
      { t:'> loading modules ............ ', cls:'m', tail:'ok',            tcls:'ok' },
      { t:'> mounting <Hero/> ........... ', cls:'m', tail:'ok',            tcls:'ok' },
      { t:'> compiling shaders .......... ', cls:'m', tail:'ok',            tcls:'ok' },
      { t:'> npm run build .............. ', cls:'m', tail:'done in 0.42s', tcls:'ok' },
      { t:'> deploy → arwi.dev .......... ', cls:'m', tail:'live',          tcls:'ok' },
      { t:'', cls:'m' },
      { t:'welcome, visitor.', cls:'b' },
    ];
    let done = false;
    const esc = s => s.replace(/[&<>]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;' }[c]));

    function finish() {
      if (done) return; done = true;
      boot.classList.add('is-done');
      document.body.removeAttribute('data-loading');
      window.dispatchEvent(new Event('arwi:ready'));
      setTimeout(() => boot.remove(), 600);
    }

    function run() {
      if (REDUCED) { log.textContent = 'welcome, visitor.'; prog.style.width = '100%'; setTimeout(finish, 200); return; }
      const total = lines.reduce((s, l) => s + l.t.length + (l.tail ? l.tail.length : 0), 0);
      const completed = [];
      let li = 0, phase = 'main', ci = 0, typed = 0;

      const curHTML = () => {
        const l = lines[li];
        const mainLen = phase === 'main' ? ci : l.t.length;
        let html = `<span class="${l.cls}">${esc(l.t.slice(0, mainLen))}</span>`;
        if (l.tail) {
          const tailLen = phase === 'main' ? 0 : (phase === 'tail' ? ci : l.tail.length);
          if (tailLen > 0) html += `<span class="${l.tcls}">${esc(l.tail.slice(0, tailLen))}</span>`;
        }
        return html;
      };

      (function tick() {
        if (li >= lines.length) { prog.style.width = '100%'; setTimeout(finish, 350); return; }
        const l = lines[li];
        if (phase === 'main') {
          if (ci < l.t.length) { ci++; typed++; } else { phase = l.tail ? 'tail' : 'done'; ci = 0; }
        } else if (phase === 'tail') {
          if (ci < l.tail.length) { ci++; typed++; } else phase = 'done';
        }
        log.innerHTML = [...completed, curHTML()].join('\n');
        prog.style.width = clamp((typed / total) * 100, 0, 100) + '%';
        log.scrollTop = log.scrollHeight;
        if (phase === 'done') { completed.push(curHTML()); li++; phase = 'main'; ci = 0; }
        setTimeout(tick, 13);
      })();
    }

    skip.addEventListener('click', finish);
    addEventListener('keydown', e => { if (!done && (e.key === 'Escape' || e.key === 'Enter')) finish(); });
    return { run, finish };
  })();

  /* =============================================================
     CUSTOM CURSOR
     ============================================================= */
  (function cursor() {
    if (matchMedia('(pointer:coarse)').matches) return;
    const dot = $('#cursorDot'), ring = $('#cursorRing');
    let rx = innerWidth/2, ry = innerHeight/2, mx = rx, my = ry;
    addEventListener('pointermove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    });
    addEventListener('pointerdown', () => ring.classList.add('is-down'));
    addEventListener('pointerup',   () => ring.classList.remove('is-down'));
    document.addEventListener('pointerover', e => {
      const hit = e.target.closest('a,button,.tech-card,.pnode,[data-magnetic],input,.cmdk__item');
      ring.classList.toggle('is-hover', !!hit);
    });
    (function loop() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    })();
  })();

  /* =============================================================
     CONSTELLATION BACKGROUND
     ============================================================= */
  (function constellation() {
    const cv = $('#bgCanvas'); if (!cv) return;
    const ctx = cv.getContext('2d');
    let w, h, pts = [], dpr = Math.min(devicePixelRatio || 1, 2);
    const mouse = { x: -999, y: -999 };

    function resize() {
      w = cv.width = innerWidth * dpr; h = cv.height = innerHeight * dpr;
      cv.style.width = innerWidth + 'px'; cv.style.height = innerHeight + 'px';
      const count = clamp(Math.floor((innerWidth * innerHeight) / 17000), 36, 110);
      pts = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - .5) * 0.22 * dpr, vy: (Math.random() - .5) * 0.22 * dpr,
      }));
    }
    addEventListener('pointermove', e => { mouse.x = e.clientX * dpr; mouse.y = e.clientY * dpr; });

    function frame() {
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
        if (d < 140 * dpr) { p.x += dx / d * 0.6; p.y += dy / d * 0.6; }
      }
      const maxD = 130 * dpr;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d = Math.hypot(dx, dy);
          if (d < maxD) {
            ctx.strokeStyle = `rgba(74,163,255,${(1 - d / maxD) * 0.22})`;
            ctx.lineWidth = dpr;
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
          }
        }
        ctx.fillStyle = 'rgba(120,200,255,.6)';
        ctx.beginPath(); ctx.arc(pts[i].x, pts[i].y, 1.4 * dpr, 0, 7); ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    }
    let raf;
    resize(); addEventListener('resize', resize);
    if (!REDUCED) frame();
    else { // single static frame
      ctx.fillStyle = 'rgba(120,200,255,.5)';
      pts.forEach(p => { ctx.beginPath(); ctx.arc(p.x, p.y, 1.4*dpr, 0, 7); ctx.fill(); });
    }
    document.addEventListener('visibilitychange', () => {
      if (REDUCED) return;
      if (document.hidden) cancelAnimationFrame(raf); else frame();
    });
  })();

  /* =============================================================
     MATRIX RAIN (toggleable)
     ============================================================= */
  const Matrix = (() => {
    const cv = $('#matrixCanvas'), ctx = cv.getContext('2d');
    let w, h, cols, drops = [], raf = null, on = false;
    const glyphs = 'アカサタナハマ0123456789{}[]<>/$;=&|+*ABCDEF'.split('');
    function resize() {
      w = cv.width = innerWidth; h = cv.height = innerHeight;
      cols = Math.floor(w / 16); drops = Array(cols).fill(0).map(() => Math.random() * -50);
    }
    function frame() {
      ctx.fillStyle = 'rgba(7,10,18,.08)'; ctx.fillRect(0, 0, w, h);
      ctx.font = '15px JetBrains Mono, monospace';
      for (let i = 0; i < cols; i++) {
        const ch = glyphs[(Math.random() * glyphs.length) | 0];
        const x = i * 16, y = drops[i] * 16;
        ctx.fillStyle = Math.random() > .96 ? '#9fdcff' : '#2e8dff';
        ctx.fillText(ch, x, y);
        if (y > h && Math.random() > .975) drops[i] = 0;
        drops[i] += 0.5;
      }
      raf = requestAnimationFrame(frame);
    }
    function toggle(force) {
      on = force ?? !on;
      cv.classList.toggle('is-on', on);
      if (on && !raf) { resize(); frame(); }
      if (!on && raf) { cancelAnimationFrame(raf); raf = null; ctx.clearRect(0,0,w,h); }
      return on;
    }
    addEventListener('resize', () => { if (on) resize(); });
    return { toggle };
  })();

  /* =============================================================
     CLICK BURST (code symbols)
     ============================================================= */
  (function burst() {
    if (REDUCED) return;
    const cv = $('#burstCanvas'), ctx = cv.getContext('2d');
    let w, h, parts = [], raf = null, dpr = Math.min(devicePixelRatio || 1, 2);
    const chars = ['{','}','<','>','/',';','(',')','$','#','*','=','&&','=>','[]','0','1'];
    function resize() { w = cv.width = innerWidth*dpr; h = cv.height = innerHeight*dpr; cv.style.width=innerWidth+'px'; cv.style.height=innerHeight+'px'; }
    resize(); addEventListener('resize', resize);
    addEventListener('pointerdown', e => {
      if (e.target.closest('input, textarea, .term__screen')) return;
      const n = 9 + (Math.random()*5|0);
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2, sp = (1.6 + Math.random()*4) * dpr;
        parts.push({
          x: e.clientX*dpr, y: e.clientY*dpr,
          vx: Math.cos(a)*sp, vy: Math.sin(a)*sp - 1*dpr,
          life: 1, ch: chars[(Math.random()*chars.length)|0],
          size: (11 + Math.random()*9) * dpr, rot: Math.random()*6,
        });
      }
      if (!raf) frame();
    });
    function frame() {
      ctx.clearRect(0,0,w,h);
      parts = parts.filter(p => p.life > 0);
      for (const p of parts) {
        p.x += p.vx; p.y += p.vy; p.vy += 0.12*dpr; p.life -= 0.022; p.rot += 0.06;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.globalAlpha = clamp(p.life,0,1);
        ctx.fillStyle = Math.random() > .5 ? '#5ad1ff' : '#2e8dff';
        ctx.font = `700 ${p.size}px JetBrains Mono, monospace`; ctx.textAlign='center';
        ctx.fillText(p.ch, 0, 0); ctx.restore();
      }
      if (parts.length) raf = requestAnimationFrame(frame); else { raf = null; ctx.clearRect(0,0,w,h); }
    }
  })();

  /* =============================================================
     MAGNETIC + RADIAL FOLLOW
     ============================================================= */
  (function magnetic() {
    if (matchMedia('(pointer:coarse)').matches) return;
    $$('[data-magnetic]').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width/2), dy = e.clientY - (r.top + r.height/2);
        el.style.transform = `translate(${dx*0.25}px, ${dy*0.35}px)`;
        el.style.setProperty('--mx', `${e.clientX - r.left}px`);
        el.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
    // radial light follow for cards/buttons
    document.addEventListener('pointermove', e => {
      const card = e.target.closest('.tech-card, .btn');
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  })();

  /* =============================================================
     REVEAL ON SCROLL
     ============================================================= */
  (function reveal() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en, i) => {
        if (en.isIntersecting) {
          setTimeout(() => en.target.classList.add('is-in'), Math.min(i * 60, 240));
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    $$('[data-reveal]').forEach(el => io.observe(el));
  })();

  /* =============================================================
     NAV: stuck, active link, dots, burger
     ============================================================= */
  (function nav() {
    const nav = $('#nav'), prog = $('#scrollProgress');
    const links = $$('.nav__link'), dots = $$('.dots__dot');
    const sections = ['hero','stack','pipeline','social','contact'].map(id => $('#'+id));
    const burger = $('#navBurger');

    function onScroll() {
      const sc = scrollY, docH = document.documentElement.scrollHeight - innerHeight;
      prog.style.width = (docH > 0 ? (sc / docH) * 100 : 0) + '%';
      nav.classList.toggle('is-stuck', sc > 40);
    }
    addEventListener('scroll', onScroll, { passive:true }); onScroll();

    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const id = en.target.id;
        links.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === '#'+id));
        dots.forEach(d => d.classList.toggle('is-active', d.getAttribute('href') === '#'+id));
      });
    }, { threshold: 0.5 });
    sections.forEach(s => s && io.observe(s));

    burger.addEventListener('click', () => nav.classList.toggle('is-open'));
    $$('.nav__link').forEach(l => l.addEventListener('click', () => nav.classList.remove('is-open')));
  })();

  /* =============================================================
     HERO ROTATOR
     ============================================================= */
  (function rotator() {
    const el = $('#rotator'); if (!el) return;
    const words = ['otherworldly','lightning-fast','polished','interactive','scalable'];
    if (REDUCED) { el.textContent = words[0]; return; }
    let wi = 0, ci = 0, deleting = false;
    (function tick() {
      const word = words[wi];
      el.textContent = word.slice(0, ci);
      if (!deleting && ci < word.length) ci++;
      else if (!deleting && ci === word.length) { deleting = true; return setTimeout(tick, 1600); }
      else if (deleting && ci > 0) ci--;
      else { deleting = false; wi = (wi + 1) % words.length; }
      setTimeout(tick, deleting ? 45 : 95);
    })();
  })();

  /* =============================================================
     INTERACTIVE TERMINAL
     ============================================================= */
  const Term = (() => {
    const screen = $('#termScreen'), inputLine = $('#termInputLine'), typed = $('#termTyped');
    const input = document.createElement('input');
    input.setAttribute('aria-hidden','true');
    input.style.cssText = 'position:absolute;opacity:0;width:1px;height:1px;border:0;padding:0;left:-9999px;';
    input.autocapitalize = 'off'; input.autocomplete = 'off'; input.spellcheck = false;
    screen.appendChild(input);

    function print(html, cls = 'term__out') {
      const div = document.createElement('div');
      div.className = 'term__line ' + cls; div.innerHTML = html;
      screen.insertBefore(div, inputLine);
      screen.scrollTop = screen.scrollHeight;
    }
    function printCmd(cmd) {
      print(`<span class="term__prompt">arwi@dev <span class="term__path">~</span> $</span> <span class="w">${esc(cmd)}</span>`, 'term__line');
    }
    const esc = s => s.replace(/[&<>]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;' }[c]));

    const COMMANDS = {
      help: () => print(
        `available commands:\n` +
        `  <span class="c">help</span>      — this list\n` +
        `  <span class="c">whoami</span>    — who is arwi\n` +
        `  <span class="c">stack</span>     — my technologies\n` +
        `  <span class="c">pipeline</span>  — production stages\n` +
        `  <span class="c">social</span>    — where to find me\n` +
        `  <span class="c">contact</span>   — let's build something\n` +
        `  <span class="c">neofetch</span>  — system info\n` +
        `  <span class="c">matrix</span>    — you know you want to\n` +
        `  <span class="c">clear</span>     — clear the screen`),
      whoami: () => print(`<span class="w">arwi</span> — modern web developer.\nFront-end + back-end. <span class="c">"too clean for default UI"</span>.`),
      ls: () => print(`stack/   pipeline/   social/   contact/   <span class="m">.secrets/</span>`),
      stack: () => print(TECH.map(t => `  <span class="b">${t.name.padEnd(11)}</span> <span class="m">${'█'.repeat(Math.round(t.level/10))}${'░'.repeat(10-Math.round(t.level/10))}</span> ${t.level}%`).join('\n')),
      skills: () => COMMANDS.stack(),
      pipeline: () => print(PIPE.map(p => `  <span class="c">${p.step}</span> ${p.name}`).join('  →\n')),
      social: () => { print(`<span class="b">YouTube</span> · <span class="b">X/Twitter</span> · <span class="b">GitHub</span> · <span class="b">Discord</span>\n<span class="m">→ scrolling to the social section...</span>`); go('#social'); },
      contact: () => { print(`<span class="ok">→</span> best way to reach me is Discord: <span class="c">${DISCORD_NICK}</span>`); go('#contact'); },
      discord: () => COMMANDS.contact(),
      neofetch: () => print(
`<span class="b">      /\\___/\\        </span>  <span class="w">arwi</span>@<span class="w">dev</span>
<span class="b">     ( o   o )       </span>  ------------
<span class="b">     (  =^=  )       </span>  <span class="c">OS</span>: ArwiOS (web)
<span class="b">      )     (        </span>  <span class="c">Shell</span>: zsh
<span class="b">     (       )       </span>  <span class="c">Stack</span>: JS·TS·React·Node
<span class="b">    ( (  )  ( ) )     </span>  <span class="c">Editor</span>: VS Code
<span class="b">   (__(__)___(__)__)  </span>  <span class="c">Uptime</span>: caffeinated`),
      matrix: () => { const on = Matrix.toggle(); print(on ? '<span class="ok">matrix:</span> enabled — follow the white rabbit.' : 'matrix: disabled.'); },
      wolf:  () => { WolfMode(); print('<span class="c">🐺 wolf mode engaged.</span>'); },
      sudo:  () => print(`<span class="m">arwi is not in the sudoers file. This incident will be reported. 😏</span>`),
      date:  () => print(new Date().toString()),
      theme: () => print('<span class="m">theme: electric-blue (locked). too clean to change.</span>'),
      clear: () => { $$('.term__line', screen).forEach(l => { if (l !== inputLine) l.remove(); }); },
      echo:  (arg) => print(esc(arg || '')),
    };

    function go(sel) { const t = $(sel); if (t) t.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' }); }

    function exec(raw) {
      const line = raw.trim(); if (!line) return;
      printCmd(line);
      const [cmd, ...rest] = line.split(' ');
      const fn = COMMANDS[cmd.toLowerCase()];
      if (fn) fn(rest.join(' '));
      else print(`<span class="m">command not found: ${esc(cmd)} — type </span><span class="c">help</span>`);
    }

    let booted = false, history = [], hi = -1;
    function bootIntro() {
      if (booted) return; booted = true;
      print('<span class="m">// terminal ready. type </span><span class="c">help</span><span class="m"> and hit Enter.</span>');
    }

    input.addEventListener('input', () => { typed.textContent = input.value; });
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const v = input.value; if (v.trim()) { history.unshift(v); hi = -1; }
        exec(v); input.value = ''; typed.textContent = '';
      } else if (e.key === 'ArrowUp')   { e.preventDefault(); if (hi < history.length-1) { hi++; input.value = history[hi]; typed.textContent = input.value; } }
      else if (e.key === 'ArrowDown')   { e.preventDefault(); if (hi > 0) { hi--; input.value = history[hi]; } else { hi=-1; input.value=''; } typed.textContent = input.value; }
    });
    screen.addEventListener('click', () => { bootIntro(); input.focus({ preventScroll:true }); });

    return { exec, focus: () => { bootIntro(); input.focus({ preventScroll:true }); }, run: (c) => { go('#hero'); bootIntro(); exec(c); } };
  })();

  /* =============================================================
     MODAL
     ============================================================= */
  const Modal = (() => {
    const root = $('#modal'), body = $('#modalBody'), closeBtn = $('#modalClose'), card = $('#modalCard');
    let lastFocus = null;
    function open(html) {
      lastFocus = document.activeElement;
      body.innerHTML = html; root.classList.add('is-open'); root.setAttribute('aria-hidden','false');
      // animate level fills
      requestAnimationFrame(() => $$('.mlevel__fill', body).forEach(f => f.style.width = f.dataset.w));
      closeBtn.focus();
    }
    function close() {
      root.classList.remove('is-open'); root.setAttribute('aria-hidden','true');
      lastFocus && lastFocus.focus && lastFocus.focus();
    }
    closeBtn.addEventListener('click', close);
    root.addEventListener('click', e => { if (e.target === root) close(); });
    return { open, close, isOpen: () => root.classList.contains('is-open') };
  })();

  /* =============================================================
     TECH GRID
     ============================================================= */
  (function techGrid() {
    const grid = $('#techGrid'); if (!grid) return;
    grid.innerHTML = TECH.map(t => `
      <button class="tech-card reveal" data-reveal data-id="${t.id}" data-cat="${t.cat}" aria-label="${t.name}">
        <span class="tech-card__hint">click › details</span>
        <svg class="ic tech-card__icon"><use href="#${t.icon}"/></svg>
        <div class="tech-card__cat">${t.catLabel}</div>
        <div class="tech-card__name">${t.name}</div>
        <div class="tech-card__bar"><span class="tech-card__fill" data-w="${t.level}%"></span></div>
      </button>`).join('');

    // animate bars when in view
    const io = new IntersectionObserver(es => es.forEach(en => {
      if (en.isIntersecting) { $('.tech-card__fill', en.target).style.width = $('.tech-card__fill', en.target).dataset.w; io.unobserve(en.target); }
    }), { threshold: .4 });
    $$('.tech-card', grid).forEach(c => io.observe(c));

    // 3D tilt
    if (!matchMedia('(pointer:coarse)').matches) {
      $$('.tech-card', grid).forEach(card => {
        card.addEventListener('pointermove', e => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
          card.style.transform = `perspective(700px) rotateX(${-py*9}deg) rotateY(${px*11}deg) translateY(-4px)`;
        });
        card.addEventListener('pointerleave', () => { card.style.transform = ''; });
      });
    }

    // click → modal
    grid.addEventListener('click', e => {
      const card = e.target.closest('.tech-card'); if (!card) return;
      const t = TECH.find(x => x.id === card.dataset.id); if (!t) return;
      Modal.open(`
        <div class="mhead">
          <div class="mhead__icon"><svg class="ic"><use href="#${t.icon}"/></svg></div>
          <div><div class="mcat">${t.catLabel}</div><h3>${t.name}</h3></div>
        </div>
        <p class="mbody-text">${t.desc}</p>
        <div class="mlevel">
          <div class="mlevel__top"><span>proficiency</span><span>${t.level}%</span></div>
          <div class="mlevel__bar"><span class="mlevel__fill" data-w="${t.level}%"></span></div>
        </div>
        <div class="mtools"><h4>what I use</h4><div class="mtags">${t.tags.map(x => `<span class="mtag">${x}</span>`).join('')}</div></div>
      `);
    });

    // filters
    $('#filters').addEventListener('click', e => {
      const chip = e.target.closest('.chip'); if (!chip) return;
      $$('.chip', $('#filters')).forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      const f = chip.dataset.filter;
      $$('.tech-card', grid).forEach(c => c.classList.toggle('is-hidden', f !== 'all' && c.dataset.cat !== f));
    });
  })();

  /* =============================================================
     PIPELINE — nodes, snake layout, animated connectors
     ============================================================= */
  (function pipeline() {
    const wrap = $('#pipe'), gridEl = $('#pipeGrid'), svg = $('#pipeSvg'); if (!wrap) return;
    const SVGNS = 'http://www.w3.org/2000/svg';

    // build nodes
    gridEl.innerHTML = PIPE.map(p => `
      <button class="pnode" data-id="${p.id}" aria-label="${p.name}">
        <span class="pnode__step">${p.step}</span>
        <div class="pnode__icon"><svg class="ic"><use href="#${p.icon}"/></svg></div>
        <div class="pnode__name">${p.name}</div>
        <div class="pnode__desc">${p.desc}</div>
        <div class="pnode__cmd">${p.cmd}</div>
      </button>`).join('');
    const nodes = $$('.pnode', gridEl);

    function cols() { const w = wrap.clientWidth; return w >= 900 ? 4 : w >= 560 ? 2 : 1; }

    function layout(c) {
      gridEl.style.gridTemplateColumns = `repeat(${c}, 1fr)`;
      nodes.forEach((n, i) => {
        const row = Math.floor(i / c), pos = i % c;
        const col = row % 2 === 0 ? pos + 1 : c - pos;   // snake
        n.style.gridColumn = col; n.style.gridRow = row + 1;
      });
    }

    function drawConnectors() {
      const wrapRect = wrap.getBoundingClientRect();
      svg.innerHTML = `<defs><linearGradient id="pipeGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#1d6fe0"/><stop offset="1" stop-color="#5ad1ff"/></linearGradient></defs>`;
      const drawn = REDUCED;
      for (let i = 0; i < nodes.length - 1; i++) {
        const a = nodes[i].getBoundingClientRect(), b = nodes[i+1].getBoundingClientRect();
        const ax = a.left - wrapRect.left, ay = a.top - wrapRect.top;
        const bx = b.left - wrapRect.left, by = b.top - wrapRect.top;
        const acx = ax + a.width/2, acy = ay + a.height/2;
        const bcx = bx + b.width/2, bcy = by + b.height/2;
        let d;
        if (Math.abs(acy - bcy) < 6) {                 // same row → horizontal
          if (bcx > acx) d = `M ${ax + a.width} ${acy} L ${bx} ${bcy}`;
          else           d = `M ${ax} ${acy} L ${bx + b.width} ${bcy}`;
        } else {                                       // wrap → vertical
          d = `M ${acx} ${ay + a.height} L ${bcx} ${by}`;
        }
        // base + highlight
        const base = document.createElementNS(SVGNS, 'path');
        base.setAttribute('d', d); base.setAttribute('class', 'pipe-path');
        svg.appendChild(base);

        const hi = document.createElementNS(SVGNS, 'path');
        hi.setAttribute('d', d); hi.setAttribute('class', 'pipe-path-draw');
        hi.id = `pp-${i}`;
        svg.appendChild(hi);
        const len = hi.getTotalLength();
        hi.style.strokeDasharray = len;
        hi.style.strokeDashoffset = (drawn || drawnOnce) ? 0 : len;

        if (!REDUCED) {
          // animated packet
          const pk = document.createElementNS(SVGNS, 'circle');
          pk.setAttribute('r', '4'); pk.setAttribute('class', 'pipe-packet');
          const am = document.createElementNS(SVGNS, 'animateMotion');
          am.setAttribute('dur', '2.6s'); am.setAttribute('begin', `${i * 0.42}s`);
          am.setAttribute('repeatCount', 'indefinite'); am.setAttribute('rotate', 'auto');
          const mp = document.createElementNS(SVGNS, 'mpath');
          mp.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `#pp-${i}`);
          mp.setAttribute('href', `#pp-${i}`);
          am.appendChild(mp); pk.appendChild(am); svg.appendChild(pk);
        }
      }
    }

    let drawnOnce = false;
    function build() { layout(cols()); requestAnimationFrame(drawConnectors); }

    // draw highlight lines progressively when in view
    const io = new IntersectionObserver(es => es.forEach(en => {
      if (en.isIntersecting && !drawnOnce) {
        drawnOnce = true;
        $$('.pipe-path-draw', svg).forEach((p, i) => {
          p.style.transition = 'stroke-dashoffset 1.1s var(--ease)';
          setTimeout(() => p.style.strokeDashoffset = 0, 160 + i * 130);
        });
      }
    }), { threshold: .25 });
    io.observe(wrap);

    // node click → modal + pulse
    gridEl.addEventListener('click', e => {
      const node = e.target.closest('.pnode'); if (!node) return;
      node.classList.remove('is-pulse'); void node.offsetWidth; node.classList.add('is-pulse');
      const p = PIPE.find(x => x.id === node.dataset.id); if (!p) return;
      Modal.open(`
        <div class="mhead">
          <div class="mhead__icon"><svg class="ic"><use href="#${p.icon}"/></svg></div>
          <div><div class="mcat">stage ${p.step} / ${PIPE.length}</div><h3>${p.name}</h3></div>
        </div>
        <p class="mbody-text">${p.long}</p>
        <div class="contact__terminal" style="margin:0 0 6px;"><span class="contact__prompt">~ $</span><span class="contact__cmd">${p.cmd}</span></div>
        <div class="mtools"><h4>tools</h4><div class="mtags">${p.tools.map(x => `<span class="mtag">${x}</span>`).join('')}</div></div>
      `);
    });

    let rid;
    addEventListener('resize', () => { clearTimeout(rid); rid = setTimeout(build, 160); });
    build();
    // redraw after fonts/images settle
    addEventListener('arwi:ready', () => setTimeout(build, 80));
    addEventListener('load', () => setTimeout(build, 120));
  })();

  /* =============================================================
     COMMAND PALETTE (Ctrl/Cmd + K)
     ============================================================= */
  const Cmdk = (() => {
    const root = $('#cmdk'), input = $('#cmdkInput'), list = $('#cmdkList');
    const go = sel => { const t = $(sel); if (t) t.scrollIntoView({ behavior: REDUCED ? 'auto':'smooth' }); close(); };
    const CMDS = [
      { icon:'ui-arrow-right', label:'Go to: Stack',     sub:'my technologies',     keys:'01', kw:'stack technologies tech', run:() => go('#stack') },
      { icon:'ui-arrow-right', label:'Go to: Pipeline',  sub:'production process',  keys:'02', kw:'pipeline process workflow', run:() => go('#pipeline') },
      { icon:'ui-arrow-right', label:'Go to: Social',    sub:'social media',        keys:'03', kw:'social youtube github x twitter discord', run:() => go('#social') },
      { icon:'ui-arrow-right', label:'Go to: Contact',   sub:"let's build",         keys:'04', kw:'contact project hire', run:() => go('#contact') },
      { icon:'s-discord',  label:'Open Discord',         sub:DISCORD_URL,           keys:'↵', kw:'discord contact', run:() => { window.open(DISCORD_URL,'_blank'); close(); } },
      { icon:'ui-copy',    label:'Copy Discord username',sub:DISCORD_NICK,          keys:'⌘C', kw:'copy discord username nick', run:() => { copyDiscord(); close(); } },
      { icon:'s-github',   label:'Open GitHub',          sub:'github.com/arqi74',   keys:'↗', kw:'github repo code', run:() => { window.open('https://github.com/arqi74','_blank'); close(); } },
      { icon:'ui-terminal',label:'Focus the terminal',   sub:'type help',           keys:'>', kw:'terminal console cli', run:() => { close(); Term.focus(); } },
      { icon:'ui-spark',   label:'Matrix mode',          sub:'character rain',      keys:'fx', kw:'matrix rain effect', run:() => { Matrix.toggle(); close(); } },
      { icon:'ui-spark',   label:'🐺 Wolf mode',         sub:'easter egg',          keys:'fx', kw:'wolf easter egg', run:() => { WolfMode(); close(); } },
    ];
    let active = 0, filtered = CMDS;

    function render() {
      list.innerHTML = filtered.map((c, i) => `
        <li class="cmdk__item ${i===active?'is-active':''}" data-i="${i}" role="option">
          <svg class="ic"><use href="#${c.icon}"/></svg>
          <span><b>${c.label}</b><small>${c.sub}</small></span>
          <span class="k">${c.keys}</span>
        </li>`).join('') || `<li class="cmdk__item" style="cursor:default"><span><b>No results</b><small>try “pipeline” or “discord”</small></span></li>`;
    }
    function filter() {
      const q = input.value.trim().toLowerCase();
      filtered = !q ? CMDS : CMDS.filter(c => (c.label + ' ' + c.sub + ' ' + c.kw).toLowerCase().includes(q));
      active = 0; render();
    }
    function open() {
      root.classList.add('is-open'); root.setAttribute('aria-hidden','false');
      input.value = ''; filter(); setTimeout(() => input.focus(), 30);
    }
    function close() { root.classList.remove('is-open'); root.setAttribute('aria-hidden','true'); }
    function isOpen() { return root.classList.contains('is-open'); }
    function exec() { const c = filtered[active]; if (c && c.run) c.run(); }

    input.addEventListener('input', filter);
    list.addEventListener('mousemove', e => { const it = e.target.closest('.cmdk__item'); if (it && it.dataset.i!=null){ active = +it.dataset.i; render(); } });
    list.addEventListener('click', e => { const it = e.target.closest('.cmdk__item'); if (it && it.dataset.i!=null){ active = +it.dataset.i; exec(); } });
    root.addEventListener('click', e => { if (e.target === root) close(); });
    input.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') { e.preventDefault(); active = (active+1) % filtered.length; render(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); active = (active-1+filtered.length) % filtered.length; render(); }
      else if (e.key === 'Enter') { e.preventDefault(); exec(); }
    });

    $('#cmdkTrigger').addEventListener('click', open);
    return { open, close, isOpen };
  })();

  /* =============================================================
     TOASTS + COPY
     ============================================================= */
  function toast(msg, icon = 'ui-spark') {
    const host = $('#toasts');
    const t = document.createElement('div');
    t.className = 'toast'; t.innerHTML = `<svg class="ic"><use href="#${icon}"/></svg><span>${msg}</span>`;
    host.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateY(10px)'; t.style.transition='.4s'; setTimeout(() => t.remove(), 400); }, 2400);
  }
  function copyDiscord() {
    const done = () => toast(`Copied: <code>${DISCORD_NICK}</code>`, 'ui-copy');
    if (navigator.clipboard) navigator.clipboard.writeText(DISCORD_NICK).then(done).catch(fallback);
    else fallback();
    function fallback() { const i = document.createElement('input'); i.value = DISCORD_NICK; document.body.append(i); i.select(); try{document.execCommand('copy');}catch(e){} i.remove(); done(); }
  }
  $('#copyDiscord').addEventListener('click', copyDiscord);
  $('#discordBtn').setAttribute('href', DISCORD_URL);

  /* =============================================================
     CONTACT typing line
     ============================================================= */
  (function contactType() {
    const el = $('#contactCmd'); if (!el) return;
    const text = 'npx create-project --with arwi';
    if (REDUCED) { el.textContent = text; return; }
    const io = new IntersectionObserver(es => es.forEach(en => {
      if (!en.isIntersecting) return; io.disconnect();
      let i = 0; (function t(){ el.textContent = text.slice(0, i++); if (i <= text.length) setTimeout(t, 55); })();
    }), { threshold:.6 });
    io.observe($('#contact'));
  })();

  /* =============================================================
     WOLF MODE (easter egg) + KONAMI
     ============================================================= */
  let wolfOn = false;
  function WolfMode() {
    wolfOn = !wolfOn;
    Matrix.toggle(wolfOn);
    toast(wolfOn ? '🐺 Wolf mode ON — the pack runs at night.' : 'Wolf mode off.', 'ui-spark');
    if (wolfOn && !REDUCED) document.documentElement.animate(
      [{ filter:'hue-rotate(0deg)' },{ filter:'hue-rotate(-18deg)' },{ filter:'hue-rotate(0deg)' }],
      { duration: 900, easing:'ease-in-out' });
  }
  (function konami() {
    const seq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let idx = 0;
    addEventListener('keydown', e => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      idx = (k === seq[idx]) ? idx + 1 : (k === seq[0] ? 1 : 0);
      if (idx === seq.length) { idx = 0; WolfMode(); toast('🐺 KONAMI — secret unlocked!','ui-spark'); }
    });
  })();

  /* =============================================================
     GLOBAL KEYS
     ============================================================= */
  addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); Cmdk.isOpen() ? Cmdk.close() : Cmdk.open(); return; }
    if (e.key === 'Escape') {
      if (Cmdk.isOpen()) return Cmdk.close();
      if (Modal.isOpen()) return Modal.close();
    }
  });

  /* =============================================================
     MISC
     ============================================================= */
  $('#year').textContent = new Date().getFullYear();

  // kick off
  if (document.readyState === 'complete' || document.readyState === 'interactive') Boot.run();
  else addEventListener('DOMContentLoaded', Boot.run);

})();
