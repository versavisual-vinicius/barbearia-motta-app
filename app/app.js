"use strict";
const $ = (s) => document.querySelector(s);
const view = $("#view");
const toast = $("#toast");
let toastTimer;
const showToast = (msg) => {
	toast.textContent = msg;
	if (
		typeof toast.showPopover === "function" &&
		!toast.matches(":popover-open")
	)
		toast.showPopover();
	toast.classList.add("show");
	clearTimeout(toastTimer);
	toastTimer = setTimeout(() => {
		toast.classList.remove("show");
		if (
			typeof toast.hidePopover === "function" &&
			toast.matches(":popover-open")
		)
			toast.hidePopover();
	}, 2500);
};

const escapeHtml = (s) => String(s ?? "").replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
	style: "currency",
	currency: "BRL",
});
const formatCurrency = (val) => {
	if (typeof val === "string") return val;
	return currencyFormatter.format(val);
};

const now = new Date();
const formatDynamicDate = (daysAhead) => {
	const d = new Date(now);
	d.setDate(d.getDate() + daysAhead);
	return {
		day: new Intl.DateTimeFormat("pt-BR", { day: "2-digit" }).format(d),
		mon: new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(d).replace(".", ""),
		weekday: new Intl.DateTimeFormat("pt-BR", { weekday: "long" }).format(d),
		full: new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long" }).format(d),
		shortDate: new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit" }).format(d),
	};
};

const nextAppt = formatDynamicDate(3);
const renewalDate = formatDynamicDate(25);

const header = (kicker, sub, title) => `
  <header class="col gap4">
    <div class="row"><span class="eyebrow">${kicker}</span><span class="dot"></span><span class="legend">${sub}</span></div>
    <h1 class="h-page">${title}</h1>
  </header>`;

const tabs = (items, active, attr) => `
  <div class="chips chips-wrap" role="tablist" aria-label="Filtro de opções">${items
		.map(
			([id, label]) =>
				`<button class="chip ${id === active ? "on" : ""}" role="tab" aria-selected="${id === active}" tabindex="${id === active ? "0" : "-1"}" id="tab-${id}" aria-controls="panel-${id}" data-${attr}="${id}">${escapeHtml(label)}</button>`,
		)
		.join("")}</div>`;

/* ---------- dados ilustrativos ---------- */
const partners = [
	{
		badge: "RN",
		name: "Red Nek Grooming",
		desc: "Pomadas e óleos de alta performance",
		off: "5% OFF",
		img: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80",
		over: "Apresente seu app na recepção",
		av: "Disponível a pronta entrega na barbearia",
		code: "MOTTA-REDNEK5",
	},
	{
		badge: "DA",
		name: "Don Alcides",
		desc: "Cuidados completos para barba e pele",
		off: "5% OFF",
		img: "https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=600&q=80",
		over: "Kit Barba Bigode completo",
		av: "Compre com o barbeiro ou online",
		code: "MOTTA-DON5",
	},
	{
		badge: "B",
		name: "B.URB Urban Care",
		desc: "Inovação e finalizadores modernos",
		off: "5% OFF",
		img: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=600&q=80",
		over: "Linha de acabamento e fixação",
		av: "Desconto cumulativo em kits",
		code: "MOTTA-BURB5",
	},
];
const perks = [
	[
		"Antecedência no agendamento",
		"Agende horários com até 7 dias de antecedência",
	],
	["Serviços simultâneos", "Cabelo e barba atendidos ao mesmo tempo"],
	["Serviços cortesia inclusos", "Sobrancelha ou higienização capilar mensal"],
	["Prioridade na lista de espera", "Vaga automática em caso de desistências"],
];
const plans = [
	{
		id: "gold",
		tier: "gold",
		dark: false,
		tag: "Mais Escolhido",
		eyebrow: "Club Gold",
		name: "Club Gold",
		sub: "Manutenção programada para cabelo e barba",
		desc: "Manutenção programada para cabelo e barba com frequência garantida, mantendo seu visual impecável sem cobrança avulsa por visita.",
		price: 125.99,
		priceFormatted: "R$ 125,99",
		per: "por mês via recorrência",
		feats: [
			"Manutenção programada para cabelo e barba",
			"Acabamento (pezinho/contorno) sempre em dia",
			"Descontos exclusivos em tratamentos e produtos",
			"Sem carência ou multas rescisórias",
		],
		cta: "Assinar Club Gold",
	},
	{
		id: "black",
		tier: "black",
		dark: true,
		tag: "VIP & Ilimitado",
		eyebrow: "Club Black",
		name: "Club Black",
		sub: "Acesso ilimitado e exclusivo",
		desc: "Acesso ilimitado/premium com benefícios e condições exclusivas para homens que não abrem mão da máxima excelência.",
		price: 299.99,
		priceFormatted: "R$ 299,99",
		per: "por mês na assinatura",
		scarce: "Vagas VIP limitadas",
		feats: [
			"Acesso ilimitado a cortes masculinos",
			"Barboterapia e acabamentos liberados",
			"Atendimento prioritário na agenda e horários nobres",
			"Condições e benefícios exclusivos em procedimentos estéticos",
		],
		cta: "Garantir vaga VIP",
	},
];
const upcoming = [
	{
		id: "a1",
		day: nextAppt.day,
		mon: nextAppt.mon,
		time: "15:30",
		barber: "Michel Nogueira",
		role: "Barbeiro Master Visagista",
		svc: "Corte Masculino + Barba",
		note: "Em 3 dias",
		total: formatCurrency(49.99),
		when: nextAppt.full.charAt(0).toUpperCase() + nextAppt.full.slice(1),
	},
];
const past = [
	{
		day: formatDynamicDate(-20).day,
		mon: formatDynamicDate(-20).mon,
		barber: "Orlando Junior",
		role: "Barbeiro Master",
		svc: "Limpeza Facial, Hidratação Capilar, Corte",
		dur: "~60 min",
		total: formatCurrency(129.99),
	},
	{
		day: formatDynamicDate(-50).day,
		mon: formatDynamicDate(-50).mon,
		barber: "Matheus Albuquerque",
		role: "Barbeiro Estilista",
		svc: "Corte Masculino",
		dur: "~35 min",
		total: formatCurrency(49.99),
	},
	{
		day: formatDynamicDate(-80).day,
		mon: formatDynamicDate(-80).mon,
		barber: "Wanderson Mota",
		role: "Barbeiro Sênior",
		svc: "Corte Tradicional na Tesoura",
		dur: "~40 min",
		total: formatCurrency(49.99),
	},
	{
		day: formatDynamicDate(-110).day,
		mon: formatDynamicDate(-110).mon,
		barber: "Welerson Mota",
		role: "Barbeiro Estilista",
		svc: "Barboterapia / Barba, Corte",
		dur: "~45 min",
		total: formatCurrency(99.98),
	},
];
const serviceCategories = [
	"Todos",
	"Cabelo & Barba",
	"Tratamentos & Estética",
];

const services = [
	// Cabelo & Barba
	{
		id: "corte",
		cat: "Cabelo & Barba",
		name: "Corte Masculino",
		desc: "Corte completo na tesoura ou máquina, alinhamento e finalização.",
		price: 49.99,
		tag: "Mais pedido",
	},
	{
		id: "barba",
		cat: "Cabelo & Barba",
		name: "Barboterapia / Barba",
		desc: "Barboterapia com toalha quente, óleos essenciais, navalhete e pós-barba refrescante.",
		price: 49.99,
		tag: "Destaque",
	},
	{
		id: "acabamento",
		cat: "Cabelo & Barba",
		name: "Acabamento (Pezinho/Contorno)",
		desc: "Acabamento de costeletas, nuca e contorno com precisão.",
		price: 20.0,
		tag: "Rápido",
	},
	{
		id: "pigmentacao",
		cat: "Cabelo & Barba",
		name: "Pigmentação (Barba ou Cabelo)",
		desc: "Disfarce de fios brancos, preenchimento de falhas e realce do contorno.",
		price: 30.0,
		starting: true,
		tag: "Definição",
	},
	{
		id: "lavagem_especial",
		cat: "Cabelo & Barba",
		name: "Lavagem Especial",
		desc: "Higienização capilar profunda com produtos profissionais e massagem revigorante.",
		price: 20.0,
		starting: true,
		tag: "Relax",
	},

	// Tratamentos & Estética
	{
		id: "hidratacao_capilar",
		cat: "Tratamentos & Estética",
		name: "Hidratação Capilar",
		desc: "Nutrição e reparação profunda para fios macios, sedosos e saudáveis.",
		price: 40.0,
		starting: true,
		tag: "Cuidado",
	},
	{
		id: "limpeza_facial",
		cat: "Tratamentos & Estética",
		name: "Limpeza Facial / Cuidados com a Pele",
		desc: "Remoção de impurezas, máscara negra, esfoliação e controle de oleosidade.",
		price: 40.0,
		starting: true,
		tag: "Estética",
	},
	{
		id: "selagem",
		cat: "Tratamentos & Estética",
		name: "Selagem Capilar",
		desc: "Tratamento de redução de volume, controle e selagem dos fios conforme o comprimento.",
		price: 0,
		priceDisplay: "Sob consulta (conforme comprimento)",
		tag: "Tratamento",
	},
	{
		id: "depilacao_masculina",
		cat: "Tratamentos & Estética",
		name: "Depilação Masculina (Áreas específicas)",
		desc: "Remoção higiênica e rápida de pelos em áreas específicas (orelha, nariz ou sobrancelha).",
		price: 25.0,
		priceDisplay: "R$ 25,00 a R$ 35,00",
		tag: "Epilação",
	},
];
const pros = [
	{
		id: "michel",
		name: "Michel Nogueira",
		role: "Barbeiro Master Visagista",
		rate: "4.9",
		next: "Hoje às 15:30",
		photo: "assets/barbeiros/Michel Nogueira.png",
	},
	{
		id: "maycon",
		name: "Maycon Angelo",
		role: "Barbeiro Master",
		rate: "5.0",
		next: "Hoje às 16:15",
		photo: "assets/barbeiros/Maycon Angelo.png",
	},
	{
		id: "orlando",
		name: "Orlando Junior",
		role: "Barbeiro Master",
		rate: "5.0",
		next: "Hoje às 17:00",
		photo: "assets/barbeiros/Orlando Junior.png",
	},
	{
		id: "matheus",
		name: "Matheus Ferreira",
		role: "Barbeiro Estilista",
		rate: "4.8",
		next: "Amanhã às 11:30",
		photo: "assets/barbeiros/Matheus Ferreira.png",
	},
	{
		id: "wanderson",
		name: "Wanderson Mota",
		role: "Barbeiro Sênior",
		rate: "4.9",
		next: "Amanhã às 14:00",
		photo: "assets/barbeiros/Wanderson Mota.png",
	},
];
const TIME_PERIODS = [
	["Manhã", "08:00 às 12:00", ["09:00", "09:45", "10:30", "11:15"], 3],
	["Tarde", "12:00 às 18:00", ["13:30", "14:15", "15:00", "15:45", "16:30", "17:15"], 0],
	["Noite", "18:00 às 21:00", ["18:00", "18:45", "19:30", "20:15"], 0],
];

function getAvailableDaySlots() {
	return [0, 1, 2, 3, 4, 5, 6].map((offset) => {
		const info = formatDynamicDate(offset);
		const isSunday = info.weekday.toLowerCase().startsWith("dom");
		const dayNum = parseInt(info.day, 10);
		return {
			offset,
			weekdayShort: info.weekday.slice(0, 3).toUpperCase(),
			day: dayNum,
			dayPadded: info.day,
			mon: info.mon,
			full: info.full.charAt(0).toUpperCase() + info.full.slice(1),
			shortDate: info.shortDate,
			status: isSunday ? "Fechado" : offset === 0 ? "Hoje" : offset > 3 ? "Poucos" : "Livre",
			available: !isSunday,
		};
	});
}

function getValidTimes() {
	return TIME_PERIODS.flatMap(([, , hs, dis]) => hs.slice(dis));
}

