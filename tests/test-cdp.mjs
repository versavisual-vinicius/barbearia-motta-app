const WS = globalThis.WebSocket;

async function run() {
  const port = process.env.CDP_PORT || 9225;
  console.log(`Fetching Chrome DevTools target on port ${port}...`);
  const res = await fetch(`http://localhost:${port}/json`);
  const targets = await res.json();
  const pageTarget = targets.find(t => t.type === 'page' && t.url.includes('5180'));
  if (!pageTarget) {
    console.error('Page target not found:', targets);
    process.exit(1);
  }

  console.log('Connecting to DevTools WebSocket:', pageTarget.webSocketDebuggerUrl);
  const ws = new WS(pageTarget.webSocketDebuggerUrl);

  let id = 1;
  const pending = new Map();
  const consoleMessages = [];
  const networkErrors = [];

  ws.addEventListener('open', () => {
    console.log('Connected to Chrome DevTools Protocol!');
  });

  ws.addEventListener('message', (event) => {
    const msg = JSON.parse(event.data.toString());
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(msg.error);
      else resolve(msg.result);
    }

    if (msg.method === 'Runtime.consoleAPICalled') {
      const text = msg.params.args.map(a => a.value || a.description).join(' ');
      consoleMessages.push({ type: msg.params.type, text });
    }
    if (msg.method === 'Network.responseReceived') {
      const { response } = msg.params;
      if (response.status >= 400) {
        networkErrors.push({ url: response.url, status: response.status });
      }
    }
  });

  await new Promise(r => ws.addEventListener('open', r));

  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const msgId = id++;
    pending.set(msgId, { resolve, reject });
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });

  // Enable DevTools domains
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Network.enable');

  // Set mobile viewport (390 x 844 - iPhone 14 / Figma frame)
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });

  const evaluate = async (expr) => {
    const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
    if (r.exceptionDetails) {
      throw new Error(r.exceptionDetails.exception?.description || 'Eval error');
    }
    return r.result.value;
  };

  const captureScreenshot = async (name) => {
    const r = await send('Page.captureScreenshot', { format: 'png' });
    const buf = Buffer.from(r.data, 'base64');
    const path = `/Users/viniciuscunha/3_DEV/MOTTA ULTIMA TENTATIVA/app/assets/screenshots/${name}.png`;
    import('fs').then(fs => {
      fs.mkdirSync('/Users/viniciuscunha/3_DEV/MOTTA ULTIMA TENTATIVA/app/assets/screenshots', { recursive: true });
      fs.writeFileSync(path, buf);
    });
    console.log(`📸 Screenshot capturado: ${name}.png`);
  };

  const results = [];

  // TEST 1: Home Page (#/inicio)
  console.log('\n--- TESTE 1: Home Page (#/inicio) ---');
  await evaluate('location.hash = "#/inicio"');
  await new Promise(r => setTimeout(r, 600));

  const homeTitle = await evaluate('document.title');
  const homeLogos = await evaluate(`({
    hasDarkSymbol: !!document.querySelector('img[src*="motta-symbol-dark.png"]'),
    hasClubMotta: !!document.querySelector('img[src*="club-motta-transparent.png"]'),
    hasGoldSymbol: !!document.querySelector('img[src*="motta-symbol-gold.png"]'),
    hasWhatsApp: !!document.querySelector('a[href*="wa.me/5522998389803"]'),
    hasPioneira: document.body.textContent.includes('Pioneira em Macaé') || document.body.textContent.includes('Pioneira em Assinatura'),
    hasExigentes: document.body.textContent.includes('homens exigentes')
  })`);
  console.log('Title:', homeTitle);
  console.log('Home Data:', homeLogos);
  results.push({ test: 'Home Page & WhatsApp Oficial (22) 99838-9803', ok: homeLogos.hasDarkSymbol && homeLogos.hasClubMotta && homeLogos.hasWhatsApp && homeLogos.hasExigentes });
  await captureScreenshot('01-home-inicio');

  // TEST 2: Tabela de Preços (#/tabela)
  console.log('\n--- TESTE 2: Tabela Oficial Cashbarber (#/tabela) ---');
  await evaluate('location.hash = "#/tabela"');
  await new Promise(r => setTimeout(r, 600));

  const tableData = await evaluate(`({
    title: document.title,
    hasTable: !!document.querySelector('.table-wrapper table'),
    rowCount: document.querySelectorAll('.table-wrapper tbody tr').length,
    firstService: document.querySelector('.table-wrapper tbody tr:first-child td')?.textContent,
    firstPrice: document.querySelector('.table-wrapper tbody tr:first-child td:last-child')?.textContent,
    lastService: document.querySelector('.table-wrapper tbody tr:last-child td')?.textContent,
    lastPrice: document.querySelector('.table-wrapper tbody tr:last-child td:last-child')?.textContent
  })`);
  console.log('Tabela Data:', tableData);
  results.push({ test: 'Tabela Oficial (20 serviços)', ok: tableData.rowCount === 20 && tableData.hasTable });
  await captureScreenshot('02-tabela-precos');

  // TEST 3: Agendamento Etapa 1 - Serviços e Categorias (#/novo/1)
  console.log('\n--- TESTE 3: Agendamento Etapa 1 - Serviços & Categorias (#/novo/1) ---');
  await evaluate('location.hash = "#/novo/1"');
  await new Promise(r => setTimeout(r, 600));

  const svcData = await evaluate(`({
    categoryChips: Array.from(document.querySelectorAll('.chips button.chip')).map(c => c.textContent),
    renderedCards: document.querySelectorAll('button[data-svc]').length,
    hasVisagismo: !!document.querySelector('button[data-svc="visagismo_combo"]'),
    hasSelagem: !!document.querySelector('button[data-svc="selagem"]'),
    hasKids: !!document.querySelector('button[data-svc="corte_kids"]'),
    footerTotal: document.querySelector('.col.gap8 b')?.textContent
  })`);
  console.log('Serviços na Etapa 1:', svcData);
  results.push({ test: 'Etapa 1 Serviços & Filtros', ok: svcData.renderedCards === 20 && svcData.hasVisagismo });

  // Testar clique em filtro de categoria: "Visagismo"
  await evaluate('document.querySelector(\'button[data-scat="Visagismo"]\')?.click()');
  await new Promise(r => setTimeout(r, 300));
  const visagismoCards = await evaluate('document.querySelectorAll(\'button[data-svc]\').length');
  console.log('Cards visíveis após filtrar por Visagismo:', visagismoCards);
  results.push({ test: 'Filtro por Categoria (Visagismo = 4)', ok: visagismoCards === 4 });
  await captureScreenshot('03-novo-agendamento-servicos');

  // Resetar para Todos
  await evaluate('document.querySelector(\'button[data-scat="Todos"]\')?.click()');
  await new Promise(r => setTimeout(r, 300));

  // TEST 4: Planos (#/planos)
  console.log('\n--- TESTE 4: Planos & Badges de Marca (#/planos) ---');
  await evaluate('location.hash = "#/planos"');
  await new Promise(r => setTimeout(r, 600));

  const planosData = await evaluate(`({
    planCount: document.querySelectorAll('article.card').length,
    hasClubBlackLogo: !!document.querySelector('img[src*="club-black-transparent.png"]'),
    hasGoldLogo: !!document.querySelector('img[src*="motta-symbol-green.png"]'),
    blackCards: document.querySelectorAll('.card.dark').length
  })`);
  console.log('Planos Data:', planosData);
  results.push({ test: 'Planos & Branding Black/Gold', ok: planosData.hasClubBlackLogo && planosData.hasGoldLogo });
  await captureScreenshot('04-planos');

  // TEST 5: Boas-Vindas (#/boas_vindas)
  console.log('\n--- TESTE 5: Boas-Vindas (#/boas_vindas) ---');
  await evaluate('location.hash = "#/boas_vindas"');
  await new Promise(r => setTimeout(r, 600));
  const bvData = await evaluate(`({
    title: document.title,
    hasSymbol: !!document.querySelector('img[src*="motta-symbol-green.png"]'),
    hasPilares: !!document.querySelector('.card'),
    hasWhatsApp: !!document.querySelector('a[href*="wa.me/5522998389803"]'),
    hasEndereco: document.body.textContent.includes('Carlos Augusto T. Garcia, 2040'),
    hasPilaresConceito: document.body.textContent.includes('Modelo por Assinatura') && document.body.textContent.includes('homens exigentes')
  })`);
  console.log('Boas-vindas Data:', bvData);
  results.push({ test: 'Tela Boas-Vindas & Pilares do Clube MOTTA', ok: bvData.hasSymbol && bvData.hasWhatsApp && bvData.hasPilaresConceito && bvData.hasEndereco });
  await captureScreenshot('05-boas-vindas');

  // TEST 6: Login (#/login)
  console.log('\n--- TESTE 6: Login (#/login) ---');
  await evaluate('location.hash = "#/login"');
  await new Promise(r => setTimeout(r, 600));
  const loginData = await evaluate(`({
    hasLogo: !!document.querySelector('img[src*="club-motta-transparent.png"]'),
    hasForm: !!document.querySelector('#auth-form')
  })`);
  console.log('Login Data:', loginData);
  results.push({ test: 'Tela Login', ok: loginData.hasLogo });
  await captureScreenshot('06-login');

  // TEST 7: Voucher Digital com Envio no WhatsApp (Etapa 5)
  console.log('\n--- TESTE 7: Voucher Digital & Envio WhatsApp (#/novo/4 -> #/novo/5) ---');
  await evaluate('location.hash = "#/novo/4"');
  await new Promise(r => setTimeout(r, 500));
  // Marcar checkbox de termos e clicar em confirmar
  await evaluate(`(() => {
    const chk = document.querySelector('#agree');
    if (chk) chk.checked = true;
    document.querySelector('#confirm-book')?.click();
  })()`);
  await new Promise(r => setTimeout(r, 600));

  const voucherData = await evaluate(`({
    hash: location.hash,
    hasQrCode: !!document.querySelector('svg rect[fill="#071E13"]'),
    hasVoucherCode: document.body.textContent.includes('#MOTTA-2026-8849'),
    hasWhatsAppSendBtn: !!document.querySelector('a[href*="wa.me/5522998389803"][href*="MOTTA-2026-8849"]')
  })`);
  console.log('Voucher Data:', voucherData);
  results.push({ test: 'Voucher Digital & Botão WhatsApp (#/novo/5)', ok: voucherData.hasQrCode && voucherData.hasWhatsAppSendBtn });
  await captureScreenshot('07-voucher-whatsapp');

  // TEST 8: PWA & Manifest Check
  console.log('\n--- TESTE 8: PWA & Manifest Check ---');
  const pwaData = await evaluate(`({
    hasManifest: !!document.querySelector('link[rel="manifest"]'),
    hasAppleTouchIcon: !!document.querySelector('link[rel="apple-touch-icon"]'),
    hasThemeColor: !!document.querySelector('meta[name="theme-color"]')
  })`);
  console.log('PWA Data:', pwaData);
  results.push({ test: 'PWA Manifest & Apple Touch Icon', ok: pwaData.hasManifest && pwaData.hasAppleTouchIcon && pwaData.hasThemeColor });

  console.log('\n=========================================');
  console.log('RELATÓRIO DE AUDITORIA CHROME DEVTOOLS:');
  console.log('Erros de console:', consoleMessages.filter(m => m.type === 'error').length);
  console.log('Erros de rede (4xx/5xx):', networkErrors.length);
  results.forEach(r => console.log(`- ${r.test}: ${r.ok ? '✅ APROVADO' : '❌ FALHOU'}`));
  console.log('=========================================\n');

  ws.close();
}

run().catch(console.error);
