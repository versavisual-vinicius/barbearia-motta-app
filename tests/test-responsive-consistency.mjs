import { spawn } from 'node:child_process';
import assert from 'node:assert';

const chromePath = '/Applications/Google Chrome Beta.app/Contents/MacOS/Google Chrome Beta';
const cdpPort = 9235;
const baseUrl = 'http://localhost:5180';

async function run() {
  console.log('Starting multi-viewport & state consistency validation...');
  const chrome = spawn(chromePath, [
    '--headless',
    '--disable-gpu',
    `--remote-debugging-port=${cdpPort}`,
    '--window-size=390,844',
    `${baseUrl}/#/inicio`
  ]);

  let targets = null;
  for (let i = 0; i < 25; i++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      const res = await fetch(`http://localhost:${cdpPort}/json`);
      targets = await res.json();
      if (targets && targets.length > 0) break;
    } catch (e) {}
  }

  assert.ok(targets && targets.length > 0, 'Chrome CDP target must be available');
  const target = targets.find(t => t.type === 'page');
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r));

  let msgId = 1;
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = msgId++;
    const handler = (evt) => {
      const msg = JSON.parse(evt.data.toString());
      if (msg.id === id) {
        ws.removeEventListener('message', handler);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });

  await send('Page.enable');
  await send('Runtime.enable');

  const setViewport = async (width, height, mobile = width < 768) => {
    await send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 2,
      mobile
    });
    await new Promise(r => setTimeout(r, 150));
  };

  const evaluate = async (expression) => {
    const res = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (res.exceptionDetails) {
      throw new Error(`Eval error: ${JSON.stringify(res.exceptionDetails)}`);
    }
    return res.result.value;
  };

  await new Promise(r => setTimeout(r, 900));

  const contrastHelperCode = `
    window.__contrastRatio = function(fgStr, bgHex) {
      const parseRgb = (s) => {
        const m = s.match(/\\d+(\\.\\d+)?/g);
        return m ? m.slice(0, 3).map(Number) : [0, 0, 0];
      };
      const hexToRgb = (h) => {
        const v = parseInt(h.replace('#', ''), 16);
        return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
      };
      const lum = ([r, g, b]) => {
        const a = [r, g, b].map(v => {
          v /= 255;
          return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
      };
      const l1 = lum(parseRgb(fgStr));
      const l2 = lum(hexToRgb(bgHex));
      return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    };
  `;
  await send('Page.enable');
  await send('Page.addScriptToEvaluateOnNewDocument', { source: contrastHelperCode });
  await evaluate(contrastHelperCode);

  const viewports = [
    [320, 640],
    [375, 812],
    [390, 844],
    [768, 1024],
    [1024, 768],
    [1440, 900],
    [667, 375] // reduced height / landscape
  ];

  console.log('\n--- 1. Lounge Card on Home (#/inicio) across all viewports ---');
  for (const [vw, vh] of viewports) {
    await setViewport(vw, vh);
    await evaluate('location.hash = "#/inicio"');
    await new Promise(r => setTimeout(r, 200));

    const loungeCheck = await evaluate(`(() => {
      const card = document.querySelector('.lounge-game-card');
      const eyebrow = card.querySelector('.lounge-game-copy .eyebrow');
      const title = card.querySelector('.lounge-game-copy h2');
      const body = card.querySelector('.lounge-game-copy p');
      const meta = card.querySelector('.lounge-game-meta');
      const er = eyebrow.getBoundingClientRect();
      const tr = title.getBoundingClientRect();
      const cr = card.getBoundingClientRect();
      const titleStyle = getComputedStyle(title);
      const lineHeightRatio = parseFloat(titleStyle.lineHeight) / parseFloat(titleStyle.fontSize);

      const cEyebrow = window.__contrastRatio(getComputedStyle(eyebrow).color, '#17241D');
      const cBody = window.__contrastRatio(getComputedStyle(body).color, '#0B1C14');
      const cMeta = window.__contrastRatio(getComputedStyle(meta).color, '#0B1C14');

      return {
        gapEyebrowTitle: tr.top - er.bottom,
        lineHeightRatio,
        cardRight: cr.right,
        alignSelf: getComputedStyle(card).alignSelf,
        previewCount: card.querySelectorAll('.lounge-game-mini').length,
        cEyebrow,
        cBody,
        cMeta
      };
    })()`);

    assert.ok(loungeCheck.gapEyebrowTitle >= 6, `[${vw}x${vh}] Eyebrow to title gap must be >= 6px, got ${loungeCheck.gapEyebrowTitle}`);
    assert.ok(loungeCheck.lineHeightRatio >= 1.2, `[${vw}x${vh}] Title line-height ratio must be >= 1.2, got ${loungeCheck.lineHeightRatio}`);
    assert.strictEqual(loungeCheck.previewCount, 4, `[${vw}x${vh}] Lounge card must display 4 mini game links`);
    assert.ok(loungeCheck.cEyebrow >= 4.5, `[${vw}x${vh}] Eyebrow contrast must be >= 4.5:1, got ${loungeCheck.cEyebrow.toFixed(2)}`);
    assert.ok(loungeCheck.cBody >= 4.5, `[${vw}x${vh}] Body contrast must be >= 4.5:1, got ${loungeCheck.cBody.toFixed(2)}`);
    assert.ok(loungeCheck.cMeta >= 4.5, `[${vw}x${vh}] Meta contrast must be >= 4.5:1, got ${loungeCheck.cMeta.toFixed(2)}`);
    if (vw >= 768) {
      assert.strictEqual(loungeCheck.alignSelf, 'start', `[${vw}x${vh}] Lounge card must have align-self: start on wide viewports`);
    }
  }
  console.log('✓ Home Lounge spacing, wide-screen layout, and >= 4.5:1 contrast verified across 320..1440px + landscape');

  console.log('\n--- 2. Login & Register Tabs (#/login) at 320px & Interaction ---');
  await setViewport(320, 640);
  await evaluate('location.hash = "#/login"');
  await new Promise(r => setTimeout(r, 250));

  const authCheck = await evaluate(`(() => {
    const loginTab = document.getElementById('tab-login');
    const regTab = document.getElementById('tab-register');
    const r1 = loginTab.getBoundingClientRect();
    const r2 = regTab.getBoundingClientRect();
    return {
      loginLeft: r1.left,
      loginRight: r1.right,
      loginHeight: r1.height,
      regLeft: r2.left,
      regRight: r2.right,
      regHeight: r2.height,
      regClipped: regTab.scrollWidth > regTab.clientWidth + 1
    };
  })()`);
  assert.ok(authCheck.loginLeft >= 0 && authCheck.regRight <= 320, `Auth tabs must fit within 320px viewport (regRight=${authCheck.regRight})`);
  assert.ok(!authCheck.regClipped, 'Register tab text must not be clipped at 320px');
  assert.ok(authCheck.loginHeight >= 44 && authCheck.regHeight >= 44, 'Auth tabs must have >= 44px touch targets');

  // Switch to Register tab and back to Login tab
  await evaluate('document.getElementById("tab-register").click()');
  const regActive = await evaluate(`({
    selected: document.getElementById('tab-register').getAttribute('aria-selected'),
    fieldsDisplay: getComputedStyle(document.getElementById('register-fields')).display,
    btnText: document.getElementById('auth-submit-btn').textContent
  })`);
  assert.strictEqual(regActive.selected, 'true');
  assert.strictEqual(regActive.fieldsDisplay, 'flex');
  assert.ok(regActive.btnText.includes('Cadastrar') || regActive.btnText.includes('Cadastro'));

  await evaluate('document.getElementById("tab-login").click()');
  const loginActive = await evaluate(`({
    selected: document.getElementById('tab-login').getAttribute('aria-selected'),
    fieldsDisplay: getComputedStyle(document.getElementById('register-fields')).display
  })`);
  assert.strictEqual(loginActive.selected, 'true');
  assert.strictEqual(loginActive.fieldsDisplay, 'none');
  console.log('✓ Login & Register tabs at 320px fit cleanly, >= 44px height, and toggle state works');

  console.log('\n--- 3. Service Category Filters (#/novo/1) at 320px ---');
  await setViewport(320, 640);
  await evaluate('location.hash = "#/novo/1"');
  await new Promise(r => setTimeout(r, 250));

  const filterCheck = await evaluate(`(() => {
    const chips = [...document.querySelectorAll('[data-scat]')];
    return chips.map(c => {
      const r = c.getBoundingClientRect();
      return {
        text: c.textContent.trim(),
        left: r.left,
        right: r.right,
        height: r.height,
        clipped: c.scrollWidth > c.clientWidth + 1
      };
    });
  })()`);
  assert.strictEqual(filterCheck.length, 3);
  for (const c of filterCheck) {
    assert.ok(c.left >= 0 && c.right <= 320, `Category chip "${c.text}" must be inside 320px viewport (right=${c.right})`);
    assert.ok(!c.clipped, `Category chip "${c.text}" must not be clipped`);
    assert.ok(c.height >= 44, `Category chip "${c.text}" must have >= 44px touch height`);
  }

  // Test filtering & preserving selected services
  await evaluate('document.querySelector(\'[data-scat="Tratamentos & Estética"]\').click()');
  await new Promise(r => setTimeout(r, 150));
  const filteredPressed = await evaluate('document.querySelector(\'[data-scat="Tratamentos & Estética"]\').getAttribute("aria-pressed")');
  assert.strictEqual(filteredPressed, 'true');
  await evaluate('document.querySelector(\'[data-scat="Todos"]\').click()');
  await new Promise(r => setTimeout(r, 150));
  console.log('✓ Service category filters at 320px are 100% visible, unclipped, and filter state works');

  console.log('\n--- 4. Professional Cards (#/novo/2) at 320px ---');
  await setViewport(320, 640);
  await evaluate('location.hash = "#/novo/2"');
  await new Promise(r => setTimeout(r, 250));

  const proCheck = await evaluate(`(() => {
    const cards = [...document.querySelectorAll('[data-pro]')];
    return cards.map(card => {
      const avatar = card.querySelector('.avatar').getBoundingClientRect();
      const rate = card.querySelector('.pro-card-rate').getBoundingClientRect();
      const name = card.querySelector('.h-section').textContent.trim();
      return {
        name,
        rateRightOfAvatar: rate.left > avatar.right,
        rateAlignedTop: rate.top < avatar.bottom,
        cardRight: card.getBoundingClientRect().right
      };
    });
  })()`);
  assert.strictEqual(proCheck.length, 5);
  for (const p of proCheck) {
    assert.ok(p.rateRightOfAvatar && p.rateAlignedTop, `Professional "${p.name}" rating badge must stay to the right of the avatar at 320px`);
    assert.ok(p.cardRight <= 320, `Professional card "${p.name}" must fit inside 320px viewport`);
  }
  console.log('✓ All 5 professional cards at 320px keep rating badge aligned on the right without wrapping under the photo');

  console.log('\n--- 5. Booking Date/Time State Consistency, Invalid State Guidance & Step Back Navigation ---');
  await evaluate('location.hash = "#/novo/3"');
  await new Promise(r => setTimeout(r, 250));

  const dtDefault = await evaluate(`(() => {
    const activeDayBtn = document.querySelector('[data-day][aria-pressed="true"]');
    const activeTimeBtn = document.querySelector('[data-time][aria-pressed="true"]');
    const summary = document.getElementById('booking-datetime-summary').textContent.trim();
    return {
      dayNum: activeDayBtn?.querySelector('b')?.textContent.trim(),
      time: activeTimeBtn?.textContent.trim(),
      summary
    };
  })()`);
  assert.ok(dtDefault.dayNum, 'An available day from the current 7-day range must be selected by default');
  assert.ok(!dtDefault.summary.includes('Dia 28'), `Summary must NEVER show hardcoded Dia 28, got "${dtDefault.summary}"`);
  assert.ok(dtDefault.summary.includes(`Dia ${dtDefault.dayNum}`), `Summary "${dtDefault.summary}" must match selected day "${dtDefault.dayNum}"`);
  assert.ok(dtDefault.summary.includes(dtDefault.time), `Summary "${dtDefault.summary}" must match selected time "${dtDefault.time}"`);

  // Test stale persisted state from a previous session (e.g., day: 28) -> must show guidance and block advancing
  await evaluate(`(() => {
    localStorage.setItem('motta_app_state_v1', JSON.stringify({
      isLoggedIn: false,
      user: null,
      appts: [],
      book: { cat: 'Todos', svc: ['corte'], pro: 'michel', day: 28, time: '15:00', agree: false }
    }));
    location.reload();
  })()`);
  await new Promise(r => setTimeout(r, 600));
  await evaluate('location.hash = "#/novo/3"');
  await new Promise(r => setTimeout(r, 250));

  const staleStateCheck = await evaluate(`(() => {
    const summary = document.getElementById('booking-datetime-summary').textContent.trim();
    const nextBtn = document.querySelector('a[href="#/novo/4"]');
    return {
      summary,
      ariaDisabled: nextBtn?.getAttribute('aria-disabled')
    };
  })()`);
  assert.strictEqual(staleStateCheck.ariaDisabled, 'true', 'Advancing must be blocked when persisted date (28) is not in the available day list');
  assert.ok(staleStateCheck.summary.includes('Selecione uma data'), `Guidance message must be shown for invalid date, got "${staleStateCheck.summary}"`);

  // Now select a valid day and time, then go back to Step 2, change professional, and verify Step 3 & Step 4
  await evaluate(`(() => {
    const validDayButtons = [...document.querySelectorAll('[data-day]:not([disabled])')];
    validDayButtons[1].click();
  })()`);
  await new Promise(r => setTimeout(r, 150));
  await evaluate(`(() => {
    const timeBtn = document.querySelector('[data-time="16:30"]');
    if (timeBtn) timeBtn.click();
  })()`);
  await new Promise(r => setTimeout(r, 150));

  // Go back to Step 2 and change professional to Maycon Angelo
  await evaluate('location.hash = "#/novo/2"');
  await new Promise(r => setTimeout(r, 200));
  await evaluate('document.querySelector(\'[data-pro="maycon"]\').click()');
  await new Promise(r => setTimeout(r, 150));

  // Proceed to Step 3 and Step 4
  await evaluate('location.hash = "#/novo/3"');
  await new Promise(r => setTimeout(r, 200));
  const step3Updated = await evaluate('document.getElementById("booking-datetime-summary").textContent.trim()');
  assert.ok(step3Updated.includes('16:30') && step3Updated.includes('Maycon Angelo'), `Step 3 summary must reflect new pro and time: "${step3Updated}"`);

  await evaluate('location.hash = "#/novo/4"');
  await new Promise(r => setTimeout(r, 200));
  const step4Text = await evaluate('document.getElementById("view").textContent');
  assert.ok(step4Text.includes('16:30') && step4Text.includes('Maycon Angelo'), 'Step 4 review must match selected day, 16:30, and Maycon Angelo');
  console.log('✓ Booking date/time state, stale session handling, blocking guidance, and back-navigation verified');

  console.log('\n--- 6. Bottom Fixed Nav Accessibility & Horizontal Overflow across all 6 widths + landscape ---');
  const routesToAudit = ['#/inicio', '#/login', '#/novo/1', '#/novo/2', '#/novo/3', '#/novo/4', '#/planos', '#/tabela', '#/play'];
  for (const [vw, vh] of viewports) {
    await setViewport(vw, vh);
    for (const r of routesToAudit) {
      await evaluate(`location.hash = "${r}"`);
      await new Promise(res => setTimeout(res, 150));
      const layoutAudit = await evaluate(`(() => {
        const docOverflow = document.documentElement.scrollWidth > window.innerWidth + 1;
        window.scrollTo(0, document.documentElement.scrollHeight);
        const navRect = document.querySelector('nav').getBoundingClientRect();
        const mainChildren = [...document.querySelectorAll('main#view > *')];
        const lastEl = mainChildren[mainChildren.length - 1];
        const lastRect = lastEl ? lastEl.getBoundingClientRect() : { bottom: 0 };
        return {
          docOverflow,
          lastBottom: lastRect.bottom,
          navTop: navRect.top
        };
      })()`);
      assert.ok(!layoutAudit.docOverflow, `[${vw}x${vh}] Route ${r} must not overflow horizontally`);
      if (layoutAudit.navTop > vh / 2) {
        assert.ok(layoutAudit.lastBottom <= layoutAudit.navTop + 4, `[${vw}x${vh}] Route ${r} bottom element (${layoutAudit.lastBottom}) must be scrollable above fixed bottom nav (${layoutAudit.navTop})`);
      } else {
        assert.ok(layoutAudit.lastBottom <= vh + 4, `[${vw}x${vh}] Route ${r} bottom element (${layoutAudit.lastBottom}) must be fully scrollable inside viewport (${vh})`);
      }
    }
  }
  console.log('✓ Zero horizontal overflow and full clearance above bottom fixed nav across all routes and viewports');

  ws.close();
  chrome.kill();
  console.log('\nALL RESPONSIVE & CONSISTENCY VALIDATIONS PASSED!');
  process.exit(0);
}

run().catch(err => {
  console.error('Validation failed:', err);
  process.exit(1);
});