function normalizeBookState(rawBook) {
	const daySlots = getAvailableDaySlots();
	const validDays = daySlots.filter((d) => d.available).map((d) => d.day);
	const validTimes = getValidTimes();
	const validServiceIds = new Set(services.map((s) => s.id));
	const validProIds = new Set(pros.map((p) => p.id));

	if (!rawBook || typeof rawBook !== "object") {
		return {
			cat: "Todos",
			svc: ["corte"],
			pro: "michel",
			day: validDays[0] ?? null,
			time: validTimes.includes("15:00") ? "15:00" : (validTimes[0] ?? null),
			agree: false,
			done: false,
		};
	}

	const svc = Array.isArray(rawBook.svc)
		? rawBook.svc.filter((id) => validServiceIds.has(id))
		: ["corte"];
	const pro = validProIds.has(rawBook.pro) ? rawBook.pro : null;
	const day = validDays.includes(Number(rawBook.day)) ? Number(rawBook.day) : null;
	const time = validTimes.includes(rawBook.time) ? rawBook.time : null;
	const cat = serviceCategories.includes(rawBook.cat) ? rawBook.cat : "Todos";

	return {
		cat,
		svc,
		pro,
		day,
		time,
		agree: Boolean(rawBook.agree),
		done: false,
	};
}

const STORAGE_KEY = "motta_app_state_v1";
function loadSavedState() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (raw) return JSON.parse(raw);
	} catch (e) {}
	return null;
}
function savePersistentState() {
	try {
		localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify({
				isLoggedIn: state.isLoggedIn,
				user: state.user,
				appts: state.appts,
				book: {
					cat: state.book.cat,
					svc: state.book.svc,
					pro: state.book.pro,
					day: state.book.day,
					time: state.book.time,
					agree: state.book.agree,
				},
			}),
		);
	} catch (e) {
		console.warn("Falha ao persistir estado local:", e);
	}
}

const saved = loadSavedState();
const state = {
	isLoggedIn: saved?.isLoggedIn ?? false,
	user: saved?.user ?? null,
	book: normalizeBookState(saved?.book),
	agTab: "agendados",
	planFilter: "todos",
	appts:
		Array.isArray(saved?.appts) && saved.appts.length > 0
			? saved.appts
			: [...upcoming],
};

