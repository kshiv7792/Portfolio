(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(pointer: coarse)').matches;

  /* ============ BOOT SCREEN ============ */
  const boot = document.getElementById('boot');
  const bootFill = document.getElementById('bootFill');
  const bootPct = document.getElementById('bootPct');
  let bp = 0;
  const bootInterval = setInterval(() => {
    bp += Math.random() * 18 + 8;
    if (bp >= 100) {
      bp = 100;
      clearInterval(bootInterval);
      setTimeout(() => boot.classList.add('hide'), 220);
    }
    bootFill.style.width = bp + '%';
    bootPct.textContent = Math.floor(bp) + '%';
  }, 90);
  if (reducedMotion) { boot.classList.add('hide'); clearInterval(bootInterval); }

  /* ============ CUSTOM CURSOR ============ */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  if (!isTouch) {
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;
    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      cursorDot.style.left = mx + 'px'; cursorDot.style.top = my + 'px';
    });
    function ringLoop(){
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      cursorRing.style.left = rx + 'px'; cursorRing.style.top = ry + 'px';
      requestAnimationFrame(ringLoop);
    }
    ringLoop();
    document.querySelectorAll('a, button, .proj-card, .skill-node, .jarvis-fab').forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
    });
  } else {
    cursorDot.style.display = 'none';
    cursorRing.style.display = 'none';
  }

  /* ============ SCROLL PROGRESS ============ */
  const scrollProgress = document.getElementById('scrollProgress');
  function updateScrollProgress(){
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    scrollProgress.style.width = (scrolled || 0) + '%';
  }
  document.addEventListener('scroll', () => requestAnimationFrame(updateScrollProgress), { passive: true });
  updateScrollProgress();

  /* ============ MAGNETIC BUTTONS ============ */
  if (!isTouch) {
    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.18}px, ${y * 0.35}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = 'translate(0,0)'; });
    });
  }

  /* ============ NAV MOBILE ============ */
  const navBurger = document.getElementById('navBurger');
  const navMobile = document.getElementById('navMobile');
  navBurger.addEventListener('click', () => navMobile.classList.toggle('open'));
  navMobile.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navMobile.classList.remove('open')));

  /* ============ NEURAL CANVAS BACKGROUND ============ */
  const canvas = document.getElementById('neuralCanvas');
  const ctx = canvas.getContext('2d');
  let W, H, nodes = [];
  const NODE_COUNT = window.innerWidth < 720 ? 34 : 68;
  let mouseX = -9999, mouseY = -9999;

  function resizeCanvas(){
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  function initNodes(){
    nodes = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.4 + 0.8
    }));
  }
  resizeCanvas(); initNodes();
  window.addEventListener('resize', () => { resizeCanvas(); initNodes(); });
  window.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
  window.addEventListener('mouseleave', () => { mouseX = -9999; mouseY = -9999; });

  const LINK_DIST = 130;
  let rafId;
  function drawNeural(){
    ctx.clearRect(0, 0, W, H);
    for (const n of nodes) {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
      const dx = mouseX - n.x, dy = mouseY - n.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 140) { n.x -= dx * 0.002; n.y -= dy * 0.002; }
    }
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < LINK_DIST) {
          const o = (1 - dist / LINK_DIST) * 0.18;
          ctx.strokeStyle = `rgba(139,124,246,${o})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    for (const n of nodes) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(62,201,172,0.55)';
      ctx.fill();
    }
    rafId = requestAnimationFrame(drawNeural);
  }
  if (!reducedMotion) {
    drawNeural();
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(rafId);
      else drawNeural();
    });
  } else {
    // static single frame
    for (const n of nodes) { ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI*2); ctx.fillStyle='rgba(62,201,172,0.4)'; ctx.fill(); }
  }

  /* ============ TERMINAL TYPEWRITER ============ */
  const termBody = document.getElementById('terminalBody');
  const termLines = [
    { p: '$ whoami', o: 'Shiv Kumar Paswan — AI Developer' },
    { p: '$ cat focus.json', o: '{ "genai": true, "ml": true, "forecasting": true }' },
    { p: '$ python deploy_model.py', o: 'Model deployed. Status: production ✓' },
    { p: '$ echo $LOCATION', o: 'Bangalore, India' }
  ];

  async function typeText(el, text, speed){
    for (let i = 0; i <= text.length; i++) {
      el.textContent = text.slice(0, i);
      await new Promise(r => setTimeout(r, speed));
    }
  }

  async function runTerminal(){
    if (reducedMotion) {
      termBody.innerHTML = termLines.map(l => `<div class="term-line"><span class="prompt">${l.p}</span><br><span class="out">${l.o}</span></div>`).join('');
      return;
    }
    termBody.innerHTML = '';
    while (true) {
      for (const line of termLines) {
        const wrap = document.createElement('div');
        wrap.className = 'term-line';
        const promptSpan = document.createElement('span');
        promptSpan.className = 'prompt';
        wrap.appendChild(promptSpan);
        termBody.appendChild(wrap);
        await typeText(promptSpan, line.p, 32);
        await new Promise(r => setTimeout(r, 220));
        const br = document.createElement('br'); wrap.appendChild(br);
        const outSpan = document.createElement('span');
        outSpan.className = 'out';
        wrap.appendChild(outSpan);
        await typeText(outSpan, line.o, 14);
        await new Promise(r => setTimeout(r, 900));
        // trim old lines
        while (termBody.children.length > 4) termBody.removeChild(termBody.firstChild);
      }
    }
  }
  runTerminal();

  /* ============ COUNT-UP STATS ============ */
  const counters = document.querySelectorAll('.rs-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        if (reducedMotion) { el.textContent = target + suffix; counterObserver.unobserve(el); return; }
        let cur = 0;
        const step = Math.max(1, Math.round(target / 40));
        const tick = () => {
          cur = Math.min(target, cur + step);
          el.textContent = cur + suffix;
          if (cur < target) requestAnimationFrame(tick);
        };
        tick();
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.6 });
  counters.forEach(c => counterObserver.observe(c));

  /* ============ REVEAL ON SCROLL ============ */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ============ ASK AI CHAT ============ */
  const QA = [
    { q: "What do you actually work on?", a: "I build applied AI systems — mostly Generative AI assistants and ML models for forecasting, classification and financial analysis. Right now that's SmartChat, an enterprise LLM assistant at Yokogawa." },
    { q: "What's your tech stack?", a: "Python and SQL as the core, ML frameworks for classical and time-series models, PySpark for big data, and Azure / AWS / GCP for deployment — plus Power BI and Tableau for the reporting side." },
    { q: "Tell me about SmartChat.", a: "SmartChat is an enterprise LLM assistant I've been building at Yokogawa. It uses retrieval-augmented generation over Azure Cognitive Search, so answers stay grounded in the actual engineering documentation instead of the model guessing." },
    { q: "What's a project you're proud of?", a: "The financial ML work at TechPay.AI — the models I shipped there improved financial data analysis accuracy by about 30%, which directly changed how the team made decisions." },
    { q: "How can I reach you?", a: "Easiest is email — kshiv7792@gmail.com — or the phone number in the contact section below. Both are one click away." }
  ];
  const askChat = document.getElementById('askChat');
  const askChips = document.getElementById('askChips');

  QA.forEach((item, idx) => {
    const b = document.createElement('button');
    b.textContent = item.q;
    b.dataset.idx = idx;
    b.addEventListener('click', () => askQuestion(idx, b));
    askChips.appendChild(b);
  });

  async function askQuestion(idx, btn){
    const chipButtons = askChips.querySelectorAll('button');
    chipButtons.forEach(c => c.disabled = true);

    const userRow = document.createElement('div');
    userRow.className = 'chat-row user';
    userRow.innerHTML = `<div class="chat-bubble">${QA[idx].q}</div>`;
    askChat.appendChild(userRow);
    askChat.scrollTop = askChat.scrollHeight;

    await new Promise(r => setTimeout(r, 300));

    const typingRow = document.createElement('div');
    typingRow.className = 'chat-row bot';
    typingRow.innerHTML = `<div class="chat-bubble"><span class="chat-typing"><span></span><span></span><span></span></span></div>`;
    askChat.appendChild(typingRow);
    askChat.scrollTop = askChat.scrollHeight;

    await new Promise(r => setTimeout(r, 700 + Math.random() * 400));
    typingRow.remove();

    const botRow = document.createElement('div');
    botRow.className = 'chat-row bot';
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    botRow.appendChild(bubble);
    askChat.appendChild(botRow);

    if (reducedMotion) {
      bubble.textContent = QA[idx].a;
    } else {
      const text = QA[idx].a;
      for (let i = 0; i <= text.length; i += 2) {
        bubble.textContent = text.slice(0, i);
        askChat.scrollTop = askChat.scrollHeight;
        await new Promise(r => setTimeout(r, 8));
      }
      bubble.textContent = text;
    }
    askChat.scrollTop = askChat.scrollHeight;
    chipButtons.forEach(c => c.disabled = false);
  }

  /* ============ SKILL GRAPH ============ */
  const skillData = [
    { id: 'lang', label: 'Languages', tags: ['Python', 'R', 'SQL', 'C++', 'Advanced Excel'] },
    { id: 'ml', label: 'Machine Learning', tags: ['GenAI', 'NLP', 'Clustering', 'Regression', 'Classification', 'Time Series'] },
    { id: 'cloud', label: 'Cloud & Infra', tags: ['AWS', 'GCP', 'Azure', 'Docker', 'Kubernetes', 'REST APIs'] },
    { id: 'stats', label: 'Fundamentals', tags: ['Hypothesis Testing', 'Sampling', 'EDA', 'Correlation & Causation'] },
    { id: 'bigdata', label: 'Big Data', tags: ['PySpark', 'Azure Databricks', 'AWS', 'GCP'] },
    { id: 'tools', label: 'Version Control', tags: ['Git', 'VS Code', 'PyCharm', 'Jenkins', 'CircleCI'] }
  ];
  const svg = document.getElementById('skillGraph');
  const skillPanel = document.getElementById('skillPanel');
  const cx = 350, cy = 230, radius = 165;
  const NS = 'http://www.w3.org/2000/svg';

  function makeEl(tag, attrs){
    const el = document.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    return el;
  }

  // edges first (so nodes render above)
  const edgeEls = [];
  skillData.forEach((s, i) => {
    const angle = (i / skillData.length) * Math.PI * 2 - Math.PI / 2;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    s._x = x; s._y = y;
    const edge = makeEl('line', { x1: cx, y1: cy, x2: x, y2: y, class: 'skill-edge', 'data-id': s.id });
    svg.appendChild(edge);
    edgeEls.push(edge);
  });

  // core node
  const coreG = makeEl('g', { class: 'skill-core' });
  coreG.appendChild(makeEl('circle', { cx, cy, r: 34 }));
  const coreText = makeEl('text', { x: cx, y: cy + 4, 'text-anchor': 'middle' });
  coreText.textContent = 'core';
  coreG.appendChild(coreText);
  svg.appendChild(coreG);

  function selectSkill(id){
    document.querySelectorAll('.skill-node').forEach(n => n.classList.toggle('active', n.dataset.id === id));
    edgeEls.forEach(e => e.classList.toggle('active', e.dataset.id === id));
    const s = skillData.find(s => s.id === id);
    if (s) {
      skillPanel.querySelector('.skill-panel-title').textContent = s.label;
      skillPanel.querySelector('.skill-panel-tags').innerHTML = s.tags.map(t => `<span>${t}</span>`).join('');
    }
  }

  skillData.forEach((s) => {
    const g = makeEl('g', { class: 'skill-node', 'data-id': s.id });
    g.appendChild(makeEl('circle', { cx: s._x, cy: s._y, r: 22 }));
    const labelY = s._y + (s._y > cy ? 38 : -30);
    const text = makeEl('text', { x: s._x, y: labelY, 'text-anchor': 'middle' });
    text.textContent = s.label;
    g.appendChild(text);
    g.addEventListener('mouseenter', () => { if (!isTouch) selectSkill(s.id); });
    g.addEventListener('click', () => selectSkill(s.id));
    svg.appendChild(g);
  });
  selectSkill(skillData[0].id);

  /* ============ TIMELINE SCROLL FILL + REVEAL ============ */
  const timeline = document.getElementById('timeline');
  const tlLineFill = document.getElementById('tlLineFill');
  const tlItems = document.querySelectorAll('.tl-item');

  const tlItemObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('in-view'); });
  }, { threshold: 0.4 });
  tlItems.forEach(item => tlItemObserver.observe(item));

  function updateTimelineFill(){
    const rect = timeline.getBoundingClientRect();
    const vh = window.innerHeight;
    const total = rect.height;
    const visibleTop = Math.min(Math.max(vh * 0.5 - rect.top, 0), total);
    const pct = total > 0 ? (visibleTop / total) * 100 : 0;
    tlLineFill.style.height = pct + '%';
  }
  document.addEventListener('scroll', () => requestAnimationFrame(updateTimelineFill), { passive: true });
  updateTimelineFill();

  /* ============ PROJECT FILTERS ============ */
  const filterBtns = document.querySelectorAll('#projFilters .chip');
  const projCards = document.querySelectorAll('.proj-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      projCards.forEach(card => {
        const tags = card.dataset.tags.split(' ');
        const show = f === 'all' || tags.includes(f);
        card.classList.toggle('hidden', !show);
      });
    });
  });

  /* ============ PROJECT EXPAND ============ */
  document.querySelectorAll('.proj-expand').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.proj-card').classList.toggle('open');
    });
  });

  /* ============ COPY TO CLIPBOARD ============ */
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const val = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(val);
      } catch (e) {
        const ta = document.createElement('textarea');
        ta.value = val; document.body.appendChild(ta); ta.select();
        document.execCommand('copy'); ta.remove();
      }
      btn.classList.add('copied');
      setTimeout(() => btn.classList.remove('copied'), 1800);
    });
  });

  /* ============ JARVIS FLOATING WIDGET ============ */
  const jarvisWidget = document.querySelector('.jarvis-widget');
  const jarvisFab = document.getElementById('jarvisFab');
  const jarvisClose = document.getElementById('jarvisClose');
  const jarvisTooltip = document.getElementById('jarvisTooltip');
  const jarvisPanel = document.getElementById('jarvisPanel');

  function openJarvis(){
    jarvisWidget.classList.add('open');
    jarvisTooltip.classList.remove('show');
    askChat.scrollTop = askChat.scrollHeight;
  }
  function closeJarvis(){ jarvisWidget.classList.remove('open'); }
  function toggleJarvis(){ jarvisWidget.classList.contains('open') ? closeJarvis() : openJarvis(); }

  jarvisFab.addEventListener('click', (e) => { e.stopPropagation(); toggleJarvis(); });
  jarvisClose.addEventListener('click', (e) => { e.stopPropagation(); closeJarvis(); });
  jarvisTooltip.addEventListener('click', (e) => { e.stopPropagation(); openJarvis(); });

  document.querySelectorAll('.js-open-jarvis').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      navMobile.classList.remove('open');
      openJarvis();
    });
  });

  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeJarvis(); });
  document.addEventListener('click', (e) => {
    if (jarvisWidget.classList.contains('open') && !jarvisWidget.contains(e.target)) closeJarvis();
  });
  jarvisPanel.addEventListener('click', (e) => e.stopPropagation());

  // first-time tooltip nudge
  if (!reducedMotion) {
    setTimeout(() => {
      if (!jarvisWidget.classList.contains('open')) jarvisTooltip.classList.add('show');
      setTimeout(() => jarvisTooltip.classList.remove('show'), 5000);
    }, 2600);
  }

  /* ============ FOOTER YEAR ============ */
  document.getElementById('year').textContent = new Date().getFullYear();
})();
