/**
 * MOTTA / INTERVALO — 4 Minigames de Precisão, Ritmo e Contemplação
 * Barbearia Motta — "O luxo de não ter pressa."
 */
(function (global) {
  'use strict';

  const PLAY_KEYS = ['equilibrio', 'frequencia', 'continuum', 'ondas'];

  const DESCRIPTIONS = {
    equilibrio: {
      name: 'Equilíbrio',
      subtitle: 'A beleza da precisão.',
      duration: '20–35 s',
      instruction: 'Deslize na pista ou use as teclas ← / → para inclinar a plataforma. Mantenha a esfera dourada estabilizada no centro por 2 segundos contínuos.',
      metric: 'Melhor tempo'
    },
    frequencia: {
      name: 'Frequência',
      subtitle: 'Encontre a sintonia.',
      duration: '15–30 s',
      instruction: 'Arraste o disco externo em círculo até os dois ponteiros coincidirem. Quando o anel brilhar, toque em FIXAR. Conclua 3 sincronias.',
      metric: 'Melhor tempo'
    },
    continuum: {
      name: 'Continuum',
      subtitle: 'Tudo encontra seu caminho.',
      duration: '25–45 s',
      instruction: 'Toque nas peças para girá-las 90°. Siga a luz âmbar desde a entrada INÍCIO até a saída FIM para completar o circuito.',
      metric: 'Menos movimentos'
    },
    ondas: {
      name: 'Ondas',
      subtitle: 'Cada instante importa.',
      duration: '15–40 s',
      instruction: 'Observe a onda concêntrica expandir. Toque na superfície no instante exato em que a onda passar sobre o anel dourado central. Acerte 3 vezes.',
      metric: 'Melhor precisão'
    }
  };

  const ARTS = {
    equilibrio: `<svg viewBox="0 0 200 150" aria-hidden="true"><defs><radialGradient id="art-sphere"><stop stop-color="#e1cba4"/><stop offset=".9" stop-color="#a68b60"/><stop offset="1" stop-color="#786346"/></radialGradient></defs><path d="M19 112 L180 98" stroke="#ad8d5f" stroke-width="4" stroke-linecap="round"/><path d="M96 110 L87 128 L107 128Z" fill="#6c756b"/><circle cx="108" cy="87" r="17" fill="url(#art-sphere)"/></svg>`,
    frequencia: `<svg viewBox="0 0 200 150" aria-hidden="true"><circle cx="100" cy="76" r="62" fill="none" stroke="#525744" stroke-width="2"/><circle cx="100" cy="76" r="49" fill="none" stroke="#ad8d5f" stroke-width="3"/><circle cx="100" cy="76" r="36" fill="none" stroke="#5a685b" stroke-width="2"/><path d="M100 14V35 M150 76H162 M100 40V53" stroke="#e4cb9b" stroke-width="4"/><circle cx="100" cy="76" r="4" fill="#d2af78"/></svg>`,
    continuum: `<svg viewBox="0 0 200 150" aria-hidden="true"><rect x="40" y="15" width="38" height="38" rx="3" fill="#24382d" stroke="#4d5f51"/><rect x="80" y="15" width="38" height="38" rx="3" fill="#24382d" stroke="#4d5f51"/><rect x="120" y="15" width="38" height="38" rx="3" fill="#24382d" stroke="#4d5f51"/><rect x="40" y="55" width="38" height="38" rx="3" fill="#24382d" stroke="#4d5f51"/><rect x="80" y="55" width="38" height="38" rx="3" fill="#24382d" stroke="#4d5f51"/><rect x="120" y="55" width="38" height="38" rx="3" fill="#24382d" stroke="#4d5f51"/><rect x="40" y="95" width="38" height="38" rx="3" fill="#24382d" stroke="#4d5f51"/><rect x="80" y="95" width="38" height="38" rx="3" fill="#24382d" stroke="#4d5f51"/><rect x="120" y="95" width="38" height="38" rx="3" fill="#24382d" stroke="#4d5f51"/><path d="M40 34H59Q78 34 78 54V74H99Q118 74 118 94V114H158" fill="none" stroke="#c4a575" stroke-width="3"/></svg>`,
    ondas: `<svg viewBox="0 0 200 150" aria-hidden="true"><circle cx="100" cy="75" r="13" stroke="#c4a575" fill="none" stroke-width="2"/><circle cx="100" cy="75" r="34" stroke="#9e8a67" fill="none" stroke-width="2"/><circle cx="100" cy="75" r="54" stroke="#4d5f51" fill="none" stroke-width="2"/><circle cx="100" cy="75" r="4" fill="#e5c89c"/></svg>`
  };

  let soundEnabled = true;
  let activeEngine = null;
  let audioCtx = null;

  function unlockAudio() {
    if (typeof window === 'undefined') return;
    try {
      const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
      if (!audioCtx) audioCtx = new AudioContextCtor();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      }
    } catch (e) {}
  }

  function getStorageKey(id) {
    return 'motta-play-best-' + id;
  }

  function readScore(id) {
    try {
      const val = localStorage.getItem(getStorageKey(id));
      return val ? JSON.parse(val) : null;
    } catch (e) {
      return null;
    }
  }

  function saveScore(id, value) {
    const prev = readScore(id);
    const improved = !prev || (id === 'ondas' ? value > prev.value : value < prev.value);
    if (improved) {
      try {
        localStorage.setItem(getStorageKey(id), JSON.stringify({ value, timestamp: Date.now() }));
      } catch (e) {}
    }
    return improved;
  }

  function formatScore(id, v) {
    if (v === null || v === undefined) return '';
    return id === 'ondas' ? `${v}%` : id === 'continuum' ? `${v} mov` : `${Number(v).toFixed(1)}s`;
  }

  function tone(freq = 440, duration = 0.07) {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      unlockAudio();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(Math.max(80, freq * 0.72), audioCtx.currentTime + duration);
      gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  }

  function vibrate(pattern = 10) {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate(pattern); } catch (e) {}
    }
  }

  function cleanup() {
    if (activeEngine && typeof activeEngine.stop === 'function') {
      try { activeEngine.stop(); } catch (e) {}
      activeEngine = null;
    }
  }

  /* ----------------- RENDER COLLECTION ----------------- */
  function renderCollectionHTML(gameId) {
    cleanup();
    if (gameId && PLAY_KEYS.includes(gameId)) {
      return renderGameShellHTML(gameId);
    }

    const scores = {};
    for (const key of PLAY_KEYS) {
      const s = readScore(key);
      scores[key] = s ? formatScore(key, s.value) : '';
    }

    return `
      <div class="play-wrapper">
        <header class="play-main-header">
          <div class="play-header-row">
            <a href="#/inicio" class="btn play-back-portal">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Voltar ao Início
            </a>
            <div class="play-brand-title">MOTTA <small>CLUB / INTERVALO</small></div>
            <div class="play-header-actions">
              <button class="sound" id="play-sound-toggle" aria-label="${soundEnabled ? 'Desativar som' : 'Ativar som'}">
                ${soundEnabled ? '♫ SOM ATIVO' : '♪ SOM DESLIGADO'}
              </button>
              <a href="play/" target="_blank" rel="noopener" class="btn play-expand-btn" title="Abrir jogo em tela cheia independente">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
                Tela Cheia
              </a>
            </div>
          </div>
        </header>

        <section class="hero play-hero">
          <span class="eyebrow" style="color:var(--gold);">UMA COLEÇÃO DE PEQUENAS EXPERIÊNCIAS</span>
          <h1>O luxo de<br/>não ter pressa.</h1>
          <p>Momentos de precisão, ritmo e contemplação. Uma pausa desenhada para quem sabe valorizar o próprio tempo enquanto aguarda seu atendimento no lounge.</p>
          <div class="play-hero-badges">
            <span>04 EXPERIÊNCIAS</span>
            <span>•</span>
            <span>15–45 SEGUNDOS</span>
            <span>•</span>
            <span>SEM PRESSA. SEM RUÍDO.</span>
          </div>
        </section>

        <div class="section-heading">
          <h2>ESCOLHA SEU INTERVALO</h2>
          <span>01 — 04</span>
        </div>

        <section class="game-grid" aria-label="Minigames">
          ${PLAY_KEYS.map((id, index) => {
            const desc = DESCRIPTIONS[id];
            const record = scores[id] ? `RECORDE · ${scores[id]}` : desc.subtitle;
            return `
              <button class="game-card" data-play-game="${id}" aria-label="Jogar ${desc.name}">
                <div class="card-art">${ARTS[id]}</div>
                <div class="card-info">
                  <span class="card-no">0${index + 1} / EXPERIÊNCIA</span>
                  <div class="card-title">${desc.name}<span class="card-arrow">↗</span></div>
                  <span class="card-sub">${record}</span>
                </div>
              </button>
            `;
          }).join('')}
        </section>

        <section class="club play-club-footer">
          <div>
            <b>SEU INTERVALO, DO SEU JEITO.</b>
            <p>Sem anúncios, sem pressão. Seu melhor resultado fica salvo neste dispositivo.</p>
          </div>
          <span class="tag">LOUNGE MOTTA · CONCEITO</span>
        </section>
      </div>
    `;
  }

  /* ----------------- RENDER GAME SHELL ----------------- */
  function renderGameShellHTML(id) {
    const desc = DESCRIPTIONS[id];
    const best = readScore(id);
    const indexNum = PLAY_KEYS.indexOf(id) + 1;

    return `
      <div class="play-wrapper play-layout">
        <div class="row between" style="align-items:center;margin-bottom:12px;">
          <button class="back" id="play-btn-collection">← VOLTAR À COLEÇÃO</button>
          <button class="sound" id="play-sound-toggle-shell">
            ${soundEnabled ? '♫ SOM ATIVO' : '♪ SOM DESLIGADO'}
          </button>
        </div>

        <div class="play-header">
          <span class="eyebrow" style="color:var(--gold);">MOTTA / INTERVALO · 0${indexNum}</span>
          <h1>${desc.name}</h1>
          <p>${desc.subtitle}</p>
        </div>

        <div class="status-bar">
          <span>${desc.duration} · UMA PAUSA</span>
          <span id="play-best-display">${best !== null ? `RECORDE: ${formatScore(id, best.value)}` : 'SEM RECORDE'}</span>
        </div>

        <div class="game-area" id="game-stage">
          <!-- Game Canvas or SVG mounted here -->
          <div class="overlay" id="play-overlay-ready">
            <span class="eyebrow" style="color:var(--gold);">PRONTO PARA COMEÇAR?</span>
            <h2>${id === 'frequencia' ? 'Encontre a sintonia.' : id === 'continuum' ? 'Acenda o caminho.' : 'O seu momento.'}</h2>
            <p>${desc.instruction}</p>
            <button class="primary" id="play-start-btn">COMEÇAR</button>
          </div>

          <div class="overlay is-hidden" id="play-overlay-done" style="display:none;">
            <span class="eyebrow" id="play-done-eyebrow" style="color:var(--gold);">EXPERIÊNCIA CONCLUÍDA</span>
            <h2 id="play-done-title">${id === 'frequencia' ? 'Sintonia perfeita.' : id === 'continuum' ? 'Circuito completo.' : 'Excelente pausa.'}</h2>
            <div class="result" id="play-done-score"></div>
            <p id="play-done-subtitle">Cada tentativa é uma nova possibilidade.</p>
            <div class="row" style="gap:10px;margin-top:10px;">
              <button class="primary" id="play-restart-btn">JOGAR NOVAMENTE</button>
              <button class="back" id="play-done-back-btn">VOLTAR À COLEÇÃO</button>
            </div>
          </div>
        </div>

        <div class="under-game">
          <p class="instruction">${desc.instruction}</p>
          <button class="secondary" id="play-quick-restart">REINICIAR ↻</button>
        </div>
        <p class="tip">Seu progresso local é guardado automaticamente. Sem penalidade por sair.</p>
      </div>
    `;
  }

  /* ----------------- GAME ENGINES ----------------- */

  // 1. EQUILÍBRIO
  function startEquilibrio(container, onFinish) {
    const canvas = document.createElement('canvas');
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    canvas.width = Math.round(600 * dpr);
    canvas.height = Math.round(350 * dpr);
    canvas.style.aspectRatio = '600 / 350';
    canvas.style.maxWidth = '100%';
    canvas.style.maxHeight = '100%';
    canvas.style.width = 'auto';
    canvas.style.height = 'auto';
    canvas.style.display = 'block';
    canvas.style.margin = 'auto';
    canvas.style.touchAction = 'none';
    canvas.setAttribute('aria-label', 'Incline a plataforma movendo o dedo, cursor ou setas horizontalmente');

    const progressLabel = document.createElement('div');
    progressLabel.style.cssText = 'position:absolute;top:20px;left:0;right:0;text-align:center;font-size:11px;color:#c4a575;letter-spacing:.2em;pointer-events:none;z-index:2;font-weight:600;';
    progressLabel.textContent = 'ESTABILIDADE · 0%';

    container.appendChild(canvas);
    container.appendChild(progressLabel);

    let tilt = 0;
    let keyTilt = 0;
    const physics = { x: -70, v: 0, hold: 0, started: performance.now(), last: performance.now(), done: false };
    let raf = 0;

    function handlePointer(e) {
      const r = canvas.getBoundingClientRect();
      if (r.width > 0) {
        tilt = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2.4));
      }
    }

    function handleKeyDown(e) {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        keyTilt = -1;
        tilt = keyTilt;
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        keyTilt = 1;
        tilt = keyTilt;
      }
    }

    function handleKeyUp(e) {
      if (['ArrowLeft', 'KeyA', 'ArrowRight', 'KeyD'].includes(e.code)) {
        keyTilt = 0;
        tilt = 0;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    canvas.addEventListener('pointerdown', (e) => {
      try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
      handlePointer(e);
    });
    canvas.addEventListener('pointermove', (e) => {
      if (e.buttons > 0) handlePointer(e);
    });

    const resetTilt = () => {
      if (keyTilt === 0) tilt = 0;
    };
    canvas.addEventListener('pointerup', resetTilt);
    canvas.addEventListener('pointercancel', resetTilt);
    window.addEventListener('pointerup', resetTilt);

    function tick(t) {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const w = 600, h = 350;
      const dt = Math.min((t - physics.last) / 1000, 0.033);
      physics.last = t;

      physics.v += (tilt * 320 - physics.x * 0.13) * dt;
      physics.v *= Math.pow(0.965, dt * 60);
      physics.x += physics.v * dt;
      physics.x = Math.max(-145, Math.min(145, physics.x));
      if (Math.abs(physics.x) >= 145) physics.v *= -0.35;

      const stable = Math.abs(physics.x) < 11 && Math.abs(physics.v) < 17;
      physics.hold = stable ? physics.hold + dt : Math.max(0, physics.hold - dt * 1.8);
      progressLabel.textContent = `ESTABILIDADE · ${Math.min(100, Math.round(physics.hold / 2 * 100))}%`;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      ctx.save();
      ctx.translate(w / 2, h / 2 + 26);
      ctx.rotate(tilt * 0.12);

      // Trilho metálico
      const track = ctx.createLinearGradient(-165, 0, 165, 0);
      track.addColorStop(0, '#7f6c4b');
      track.addColorStop(0.5, '#debf86');
      track.addColorStop(1, '#7f6c4b');
      ctx.strokeStyle = track;
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-167, 0);
      ctx.lineTo(167, 0);
      ctx.stroke();

      // Base do pivô
      ctx.fillStyle = '#637468';
      ctx.beginPath();
      ctx.moveTo(-12, 4);
      ctx.lineTo(12, 4);
      ctx.lineTo(0, 35);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = 'rgba(198,172,121,.35)';
      ctx.fillRect(-13, -8, 26, 6);

      // Esfera dourada com iluminação radial
      const bx = physics.x, by = -17;
      const grad = ctx.createRadialGradient(bx - 5, by - 7, 1, bx, by, 16);
      grad.addColorStop(0, '#f7e1b3');
      grad.addColorStop(0.55, '#c6a472');
      grad.addColorStop(1, '#765e3e');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(bx, by, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Dica inferior
      ctx.fillStyle = '#a3b0a3';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('DESLIZE OU USE AS SETAS PARA INCLINAR', w / 2, h - 26);

      // Arco de guia translúcido
      ctx.strokeStyle = 'rgba(196,165,117,0.18)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2 + 8, 42, 0, Math.PI * 2);
      ctx.stroke();

      // Arco de progresso central
      ctx.strokeStyle = '#c4a575';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2 + 8, 42, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.min(1, physics.hold / 2));
      ctx.stroke();

      ctx.restore();

      if (physics.hold >= 2 && !physics.done) {
        physics.done = true;
        tone(530);
        vibrate([12, 24, 18]);
        const score = Math.round((t - physics.started) / 100) / 10;
        onFinish(score);
        return;
      }

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);

    return {
      stop() {
        cancelAnimationFrame(raf);
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        window.removeEventListener('pointerup', resetTilt);
        canvas.remove();
        progressLabel.remove();
      }
    };
  }

  // 2. FREQUÊNCIA
  function startFrequencia(container, onFinish) {
    const DEG = 180 / Math.PI;
    const norm = (a) => ((a % 360) + 360) % 360;
    const diff = (a, b) => Math.abs((norm(a - b) + 180) % 360 - 180);
    const TARGET = 15;

    let angle = 110;
    let inner = 0;
    let hits = 0;
    let drag = false;
    let lastPointer = 0;
    let done = false;
    let started = performance.now();
    let last = started;
    let raf = 0;
    let feedbackTimer = null;
    let errorFeedbackActive = false;

    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'position:relative;width:100%;height:100%;display:flex;align-items:center;justify-content:center;';

    const statusEl = document.createElement('div');
    statusEl.className = 'frequency-status';
    statusEl.innerHTML = `<span class="frequency-led"></span><span class="frequency-text">GIRE PARA ENCONTRAR A SINTONIA</span>`;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 600 350');
    svg.style.cssText = 'width:100%;height:100%;touch-action:none;cursor:grab;';

    // Definições e ticks
    let ticksLines = '';
    for (let i = 0; i < 48; i++) {
      ticksLines += `<line x1="300" y1="58" x2="300" y2="${i % 4 === 0 ? 69 : 64}" transform="rotate(${i * 7.5} 300 172)" stroke="#7f8068" stroke-width="1"/>`;
    }

    svg.innerHTML = `
      <defs>
        <radialGradient id="ring-bg"><stop stop-color="#2b3830"/><stop offset="1" stop-color="#111a15"/></radialGradient>
        <filter id="frequency-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="6" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <circle cx="300" cy="172" r="136" fill="url(#ring-bg)" stroke="#35463b"/>
      <circle cx="300" cy="172" r="118" fill="none" stroke="#8d7655" stroke-width="2"/>
      ${ticksLines}
      <circle id="freq-target" cx="300" cy="172" r="87" fill="#16241c" stroke="#b99b67" stroke-width="3"/>
      <circle id="freq-halo" cx="300" cy="172" r="104" stroke="#d9bc82" stroke-width="1.5" fill="none" opacity=".78" class="frequency-halo" style="display:none;"/>
      <circle cx="300" cy="172" r="53" fill="#1a2720" stroke="#4b5f50"/>
      <line id="freq-outer-hand" x1="300" y1="49" x2="300" y2="87" stroke="#e5c58a" stroke-width="6" stroke-linecap="round" transform="rotate(110 300 172)"/>
      <line id="freq-inner-hand" x1="300" y1="84" x2="300" y2="119" stroke="#ddcfae" stroke-width="6" stroke-linecap="round" transform="rotate(0 300 172)"/>
      <circle cx="300" cy="172" r="5" fill="#c4a575"/>
      <text id="freq-hits-text" x="300" y="294" text-anchor="middle" font-size="10" fill="#a9b6a8" letter-spacing="2">0 / 3 SINCRONIAS</text>
    `;

    const dotsEl = document.createElement('div');
    dotsEl.className = 'dots';
    dotsEl.innerHTML = `<span class="dot"></span><span class="dot"></span><span class="dot"></span>`;

    const fixBtn = document.createElement('button');
    fixBtn.className = 'primary fix-button';
    fixBtn.textContent = 'FIXAR';

    wrapper.appendChild(dotsEl);
    wrapper.appendChild(statusEl);
    wrapper.appendChild(svg);
    wrapper.appendChild(fixBtn);
    container.appendChild(wrapper);

    const outerHand = svg.querySelector('#freq-outer-hand');
    const innerHand = svg.querySelector('#freq-inner-hand');
    const targetRing = svg.querySelector('#freq-target');
    const halo = svg.querySelector('#freq-halo');
    const hitsText = svg.querySelector('#freq-hits-text');
    const led = statusEl.querySelector('.frequency-led');
    const statusText = statusEl.querySelector('.frequency-text');

    function pointerAngle(e) {
      const ctm = svg.getScreenCTM();
      if (ctm) {
        const p = svg.createSVGPoint();
        p.x = e.clientX;
        p.y = e.clientY;
        const local = p.matrixTransform(ctm.inverse());
        return Math.atan2(local.y - 172, local.x - 300) * DEG;
      }
      return 0;
    }

    svg.addEventListener('pointerdown', (e) => {
      if (done) return;
      drag = true;
      lastPointer = pointerAngle(e);
      try { svg.setPointerCapture(e.pointerId); } catch (err) {}
    });

    svg.addEventListener('pointermove', (e) => {
      if (!drag || done) return;
      const current = pointerAngle(e);
      let delta = current - lastPointer;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;
      angle = norm(angle + delta);
      lastPointer = current;
      outerHand.setAttribute('transform', `rotate(${angle} 300 172)`);
      updateAlignment();
    });

    const stopDrag = () => { drag = false; };
    svg.addEventListener('pointerup', stopDrag);
    svg.addEventListener('pointercancel', stopDrag);
    window.addEventListener('pointerup', stopDrag);

    function updateAlignment() {
      const err = diff(angle, inner);
      const aligned = err <= TARGET;
      const near = err <= 35;

      led.className = `frequency-led ${aligned ? 'is-aligned' : near ? 'is-near' : ''}`;
      fixBtn.className = `primary fix-button ${aligned ? 'fix-button--ready' : ''}`;

      if (!errorFeedbackActive) {
        if (aligned) {
          targetRing.setAttribute('stroke', '#f2d69c');
          targetRing.setAttribute('stroke-width', '4');
          targetRing.setAttribute('filter', 'url(#frequency-glow)');
          halo.style.display = 'block';
          statusText.textContent = 'ALINHADO · TOQUE EM FIXAR';
        } else if (near) {
          targetRing.setAttribute('stroke', '#d2b681');
          targetRing.setAttribute('stroke-width', '3');
          targetRing.removeAttribute('filter');
          halo.style.display = 'none';
          statusText.textContent = 'QUASE · AJUSTE UM POUCO';
        } else {
          targetRing.setAttribute('stroke', '#b99b67');
          targetRing.setAttribute('stroke-width', '3');
          targetRing.removeAttribute('filter');
          halo.style.display = 'none';
          statusText.textContent = 'GIRE PARA ENCONTRAR A SINTONIA';
        }
      }
    }

    fixBtn.addEventListener('click', () => {
      if (done) return;
      const currentError = diff(angle, inner);
      if (feedbackTimer) clearTimeout(feedbackTimer);

      if (currentError <= TARGET) {
        hits++;
        hitsText.textContent = `${hits} / 3 SINCRONIAS`;
        dotsEl.children[hits - 1]?.classList.add('filled');
        vibrate(18);
        tone(450 + hits * 120);

        if (hits === 3) {
          done = true;
          statusText.textContent = 'TRÊS SINCRONIAS CONCLUÍDAS';
          const score = Math.round((performance.now() - started) / 100) / 10;
          setTimeout(() => onFinish(score), 400);
          return;
        } else {
          errorFeedbackActive = true;
          statusText.textContent = 'SINCRONIA CONFIRMADA';
          feedbackTimer = setTimeout(() => {
            errorFeedbackActive = false;
            updateAlignment();
          }, 600);
        }
      } else {
        errorFeedbackActive = true;
        statusText.textContent = 'FORA DA ZONA · APROXIME OS PONTEIROS';
        vibrate(5);
        feedbackTimer = setTimeout(() => {
          errorFeedbackActive = false;
          updateAlignment();
        }, 800);
      }
    });

    function tick(t) {
      const dt = Math.max(0, Math.min((t - last) / 1000, 0.05));
      last = t;
      inner = norm(inner + dt * (24 + hits * 10));
      innerHand.setAttribute('transform', `rotate(${inner} 300 172)`);
      if (!done) {
        updateAlignment();
        raf = requestAnimationFrame(tick);
      }
    }

    raf = requestAnimationFrame(tick);

    return {
      stop() {
        cancelAnimationFrame(raf);
        if (feedbackTimer) clearTimeout(feedbackTimer);
        window.removeEventListener('pointerup', stopDrag);
        wrapper.remove();
      }
    };
  }

  // 3. CONTINUUM
  function startContinuum(container, onFinish) {
    const rotate = (d, steps) => (d + steps) % 4;
    const path = { 4: [3, 1], 5: [3, 1], 6: [3, 2], 10: [0, 1], 11: [3, 1] };
    const seeded = (index) => ((index * 7 + 3) % 3 + 1);
    const initialTiles = Array.from({ length: 16 }, (_, i) => ({
      base: path[i] || ((i % 3 === 0) ? [0, 1] : [0, 2]),
      rotation: seeded(i)
    }));

    let tiles = initialTiles.map(t => ({ ...t }));
    let moves = 0;
    let done = false;
    let completeTimer = null;

    function tracePath(currentTiles) {
      let idx = 4, coming = 3;
      const lit = [], visited = new Set();
      for (let step = 0; step < 16; step++) {
        if (visited.has(idx)) return { lit, frontier: idx, solved: false };
        visited.add(idx);
        const exits = currentTiles[idx].base.map(d => rotate(d, currentTiles[idx].rotation));
        if (!exits.includes(coming)) return { lit, frontier: idx, solved: false };
        const out = exits.find(d => d !== coming);
        if (out === undefined) return { lit, frontier: idx, solved: false };
        lit.push(idx);
        if (idx === 11 && out === 1) return { lit, frontier: null, solved: true };
        const row = Math.floor(idx / 4), col = idx % 4;
        const nr = row + [-1, 0, 1, 0][out], nc = col + [0, 1, 0, -1][out];
        if (nr < 0 || nr >= 4 || nc < 0 || nc >= 4) return { lit, frontier: null, solved: false };
        idx = nr * 4 + nc;
        coming = (out + 2) % 4;
      }
      return { lit, frontier: idx, solved: false };
    }

    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'position:relative;width:100%;height:100%;display:flex;align-items:center;justify-content:center;flex-direction:column;';

    const movesEl = document.createElement('div');
    movesEl.className = 'continuum-moves';
    movesEl.textContent = 'MOVIMENTOS · 0';

    const cWrap = document.createElement('div');
    cWrap.className = 'continuum-wrap';

    const grid = document.createElement('div');
    grid.className = 'puzzle-grid';
    grid.setAttribute('role', 'group');
    grid.setAttribute('aria-label', 'Circuito de 16 peças; conecte a entrada à esquerda com a saída à direita');

    const inPort = document.createElement('span');
    inPort.className = 'continuum-port continuum-port--in';
    inPort.innerHTML = `<span class="continuum-port-dot"></span> <span>INÍCIO</span>`;

    const outPort = document.createElement('span');
    outPort.className = 'continuum-port continuum-port--out';
    outPort.innerHTML = `<span class="continuum-port-dot"></span> <span>FIM</span>`;

    const feedbackEl = document.createElement('div');
    feedbackEl.className = 'continuum-feedback';
    feedbackEl.textContent = 'COMECE PELA ENTRADA À ESQUERDA';

    cWrap.appendChild(grid);
    cWrap.appendChild(inPort);
    cWrap.appendChild(outPort);

    wrapper.appendChild(movesEl);
    wrapper.appendChild(cWrap);
    wrapper.appendChild(feedbackEl);
    container.appendChild(wrapper);

    function renderGrid() {
      const trace = tracePath(tiles);
      grid.innerHTML = '';

      if (trace.solved) {
        cWrap.classList.add('continuum--solved');
        outPort.classList.add('is-solved');
        feedbackEl.textContent = 'CAMINHO COMPLETO';
      } else {
        cWrap.classList.remove('continuum--solved');
        outPort.classList.remove('is-solved');
        feedbackEl.textContent = trace.lit.length === 0
          ? 'COMECE PELA ENTRADA À ESQUERDA'
          : `${trace.lit.length} ${trace.lit.length === 1 ? 'PEÇA CONECTADA' : 'PEÇAS CONECTADAS'} · SIGA A LUZ`;
      }

      tiles.forEach((tile, i) => {
        const lit = trace.lit.includes(i);
        const frontier = trace.frontier === i;
        const d = tile.base.map((direction, j) => `${j === 0 ? 'M' : 'L'} ${[35, 70, 35, 0][direction]} ${[0, 35, 70, 35][direction]}`).join(' ');

        const btn = document.createElement('button');
        btn.className = `tile ${lit ? 'tile--lit' : ''} ${frontier ? 'tile--frontier' : ''}`;
        btn.setAttribute('aria-label', `Girar peça ${i + 1}`);
        btn.disabled = done;

        btn.innerHTML = `
          <svg viewBox="0 0 70 70" aria-hidden="true">
            <g transform="rotate(${tile.rotation * 90} 35 35)">
              ${lit ? `<path d="${d}" stroke="#e3c590" stroke-width="11" fill="none" stroke-linecap="round" opacity=".38" class="continuum-glow"/>` : ''}
              <path d="${d}" stroke="${lit ? '#f1d39a' : '#c4a575'}" stroke-width="${lit ? 6 : 5}" fill="none" stroke-linecap="round"/>
              <circle cx="35" cy="35" r="4" fill="${lit ? '#fff0c1' : '#e3c590'}"/>
            </g>
          </svg>
        `;

        btn.addEventListener('click', () => {
          if (done) return;
          const prevTrace = tracePath(tiles);
          tiles[i].rotation = (tiles[i].rotation + 1) % 4;
          moves++;
          movesEl.textContent = `MOVIMENTOS · ${moves}`;

          const nextTrace = tracePath(tiles);
          vibrate(nextTrace.lit.length > prevTrace.lit.length ? 12 : 4);
          tone(nextTrace.lit.length > prevTrace.lit.length ? 420 : 260, 0.045);

          if (nextTrace.solved) {
            done = true;
            vibrate([12, 45, 20]);
            tone(650, 0.2);
            completeTimer = setTimeout(() => onFinish(moves), 850);
          }

          renderGrid();
        });

        grid.appendChild(btn);
      });
    }

    renderGrid();

    return {
      stop() {
        if (completeTimer) clearTimeout(completeTimer);
        wrapper.remove();
      }
    };
  }

  // 4. ONDAS
  function startOndas(container, onFinish) {
    let radius = 18;
    const scores = [];
    let done = false;
    let started = performance.now();
    let last = started;
    let raf = 0;

    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'position:relative;width:100%;height:100%;display:flex;align-items:center;justify-content:center;';

    const tapBtn = document.createElement('button');
    tapBtn.setAttribute('aria-label', 'Tocar para sincronizar a onda');
    tapBtn.style.cssText = 'position:absolute;inset:0;background:transparent;border:0;z-index:2;width:100%;height:100%;cursor:pointer;';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 600 350');
    svg.style.cssText = 'width:100%;height:100%;pointer-events:none;';

    svg.innerHTML = `
      <defs>
        <radialGradient id="waves-water"><stop stop-color="#284136"/><stop offset="1" stop-color="#111a16"/></radialGradient>
      </defs>
      <circle cx="300" cy="172" r="149" fill="url(#waves-water)"/>
      <circle cx="300" cy="172" r="96" fill="none" stroke="#c5a675" stroke-width="5" stroke-opacity=".6"/>
      <circle cx="300" cy="172" r="103" fill="none" stroke="#5f6a52" stroke-width="1" stroke-dasharray="2 9"/>
      <circle id="waves-current-ring" cx="300" cy="172" r="18" fill="none" stroke="#e9cf9c" stroke-width="2.5"/>
      <circle id="waves-echo-ring" cx="300" cy="172" r="0" fill="none" stroke="#987e55" stroke-width="1" stroke-opacity=".5"/>
      <circle cx="300" cy="172" r="5" fill="#d7b985"/>
      <text id="waves-indicator" x="300" y="296" text-anchor="middle" fill="#98a99c" font-size="10" letter-spacing="2">TOQUE NO INSTANTE CERTO</text>
    `;

    const dotsEl = document.createElement('div');
    dotsEl.className = 'dots';
    dotsEl.style.cssText = 'z-index:3;pointer-events:none;';
    dotsEl.innerHTML = `<span class="dot"></span><span class="dot"></span><span class="dot"></span>`;

    const hintEl = document.createElement('div');
    hintEl.className = 'ripple-button';
    hintEl.style.cssText = 'pointer-events:none;color:#c4a575;font-size:11px;letter-spacing:.16em;font-weight:600;';
    hintEl.textContent = 'TOQUE NA SUPERFÍCIE';

    wrapper.appendChild(tapBtn);
    wrapper.appendChild(svg);
    wrapper.appendChild(dotsEl);
    wrapper.appendChild(hintEl);
    container.appendChild(wrapper);

    const currentRing = svg.querySelector('#waves-current-ring');
    const echoRing = svg.querySelector('#waves-echo-ring');
    const indicator = svg.querySelector('#waves-indicator');

    tapBtn.addEventListener('click', () => {
      if (done) return;
      const error = Math.abs(radius - 96);
      if (error <= 14) {
        const accuracy = Math.round(100 * (1 - error / 23));
        scores.push(accuracy);
        dotsEl.children[scores.length - 1]?.classList.add('filled');
        indicator.textContent = 'RESSONÂNCIA CAPTURADA';
        vibrate(12);
        tone(390 + scores.length * 90, 0.1);
        radius = 18;

        if (scores.length >= 3) {
          done = true;
          const avg = Math.round(scores.reduce((s, v) => s + v, 0) / 3);
          setTimeout(() => onFinish(avg), 350);
        }
      } else {
        indicator.textContent = error > 14 ? 'ENCONTRE O ANEL DE LUZ' : '';
        vibrate(3);
      }
    });

    function tick(t) {
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      radius += dt * (64 + scores.length * 8);
      if (radius > 140) radius = 18;

      currentRing.setAttribute('r', radius);
      echoRing.setAttribute('r', Math.max(0, radius - 23));

      if (!done) raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);

    return {
      stop() {
        cancelAnimationFrame(raf);
        wrapper.remove();
      }
    };
  }

  /* ----------------- GAME LAUNCHER ----------------- */
  function launchGame(id) {
    cleanup();
    const view = document.getElementById('view');
    if (!view) return;

    view.innerHTML = renderGameShellHTML(id);

    const stage = document.getElementById('game-stage');
    const readyOverlay = document.getElementById('play-overlay-ready');
    const doneOverlay = document.getElementById('play-overlay-done');
    const startBtn = document.getElementById('play-start-btn');
    const restartBtn = document.getElementById('play-restart-btn');
    const quickRestart = document.getElementById('play-quick-restart');
    const backCollectionBtn = document.getElementById('play-btn-collection');
    const doneBackBtn = document.getElementById('play-done-back-btn');
    const soundToggle = document.getElementById('play-sound-toggle-shell');

    const handleSoundToggle = () => {
      unlockAudio();
      soundEnabled = !soundEnabled;
      const text = soundEnabled ? '♫ SOM ATIVO' : '♪ SOM DESLIGADO';
      soundToggle.textContent = text;
      if (soundEnabled) tone(480, 0.08);
    };
    soundToggle.addEventListener('click', handleSoundToggle);

    const goBack = () => {
      cleanup();
      if (location.hash.startsWith('#/play/')) {
        location.hash = '#/play';
      } else {
        initPlayView();
      }
    };
    backCollectionBtn.addEventListener('click', goBack);
    doneBackBtn.addEventListener('click', goBack);

    function handleFinish(value) {
      const improved = saveScore(id, value);
      tone(610, 0.22);
      vibrate([12, 30, 18]);

      const eyebrow = document.getElementById('play-done-eyebrow');
      const scoreDisplay = document.getElementById('play-done-score');
      const subtitle = document.getElementById('play-done-subtitle');
      const bestDisplay = document.getElementById('play-best-display');

      if (eyebrow) eyebrow.textContent = improved ? 'NOVO RECORDE' : 'EXPERIÊNCIA CONCLUÍDA';
      if (scoreDisplay) scoreDisplay.textContent = formatScore(id, value);
      if (subtitle) subtitle.textContent = improved ? 'Seu melhor registro até agora.' : 'Cada tentativa é uma nova possibilidade.';
      if (bestDisplay) bestDisplay.textContent = `RECORDE: ${formatScore(id, value)}`;

      if (doneOverlay) doneOverlay.style.display = 'flex';
    }

    function runEngine() {
      unlockAudio();
      cleanup();
      if (readyOverlay) readyOverlay.style.display = 'none';
      if (doneOverlay) doneOverlay.style.display = 'none';

      if (id === 'equilibrio') activeEngine = startEquilibrio(stage, handleFinish);
      else if (id === 'frequencia') activeEngine = startFrequencia(stage, handleFinish);
      else if (id === 'continuum') activeEngine = startContinuum(stage, handleFinish);
      else if (id === 'ondas') activeEngine = startOndas(stage, handleFinish);
    }

    startBtn.addEventListener('click', runEngine);
    restartBtn.addEventListener('click', runEngine);
    quickRestart.addEventListener('click', runEngine);
  }

  /* ----------------- INIT VIEW ----------------- */
  function initPlayView(gameId) {
    cleanup();
    const view = document.getElementById('view');
    if (!view) return;

    if (gameId && PLAY_KEYS.includes(gameId)) {
      launchGame(gameId);
      return;
    }

    view.innerHTML = renderCollectionHTML();

    const soundBtn = document.getElementById('play-sound-toggle');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        unlockAudio();
        soundEnabled = !soundEnabled;
        soundBtn.textContent = soundEnabled ? '♫ SOM ATIVO' : '♪ SOM DESLIGADO';
        soundBtn.setAttribute('aria-label', soundEnabled ? 'Desativar som' : 'Ativar som');
        if (soundEnabled) tone(480, 0.08);
      });
    }

    view.querySelectorAll('[data-play-game]').forEach(card => {
      card.addEventListener('click', () => {
        const targetId = card.getAttribute('data-play-game');
        unlockAudio();
        location.hash = '#/play/' + targetId;
      });
    });
  }

  // Export module
  global.MottaPlay = {
    renderHTML: renderCollectionHTML,
    init: initPlayView,
    launch: launchGame,
    cleanup: cleanup,
    unlockAudio: unlockAudio,
    getSoundEnabled: () => soundEnabled,
    setSoundEnabled: (val) => { soundEnabled = !!val; }
  };

})(typeof window !== 'undefined' ? window : this);