/* ---------- telas ---------- */
const screens = {
	play(arg) {
		return window.MottaPlay ? window.MottaPlay.renderHTML(arg) : '<div class="play-wrapper"><p style="text-align:center;padding:40px;color:var(--muted);">Carregando experiências...</p></div>';
	},
	clube() {
		return `${header("Clube Motta", "Vantagens Exclusivas", "Produtos e benefícios")}
    <p class="body">Aproveite descontos exclusivos em marcas parceiras e privilégios desenhados para elevar o seu ritual de cuidado.</p>
    <div class="chips chips-wrap"><a class="chip on" href="#/clube" style="text-decoration:none">Produtos e benefícios</a><a class="chip" href="#/plano" style="text-decoration:none">Meu plano</a><a class="chip" href="#/agendamentos" style="text-decoration:none">Agendamentos</a><a class="chip" href="#/perfil" style="text-decoration:none">Editar perfil</a></div>
    <section class="hero" aria-label="Seu plano">
      <div class="row between">
        <div class="row" style="gap:8px;align-items:center;">
          <img src="assets/logos/motta-symbol-gold.png" alt="Motta" style="width:22px;height:22px;object-fit:contain;">
          <span class="eyebrow">Seu plano</span>
        </div>
        <span class="pill">Ativo</span>
      </div>
      <h2>Club Gold</h2>
      <p>Manutenção programada para cabelo e barba com frequência garantida e prioridade de atendimento.</p>
      <div class="row" style="gap:16px;padding-top:8px"><div class="meta">Próxima renovação<b>${renewalDate.full}</b></div><span style="width:1px;height:24px;background:var(--forest-800)"></span><div class="meta">Economia acumulada<b style="color:var(--gold)">R$ 148,00</b></div></div>
    </section>
    <section class="col gap16">
      <div class="row between"><div><h2 class="h-section">Descontos em produtos</h2><p class="legend">Linha profissional selecionada para cuidados diários</p></div></div>
      ${partners
				.map(
					(p) => `
      <article class="card">
        <div class="pro-card-header"><div class="pro-card-identity"><div class="avatar" aria-hidden="true">${p.badge}</div><div class="pro-card-info"><div class="item" style="color:var(--ink)">${p.name}</div><div class="legend">${p.desc}</div></div></div><span class="badge pro-card-rate">${p.off}</span></div>
        <div class="ph"><img src="${p.img}" alt="" loading="lazy"><span>${p.over}</span></div>
        <div class="row between"><span class="legend" style="color:var(--text)">${p.av}</span><button class="link" data-copy="${p.code}">Copiar cupom</button></div>
      </article>`,
				)
				.join("")}
    </section>
    <section class="col gap16">
      <div><h2 class="h-section">Outros benefícios do seu plano</h2><p class="legend">Privilégios que garantem comodidade e agilidade em cada visita</p></div>
      <div class="card">${perks.map(([t, d]) => `<div><div class="item" style="color:var(--ink)">${t}</div><div class="legend">${d}</div></div>`).join("")}</div>
    </section>
    <section class="hero"><div class="item">Aproveite todos os benefícios</div><p class="meta">Gerencie forma de pagamento, dependentes e recibos</p><a class="btn" style="text-decoration:none;text-align:center;display:grid;align-content:center;color:var(--ink);background:#fff" href="#/plano">Gerenciar meu plano</a><a class="link" style="color:var(--gold)" href="#/beneficios">Ver benefícios do plano</a></section>`;
	},

	beneficios() {
		const f = state.benFilter || "todos";
		const items = [
			["Corte", "100% OFF", "Corte completo na tesoura ou máquina.", 49.99, 0],
			[
				"Barba",
				"100% OFF",
				"Barboterapia com toalha quente e alinhamento.",
				49.99,
				0,
			],
			[
				"Pezinho / Acabamento",
				"100% OFF",
				"Alinhamento da nuca e contornos.",
				20.0,
				0,
			],
			[
				"Sobrancelha (Navalha)",
				"100% OFF",
				"Alinhamento e desenho na navalha.",
				20.0,
				0,
			],
			[
				"Hidratação Capilar",
				"15% OFF",
				"Nutrição profunda dos fios.",
				40.0,
				34.0,
			],
			[
				"Limpeza Facial",
				"15% OFF",
				"Argiloterapia e esfoliação revigorante.",
				40.0,
				34.0,
			],
		].filter((x) => f === "todos" || (f === "gratis" ? x[4] === 0 : x[4] > 0));
		return `<header class="col gap4"><div class="row"><span class="eyebrow">Plano selecionado</span></div><div class="row between"><h1 class="h-page">Benefícios do Plano</h1><span class="ok" style="color:var(--forest)">Membro Ativo</span></div><p class="body">Conheça cada serviço, cortesias e descontos exclusivos inclusos na sua assinatura.</p></header>
    <div class="chips chips-wrap"><a class="chip on" href="#/beneficios" style="text-decoration:none">Benefícios</a><a class="chip" href="#/plano" style="text-decoration:none">Meu plano</a><a class="chip" href="#/planos" style="text-decoration:none">Comparar</a><a class="chip" href="#/clube" style="text-decoration:none">Dúvidas</a></div>
    <section class="card"><div class="row between"><span class="item" style="color:var(--ink)">100 Cortesias</span><span class="legend">Serviços por mês</span></div><div class="row between"><span class="item" style="color:var(--ink)">Até 100% OFF</span><span class="legend">Nos carros-chefes</span></div><div class="row between"><span class="item" style="color:var(--ink)">Produtos -15%</span><span class="legend">Pomadas e óleos</span></div></section>
    <section class="hero"><span class="eyebrow">Plano selecionado</span><h2 style="font-size:1.75rem;line-height:1.214">Club Gold</h2><p class="meta">Experiência completa de barbearia com serviços programados e hospitalidade de excelência.</p><div class="row" style="gap:16px"><span class="meta"><b>Cortes &amp; Barba</b>Inclusos no plano</span><span class="meta"><b>Extras -15%</b>Descontos exclusivos</span></div></section>
    <div class="row between"><h2 class="h-section">Serviços do Plano</h2><span class="legend">${items.length} disponíveis</span></div>
    ${tabs(
			[
				["todos", "Todos"],
				["gratis", "Gratuitos (100%)"],
				["desc", "Com Desconto"],
			],
			f,
			"bf",
		)}
    <div id="panel-${f}" role="tabpanel" aria-labelledby="tab-${f}" class="col gap16">${items.map(([n, off, d, p, np]) => `<article class="card"><div class="row between"><span class="h-section">${escapeHtml(n)}</span><span class="badge" ${np ? 'style="background:var(--warn-bg);color:#78350F"' : ""}>${escapeHtml(off)}</span></div><p class="body" style="color:var(--muted)">${escapeHtml(d)}</p><div class="row between"><span><s class="legend">${formatCurrency(p)}</s> <b style="color:var(--forest)">${formatCurrency(np)}</b></span><a class="link" href="#/novo/1">Agendar</a></div></article>`).join("")}</div>
    <section class="card"><div class="row between"><span class="item" style="color:var(--ink)">Vantagens Inclusas</span><span class="ok" style="color:var(--forest)">Tudo ativo</span></div><ul><li>Manutenção programada para cabelo e barba</li><li>Descontos de até 100% em procedimentos essenciais</li><li>Serviços adicionais com até 15% OFF</li><li>Prioridade na agenda e horários nobres</li></ul></section>
    <section class="hero"><span class="eyebrow" style="letter-spacing:1.2px">Ambiente exclusivo</span><div class="item">Cerveja artesanal e café cortesia inclusos</div></section>
    <div class="col gap8"><a class="btn primary" style="text-align:center;text-decoration:none" href="#/planos">Contratar este plano</a><p class="legend" style="text-align:center">Sem fidelidade forçada. Cancele ou altere a qualquer momento no app.</p></div>`;
	},

	plano() {
		const quotas = [
			["Cotas de Corte de Cabelo", 3, 4, `Resta 1 corte até ${renewalDate.shortDate}`],
			["Cotas de Barboterapia Ritual", 2, 4, `Restam 2 rituais até ${renewalDate.shortDate}`],
		];
		return `${header("Assinatura premium", "Meu plano", "Meu Plano Benefícios")}
    <p class="body">Acompanhe o saldo mensal de suas cotas, utilize cortes inclusos e desfrute de privilégios exclusivos.</p>
    <section class="hero" aria-label="Plano ativo">
      <div class="row between">
        <div class="row" style="gap:8px;align-items:center;">
          <img src="assets/logos/motta-symbol-gold.png" alt="Motta" style="width:22px;height:22px;object-fit:contain;">
          <span class="pill">Plano ativo</span>
        </div>
        <span class="item" style="color:var(--gold-soft)">Club Gold</span>
      </div>
      <h2>Club Gold — Corte &amp; Barba</h2>
      <p class="meta">Membro assíduo • Renovação automática em ${renewalDate.shortDate}/${now.getFullYear()}</p>
      <div class="row between" style="padding-top:8px"><span class="meta">Mensalidade:</span><span style="font-weight:700;font-size:1.25rem;color:var(--mint-on-dark)">${formatCurrency(125.99)}<small class="meta">/mês</small></span></div>
      ${quotas.map(([n, u, t]) => `<div class="meta"><div class="row between"><span>${n}</span><span style="color:var(--mint-on-dark);font-weight:600">${u} de ${t} (${(u / t) * 100}%)</span></div><div class="bar" style="background:rgba(255,255,255,.15);margin-top:4px" role="progressbar" aria-valuenow="${u}" aria-valuemax="${t}"><i style="width:${(u / t) * 100}%;background:var(--mint-on-dark)"></i></div></div>`).join("")}
      <div class="meta">Extras Upgrades: <b style="display:inline">15% OFF</b> · Economia anual garantida</div>
    </section>
    <section class="col gap16">
      <div><h2 class="h-section" style="font:400 1.125rem/1.556 var(--serif)">Saldo e Utilização de Cotas</h2><p class="legend">Ciclo mensal ativo · <b style="color:#003D1B">Renovação programada</b></p></div>
      <article class="card"><div class="row between"><div><div class="item" style="color:var(--text-strong)">Corte Tradicional ou Degradê</div><div class="legend">Lavagem refrescante, corte e styling</div></div><span class="badge">INCLUSO</span></div><div class="legend">Preço avulso: <s>R$ 49,99</s> · <b style="color:#003D1B">R$ 0,00</b></div><a class="btn primary" style="text-align:center;text-decoration:none" href="#/novo/1">Agendar com cota</a></article>
      <article class="card"><div class="row between"><div><div class="item" style="color:var(--text-strong)">Barba Tradicional</div><div class="legend">Toalha quente com óleos essenciais e navalhete esterilizado</div></div><span class="badge">INCLUSO</span></div><div class="legend">Preço avulso: <s>R$ 49,99</s> · <b style="color:#003D1B">R$ 0,00</b></div><a class="btn primary" style="text-align:center;text-decoration:none" href="#/novo/1">Agendar barba</a></article>
      <article class="card"><div class="row between"><div><div class="item" style="color:var(--text-strong)">Limpeza Facial ou Hidratação</div><div class="legend">Argiloterapia ou nutrição profunda</div></div><span class="badge" style="background:var(--warn-bg);color:var(--warn-text)">15% OFF</span></div><div class="legend">De R$ 40,00 por <b style="color:var(--text-strong)">R$ 34,00</b></div><button class="btn" data-toast="Extra adicionado ao seu próximo agendamento">Agendar extra</button></article>
    </section>
    <section class="col gap16">
      <h2 class="h-section" style="font:400 1.125rem/1.556 var(--serif)">Benefícios &amp; Parcerias Homologadas</h2>
      <div class="card">${[
				[
					"Serviços Inclusos",
					"Cortes e barbas programados sem taxa avulsa a cada visita.",
				],
				[
					"15% OFF em Extras",
					"Sobrancelha, selagem capilar, camuflagem de grisalhos e manicure.",
				],
				[
					"Cosméticos da Bancada",
					"10% em pomadas, óleos e balms homologados (Red Nek, Don Alcides).",
				],
				[
					"Hospitality Bar Valet",
					"Chopp artesanal, café espresso ilimitado e 1h de estacionamento conveniado.",
				],
			]
				.map(
					([t, d]) =>
						`<div><div class="item" style="color:var(--text-strong)">${t}</div><div class="legend" style="color:var(--text-2)">${d}</div></div>`,
				)
				.join("")}</div>
    </section>
    <section class="card"><h2 class="h-section" style="font:400 1.125rem/1.556 var(--serif)">Gestão de Assinatura &amp; Faturamento</h2><div class="item" style="color:var(--text-strong)">Mastercard final •••• 9241</div><div class="legend">Próxima cobrança: 05/11/2026 (R$ 125,99) · Automática</div><div class="legend" style="color:var(--text-2)"><b>Sem período de carência:</b> pause ou cancele a qualquer momento antes da renovação, sem multas.</div><button class="btn" data-toast="Abrindo forma de pagamento (demo)">Alterar forma de pagamento</button><a class="btn" style="text-align:center;text-decoration:none" href="#/planos">Trocar de plano</a></section>
    <p class="legend" style="text-align:center">Protótipo demonstrativo • valores ilustrativos</p>`;
	},

	agendamentos_vazio() {
		return `<header class="col gap4"><span class="eyebrow" style="color:var(--gold-ink);letter-spacing:1.92px">Agenda Motta</span><div class="row between"><h1 class="h-display">Sua Agenda</h1><span class="badge" style="background:var(--mint);color:#123D26">Em dia</span></div></header>
    <div class="chips chips-wrap" role="tablist" aria-label="Visualização de agendamentos"><button class="chip on" role="tab" aria-selected="true" tabindex="0">Agendados (0)</button><a class="chip" role="tab" aria-selected="false" tabindex="-1" href="#/agendamentos" style="text-decoration:none;">Anteriores (12)</a></div>
    <article class="card" style="align-items:center;text-align:center;padding:32px 16px;gap:16px;">
      <div style="width:64px;height:64px;border-radius:50%;background:var(--surface-soft);display:flex;align-items:center;justify-content:center;color:var(--forest);" aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
      </div>
      <div class="legend" style="color:var(--forest);font-weight:600;text-transform:uppercase;letter-spacing:0.8px;">Barbearia Motta • Sala Privada</div>
      <h2 class="h-page" style="font-size:1.4375rem;line-height:1.217;">Você ainda não tem nenhum agendamento</h2>
      <p class="body" style="color:var(--text);">Que tal reservar seu próximo momento de cuidado? Escolha o barbeiro da sua preferência e viva a experiência completa Motta.</p>
      <div class="col gap8" style="width:100%;max-width:280px;">
        <a class="btn primary" style="text-align:center;text-decoration:none;" href="#/novo/1">Novo agendamento</a>
        <a class="btn" style="text-align:center;text-decoration:none;" href="#/agendamentos">Ver histórico</a>
      </div>
    </article>
    <section class="hero">
      <span class="eyebrow" style="letter-spacing:1.2px;">Clube por Assinatura</span>
      <h2>Clube MOTTA — Pioneira em Macaé</h2>
      <p>Planos mensais fixos para manter corte e barba com frequência programada, sem cobrança avulsa por visita.</p>
      <a class="btn" style="text-decoration:none;text-align:center;background:#fff;color:var(--ink);font-weight:600;" href="#/planos">Conhecer planos</a>
    </section>
    <section class="card">
      <div class="item" style="color:var(--ink)">Por que fazer parte do Clube MOTTA?</div>
      <div class="legend"><b>Pioneirismo em Macaé:</b> Modelo inovador de assinatura recorrente com planos mensais fixos.</div>
      <div class="legend"><b>Manutenção Contínua:</b> Atendimento semanal ou quinzenal para homens exigentes que prezam pelo visual impecável.</div>
      <div class="legend"><b>Categorias Sob Medida:</b> Club Gold e Club Black com produtos homologados e visagismo exclusivo.</div>
    </section>`;
	},
	agendamentos() {
		const t = state.agTab;
		const body =
			t === "agendados"
				? state.appts.length
					? state.appts
							.map(
								(a) => `
        <article class="card">
          <div class="row between"><span class="eyebrow" style="color:#4C6455">Próximo atendimento</span><span class="ok">Confirmado</span></div>
          <div class="row" style="gap:12px"><div class="date"><small>${escapeHtml(a.mon)}</small><b>${escapeHtml(a.day)}</b></div><div><div class="h-section" style="font:400 1.125rem/1.222 var(--serif);color:var(--text-strong)">${escapeHtml(a.when || nextAppt.full)}</div><div class="item" style="color:#003D1B">${escapeHtml(a.time)} · ${escapeHtml(a.note)}</div></div></div>
          <div><div class="item" style="color:var(--text-strong)">${escapeHtml(a.barber)}</div><div class="legend" style="color:var(--text-2)">${escapeHtml(a.role)}</div></div>
          <div><div class="item" style="color:var(--text-strong)">${escapeHtml(a.svc)} — Total <b style="color:#003D1B">${escapeHtml(a.total)}</b></div></div>
          <div class="row gap8" style="gap:8px;flex-wrap:wrap"><button class="btn" data-toast="Detalhes do agendamento (demo)">Ver detalhes</button><button class="btn" data-toast="Reagendamento (demo)">Reagendar</button><button class="btn danger" data-cancel="${escapeHtml(a.id)}">Cancelar</button></div>
        </article>
        <article class="card lounge-game-card">
          <div class="row between" style="align-items:center;">
            <span class="eyebrow" style="color:var(--gold);font-size:0.6875rem;">Aguardando seu horário?</span>
            <span class="badge" style="background:rgba(199,165,102,0.25);color:var(--gold-soft);font-size:0.6875rem;">Lounge Motta</span>
          </div>
          <div class="lounge-game-copy">
            <div class="item" style="color:#fff;font-size:0.9375rem;">MOTTA / INTERVALO — 4 Jogos de Precisão</div>
            <p class="legend" style="color:var(--on-dark);">Aproveite o café no lounge e relaxe com nossos minigames táteis de precisão e ritmo enquanto aguarda seu atendimento.</p>
          </div>
          <div class="row" style="gap:8px;flex-wrap:wrap;">
            <a class="btn primary" style="background:var(--gold);color:var(--ink);font-weight:700;text-decoration:none;flex:1;min-height:44px;display:flex;align-items:center;justify-content:center;" href="#/play">Jogar no Lounge →</a>
            <a class="btn" style="background:rgba(255,255,255,0.1);color:#fff;text-decoration:none;min-height:44px;display:flex;align-items:center;justify-content:center;" href="play/" target="_blank" rel="noopener">Tela Cheia ↗</a>
          </div>
        </article>`,
							)
							.join("")
					: `<article class="card" style="align-items:center;text-align:center"><h2 class="h-page">Você ainda não tem nenhum agendamento</h2><p class="body">Que tal reservar seu próximo momento de cuidado? Escolha o barbeiro da sua preferência e viva a experiência completa Motta.</p><a class="btn primary" style="text-decoration:none" href="#/novo/1">Novo agendamento</a></article>
        <article class="card lounge-game-card" style="text-align:center;align-items:center;">
          <span class="eyebrow" style="color:var(--gold);font-size:0.6875rem;">Lounge &amp; Experiência</span>
          <div class="item" style="color:#fff;font-size:0.9375rem;">Conheça o MOTTA / INTERVALO</div>
          <p class="legend" style="color:var(--on-dark);max-width:300px;">Quatro minigames analógicos desenhados para desacelerar o seu dia com estilo.</p>
          <a class="btn primary" style="background:var(--gold);color:var(--ink);font-weight:700;text-decoration:none;min-height:44px;padding:10px 18px;" href="#/play">Jogar Minigames →</a>
        </article>`
				: `<div class="row between"><div><h2 class="h-section">Histórico de agendamentos</h2><p class="legend">12 visitas concluídas</p></div></div>` +
					past
						.map(
							(a) => `
        <article class="card">
          <div class="row" style="gap:12px"><div class="date"><small>${escapeHtml(a.mon)}</small><b>${escapeHtml(a.day)}</b></div><div style="flex:1"><div class="h-section" style="font-size:1rem;line-height:1.5">${escapeHtml(a.barber)}</div><div class="legend">${escapeHtml(a.role)}</div></div><span class="ok">Concluído</span></div>
          <div class="item" style="font-weight:500;font-size:0.875rem;color:var(--ink)">${escapeHtml(a.svc)}</div>
          <div class="row between"><span class="legend">Duração: ${escapeHtml(a.dur)}</span><b style="color:var(--ink)">${escapeHtml(a.total)}</b></div>
          <div class="row" style="gap:8px;flex-wrap:wrap"><button class="btn" data-toast="Detalhes (demo)">Detalhes</button><button class="btn primary" data-toast="Reagendar (demo)">Reagendar</button></div>
        </article>`,
						)
						.join("");
		return `<header class="col gap4"><span class="eyebrow" style="color:var(--gold-ink);letter-spacing:1.92px">Agenda Motta</span><div class="row between"><h1 class="h-display">Agendamentos</h1><a class="btn primary" style="text-decoration:none;display:grid;align-content:center" href="#/novo/1">Novo</a></div></header>
    ${tabs(
			[
				["agendados", `Agendados (${state.appts.length})`],
				["anteriores", "Anteriores (12)"],
			],
			t,
			"ag",
		)}
    <div id="panel-${t}" role="tabpanel" aria-labelledby="tab-${t}" class="col gap16">${body}</div>
    <section class="card"><div class="item" style="color:var(--ink)">Por que agendar pelo aplicativo?</div><div class="legend"><b>Pontualidade e praticidade.</b> Sem filas, horário reservado com seu profissional.</div><div class="legend"><b>Barbeiros especialistas.</b> Visagismo sob medida a cada visita.</div></section>`;
	},

	planos() {
		const f = state.planFilter;
		const list = plans.filter((p) => f === "todos" || p.tier === f);
		return `${header("Planos e assinaturas", "Pioneira em Macaé", "Clube MOTTA — Assinatura Recorrente")}
    <p class="body">Pioneira no modelo de assinatura na cidade de Macaé. Planos mensais fixos com frequência programada (semanal ou quinzenal) para manutenção contínua do visual, sem cobrança avulsa por visita. Um clube para homens exigentes.</p>
    ${tabs(
			[
				["todos", "Todos"],
				["gold", "Club Gold"],
				["black", "Club Black"],
			],
			f,
			"pf",
		)}
    <div class="row between"><h2 class="h-section">${f === "black" ? "Categoria Club Black (VIP)" : f === "gold" ? "Categoria Club Gold" : "Planos de Recorrência (Assinaturas Mensais)"}</h2><span class="legend">${list.length} opções</span></div>
    <div id="panel-${f}" role="tabpanel" aria-labelledby="tab-${f}" class="col gap16">${list
			.map(
				(p) => `
      <article class="card ${p.dark ? "dark" : ""}">
        <div class="row between">
          <div class="row" style="gap:8px;align-items:center;">
            <img src="${p.tier === "black" ? "assets/logos/club-black-transparent.png" : "assets/logos/motta-symbol-green.png"}" alt="" style="height:22px;object-fit:contain;">
            <span class="eyebrow" style="color:${p.dark ? "var(--gold)" : "var(--muted)"}">${p.eyebrow || (p.tier === "black" ? "Club Black" : "Club Gold")}</span>
          </div>
          ${p.tag ? `<span class="badge" style="${p.scarce ? "background:transparent;color:var(--gold-soft);padding:0" : ""}">${p.tag}</span>` : ""}
        </div>
        <div><h3 class="h-section" ${p.dark ? "" : ""}>${p.name}</h3><div class="item" style="color:${p.dark ? "var(--gold)" : "var(--forest)"}">${p.sub}</div></div>
        <p class="body">${p.desc}</p>
        <div><span class="price">${p.priceFormatted || formatCurrency(p.price)}</span><div class="legend">${p.per}</div>${p.scarce ? `<div class="scarce">${p.scarce}</div>` : ""}</div>
        <ul>${p.feats.map((x) => `<li>${x}</li>`).join("")}</ul>
        <button class="btn ${p.dark ? "gold" : "primary"} block" data-toast="${p.name}: assinatura digital via link da bio / app">${p.cta}</button>
      </article>`,
			)
			.join("")}</div>
    <section class="card"><div class="item" style="color:var(--text-strong)">Recorrência &amp; Gestão Digital</div><div class="legend">Contratação via plataforma integrada, sem carência ou multas. Pause ou altere seu plano quando quiser pelo aplicativo.</div></section>`;
	},

	boas_vindas() {
		return `<header class="col gap4">
      <div class="row between" style="align-items:center;">
        <div class="row"><span class="eyebrow" style="color:var(--gold-ink);letter-spacing:1.92px;">Barbearia Motta</span><span class="dot"></span><span class="legend">Pioneira em Macaé</span></div>
        <img src="assets/logos/motta-symbol-green.png" alt="Motta" style="width:26px;height:26px;object-fit:contain;">
      </div>
      <h1 class="h-display" style="font-size:1.75rem;line-height:1.214;">Clube para homens exigentes.</h1>
      <p class="body">Cuidado masculino contínuo na unidade Sol &amp; Mar. Frequência programada, visagismo exclusivo, produtos da linha profissional e hospitalidade de excelência.</p>
    </header>

    <section class="hero mimos-hero" aria-label="Boas-vindas">
      <div class="row between"><span class="eyebrow">Experiência Motta</span><span class="pill">Autocuidado</span></div>
      <h2>Seus mimos de autocuidado</h2>
      <div class="mimos-carousel" role="region" aria-label="Mimos de autocuidado" aria-roledescription="carrossel">
        <div class="mimos-slides" aria-live="off">
          <div class="mimos-slide" role="group" aria-label="1 de 3"><strong>Cabelo e barba</strong><p>Corte, barba, hidratação, camuflagem e selagem.</p></div>
          <div class="mimos-slide" role="group" aria-label="2 de 3" hidden><strong>Rosto</strong><p>Limpeza facial e sobrancelha.</p></div>
          <div class="mimos-slide" role="group" aria-label="3 de 3" hidden><strong>Higienização</strong><p>Orelha e nariz.</p></div>
        </div>
        <div class="mimos-controls"><button type="button" data-mimos="prev" aria-label="Mimo anterior">←</button><span class="mimos-position" aria-live="polite">1 / 3</span><button type="button" data-mimos="next" aria-label="Próximo mimo">→</button><button type="button" class="mimos-pause" data-mimos="pause">Pausar</button></div>
      </div>
      <div class="row" style="gap:16px;padding-top:8px">
        <div class="meta">Unidade Sol &amp; Mar<b>Av. Carlos Augusto T. Garcia, 2040</b></div>
        <span style="width:1px;height:24px;background:var(--forest-800)"></span>
        <div class="meta">Valet<b>Cortesia no local</b></div>
      </div>
    </section>

    <section class="col gap16 welcome-options">
      <div>
        <h2 class="h-section">Por onde deseja começar?</h2>
        <p class="legend">Escolha sua forma preferida de atendimento</p>
      </div>

      <article class="card" style="border:2px solid var(--forest);box-shadow:var(--sh-hero);">
        <div class="row between">
          <div>
            <span class="badge" style="background:var(--mint);color:#003D1B;margin-bottom:6px;display:inline-block;">Recomendado</span>
            <div class="item" style="font-size:1rem;color:var(--text-strong)">Agendar Primeiro Corte ou Barba</div>
            <div class="legend" style="color:var(--text-2);margin-top:2px;">Escolha o barbeiro especialista e o horário perfeito em tempo real.</div>
          </div>
        </div>
        <div class="row between" style="padding-top:4px;">
          <span class="legend" style="color:var(--forest);font-weight:600;">Sem filas • Confirmação instantânea</span>
          <a class="btn primary" style="text-decoration:none;" href="#/novo/1">Agendar agora</a>
        </div>
      </article>

      <article class="card">
        <div class="row between">
          <div>
            <span class="badge" style="background:var(--warn-bg);color:var(--warn-text);margin-bottom:6px;display:inline-block;">Economia &amp; Recorrência</span>
            <div class="item" style="font-size:1rem;color:var(--text-strong)">Assinar o Clube MOTTA</div>
            <div class="legend" style="color:var(--text-2);margin-top:2px;">Planos mensais fixos com cortes e barbas semanais/quinzenais sem taxa avulsa por visita.</div>
          </div>
        </div>
        <div class="row between" style="padding-top:4px;">
          <span class="legend" style="color:var(--text);">Categorias Club Gold e Club Black</span>
          <a class="btn" style="text-decoration:none;text-align:center;" href="#/planos">Conhecer planos</a>
        </div>
      </article>
    </section>

    <section class="col gap16">
      <div>
        <h2 class="h-section">Pilares do Conceito Clube MOTTA</h2>
        <p class="legend">Por que somos pioneiros no modelo de assinatura em Macaé</p>
      </div>
      <div class="card">
        <div>
          <div class="item" style="color:var(--ink)">1. Modelo por Assinatura (Membro/Club)</div>
          <div class="legend" style="color:var(--text-2)">Pioneira na cidade, a Barbearia Motta oferece planos mensais fixos que permitem realizar cortes, barba e manutenções com frequência programada, sem cobrança avulsa por visita.</div>
        </div>
        <div style="height:1px;background:var(--surface-soft);"></div>
        <div>
          <div class="item" style="color:var(--ink)">2. Segmentação em Categorias (Club Gold &amp; Club Black)</div>
          <div class="legend" style="color:var(--text-2)">Membros divididos em níveis de benefícios, variando a cobertura de procedimentos (ex.: apenas corte, corte + barba/barboterapia, sobrancelha e tratamentos capilares como hidratação ou selagem).</div>
        </div>
        <div style="height:1px;background:var(--surface-soft);"></div>
        <div>
          <div class="item" style="color:var(--ink)">3. Posicionamento Exclusivo ("Clube para homens exigentes")</div>
          <div class="legend" style="color:var(--text-2)">Transcende o corte tradicional e opera como um espaço de conveniência e autocuidado masculino contínuo, reduzindo o atrito de agendamento e garantindo padronização de atendimento e produtos da linha profissional.</div>
        </div>
        <div style="height:1px;background:var(--surface-soft);"></div>
        <div>
          <div class="item" style="color:var(--ink)">4. Hospitalidade &amp; Confraria Sol &amp; Mar</div>
          <div class="legend" style="color:var(--text-2)">Chopp artesanal estupidamente gelado, café Nespresso gourmet, valet cortesia no local e atendimento focado em clientes semanais ou quinzenais.</div>
        </div>
      </div>
    </section>

    <section class="hero">
      <span class="eyebrow" style="letter-spacing:1.2px;">Atendimento Humano &amp; Agendamento</span>
      <h2>Ficou com alguma dúvida?</h2>
      <p>Nosso Concierge está pronto para ajudar a escolher o melhor serviço ou profissional para você.</p>
      <a class="btn" style="text-decoration:none;text-align:center;background:#fff;color:var(--ink);font-weight:600;" href="https://wa.me/5522998389803" target="_blank" rel="noopener">Falar no WhatsApp: (22) 99838-9803</a>
    </section>

    <p class="legend" style="text-align:center;">Barbearia Motta Macaé • Av. Carlos Augusto T. Garcia, 2040 – Sol e Mar, Macaé/RJ</p>`;
	},
	login() {
		return `<header class="col gap4" style="align-items:center;text-align:center;">
      <img src="assets/logos/club-motta-transparent.png" alt="Club Motta" style="height:52px;object-fit:contain;margin-bottom:8px;">
      <h1 class="h-display" style="font-size:1.625rem;line-height:1.231;color:var(--ink);">Entre ou Cadastre-se</h1>
      <p class="body">Acesse seus agendamentos, cotas do Clube Motta e histórico de atendimento.</p>
    </header>

    <div class="chips chips-auth" role="tablist" aria-label="Acesso à conta">
      <button class="chip on" id="tab-login" role="tab" aria-selected="true" tabindex="0" aria-controls="auth-form">Já sou cliente (Entrar)</button>
      <button class="chip" id="tab-register" role="tab" aria-selected="false" tabindex="-1" aria-controls="auth-form">Primeira vez (Cadastrar)</button>
    </div>

    <!-- Formulário de Login -->
    <form id="auth-form" class="card" style="gap:16px;">
      <div id="register-fields" class="col gap16" style="display:none;">
        <label class="col" style="gap:4px">
          <span class="legend" style="font-weight:600;color:var(--text-strong)">Nome Completo *</span>
          <input id="auth-name" placeholder="Ex.: Vinícius Cunha" style="min-height:44px;padding:10px 12px;border-radius:var(--r-md);border:1px solid #d4dad4;background:#fff;font:400 14px var(--sans);color:#171B18">
        </label>
      </div>

      <label class="col" style="gap:4px">
        <span class="legend" style="font-weight:600;color:var(--text-strong)">Telefone (WhatsApp) *</span>
        <input id="auth-phone" type="tel" value="(22) 99838-9803" placeholder="(22) 99838-9803" required style="min-height:44px;padding:10px 12px;border-radius:var(--r-md);border:1px solid #d4dad4;background:#fff;font:400 14px var(--sans);color:#171B18">
      </label>

      <label class="col" style="gap:4px">
        <span class="legend" style="font-weight:600;color:var(--text-strong)">Senha de Acesso *</span>
        <input id="auth-pass" type="password" value="••••••••" placeholder="Sua senha" required style="min-height:44px;padding:10px 12px;border-radius:var(--r-md);border:1px solid #d4dad4;background:#fff;font:400 14px var(--sans);color:#171B18">
      </label>

      <button id="auth-submit-btn" class="btn primary" type="submit" style="width:100%;min-height:46px;font-weight:700;margin-top:4px;">Acessar Minha Conta</button>

      <p class="legend" style="text-align:center;color:var(--text-2);">Seus dados estão protegidos com criptografia de ponta a ponta.</p>
    </form>

    <section class="card" style="border:1.5px solid #E6F1E5;">
      <div class="item" style="color:var(--forest)">Quer apenas agendar sem cadastro prévio?</div>
      <div class="legend" style="color:var(--text-2)">Você pode escolher o profissional e horário agora e preencher os dados no final.</div>
      <a class="btn" style="text-align:center;text-decoration:none;margin-top:6px;" href="#/novo/1">Agendamento direto</a>
    </section>`;
	},
	inicio() {
		return `<header class="col home-header card-wrapper">
      <div class="row between" style="align-items:center;">
        <div class="row" style="gap:10px;align-items:center;">
          <img src="assets/logos/motta-symbol-dark.png" alt="Barbearia Motta" style="width:34px;height:34px;object-fit:contain;">
          <div>
            <div class="eyebrow" style="color:var(--gold-ink);letter-spacing:1.5px;font-size:0.6875rem;">Barbearia Motta</div>
            <div class="legend" style="font-size:0.6875rem;">Pioneira em Assinatura • Sol &amp; Mar</div>
          </div>
        </div>
      </div>
      <h1 class="h-display card-title">Clube para homens exigentes.</h1>
      <p class="body" style="color:var(--text);">Manutenção contínua do visual sem atrito de agendamento, produtos da linha profissional e hospitalidade de excelência em Macaé.</p>
    </header>

    <!-- Card Central: Novo por aqui? -->
    <section class="hero hero-trust-card" style="border:2px solid var(--gold);box-shadow:0 10px 28px rgba(7,30,19,0.22);padding:24px 20px 24px;text-align:center;align-items:center;gap:12px;">
      <!-- Floating Badge Top Left: Pioneira em Assinatura -->
      <div class="floating-badge top-left">
        <span class="badge-icon" aria-hidden="true">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </span>
        <div class="badge-content">
          <span class="badge-title">Pioneira em Assinatura</span>
          <span class="badge-subtitle">Padrão de Excelência Macaé</span>
        </div>
      </div>

      <h2 style="font-size:1.5rem;line-height:1.25;color:#fff;">Crie sua conta e viva a experiência Motta</h2>
      <p class="body" style="color:var(--on-dark);max-width:320px;margin:0 auto;">Agende seu horário com os melhores barbeiros da cidade. Planos mensais fixos com frequência programada ou agendamento avulso direto.</p>

      <div class="col gap8" style="width:100%;padding-top:4px;">
        <a class="btn primary" style="background:var(--gold);color:var(--ink);font-weight:700;text-align:center;text-decoration:none;min-height:46px;display:flex;align-items:center;justify-content:center;" href="#/login">Criar Conta / Entrar</a>
        <a class="btn" style="background:rgba(255,255,255,0.12);color:#fff;text-align:center;text-decoration:none;min-height:42px;display:flex;align-items:center;justify-content:center;" href="#/boas_vindas">Conhecer o Conceito &amp; Hospitalidade</a>
      </div>

      <div style="display:flex;align-items:center;justify-content:center;gap:6px;font-size:0.75rem;color:var(--gold-soft);padding-top:2px;">
        <span aria-hidden="true">★★★★★</span>
        <span style="color:rgba(255,255,255,0.85);font-weight:500;">4.9 de avaliação • Mais de 1.200 clientes atendidos</span>
      </div>
    </section>

    <!-- Opções de Agendamento: Com ou Sem Assinatura -->
    <section class="col home-booking">
      <div>
        <h2 class="h-section" style="font-size:1.25rem;line-height:1.3;">Como você deseja agendar?</h2>
        <p class="legend">Flexibilidade total para a sua rotina</p>
      </div>

      <!-- Opção 1: Avulso / Sem Plano -->
      <article class="card" style="border:1.5px solid #E6F1E5;">
        <div class="row between">
          <div>
            <span class="badge" style="background:var(--surface-soft);color:var(--text-strong);margin-bottom:6px;display:inline-block;">Agendamento Avulso</span>
            <div class="item" style="font-size:1rem;color:var(--text-strong)">Agendar Sem Assinatura</div>
            <div class="legend" style="color:var(--text-2);margin-top:2px;">Pague somente pelo serviço que realizar (corte, barba ou terapias). Pague na recepção ou online.</div>
          </div>
        </div>
        <div class="row between home-card-actions" style="padding-top:6px;border-top:1px solid var(--surface-soft);margin-top:6px;">
          <span class="legend" style="color:var(--forest);font-weight:600;">Cortes a partir de R$ 49,99</span>
          <a class="btn primary" style="text-decoration:none;" href="#/novo/1">Agendar avulso</a>
        </div>
      </article>

      <!-- Opção 2: Com Assinatura Clube Motta -->
      <article class="card" style="border:1.5px solid var(--gold);background:linear-gradient(180deg, #FFFFFF 0%, #F9F7F2 100%);">
        <div class="row between">
          <div>
            <span class="badge" style="background:var(--warn-bg);color:var(--warn-text);margin-bottom:6px;display:inline-block;">Manutenção Contínua</span>
            <div class="item" style="font-size:1rem;color:var(--text-strong)">Clube MOTTA — Assinatura Recorrente</div>
            <div class="legend" style="color:var(--text-2);margin-top:2px;">Planos mensais fixos com frequência semanal ou quinzenal programada, sem cobrança avulsa por visita. Categorias Club Gold e Club Black.</div>
          </div>
        </div>
        <div class="row between home-card-actions" style="padding-top:6px;border-top:1px solid #EBE5D8;margin-top:6px;">
          <span class="legend" style="color:#003D1B;font-weight:700;">A partir de R$ 125,99/mês</span>
          <a class="btn" style="background:var(--forest);color:#fff;text-decoration:none;" href="#/planos">Assinar e agendar</a>
        </div>
      </article>

      <div style="text-align:center;padding:2px 0;">
        <a class="link" style="color:var(--forest);font-size:0.8125rem;text-decoration:none;font-weight:600;" href="#/tabela">Ver tabela completa de serviços e preços →</a>
      </div>
    </section>

    <section class="home-experience" aria-labelledby="experience-title">
      <div class="home-experience-copy">
        <span class="home-experience-eyebrow">Seu momento começa aqui</span>
        <h2 id="experience-title">Muito além do corte e da barba.</h2>
        <p>Cuidado em cada detalhe para você se sentir bem e manter seu estilo.</p>
      </div>
      <img class="home-experience-image" src="assets/experiencia/atendimento.jpg" width="484" height="604" loading="lazy" alt="Cliente recebe cuidado com a barba na Barbearia Motta">
      <div class="home-experience-details">
        <div><h3>Profissionais preparados</h3><p>Atendimento que entende seu estilo.</p></div>
        <div><h3>Produtos selecionados</h3><p>O cuidado certo para manter o resultado.</p></div>
        <div><h3>Conforto e cuidado</h3><p>Um padrão que faz você querer voltar.</p></div>
        <a href="https://www.instagram.com/p/DeRtSUdoF2S/" target="_blank" rel="noopener noreferrer">Conheça a experiência no Instagram <span aria-hidden="true">↗</span></a>
      </div>
    </section>

    <!-- Card Lounge & Minigames: Enquanto você aguarda -->
    <section class="card lounge-game-card">
      <div style="position:absolute;top:-40px;right:-40px;width:140px;height:140px;background:radial-gradient(circle, rgba(199,165,102,0.2) 0%, transparent 70%);border-radius:50%;pointer-events:none;"></div>
      <div class="row between" style="align-items:center;">
        <span class="pill" style="background:rgba(199,165,102,0.2);color:var(--gold-soft);border:1px solid rgba(199,165,102,0.45);">
          Lounge &amp; Hospitalidade
        </span>
        <span class="legend" style="color:var(--gold-soft);font-size:0.6875rem;letter-spacing:1px;font-weight:600;">ENQUANTO AGUARDA</span>
      </div>
      <div class="lounge-game-copy">
        <div class="eyebrow">MOTTA / INTERVALO</div>
        <h2>O luxo de não ter pressa.</h2>
        <p class="body">Chegou mais cedo ou aguardando seu horário no lounge? Desfrute de um Café Nespresso ou Chopp cortesia e experimente nossos 4 minigames exclusivos de precisão, ritmo e contemplação.</p>
      </div>
      <div class="lounge-game-preview" aria-label="Atalhos dos minigames">
        <a class="lounge-game-mini" href="#/play/equilibrio"><small>01 · Precisão</small><strong>Equilíbrio</strong></a>
        <a class="lounge-game-mini" href="#/play/frequencia"><small>02 · Sintonia</small><strong>Frequência</strong></a>
        <a class="lounge-game-mini" href="#/play/continuum"><small>03 · Lógica</small><strong>Continuum</strong></a>
        <a class="lounge-game-mini" href="#/play/ondas"><small>04 · Ritmo</small><strong>Ondas</strong></a>
      </div>
      <div class="row" style="gap:8px;align-items:center;flex-wrap:wrap;">
        <a class="btn primary" style="background:var(--gold);color:var(--ink);font-weight:700;text-decoration:none;flex:1;min-height:44px;display:flex;align-items:center;justify-content:center;" href="#/play">Jogar no Lounge →</a>
        <a class="btn" style="background:rgba(255,255,255,0.12);color:#fff;text-decoration:none;min-height:44px;display:flex;align-items:center;justify-content:center;" href="play/" target="_blank" rel="noopener">Tela Cheia ↗</a>
      </div>
      <div class="lounge-game-meta">
        <span>04 Experiências</span>
        <span aria-hidden="true">•</span>
        <span>15–45 segundos</span>
        <span aria-hidden="true">•</span>
        <span>Sem anúncios</span>
      </div>
    </section>

    <!-- Hospitalidade e Localização -->
    <section class="card" style="padding:18px;gap:12px;">
      <div class="row" style="gap:10px;align-items:center;">
        <div class="avatar" style="background:#E6F1E5;color:var(--forest);display:flex;align-items:center;justify-content:center;" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
        </div>
        <div>
          <div class="item" style="color:var(--text-strong);">Unidade Sol &amp; Mar (Macaé - RJ)</div>
          <div class="legend">Av. Carlos Augusto T. Garcia, 2040 • Valet cortesia</div>
        </div>
      </div>
      <div class="legend" style="color:var(--text-2);line-height:1.4;">Lounge climatizado com Café Nespresso e Chopp Artesanal inclusos em todos os atendimentos.</div>
      <div class="home-whatsapp"><span class="home-whatsapp-contact">WhatsApp Oficial<br><span>(22) 99838-9803</span></span><a class="btn primary home-whatsapp-action" href="https://wa.me/5522998389803" target="_blank" rel="noopener">Falar agora →</a></div>
    </section>

    <div class="row home-shortcuts" style="gap:8px;">
      <a class="btn" style="flex:1;text-align:center;text-decoration:none;" href="#/clube">Benefícios e Marcas</a>
      <a class="btn" style="flex:1;text-align:center;text-decoration:none;" href="#/login">Acessar Conta</a>
      <a class="btn" style="flex:100%;text-align:center;text-decoration:none;border:1px solid rgba(199,165,102,0.4);background:rgba(199,165,102,0.08);color:var(--forest);font-weight:600;" href="#/play">Jogar no Lounge (Motta Play) →</a>
    </div>

    <footer class="home-footer"><p class="legend">Barbearia Motta Macaé •  &amp; Estética Masculina</p></footer>`;
	},
	tabela() {
		return `<header class="col gap4">
      <div class="row between" style="align-items:center;">
        <div class="row"><span class="eyebrow" style="color:var(--gold-ink);letter-spacing:1.92px;">Barbearia Motta</span><span class="dot"></span><span class="legend">Tabela Oficial</span></div>
        <img src="assets/logos/motta-symbol-green.png" alt="Motta" style="width:26px;height:26px;object-fit:contain;">
      </div>
      <h1 class="h-display" style="font-size:1.625rem;line-height:1.231;">Tabela de Serviços e Preços</h1>
      <p class="body">Valores oficiais e atualizados de serviços avulsos e assinaturas mensais da Barbearia Motta.</p>
    </header>

    <div class="col gap8" style="margin-bottom:8px">
      <div class="row between" style="align-items:center">
        <h2 class="h-section" style="font-size:1.125rem;margin:0">Serviços Avulsos</h2>
        <span class="legend">${services.length} serviços</span>
      </div>
      <p class="table-hint" id="services-hint">Role a tabela lateralmente para visualizar todos os detalhes</p>
      <div class="table-wrapper" tabindex="0" role="region" aria-labelledby="pricing-caption" aria-describedby="services-hint">
        <table>
          <caption id="pricing-caption">Barbearia Motta • Tabela Oficial de Serviços Avulsos</caption>
          <thead>
            <tr>
              <th scope="col" style="width:36%">Categoria</th>
              <th scope="col">Serviço</th>
              <th scope="col" style="text-align:right;white-space:nowrap">Valor</th>
            </tr>
          </thead>
          <tbody>
            ${services
							.map(
								(s) => `
              <tr>
                <th scope="row" style="font-weight:600;color:var(--forest);font-size:0.6875rem;text-transform:uppercase;">${s.cat}</th>
                <td style="color:var(--text-strong);font-weight:500;">${s.name}</td>
                <td style="text-align:right;white-space:nowrap;font-weight:700;color:var(--ink);">${s.priceDisplay ? s.priceDisplay : (s.starting ? '<span class="legend" style="font-size:0.625rem;font-weight:500;display:block">A partir de</span>' : "") + formatCurrency(s.price)}</td>
              </tr>
            `,
							)
							.join("")}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Planos de Recorrência (Assinaturas Mensais) -->
    <div class="col gap8" style="margin-top:12px;margin-bottom:8px">
      <div class="row between" style="align-items:center">
        <h2 class="h-section" style="font-size:1.125rem;margin:0">Planos de Recorrência (Assinaturas Mensais)</h2>
        <span class="badge" style="background:var(--warn-bg);color:var(--warn-text)">Clube Motta</span>
      </div>
      <p class="table-hint" id="plans-hint">Role a tabela lateralmente para comparar planos e coberturas</p>
      <div class="table-wrapper" tabindex="0" role="region" aria-labelledby="plans-caption" aria-describedby="plans-hint">
        <table>
          <caption id="plans-caption">Barbearia Motta • Planos de Assinatura Mensal</caption>
          <thead>
            <tr>
              <th scope="col" style="width:30%">Plano</th>
              <th scope="col">Cobertura &amp; Benefícios</th>
              <th scope="col" style="text-align:right;white-space:nowrap">Valor Mensal</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" style="font-weight:700;color:var(--gold-ink);font-size:0.8125rem;">Club Gold</th>
              <td style="color:var(--text-strong);font-size:0.75rem;">Manutenção programada para cabelo e barba.</td>
              <td style="text-align:right;white-space:nowrap;font-weight:700;color:var(--ink);"><b style="font-size:0.9375rem">${formatCurrency(125.99)}</b><small class="legend" style="display:block">/mês</small></td>
            </tr>
            <tr>
              <th scope="row" style="font-weight:700;color:#071E13;font-size:0.8125rem;">Club Black</th>
              <td style="color:var(--text-strong);font-size:0.75rem;">Acesso ilimitado/premium com benefícios e condições exclusivas.</td>
              <td style="text-align:right;white-space:nowrap;font-weight:700;color:var(--ink);"><b style="font-size:0.9375rem">${formatCurrency(299.99)}</b><small class="legend" style="display:block">/mês</small></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="col gap8">
      <a class="btn primary" style="text-align:center;text-decoration:none;" href="#/novo/1">Agendar Procedimento Avulso</a>
      <a class="btn" style="text-align:center;text-decoration:none;" href="#/planos">Conhecer e Assinar Planos</a>
      <a class="btn" style="text-align:center;text-decoration:none;" href="#/inicio">Voltar ao Início</a>
    </div>`;
	},
	novo(step) {
		const B = state.book;
		const daySlots = getAvailableDaySlots();
		const validTimes = getValidTimes();
		const selectedDaySlot = daySlots.find((d) => d.available && d.day === Number(B.day)) || null;
		const hasValidTime = validTimes.includes(B.time);
		const selectedPro = pros.find((p) => p.id === B.pro) || null;
		const steps = [
			"Serviços",
			"Profissional",
			"Data e Hora",
			"Revisão",
			"Confirmação",
		];
		const bar = `<div class="col gap8"><div class="row between"><span class="eyebrow">Etapa ${step} de 5</span><span class="legend">${step * 20}% concluído</span></div>
      <div class="bar" role="progressbar" aria-valuenow="${step}" aria-valuemin="1" aria-valuemax="5"><i style="width:${step * 20}%"></i></div>
      <div class="row between legend" style="gap:4px 8px">${steps.map((n, i) => `<span style="color:${i + 1 === step ? "var(--forest)" : ""};font-weight:${i + 1 === step ? 700 : 400}">${i + 1}. ${n}</span>`).join("")}</div></div>`;
		const total = services
			.filter((x) => B.svc.includes(x.id))
			.reduce((a, x) => a + x.price, 0);
		const fmt = (n, starting = false) =>
			(starting ? "A partir de " : "") + formatCurrency(n);
		const foot = (next, label, back, canAdvance = true, guidanceMsg = "") =>
			`<div class="col gap8">
        ${!canAdvance && guidanceMsg ? `<div class="booking-guidance" role="status">${escapeHtml(guidanceMsg)}</div>` : ""}
        <div class="row between"><span class="legend">${B.svc.length} serviço(s) selecionado(s)</span><b style="color:var(--ink);font-size:1.1875rem">${fmt(total)}</b></div>
        <a class="btn primary ${canAdvance ? "" : "is-disabled"}" style="text-align:center;text-decoration:none" href="#/novo/${next}" ${canAdvance ? "" : `aria-disabled="true" data-blocked-msg="${escapeHtml(guidanceMsg)}"`}>${label}</a>
        ${back ? `<a class="btn" style="text-align:center;text-decoration:none" href="#/novo/${back}">Voltar</a>` : ""}
      </div>`;

		if (step === 1) {
			const activeCat = B.cat || "Todos";
			const cats =
				activeCat === "Todos"
					? serviceCategories.filter((c) => c !== "Todos")
					: [activeCat];
			const canAdvanceStep1 = B.svc.length > 0;
			return `<header class="col gap4">
        <h1 class="h-page">Novo Agendamento</h1>
        <span class="legend">Seleção de Serviços · Tabela Oficial Unidade Sol &amp; Mar</span>
      </header>${bar}
      <div class="card" style="flex-direction:row;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px">
        <div>
          <div class="item" style="color:var(--ink)">Tabela Oficial 2026</div>
          <div class="legend">${B.svc.length} procedimento(s) marcado(s)</div>
        </div>
        <a class="btn" style="text-decoration:none;font-size:0.75rem;padding:8px 14px;min-height:44px;white-space:nowrap" href="#/tabela">Ver tabela</a>
      </div>
      <div class="chips chips-wrap" role="group" aria-label="Filtrar por Categoria">
        ${serviceCategories.map((c) => `<button class="chip ${activeCat === c ? "on" : ""}" data-scat="${c}" aria-pressed="${activeCat === c}">${c}</button>`).join("")}
      </div>
      <div class="col gap16">
        ${cats
					.map((catName) => {
						const list = services.filter((s) => s.cat === catName);
						return `<div class="col gap8">
            <div class="row between" style="padding-top:4px"><span class="eyebrow" style="color:var(--forest);letter-spacing:1px">${catName}</span><span class="legend">${list.length} opções</span></div>
            ${list
							.map((x) => {
								const on = B.svc.includes(x.id);
								return `<button class="card" style="text-align:left;outline:${on ? "2px solid var(--forest)" : "none"};gap:10px" data-svc="${x.id}" aria-pressed="${on}">
                <div class="row between">
                  <span class="h-section" style="font-size:1rem;line-height:1.375">${x.name}</span>
                  ${x.tag ? `<span class="badge">${x.tag}</span>` : ""}
                </div>
                <span class="body" style="color:var(--text);font-size:0.8125rem">${x.desc}</span>
                <div class="row between" style="padding-top:4px;border-top:1px solid var(--surface-soft)">
                  <span class="legend" style="color:var(--forest);font-weight:600;font-size:0.6875rem;text-transform:uppercase">${x.cat}</span>
                  <div style="text-align:right">
                    ${x.priceDisplay ? `<b style="color:var(--ink);font-size:1.125rem">${x.priceDisplay}</b>` : `${x.starting ? `<span class="legend" style="font-size:0.6875rem;display:block">A partir de</span>` : ""}<b style="color:var(--ink);font-size:1.125rem">${formatCurrency(x.price)}</b>`}
                  </div>
                </div>
              </button>`;
							})
							.join("")}
          </div>`;
					})
					.join("")}
      </div>${foot(2, "Continuar para Profissional", null, canAdvanceStep1, "Selecione pelo menos um serviço para continuar.")}`;
		}

		if (step === 2) {
			const canAdvanceStep2 = Boolean(selectedPro);
			return `<header class="col gap4"><h1 class="h-page">Escolha o Profissional</h1><span class="legend">Selecione o especialista de sua confiança na unidade Sol &amp; Mar.</span></header>${bar}
      <div class="col gap16">${pros.map((p) => `<button class="card" style="text-align:left;outline:${B.pro === p.id ? "2px solid var(--forest)" : "none"}" data-pro="${p.id}" aria-pressed="${B.pro === p.id}"><div class="pro-card-header"><div class="pro-card-identity"><div class="avatar" style="overflow:hidden;padding:0;background:#F1F4EF;" aria-hidden="true">${p.photo ? `<img src="${p.photo}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;">` : p.name[0]}</div><div class="pro-card-info"><div class="h-section" style="font-size:1rem;line-height:1.35">${p.name}</div><div class="legend">${p.role}</div></div></div><span class="badge pro-card-rate" style="background:var(--warn-bg);color:var(--warn-text)">★ ${p.rate}</span></div><span class="legend">Próximo livre: <b style="color:var(--text-strong)">${p.next}</b></span></button>`).join("")}</div>${foot(3, "Continuar para Data e Horário", 1, canAdvanceStep2, "Selecione um profissional para continuar.")}`;
		}

		if (step === 3) {
			const currentPro = selectedPro?.name || pros[0].name;
			const canAdvanceStep3 = Boolean(selectedDaySlot && hasValidTime && selectedPro);
			const summaryText = canAdvanceStep3
				? `Dia ${selectedDaySlot.dayPadded} (${selectedDaySlot.full}) às ${B.time} • ${currentPro}`
				: !selectedDaySlot && !hasValidTime
					? "Selecione uma data e um horário disponíveis acima para continuar."
					: !selectedDaySlot
						? "Selecione uma data disponível acima para continuar."
						: "Selecione um horário disponível acima para continuar.";

			return `<header class="col gap4"><h1 class="h-page">Escolha Data e Horário</h1><span class="legend">Disponibilidade em tempo real · Próximos dias</span></header>${bar}
      <p class="chips-scroll-hint"><span>Escolha o dia do atendimento</span><span aria-hidden="true">Deslize ↔</span></p>
      <div class="chips" role="group" aria-label="Dias">${daySlots.map((d) => `<button class="chip ${selectedDaySlot?.day === d.day ? "on" : ""}" style="min-width:72px;padding:8px 6px;display:flex;flex-direction:column;align-items:center" aria-pressed="${selectedDaySlot?.day === d.day}" ${!d.available ? "disabled" : ""} data-day="${d.day}"><small>${d.weekdayShort}</small><b>${d.dayPadded}</b><small>${selectedDaySlot?.day === d.day ? "Selecionado" : d.status}</small></button>`).join("")}</div>
      ${TIME_PERIODS.map(([n, r, hs, dis]) => `<section class="col gap8"><div class="row between"><span class="eyebrow" style="color:var(--text-strong)">${n}</span><span class="legend">${r}</span></div><div class="time-slots">${hs.map((h, i) => `<button class="chip ${hasValidTime && B.time === h ? "on" : ""}" aria-pressed="${hasValidTime && B.time === h}" ${i < dis ? 'disabled style="text-decoration:line-through;opacity:.5"' : ""} data-time="${h}">${h}</button>`).join("")}</div></section>`).join("")}
      <div class="card"><div class="item" style="color:var(--text-strong)">Pontualidade &amp; Cancelamentos</div><div class="legend" style="color:var(--text-2)">Tolerância máxima de 15 minutos. Cancelamento sem custo com até 2 horas de antecedência.</div></div>
      <div class="col gap8">
        <div class="${canAdvanceStep3 ? "legend" : "booking-guidance"}" role="status" id="booking-datetime-summary">${escapeHtml(summaryText)}</div>
        <a class="btn primary ${canAdvanceStep3 ? "" : "is-disabled"}" style="text-align:center;text-decoration:none" href="#/novo/4" ${canAdvanceStep3 ? "" : `aria-disabled="true" data-blocked-msg="${escapeHtml(summaryText)}"`}>Prosseguir para Revisão</a>
        <a class="btn" style="text-align:center;text-decoration:none" href="#/novo/2">Voltar</a>
      </div>`;
		}

		if (step === 4) {
			const sel = services.filter((x) => B.svc.includes(x.id));
			const pro = selectedPro || pros[0];
			const dayLabel = selectedDaySlot ? `Dia ${selectedDaySlot.dayPadded} (${selectedDaySlot.full})` : `Dia ${String(B.day ?? "").padStart(2, "0")}`;
			const hasStarting = sel.some((x) => x.starting || x.priceDisplay);
			return `<header class="col gap4"><h1 class="h-page">Revisão e Confirmação</h1><span class="legend">Confira os dados, procedimentos e valores antes de finalizar.</span></header>${bar}
      <section class="card"><span class="eyebrow" style="color:#4C6455">Quando &amp; onde</span><div class="item" style="font-size:0.875rem;color:var(--text-strong)">Data agendada: ${escapeHtml(dayLabel)}</div><div class="legend">${escapeHtml(B.time)} · Unidade Sol &amp; Mar — Av. Carlos Augusto T. Garcia, 2040, Macaé - RJ</div></section>
      <section class="card"><span class="eyebrow" style="color:#4C6455">Profissional especialista</span><div class="item" style="font-size:0.875rem;color:var(--text-strong)">${pro.name}</div><div class="legend">${pro.role}</div></section>
      <section class="card"><span class="eyebrow" style="color:#4C6455">Procedimentos selecionados (${sel.length})</span>${sel.map((x) => `<div class="row between"><span class="item" style="color:var(--text-strong)">${x.name}</span><b style="color:var(--ink)">${x.priceDisplay || fmt(x.price, x.starting)}</b></div>`).join("")}</section>
      <section class="card"><span class="eyebrow" style="color:#4C6455">Resumo financeiro</span>
        <div class="row between legend"><span>Forma de cobrança</span><span>Balcão / Recepção</span></div>
        <div class="row between"><b style="color:var(--text-2)">TOTAL ESTIMADO</b><b style="font-size:1.5rem;color:#003D1B">${hasStarting ? "A partir de " : ""}${fmt(total)}</b></div>
        ${hasStarting ? `<p class="legend" style="color:var(--text-2);font-size:0.6875rem">* Procedimentos com indicação "A partir de", faixas de valores ou sob consulta têm valor final confirmado na recepção.</p>` : ""}
      </section>
      <label class="card" style="flex-direction:row;gap:12px;align-items:flex-start;font-size:0.6875rem;color:var(--text-strong)"><input type="checkbox" id="agree" ${B.agree ? "checked" : ""} style="width:20px;height:20px;accent-color:var(--forest);flex:none"><span>Li e concordo com os termos de comparecimento, tolerância de 15 minutos e política de cancelamento da Barbearia Motta.</span></label>
      <div class="col gap8"><button class="btn primary" id="confirm-book">Confirmar Agendamento</button><a class="btn" style="text-align:center;text-decoration:none" href="#/novo/3">Voltar e Modificar Dados</a></div>`;
		}

		const pro = selectedPro || pros[0];
		const dayFormatted = selectedDaySlot ? selectedDaySlot.dayPadded : String(B.day ?? "").padStart(2, "0");
		const svcNames = services
			.filter((x) => B.svc.includes(x.id))
			.map((x) => x.name)
			.join(" + ");
		const waText = encodeURIComponent(
			`Olá, Barbearia Motta! Acabei de agendar pelo aplicativo:\n\n` +
				`Procedimento(s): ${svcNames}\n` +
				`Profissional: ${pro.name}\n` +
				`Data: Dia ${dayFormatted} às ${B.time}h\n` +
				`Unidade Sol & Mar — Av. Carlos Augusto T. Garcia, 2040\n` +
				`Voucher: #MOTTA-2026-8849\n` +
				`Total: ${fmt(total)}\n\n` +
				`Favor confirmar o recebimento na recepção!`,
		);
		const waUrl = `https://wa.me/5522998389803?text=${waText}`;

		return `<header class="col gap4" style="text-align:center;align-items:center"><span class="badge" style="background:var(--warn-bg);color:var(--warn-text)">MOTTA CLUB PRIORITY • #MOTTA-2026-8849</span><h1 class="h-display" style="font-size:1.875rem;line-height:1.25;color:var(--text-strong)">Agendamento Confirmado!</h1><p class="body">Sua reserva foi processada. Apresente seu voucher digital ao chegar no balcão da unidade Sol &amp; Mar.</p></header>${bar}
      <section class="hero"><div class="row between"><span class="eyebrow">Unidade Macaé</span><img src="assets/logos/motta-symbol-gold.png" alt="Motta" style="width:24px;height:24px;object-fit:contain;"></div><h2>Barbearia Motta — Sol &amp; Mar</h2><div class="meta">Dia ${dayFormatted}<b>${B.time}h (comparecimento pontual)</b></div><div class="meta">Profissional<b>${pro.name}</b></div><div class="meta">A pagar no local<b style="color:var(--mint-on-dark);font-size:1rem">${fmt(total)}</b></div></section>
      <section class="card" style="align-items:center;text-align:center;padding:20px;gap:12px;border:1px solid #E6F1E5;">
        <img src="assets/logos/club-motta-transparent.png" alt="Club Motta" style="height:32px;object-fit:contain;">
        <span class="legend" style="color:var(--forest);font-weight:700;text-transform:uppercase;letter-spacing:0.8px;">Voucher Digital • Apresente na Recepção</span>
        <svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg" style="background:#fff;padding:8px;border-radius:8px;">
          <rect width="140" height="140" fill="white"/>
          <rect x="10" y="10" width="35" height="35" rx="4" fill="#071E13"/>
          <rect x="15" y="15" width="25" height="25" rx="2" fill="white"/>
          <rect x="20" y="20" width="15" height="15" rx="2" fill="#071E13"/>
          <rect x="95" y="10" width="35" height="35" rx="4" fill="#071E13"/>
          <rect x="100" y="15" width="25" height="25" rx="2" fill="white"/>
          <rect x="105" y="20" width="15" height="15" rx="2" fill="#071E13"/>
          <rect x="10" y="95" width="35" height="35" rx="4" fill="#071E13"/>
          <rect x="15" y="100" width="25" height="25" rx="2" fill="white"/>
          <rect x="20" y="105" width="15" height="15" rx="2" fill="#071E13"/>
          <rect x="55" y="15" width="8" height="8" fill="#15552D"/>
          <rect x="70" y="15" width="8" height="8" fill="#071E13"/>
          <rect x="55" y="30" width="15" height="8" fill="#C7A566"/>
          <rect x="75" y="30" width="8" height="15" fill="#15552D"/>
          <rect x="20" y="55" width="8" height="15" fill="#071E13"/>
          <rect x="35" y="65" width="15" height="8" fill="#15552D"/>
          <rect x="55" y="55" width="25" height="25" rx="4" fill="#071E13"/>
          <rect x="60" y="60" width="15" height="15" fill="#C7A566"/>
          <rect x="90" y="55" width="15" height="8" fill="#15552D"/>
          <rect x="115" y="60" width="15" height="8" fill="#071E13"/>
          <rect x="90" y="75" width="8" height="20" fill="#071E13"/>
          <rect x="105" y="70" width="15" height="8" fill="#15552D"/>
          <rect x="120" y="85" width="10" height="10" fill="#C7A566"/>
          <rect x="55" y="95" width="15" height="8" fill="#071E13"/>
          <rect x="75" y="95" width="8" height="15" fill="#15552D"/>
          <rect x="55" y="115" width="25" height="8" fill="#15552D"/>
          <rect x="90" y="105" width="15" height="15" fill="#071E13"/>
          <rect x="110" y="115" width="18" height="8" fill="#15552D"/>
        </svg>
        <span style="font-size:0.75rem;font-family:Liberation Mono,monospace;font-weight:700;color:#071E13;">#MOTTA-2026-8849</span>
      </section>

      <!-- Botão de Demonstração / Envio WhatsApp -->
      <a class="btn" style="background:#25D366;color:#fff;text-align:center;text-decoration:none;font-weight:700;display:flex;align-items:center;justify-content:center;gap:8px;padding:12px 16px;box-shadow:0 4px 14px rgba(37,211,102,0.35);" href="${waUrl}" target="_blank" rel="noopener">
        <span>📲 Enviar Confirmação para o WhatsApp</span>
      </a>

      <section class="card"><div class="h-section" style="font:400 1rem/1.5 var(--serif)">Diretrizes do Seu Atendimento</div><div class="legend" style="color:var(--text-2)"><b>1. Chegue com 10 min de antecedência.</b> Aproveite o lounge.<br><b>2. Tolerância de 15 minutos.</b><br><b>3. Reagendamento sem multas</b> pelo app até 2 horas antes.</div></section>
      <div class="col gap8"><a class="btn primary" style="text-align:center;text-decoration:none" href="#/agendamentos">Ver Meus Agendamentos</a><a class="btn" style="text-align:center;text-decoration:none" href="#/inicio">Voltar ao Início</a></div>`;
	},

	perfil() {
		const u = {
			name: "Vinícius Cunha",
			phone: "(22) 99999-0000",
			email: "cliente@exemplo.com",
			birth: "01/01/1990",
			cep: "27900-000",
			rua: "Rua Exemplo",
			num: "100",
			comp: "",
			bairro: "Centro",
			cidade: "Macaé",
			uf: "RJ",
			...(state.user || {}),
		};
		const f = (l, id, v, ph) =>
			`<label class="col" style="gap:4px"><span class="legend" style="font-weight:500">${l}</span><input id="prof-${id}" name="${id}" value="${escapeHtml(v)}" placeholder="${ph || ""}" style="min-height:44px;padding:10px 12px;border-radius:var(--r-md);border:1px solid #d4dad4;background:#fff;font:400 14px var(--sans);color:#171B18"></label>`;
		return `<header class="col gap4"><span class="eyebrow" style="color:var(--muted);letter-spacing:1.2px">Configurações da conta</span><h1 class="h-page">Seu perfil</h1><p class="body">Gerencie suas informações pessoais, endereço e preferências da sua conta na Barbearia Motta.</p></header>
    <section class="hero"><span class="eyebrow">Seu perfil</span><h2 style="font:500 1.1875rem/1.316 var(--sans)">${escapeHtml(u.name)}</h2><p class="meta">Cliente desde out/2023</p></section>
    <form id="profile" class="col gap24">
      <section class="card"><h2 class="h-section">Informações pessoais</h2>${f("Nome completo *", "name", u.name)}${f("Telefone *", "phone", u.phone)}${f("E-mail *", "email", u.email)}${f("Data de nascimento *", "birth", u.birth)}</section>
      <section class="card"><h2 class="h-section">Endereço</h2>${f("CEP *", "cep", u.cep)}${f("Rua *", "rua", u.rua)}${f("Número *", "num", u.num)}${f("Complemento", "comp", u.comp, "Ex.: Apto, Bloco, Sala")}${f("Bairro *", "bairro", u.bairro)}${f("Cidade *", "cidade", u.cidade)}${f("UF *", "uf", u.uf)}</section>
      <section class="card"><h2 class="h-section">Notificações</h2>${[
				["Lembretes de agendamento", "Avisos via WhatsApp", true],
				["Novidades e promoções", "Ofertas e benefícios do Clube", false],
			]
				.map(
					([t, d, on]) =>
						`<label class="row between"><span><span class="item" style="color:#171B18;display:block">${t}</span><span class="legend">${d}</span></span><input type="checkbox" role="switch" ${on ? "checked" : ""} style="width:22px;height:22px;accent-color:var(--forest)"></label>`,
				)
				.join("")}</section>
            <div class="row" style="gap:8px"><a class="btn" href="#/clube" style="text-decoration:none;flex:1;text-align:center">Cancelar</a><button class="btn primary" style="flex:1" type="submit">Salvar alterações</button></div>
      <button class="btn danger" id="logout-btn" type="button" style="width:100%;text-align:center;border:1px solid #BA1A1A;">Sair da Conta (Logout)</button>
    </form>`;
	},
};

/* ---------- roteador ---------- */
const titles = {
	inicio: "Início",
	play: "Intervalo & Minigames no Lounge",
	login: "Entrar / Cadastro",
	boas_vindas: "Boas-vindas",
	clube: "Produtos e benefícios",
	plano: "Meu plano",
	beneficios: "Benefícios do plano",
	agendamentos: "Agendamentos",
	agendamentos_vazio: "Sua Agenda",
	planos: "Planos",
	perfil: "Perfil",
	novo: "Novo agendamento",
	tabela: "Tabela de Serviços e Preços",
};
let mimosTimer;
let welcomeObserver;
function setupWelcomeReveal() {
	welcomeObserver?.disconnect();
	if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
	const cards = view.querySelectorAll(".welcome-options > .card");
	if (!cards.length) return;
	cards.forEach((card) => card.classList.add("reveal-pending"));
	welcomeObserver = new IntersectionObserver((entries) => {
		for (const entry of entries) {
			if (entry.isIntersecting) {
				entry.target.classList.add("reveal-ready");
				entry.target.classList.remove("reveal-pending");
			} else if (entry.boundingClientRect.top >= innerHeight) {
				entry.target.classList.remove("reveal-ready");
				entry.target.classList.add("reveal-pending");
			}
		}
	}, { threshold: 0.1 });
	cards.forEach((card) => welcomeObserver.observe(card));
}
function setupMimos() {
	clearInterval(mimosTimer);
	const carousel = view.querySelector(".mimos-carousel");
	if (!carousel) return;
	const slides = [...carousel.querySelectorAll(".mimos-slide")];
	const position = carousel.querySelector(".mimos-position");
	const pause = carousel.querySelector('[data-mimos="pause"]');
	let current = 0;
	let playing = !matchMedia("(prefers-reduced-motion: reduce)").matches;
	const show = (index) => {
		current = (index + slides.length) % slides.length;
		slides.forEach((slide, i) => { slide.hidden = i !== current; });
		position.textContent = `${current + 1} / ${slides.length}`;
	};
	const sync = () => {
		clearInterval(mimosTimer);
		pause.textContent = playing ? "Pausar" : "Reproduzir";
		if (playing) mimosTimer = setInterval(() => { if (!document.hidden) show(current + 1); }, 5000);
	};
	carousel.addEventListener("focusin", (event) => { if (playing && event.target.matches(":focus-visible")) { playing = false; sync(); } });
	carousel.addEventListener("click", (event) => {
		const action = event.target.closest("[data-mimos]")?.dataset.mimos;
		if (!action) return;
		if (action === "pause") playing = !playing;
		else { playing = false; show(current + (action === "next" ? 1 : -1)); }
		sync();
	});
	sync();
}
function render() {
	const [route, arg] = (location.hash.replace("#/", "") || "inicio").split("/");
	if (!screens[route]) {
		location.replace("#/inicio");
		return;
	}

	// Guard de rotas protegidas (Agendamentos, Clube, Perfil exigem login)
	const protectedRoutes = [
		"agendamentos",
		"clube",
		"plano",
		"beneficios",
		"perfil",
	];
	if (!state.isLoggedIn && protectedRoutes.includes(route)) {
		showToast("Faça login para acessar esta área");
		location.replace("#/login");
		return;
	}

	let step = Math.min(5, Math.max(1, +arg || 1));
	if (route === "novo") {
		const B = state.book;
		const daySlots = getAvailableDaySlots();
		const validTimes = getValidTimes();
		const hasValidDay = daySlots.some((d) => d.available && d.day === Number(B.day));
		const hasValidTime = validTimes.includes(B.time);
		const hasValidPro = pros.some((p) => p.id === B.pro);
		if (step >= 2 && B.svc.length === 0) {
			showToast("Selecione pelo menos um serviço");
			location.replace("#/novo/1");
			return;
		}
		if (step >= 3 && !hasValidPro) {
			showToast("Selecione um profissional");
			location.replace("#/novo/2");
			return;
		}
		if (step >= 4 && (!hasValidDay || !hasValidTime)) {
			showToast("Selecione uma data e um horário disponíveis");
			location.replace("#/novo/3");
			return;
		}
		if (step === 5 && !B.done) {
			location.replace("#/novo/4");
			return;
		}
		if (step < 5) B.done = false;
	}

	const updateDOM = () => {
		clearInterval(mimosTimer);
		welcomeObserver?.disconnect();
		if (window.MottaPlay && route !== "play") window.MottaPlay.cleanup();
		view.innerHTML = screens[route](route === "play" ? arg : step);
		if (window.MottaPlay && route === "play") window.MottaPlay.init(arg);
		setupMimos();
		setupWelcomeReveal();
		const playSubtitles = {
			equilibrio: "Equilíbrio · Minigame",
			frequencia: "Frequência · Minigame",
			continuum: "Continuum · Minigame",
			ondas: "Ondas · Minigame"
		};
		const pageTitle = route === "play" && arg && playSubtitles[arg]
			? `Motta — ${playSubtitles[arg]}`
			: `Motta — ${titles[route] || "Barbearia"}`;
		document.title = pageTitle;

		// Atualizar Navbar conforme estado de login (arquitetura consistente de 5 abas)
		const nav = document.querySelector("nav");
		nav.classList.remove("is-hidden");
		nav.innerHTML = `
      <a href="#/inicio"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>Início</a>
      <a href="#/agendamentos"><svg aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>Agendamentos</a>
      <a href="#/clube"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.500l6.100-.9z"/></svg>Clube</a>
      <a href="#/planos"><svg aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18"/></svg>Planos</a>
      <a href="${state.isLoggedIn ? "#/perfil" : "#/login"}"><svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>${state.isLoggedIn ? "Perfil" : "Entrar"}</a>
    `;

		document.querySelectorAll("nav a").forEach((a) => {
			const target = a.getAttribute("href").slice(2);
			const active =
				target === route ||
				((route === "plano" || route === "beneficios") && target === "clube") ||
				((route === "novo" || route === "agendamentos_vazio") &&
					target === "agendamentos");
			active
				? a.setAttribute("aria-current", "page")
				: a.removeAttribute("aria-current");
		});

		window.scrollTo(0, 0);
		view.focus({ preventScroll: true });
	};

	if (
		typeof document.startViewTransition === "function" &&
		!window.matchMedia("(prefers-reduced-motion: reduce)").matches
	) {
		const transition = document.startViewTransition(updateDOM);
		transition.finished.finally(() => {
			view.focus({ preventScroll: true });
		});
	} else {
		updateDOM();
	}
}

window.addEventListener("hashchange", render);

document.addEventListener("keydown", (e) => {
	if (e.target.matches('[role="tab"]')) {
		const tablist = e.target.closest('[role="tablist"]');
		if (!tablist) return;
		const tabButtons = [...tablist.querySelectorAll('[role="tab"]')];
		const idx = tabButtons.indexOf(e.target);
		if (idx === -1) return;
		let nextIdx = idx;
		if (e.key === "ArrowRight") nextIdx = (idx + 1) % tabButtons.length;
		else if (e.key === "ArrowLeft") nextIdx = (idx - 1 + tabButtons.length) % tabButtons.length;
		else if (e.key === "Home") nextIdx = 0;
		else if (e.key === "End") nextIdx = tabButtons.length - 1;
		else return;
		e.preventDefault();
		tabButtons[nextIdx].focus();
		tabButtons[nextIdx].click();
	}
});

let cancelId = null;
document.addEventListener("click", (e) => {
	const blockedLink = e.target.closest('[aria-disabled="true"][data-blocked-msg]');
	if (blockedLink) {
		e.preventDefault();
		showToast(blockedLink.dataset.blockedMsg);
		return;
	}

	const t = e.target.closest(
		"[data-copy],[data-toast],[data-ag],[data-pf],[data-cancel],[data-bf],[data-svc],[data-scat],[data-pro],[data-day],[data-time],#confirm-book,#logout-btn,#tab-login,#tab-register",
	);
	if (!t) return;

	// Alternar abas Login / Cadastro
	if (t.id === "tab-login") {
		$("#tab-login").classList.add("on");
		$("#tab-login").setAttribute("aria-selected", "true");
		$("#tab-login").tabIndex = 0;
		$("#tab-register").classList.remove("on");
		$("#tab-register").setAttribute("aria-selected", "false");
		$("#tab-register").tabIndex = -1;
		$("#register-fields").style.display = "none";
		$("#auth-submit-btn").textContent = "Acessar Minha Conta";
	} else if (t.id === "tab-register") {
		$("#tab-register").classList.add("on");
		$("#tab-register").setAttribute("aria-selected", "true");
		$("#tab-register").tabIndex = 0;
		$("#tab-login").classList.remove("on");
		$("#tab-login").setAttribute("aria-selected", "false");
		$("#tab-login").tabIndex = -1;
		$("#register-fields").style.display = "flex";
		$("#auth-submit-btn").textContent = "Finalizar Cadastro e Entrar";
	} else if (t.id === "logout-btn") {
		state.isLoggedIn = false;
		state.user = null;
		savePersistentState();
		showToast("Você saiu da conta.");
		location.hash = "#/inicio";
		render();
		return;
	}
	if (t.dataset.copy) {
		navigator.clipboard?.writeText(t.dataset.copy);
		showToast(`Cupom ${t.dataset.copy} copiado`);
	} else if (t.dataset.toast) showToast(t.dataset.toast);
	else if (t.dataset.ag) {
		state.agTab = t.dataset.ag;
		render();
	} else if (t.dataset.pf) {
		state.planFilter = t.dataset.pf;
		render();
	} else if (t.dataset.bf) {
		state.benFilter = t.dataset.bf;
		render();
	} else if (t.dataset.scat) {
		state.book.cat = t.dataset.scat;
		savePersistentState();
		render();
	} else if (t.dataset.svc) {
		const a = state.book.svc,
			k = t.dataset.svc;
		state.book.svc = a.includes(k)
			? a.filter((x) => x !== k)
			: [...a, k];
		savePersistentState();
		render();
	} else if (t.dataset.pro) {
		state.book.pro = t.dataset.pro;
		savePersistentState();
		render();
	} else if (t.dataset.day) {
		const clickedDay = +t.dataset.day;
		state.book.day = state.book.day === clickedDay ? null : clickedDay;
		savePersistentState();
		render();
	} else if (t.dataset.time) {
		const clickedTime = t.dataset.time;
		state.book.time = state.book.time === clickedTime ? null : clickedTime;
		savePersistentState();
		render();
	} else if (t.id === "confirm-book") {
		if (!$("#agree").checked) {
			showToast("Aceite os termos para confirmar");
			return;
		}
		const B = state.book,
			pro = pros.find((p) => p.id === B.pro) || pros[0],
			daySlot = getAvailableDaySlots().find((d) => d.available && d.day === Number(B.day));
		state.appts.push({
			id: "a" + Date.now(),
			day: daySlot ? daySlot.dayPadded : String(B.day).padStart(2, "0"),
			mon: daySlot ? daySlot.mon : now.toLocaleDateString("pt-BR", { month: "short" }).replace(".", ""),
			time: B.time,
			barber: pro.name,
			role: pro.role,
			svc: services
				.filter((x) => B.svc.includes(x.id))
				.map((x) => x.name)
				.join(" + "),
			note: "Confirmado",
			total: formatCurrency(
				services
					.filter((x) => B.svc.includes(x.id))
					.reduce((a, x) => a + x.price, 0),
			),
			when: daySlot ? daySlot.full : `Dia ${B.day}`,
		});
		savePersistentState();
		B.done = true;
		location.hash = "#/novo/5";
	} else if (t.dataset.cancel) {
		cancelId = t.dataset.cancel;
		$("#cancel").showModal();
	}
});
const dlg = $("#cancel");
// Fallback de light dismiss onde closedby não existe (ex.: Safari)
if (!("closedBy" in HTMLDialogElement.prototype)) {
	const outside = (e) => {
		const r = dlg.getBoundingClientRect();
		return (
			e.clientX < r.left ||
			e.clientX > r.right ||
			e.clientY < r.top ||
			e.clientY > r.bottom
		);
	};
	let down = false;
	dlg.addEventListener("pointerdown", (e) => {
		down = outside(e);
	});
	dlg.addEventListener("pointerup", (e) => {
		if (down && outside(e)) dlg.close();
	});
}
dlg.addEventListener("close", () => {
	if (dlg.returnValue === "cancel") {
		state.appts = state.appts.filter((a) => a.id !== cancelId);
		savePersistentState();
		showToast("Agendamento cancelado. Cota devolvida.");
		render();
	}
	dlg.returnValue = "";
});
render();

document.addEventListener("submit", (e) => {
	if (e.target.id === "auth-form") {
		e.preventDefault();
		state.isLoggedIn = true;
		state.user = {
			...(state.user || {}),
			name: $("#auth-name")?.value?.trim() || "Vinícius Cunha",
			phone: $("#auth-phone")?.value?.trim() || "(22) 99999-0000",
		};
		savePersistentState();
		showToast("Bem-vindo! Login realizado com sucesso.");
		location.hash = "#/agendamentos";
		return;
	}
	if (e.target.id !== "profile") return;
	e.preventDefault();
	const form = e.target;
	state.user = {
		...(state.user || {}),
		name: form.querySelector("#prof-name")?.value?.trim() || state.user?.name || "Vinícius Cunha",
		phone: form.querySelector("#prof-phone")?.value?.trim() || state.user?.phone || "",
		email: form.querySelector("#prof-email")?.value?.trim() || state.user?.email || "",
		birth: form.querySelector("#prof-birth")?.value?.trim() || state.user?.birth || "",
		cep: form.querySelector("#prof-cep")?.value?.trim() || state.user?.cep || "",
		rua: form.querySelector("#prof-rua")?.value?.trim() || state.user?.rua || "",
		num: form.querySelector("#prof-num")?.value?.trim() || state.user?.num || "",
		comp: form.querySelector("#prof-comp")?.value?.trim() || state.user?.comp || "",
		bairro: form.querySelector("#prof-bairro")?.value?.trim() || state.user?.bairro || "",
		cidade: form.querySelector("#prof-cidade")?.value?.trim() || state.user?.cidade || "",
		uf: form.querySelector("#prof-uf")?.value?.trim() || state.user?.uf || "",
	};
	savePersistentState();
	showToast("Perfil atualizado com sucesso!");
	render();
});
