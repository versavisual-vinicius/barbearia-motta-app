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

const header = (kicker, sub, title) => `
  <header class="col gap4">
    <div class="row"><span class="eyebrow">${kicker}</span><span class="dot"></span><span class="legend">${sub}</span></div>
    <h1 class="h-page">${title}</h1>
  </header>`;

const tabs = (items, active, attr) => `
  <div class="chips" role="tablist">${items
		.map(
			([id, label]) =>
				`<button class="chip" role="tab" aria-selected="${id === active}" data-${attr}="${id}">${label}</button>`,
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
		id: "gold3",
		tier: "gold",
		dark: true,
		tag: "Mais vendido",
		eyebrow: "Club Motta",
		name: "Club Motta — Corte Barba",
		sub: "Corte Barba ilimitado",
		desc: "O plano mais completo do Club Motta, ideal para manutenção contínua semanal sem cobrança avulsa por visita.",
		price: "229,99",
		per: "por mês via recorrência",
		feats: [
			"Corte com frequência programada",
			"Barba com frequência programada",
			"Sem taxa avulsa por visita",
			"Taxa de ativação R$ 7,00 (1º mês)",
		],
		cta: "Assinar agora",
	},
	{
		id: "gold2",
		tier: "gold",
		name: "Club Motta — Barba",
		sub: "Barba alinhada sempre",
		desc: "Ideal para quem quer a barba sempre desenhada e alinhada toda semana sem cobrança avulsa.",
		price: "129,99",
		per: "por mês",
		feats: [
			"Barba com frequência programada",
			"Barboterapia com toalha quente",
			"Taxa de ativação R$ 7,00 (1º mês)",
		],
		cta: "Comprar",
	},
	{
		id: "gold1",
		tier: "gold",
		name: "Club Motta — Corte",
		sub: "Corte na frequência ideal",
		desc: "Cortes com frequência programada para manter o visual impecável sem pagar a cada visita.",
		price: "125,99",
		per: "por mês",
		feats: [
			"Corte com frequência programada",
			"Manutenção contínua do visual",
			"Taxa de ativação R$ 7,00 (1º mês)",
		],
		cta: "Comprar",
	},
	{
		id: "black1",
		tier: "black",
		dark: true,
		tag: "Vagas limitadas",
		eyebrow: "Club Black",
		name: "Club Black — Corte VIP",
		sub: "Para homens exigentes",
		desc: "Corte sempre em dia, atendimento prioritário, lavagem especial e produtos da linha profissional.",
		price: "159,99",
		per: "por mês",
		scarce: "Resta 4 vaga(s)",
		feats: [
			"Atendimento prioritário",
			"Corte com frequência programada",
			"Linha profissional homologada",
			"Taxa de ativação R$ 7,00 (1º mês)",
		],
		cta: "Garantir vaga",
	},
	{
		id: "black2",
		tier: "black",
		dark: true,
		tag: "Vagas limitadas",
		eyebrow: "Club Black",
		name: "Club Black — Barba VIP",
		sub: "Autocuidado premium",
		desc: "Alinhamento de precisão, toalha quente e tratamentos capilares e de pele com produtos premium.",
		price: "159,99",
		per: "por mês",
		scarce: "Resta 1 vaga(s)",
		feats: [
			"Barba com atendimento prioritário",
			"Toalha quente e barboterapia",
			"Produtos da linha profissional",
			"Taxa de ativação R$ 7,00 (1º mês)",
		],
		cta: "Garantir vaga",
	},
	{
		id: "prime",
		tier: "black",
		dark: true,
		tag: "Poucas vagas",
		eyebrow: "Club Black Prime",
		name: "Club Black — Prime Total",
		sub: "Experiência definitiva",
		desc: "Total liberdade para barba e corte, cobertura ampliada com tratamentos e bebidas cortesia.",
		price: "299,99",
		per: "por mês na assinatura",
		scarce: "Resta 14 vaga(s)",
		feats: [
			"Corte e Barba prioritários",
			"Cobertura de tratamentos e cuidados",
			"Sem cobrança avulsa por visita",
			"Taxa de ativação R$ 7,00 (1º mês)",
		],
		cta: "Garantir vaga",
	},
];
const upcoming = [
	{
		id: "a1",
		day: "24",
		mon: "Out",
		time: "15:30",
		barber: "Michel Nogueira",
		role: "Barbeiro Master Visagista",
		svc: "Corte Masculino + Barba",
		note: "Em 3 dias",
		total: "R$ 32,30",
	},
];
const past = [
	{
		day: "05",
		mon: "Out",
		barber: "Orlando Junior",
		role: "Barbeiro Master",
		svc: "Sobrancelha, Hidratação Capilar, Corte",
		dur: "~60 min",
		total: "R$ 109,99",
	},
	{
		day: "05",
		mon: "Set",
		barber: "Matheus Albuquerque",
		role: "Barbeiro Estilista",
		svc: "Corte Masculino Degradê",
		dur: "~35 min",
		total: "R$ 49,99",
	},
	{
		day: "04",
		mon: "Ago",
		barber: "Wanderson Mota",
		role: "Barbeiro Sênior",
		svc: "Corte Tradicional na Tesoura",
		dur: "~40 min",
		total: "R$ 49,99",
	},
	{
		day: "12",
		mon: "Jun",
		barber: "Welerson Mota",
		role: "Barbeiro Estilista",
		svc: "Design de Sobrancelha, Corte",
		dur: "~45 min",
		total: "R$ 72,00",
	},
];
const serviceCategories = [
	"Todos",
	"Corte Barba",
	"Visagismo",
	"Tratamentos Cuidados",
	"Pigmentação Lavagem",
	"Depilação Sobrancelha",
];

const services = [
	// Corte Barba
	{
		id: "corte",
		cat: "Corte Barba",
		name: "Corte",
		desc: "Corte completo na tesoura ou máquina, alinhamento e finalização.",
		price: 49.99,
		tag: "Mais pedido",
	},
	{
		id: "barba",
		cat: "Corte Barba",
		name: "Barba",
		desc: "Barboterapia com toalha quente, navalhete e pós-barba refrescante.",
		price: 49.99,
		tag: "Destaque",
	},
	{
		id: "corte_kids",
		cat: "Corte Barba",
		name: "Corte Kids (Até 8 anos)",
		desc: "Atendimento paciente e especializado para crianças até 8 anos.",
		price: 60.0,
		tag: "Kids",
	},
	{
		id: "pezinho",
		cat: "Corte Barba",
		name: "Pezinho / Acabamento",
		desc: "Acabamento de costeletas, nuca e contorno perfeito.",
		price: 20.0,
		tag: "Rápido",
	},

	// Visagismo
	{
		id: "visagismo_combo",
		cat: "Visagismo",
		name: "Atendimento com Técnica de Visagismo (Cabelo e Barba)",
		desc: "Experiência completa harmonizando corte e barba com traços anatômicos.",
		price: 199.99,
		tag: "Exclusivo",
	},
	{
		id: "visagismo_corte",
		cat: "Visagismo",
		name: "Corte com Técnica de Visagismo",
		desc: "Análise facial e corte personalizado valorizando o formato do rosto.",
		price: 120.0,
		starting: true,
		tag: "Visagismo",
	},
	{
		id: "visagismo_barba",
		cat: "Visagismo",
		name: "Barba com Técnica de Visagismo",
		desc: "Desenho, proporção e geometria sob medida para a anatomia facial.",
		price: 100.0,
		tag: "Visagismo",
	},
	{
		id: "visagismo_consultoria",
		cat: "Visagismo",
		name: "Consultoria de Visagismo",
		desc: "Diagnóstico completo de imagem, morfologia e alinhamento visual.",
		price: 550.0,
		starting: true,
		tag: "VIP",
	},

	// Tratamentos Cuidados
	{
		id: "selagem",
		cat: "Tratamentos Cuidados",
		name: "Selagem Capilar",
		desc: "Tratamento de redução de volume, controle e alinhamento dos fios.",
		price: 120.0,
		starting: true,
		tag: "Tratamento",
	},
	{
		id: "hidratacao_capilar",
		cat: "Tratamentos Cuidados",
		name: "Hidratação Capilar",
		desc: "Nutrição e reparação profunda para fios ressecados ou opacos.",
		price: 40.0,
		tag: "Cuidado",
	},
	{
		id: "hidratacao_barba",
		cat: "Tratamentos Cuidados",
		name: "Hidratação de Barba",
		desc: "Tratamento intensivo para fios macios, alinhados e sem frizz.",
		price: 40.0,
		tag: "Cuidado",
	},
	{
		id: "limpeza_facial",
		cat: "Tratamentos Cuidados",
		name: "Limpeza Facial",
		desc: "Remoção de impurezas, argiloterapia e esfoliação revigorante.",
		price: 40.0,
		tag: "Estética",
	},

	// Pigmentação Lavagem
	{
		id: "pigmentacao_capilar",
		cat: "Pigmentação Lavagem",
		name: "Pigmentação Capilar",
		desc: "Camuflagem sutil e preenchimento de falhas ou fios brancos.",
		price: 40.0,
		tag: "Definição",
	},
	{
		id: "pigmentacao_barba",
		cat: "Pigmentação Lavagem",
		name: "Pigmentação Barba",
		desc: "Uniformização e definição de tom para aspecto denso e natural.",
		price: 40.0,
		tag: "Definição",
	},
	{
		id: "lavagem_capilar",
		cat: "Pigmentação Lavagem",
		name: "Lavagem Capilar (Simples)",
		desc: "Higienização capilar com shampoo refrescante e secagem.",
		price: 15.0,
		tag: "Express",
	},
	{
		id: "lavagem_barba",
		cat: "Pigmentação Lavagem",
		name: "Lavagem de Barba",
		desc: "Higienização profunda dos fios da barba com produtos especiais.",
		price: 15.0,
		tag: "Express",
	},

	// Depilação Sobrancelha
	{
		id: "depilacao_orelha",
		cat: "Depilação Sobrancelha",
		name: "Depilação Orelha (Cera)",
		desc: "Remoção rápida e higiênica de pelos da orelha com cera morna.",
		price: 25.0,
		tag: "Epilação",
	},
	{
		id: "depilacao_nasal",
		cat: "Depilação Sobrancelha",
		name: "Depilação Nasal (Cera)",
		desc: "Eliminação segura de pelos nasais com cera de alta precisão.",
		price: 25.0,
		tag: "Epilação",
	},
	{
		id: "sobrancelha_navalha",
		cat: "Depilação Sobrancelha",
		name: "Sobrancelha (Navalha)",
		desc: "Alinhamento sutil e limpeza do arco preservando formato natural.",
		price: 20.0,
		tag: "Design",
	},
	{
		id: "sobrancelha_cera",
		cat: "Depilação Sobrancelha",
		name: "Sobrancelha (Cera)",
		desc: "Design e epilação com cera hipoalergênica de maior durabilidade.",
		price: 35.0,
		tag: "Design",
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
	book: { svc: ["corte"], pro: "michel", day: 28, time: "15:00", agree: false },
	agTab: "agendados",
	planFilter: "todos",
	appts:
		Array.isArray(saved?.appts) && saved.appts.length > 0
			? saved.appts
			: [...upcoming],
};

/* ---------- telas ---------- */
const screens = {
	clube() {
		return `${header("Clube Motta", "Vantagens Exclusivas", "Produtos e benefícios 🛍️")}
    <p class="body">Aproveite descontos exclusivos em marcas parceiras e privilégios desenhados para elevar o seu ritual de cuidado.</p>
    <div class="chips"><a class="chip on" href="#/clube" style="text-decoration:none">Produtos e benefícios</a><a class="chip" href="#/plano" style="text-decoration:none">Meu plano</a><a class="chip" href="#/agendamentos" style="text-decoration:none">Agendamentos</a><a class="chip" href="#/perfil" style="text-decoration:none">Editar perfil</a></div>
    <section class="hero" aria-label="Seu plano">
      <div class="row between">
        <div class="row" style="gap:8px;align-items:center;">
          <img src="assets/logos/motta-symbol-gold.png" alt="Motta" style="width:22px;height:22px;object-fit:contain;">
          <span class="eyebrow">Seu plano</span>
        </div>
        <span class="pill">Ativo</span>
      </div>
      <h2>Clube Motta Master</h2>
      <p>Descontos automáticos aplicados no caixa e atendimento com prioridade absoluta.</p>
      <div class="row" style="gap:16px;padding-top:8px"><div class="meta">Próxima renovação<b>05 de Novembro, 2026</b></div><span style="width:1px;height:24px;background:var(--forest-800)"></span><div class="meta">Economia acumulada<b style="color:var(--gold)">R$ 148,00</b></div></div>
    </section>
    <section class="col gap16">
      <div class="row between"><div><h2 class="h-section">Descontos em produtos</h2><p class="legend">Linha profissional selecionada para cuidados diários</p></div></div>
      ${partners
				.map(
					(p) => `
      <article class="card">
        <div class="row between"><div class="row gap8" style="gap:8px"><div class="avatar" aria-hidden="true">${p.badge}</div><div><div class="item" style="color:var(--ink)">${p.name}</div><div class="legend">${p.desc}</div></div></div><span class="badge">${p.off}</span></div>
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
		const brl = (n) => "R$ " + n.toFixed(2).replace(".", ",");
		return `<header class="col gap4"><div class="row"><span class="eyebrow">Plano selecionado</span></div><div class="row between"><h1 class="h-page">Benefícios do Plano</h1><span class="ok" style="color:var(--forest)">Membro Ativo</span></div><p class="body">Conheça cada serviço, cortesias e descontos exclusivos inclusos na sua assinatura.</p></header>
    <div class="chips"><a class="chip on" href="#/beneficios" style="text-decoration:none">Benefícios</a><a class="chip" href="#/plano" style="text-decoration:none">Meu plano</a><a class="chip" href="#/planos" style="text-decoration:none">Comparar</a><a class="chip" href="#/clube" style="text-decoration:none">Dúvidas</a></div>
    <section class="card"><div class="row between"><span class="item" style="color:var(--ink)">100 Cortesias</span><span class="legend">Serviços por mês</span></div><div class="row between"><span class="item" style="color:var(--ink)">Até 100% OFF</span><span class="legend">Nos carros-chefes</span></div><div class="row between"><span class="item" style="color:var(--ink)">Produtos -15%</span><span class="legend">Pomadas e óleos</span></div></section>
    <section class="hero"><span class="eyebrow">Plano selecionado</span><h2 style="font-size:1.75rem;line-height:1.214">Clube Motta</h2><p class="meta">Experiência completa de barbearia com serviços ilimitados e mimos exclusivos.</p><div class="row" style="gap:16px"><span class="meta"><b>100 / mês</b>Serviços grátis</span><span class="meta"><b>Extras -15%</b>Descontos VIP</span></div></section>
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
    <div class="col gap16">${items.map(([n, off, d, p, np]) => `<article class="card"><div class="row between"><span class="h-section">${n}</span><span class="badge" ${np ? 'style="background:var(--warn-bg);color:#78350F"' : ""}>${off}</span></div><p class="body" style="color:var(--muted)">${d}</p><div class="row between"><span><s class="legend">${brl(p)}</s> <b style="color:var(--forest)">${brl(np)}</b></span><a class="link" href="#/novo/1">Agendar</a></div></article>`).join("")}</div>
    <section class="card"><div class="row between"><span class="item" style="color:var(--ink)">Vantagens Inclusas</span><span class="ok" style="color:var(--forest)">Tudo ativo</span></div><ul><li>100 serviços gratuitos por mês</li><li>Descontos de até 100% em procedimentos</li><li>Serviços adicionais com até 15% OFF</li><li>Prioridade na fila e horários premium</li></ul></section>
    <section class="hero"><span class="eyebrow" style="letter-spacing:1.2px">Ambiente exclusivo</span><div class="item">Cerveja artesanal e café cortesia</div></section>
    <div class="col gap8"><a class="btn primary" style="text-align:center;text-decoration:none" href="#/planos">Contratar este plano</a><p class="legend" style="text-align:center">Sem fidelidade forçada. Cancele a qualquer momento no app.</p></div>`;
	},

	plano() {
		const quotas = [
			["Cotas de Corte de Cabelo", 3, 4, "Resta 1 corte até 05/11"],
			["Cotas de Barboterapia Ritual", 2, 4, "Restam 2 rituais até 05/11"],
		];
		return `${header("Assinatura premium", "Meu plano", "Meu Plano Benefícios")}
    <p class="body">Acompanhe o saldo mensal de suas cotas, utilize cortes inclusos e desfrute de privilégios exclusivos.</p>
    <section class="hero" aria-label="Plano ativo">
      <div class="row between">
        <div class="row" style="gap:8px;align-items:center;">
          <img src="assets/logos/motta-symbol-gold.png" alt="Motta" style="width:22px;height:22px;object-fit:contain;">
          <span class="pill">Plano ativo</span>
        </div>
        <span class="item" style="color:var(--gold-soft)">Nível Ouro</span>
      </div>
      <h2>Clube Gold 3 — Corte &amp; Barba</h2>
      <p class="meta">Membro assíduo desde Out/2023 • Renovação automática em 05/11/2026</p>
      <div class="row between" style="padding-top:8px"><span class="meta">Mensalidade:</span><span style="font-weight:700;font-size:1.25rem;color:var(--mint-on-dark)">R$ 229,99<small class="meta">/mês</small></span></div>
      ${quotas.map(([n, u, t]) => `<div class="meta"><div class="row between"><span>${n}</span><span style="color:var(--mint-on-dark);font-weight:600">${u} de ${t} (${(u / t) * 100}%)</span></div><div class="bar" style="background:rgba(255,255,255,.15);margin-top:4px" role="progressbar" aria-valuenow="${u}" aria-valuemax="${t}"><i style="width:${(u / t) * 100}%;background:var(--mint-on-dark)"></i></div></div>`).join("")}
      <div class="meta">Extras Upgrades: <b style="display:inline">15% OFF</b> · Economia anual: <b style="display:inline;color:var(--mint-on-dark)">R$ 640,00</b></div>
    </section>
    <section class="col gap16">
      <div><h2 class="h-section" style="font:400 1.125rem/1.556 var(--serif)">Saldo e Utilização de Cotas</h2><p class="legend">Ciclo vigente: 06/10 a 05/11 · <b style="color:#003D1B">Renovação em 18 dias</b></p></div>
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
    <section class="card"><h2 class="h-section" style="font:400 1.125rem/1.556 var(--serif)">Gestão de Assinatura &amp; Faturamento</h2><div class="item" style="color:var(--text-strong)">Mastercard final •••• 9241</div><div class="legend">Próxima cobrança: 05/11/2026 (R$ 229,99) · Automática</div><div class="legend" style="color:var(--text-2)"><b>Sem período de carência:</b> pause ou cancele a qualquer momento antes da renovação, sem multas.</div><button class="btn" data-toast="Abrindo forma de pagamento (demo)">Alterar forma de pagamento</button><a class="btn" style="text-align:center;text-decoration:none" href="#/planos">Trocar de plano</a></section>
    <p class="legend" style="text-align:center">Protótipo demonstrativo • valores ilustrativos</p>`;
	},

	agendamentos_vazio() {
		return `<header class="col gap4"><span class="eyebrow" style="color:var(--gold);letter-spacing:1.92px">Agenda Motta</span><div class="row between"><h1 class="h-display">Sua Agenda</h1><span class="badge" style="background:var(--mint);color:#123D26">Em dia</span></div></header>
    <div class="chips" role="tablist"><button class="chip on" role="tab" aria-selected="true">Agendados (0)</button><a class="chip" role="tab" href="#/agendamentos" style="text-decoration:none;">Anteriores (12)</a></div>
    <article class="card" style="align-items:center;text-align:center;padding:32px 16px;gap:16px;">
      <div style="width:64px;height:64px;border-radius:50%;background:var(--surface-soft);display:flex;align-items:center;justify-content:center;font-size:1.75rem;">📅</div>
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
      <div class="legend"><b>Categorias Sob Medida:</b> Club Motta e Club Black com produtos homologados e visagismo exclusivo.</div>
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
          <div class="row" style="gap:12px"><div class="date"><small>${a.mon}</small><b>${a.day}</b></div><div><div class="h-section" style="font:400 1.125rem/1.222 var(--serif);color:var(--text-strong)">${a.when || "Sexta-feira, 24 de Outubro"}</div><div class="item" style="color:#003D1B">${a.time} · ${a.note}</div></div></div>
          <div><div class="item" style="color:var(--text-strong)">${a.barber}</div><div class="legend" style="color:var(--text-2)">${a.role}</div></div>
          <div class="legend" style="color:var(--text-2)">${a.svc} — Total <b style="color:#003D1B">${a.total}</b></div>
          <div class="row gap8" style="gap:8px;flex-wrap:wrap"><button class="btn" data-toast="Detalhes do agendamento (demo)">Ver detalhes</button><button class="btn" data-toast="Reagendamento (demo)">Reagendar</button><button class="btn danger" data-cancel="${a.id}">Cancelar</button></div>
        </article>`,
							)
							.join("")
					: `<article class="card" style="align-items:center;text-align:center"><h2 class="h-page">Você ainda não tem nenhum agendamento</h2><p class="body">Que tal reservar seu próximo momento de cuidado? Escolha o barbeiro da sua preferência e viva a experiência completa Motta.</p><a class="btn primary" style="text-decoration:none" href="#/novo/1">Novo agendamento</a></article>`
				: `<div class="row between"><div><h2 class="h-section">Histórico de agendamentos</h2><p class="legend">12 visitas concluídas</p></div></div>` +
					past
						.map(
							(a) => `
        <article class="card">
          <div class="row" style="gap:12px"><div class="date"><small>${a.mon}</small><b>${a.day}</b></div><div style="flex:1"><div class="h-section" style="font-size:1rem;line-height:1.5">${a.barber}</div><div class="legend">${a.role}</div></div><span class="ok">Concluído</span></div>
          <div class="item" style="font-weight:500;font-size:0.875rem;color:var(--ink)">${a.svc}</div>
          <div class="row between"><span class="legend">Duração: ${a.dur}</span><b style="color:var(--ink)">${a.total}</b></div>
          <div class="row" style="gap:8px"><button class="btn" data-toast="Detalhes (demo)">Detalhes</button><button class="btn primary" data-toast="Reagendar (demo)">Reagendar</button></div>
        </article>`,
						)
						.join("");
		return `<header class="col gap4"><span class="eyebrow" style="color:var(--gold);letter-spacing:1.92px">Agenda Motta</span><div class="row between"><h1 class="h-display">Agendamentos 📅</h1><a class="btn primary" style="text-decoration:none;display:grid;align-content:center" href="#/novo/1">Novo</a></div></header>
    ${tabs(
			[
				["agendados", `Agendados (${state.appts.length})`],
				["anteriores", "Anteriores (12)"],
			],
			t,
			"ag",
		)}
    <div class="col gap16">${body}</div>
    <section class="card"><div class="item" style="color:var(--ink)">Por que agendar pelo aplicativo?</div><div class="legend"><b>Pontualidade e praticidade.</b> Sem filas, horário reservado com seu profissional.</div><div class="legend"><b>Barbeiros especialistas.</b> Visagismo sob medida a cada visita.</div></section>`;
	},

	planos() {
		const f = state.planFilter;
		const list = plans.filter((p) => f === "todos" || p.tier === f);
		return `${header("Planos e assinaturas", "Pioneira em Macaé", "Clube MOTTA — Assinatura Recorrente ✂️")}
    <p class="body">Pioneira no modelo de assinatura na cidade de Macaé. Planos mensais fixos com frequência programada (semanal ou quinzenal) para manutenção contínua do visual, sem cobrança avulsa por visita. Um clube para homens exigentes.</p>
    ${tabs(
			[
				["todos", "Todos"],
				["gold", "Club Motta"],
				["black", "Club Black"],
			],
			f,
			"pf",
		)}
    <div class="row between"><h2 class="h-section">${f === "black" ? "Categoria Club Black (VIP)" : f === "gold" ? "Categoria Club Motta" : "Planos do Clube MOTTA"}</h2><span class="legend">${list.length} opções</span></div>
    <div class="col gap16">${list
			.map(
				(p) => `
      <article class="card ${p.dark ? "dark" : ""}">
        <div class="row between">
          <div class="row" style="gap:8px;align-items:center;">
            <img src="${p.tier === "black" ? "assets/logos/club-black-transparent.png" : "assets/logos/motta-symbol-green.png"}" alt="" style="height:22px;object-fit:contain;">
            <span class="eyebrow" style="color:${p.dark ? "var(--gold)" : "var(--muted)"}">${p.eyebrow || "Club Motta"}</span>
          </div>
          ${p.tag ? `<span class="badge" style="${p.scarce ? "background:transparent;color:var(--gold-soft);padding:0" : ""}">${p.tag}</span>` : ""}
        </div>
        <div><h3 class="h-section" ${p.dark ? "" : ""}>${p.name}</h3><div class="item" style="color:${p.dark ? "var(--gold)" : "var(--forest)"}">${p.sub}</div></div>
        <p class="body">${p.desc}</p>
        <div><span class="legend">R$</span> <span class="price">${p.price}</span><div class="legend">${p.per}</div>${p.scarce ? `<div class="scarce">${p.scarce}</div>` : ""}</div>
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
        <div class="row"><span class="eyebrow" style="color:var(--gold);letter-spacing:1.92px;">Barbearia Motta</span><span class="dot"></span><span class="legend">Pioneira em Macaé</span></div>
        <img src="assets/logos/motta-symbol-green.png" alt="Motta" style="width:26px;height:26px;object-fit:contain;">
      </div>
      <h1 class="h-display" style="font-size:1.75rem;line-height:1.214;">Clube para homens exigentes.</h1>
      <p class="body">Cuidado masculino contínuo na unidade Sol &amp; Mar. Frequência programada, visagismo exclusivo, produtos da linha profissional e hospitalidade de excelência.</p>
    </header>

    <section class="hero" aria-label="Boas-vindas">
      <div class="row between"><span class="eyebrow">Primeira Experiência</span><span class="pill">Cortesia VIP</span></div>
      <h2>Primeira Visita com Chopp &amp; Café</h2>
      <p>Chegue 15 minutos antes para relaxar no lounge climatizado. Seu atendimento inclui café espresso gourmet ou chopp artesanal gelado cortesia.</p>
      <div class="row" style="gap:16px;padding-top:8px">
        <div class="meta">Unidade Sol &amp; Mar<b>Av. Carlos Augusto T. Garcia, 2040</b></div>
        <span style="width:1px;height:24px;background:var(--forest-800)"></span>
        <div class="meta">Valet<b>Cortesia no local</b></div>
      </div>
    </section>

    <section class="col gap16">
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
          <span class="legend" style="color:var(--text);">Categorias Club Motta e Club Black</span>
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
          <div class="item" style="color:var(--ink)">2. Segmentação em Categorias (Club Motta &amp; Club Black)</div>
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

    <div class="chips" role="tablist">
      <button class="chip on" id="tab-login" role="tab">Já sou cliente (Entrar)</button>
      <button class="chip" id="tab-register" role="tab">Primeira vez (Cadastrar)</button>
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
            <div class="eyebrow" style="color:var(--gold);letter-spacing:1.5px;font-size:0.6875rem;">Barbearia Motta</div>
            <div class="legend" style="font-size:0.6875rem;">Pioneira em Assinatura • Sol &amp; Mar</div>
          </div>
        </div>
        <img src="assets/logos/club-motta-transparent.png" alt="Club Motta" style="height:32px;object-fit:contain;">
      </div>
      <h1 class="h-display card-title">Clube para homens exigentes.</h1>
      <p class="body" style="color:var(--text);">Manutenção contínua do visual sem atrito de agendamento, produtos da linha profissional e hospitalidade de excelência em Macaé.</p>
    </header>

    <!-- Card Central: Novo por aqui? -->
    <section class="hero" style="border:2px solid var(--gold);box-shadow:0 10px 28px rgba(7,30,19,0.22);padding:20px;text-align:center;align-items:center;gap:12px;">
      <h2 style="font-size:1.5rem;line-height:1.25;color:#fff;">Crie sua conta e viva a experiência Motta</h2>
      <p class="body" style="color:var(--on-dark);max-width:320px;margin:0 auto;">Agende seu horário com os melhores barbeiros da cidade. Planos mensais fixos com frequência programada ou agendamento avulso direto.</p>

      <div class="col gap8" style="width:100%;padding-top:4px;">
        <a class="btn primary" style="background:var(--gold);color:var(--ink);font-weight:700;text-align:center;text-decoration:none;min-height:46px;display:flex;align-items:center;justify-content:center;" href="#/login">Criar Conta / Entrar</a>
        <a class="btn" style="background:rgba(255,255,255,0.12);color:#fff;text-align:center;text-decoration:none;min-height:42px;display:flex;align-items:center;justify-content:center;" href="#/boas_vindas">Conhecer o Conceito &amp; Hospitalidade</a>
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
            <span class="badge" style="background:var(--warn-bg);color:var(--warn-text);margin-bottom:6px;display:inline-block;">★ Manutenção Contínua</span>
            <div class="item" style="font-size:1rem;color:var(--text-strong)">Clube MOTTA — Assinatura Recorrente</div>
            <div class="legend" style="color:var(--text-2);margin-top:2px;">Planos mensais fixos com frequência semanal ou quinzenal programada, sem cobrança avulsa por visita. Categorias Club Motta e Club Black.</div>
          </div>
        </div>
        <div class="row between home-card-actions" style="padding-top:6px;border-top:1px solid #EBE5D8;margin-top:6px;">
          <span class="legend" style="color:#003D1B;font-weight:700;">A partir de R$ 125,99/mês</span>
          <a class="btn" style="background:var(--forest);color:#fff;text-decoration:none;" href="#/planos">Assinar e agendar</a>
        </div>
      </article>

      <div style="text-align:center;padding:2px 0;">
        <a class="link" style="color:var(--forest);font-size:0.8125rem;text-decoration:none;font-weight:600;" href="#/tabela">📋 Ver tabela completa de serviços e preços (Cashbarber) →</a>
      </div>
    </section>

    <!-- Hospitalidade e Localização -->
    <section class="card" style="padding:18px;gap:12px;">
      <div class="row" style="gap:10px;align-items:center;">
        <div class="avatar" style="background:#E6F1E5;color:var(--forest);font-size:1.25rem;">📍</div>
        <div>
          <div class="item" style="color:var(--text-strong);">Unidade Sol &amp; Mar (Macaé - RJ)</div>
          <div class="legend">Av. Carlos Augusto T. Garcia, 2040 • Valet cortesia</div>
        </div>
      </div>
      <div class="legend" style="color:var(--text-2);line-height:1.4;">Lounge climatizado com Café Nespresso e Chopp Artesanal inclusos em todos os atendimentos.</div>
      <a class="btn primary home-whatsapp" href="https://wa.me/5522998389803" target="_blank" rel="noopener"><span>WhatsApp Oficial: (22) 99838-9803</span> <span style="font-weight:700;font-size:0.8125rem;">Falar agora →</span></a>
    </section>

    <div class="row home-shortcuts" style="gap:8px;">
      <a class="btn" style="flex:1;text-align:center;text-decoration:none;" href="#/clube">Benefícios e Marcas</a>
      <a class="btn" style="flex:1;text-align:center;text-decoration:none;" href="#/login">Acessar Conta</a>
    </div>

    <footer class="home-footer"><p class="legend">Barbearia Motta Macaé •  &amp; Estética Masculina</p></footer>`;
	},
	tabela() {
		return `<header class="col gap4">
      <div class="row between" style="align-items:center;">
        <div class="row"><span class="eyebrow" style="color:var(--gold);letter-spacing:1.92px;">Barbearia Motta</span><span class="dot"></span><span class="legend">Tabela Oficial</span></div>
        <img src="assets/logos/motta-symbol-green.png" alt="Motta" style="width:26px;height:26px;object-fit:contain;">
      </div>
      <h1 class="h-display" style="font-size:1.625rem;line-height:1.231;">Tabela de Serviços e Preços</h1>
      <p class="body">Valores extraídos diretamente do sistema oficial de agendamento Cashbarber da Barbearia Motta.</p>
    </header>

    <div class="table-wrapper" tabindex="0" role="region" aria-labelledby="pricing-caption">
      <table>
        <caption id="pricing-caption">Barbearia Motta • Tabela Oficial de Serviços e Preços</caption>
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
              <td style="text-align:right;white-space:nowrap;font-weight:700;color:var(--ink);">${(s.starting ? '<span class="legend" style="font-size:0.625rem;font-weight:500;display:block">A partir de</span>' : "") + "R$ " + s.price.toFixed(2).replace(".", ",")}</td>
            </tr>
          `,
						)
						.join("")}
        </tbody>
      </table>
    </div>

    <p class="legend" style="text-align:center;color:var(--text-2);">Nota: Na interface de seleção do sistema Cashbarber, o tempo estimado de duração de cada procedimento não é exibido nos cards.</p>

    <div class="col gap8">
      <a class="btn primary" style="text-align:center;text-decoration:none;" href="#/novo/1">Agendar Procedimento</a>
      <a class="btn" style="text-align:center;text-decoration:none;" href="#/inicio">Voltar ao Início</a>
    </div>`;
	},
	novo(step) {
		const B = state.book;
		const steps = [
			"Serviços",
			"Profissional",
			"Data e Hora",
			"Revisão",
			"Confirmação",
		];
		const bar = `<div class="col gap8"><div class="row between"><span class="eyebrow">Etapa ${step} de 5</span><span class="legend">${step * 20}% concluído</span></div>
      <div class="bar" role="progressbar" aria-valuenow="${step}" aria-valuemin="1" aria-valuemax="5"><i style="width:${step * 20}%"></i></div>
      <div class="row between legend">${steps.map((n, i) => `<span style="color:${i + 1 === step ? "var(--forest)" : ""};font-weight:${i + 1 === step ? 700 : 400}">${i + 1}. ${n}</span>`).join("")}</div></div>`;
		const total = services
			.filter((x) => B.svc.includes(x.id))
			.reduce((a, x) => a + x.price, 0);
		const fmt = (n, starting = false) =>
			(starting ? "A partir de " : "") + "R$ " + n.toFixed(2).replace(".", ",");
		const foot = (next, label, back) =>
			`<div class="col gap8"><div class="row between"><span class="legend">${B.svc.length} serviço(s) selecionado(s)</span><b style="color:var(--ink);font-size:1.1875rem">${fmt(total)}</b></div><a class="btn primary" style="text-align:center;text-decoration:none" href="#/novo/${next}">${label}</a>${back ? `<a class="btn" style="text-align:center;text-decoration:none" href="#/novo/${back}">Voltar</a>` : ""}</div>`;

		if (step === 1) {
			const activeCat = B.cat || "Todos";
			const cats =
				activeCat === "Todos"
					? serviceCategories.filter((c) => c !== "Todos")
					: [activeCat];
			return `<header class="col gap4">
        <h1 class="h-page">Novo Agendamento</h1>
        <span class="legend">Seleção de Serviços · Tabela Oficial Unidade Sol &amp; Mar</span>
      </header>${bar}
      <div class="card" style="flex-direction:row;align-items:center;justify-content:space-between">
        <div>
          <div class="item" style="color:var(--ink)">Tabela Cashbarber 2026</div>
          <div class="legend">${B.svc.length} procedimento(s) marcado(s)</div>
        </div>
        <a class="btn" style="text-decoration:none;font-size:0.75rem;padding:6px 12px;min-height:36px;white-space:nowrap" href="#/tabela">Ver tabela</a>
      </div>
      <div class="chips" role="group" aria-label="Filtrar por Categoria">
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
                    ${x.starting ? `<span class="legend" style="font-size:0.6875rem;display:block">A partir de</span>` : ""}
                    <b style="color:var(--ink);font-size:1.125rem">R$ ${x.price.toFixed(2).replace(".", ",")}</b>
                  </div>
                </div>
              </button>`;
							})
							.join("")}
          </div>`;
					})
					.join("")}
      </div>${foot(2, "Continuar para Profissional")}`;
		}

		if (step === 2)
			return `<header class="col gap4"><h1 class="h-page">Escolha o Profissional</h1><span class="legend">Selecione o especialista de sua confiança na unidade Sol &amp; Mar.</span></header>${bar}
      <div class="col gap16">${pros.map((p) => `<button class="card" style="text-align:left;outline:${B.pro === p.id ? "2px solid var(--forest)" : "none"}" data-pro="${p.id}" aria-pressed="${B.pro === p.id}"><div class="row between"><div class="row" style="gap:12px"><div class="avatar" style="overflow:hidden;padding:0;background:#F1F4EF;" aria-hidden="true">${p.photo ? `<img src="${p.photo}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;">` : p.name[0]}</div><div><div class="h-section" style="font-size:1rem;line-height:1.5">${p.name}</div><div class="legend">${p.role}</div></div></div><span class="badge" style="background:var(--warn-bg);color:var(--warn-text)">★ ${p.rate}</span></div><span class="legend">Próximo livre: <b style="color:var(--text-strong)">${p.next}</b></span></button>`).join("")}</div>${foot(3, "Continuar para Data e Horário", 1)}`;

		if (step === 3) {
			const days = [
				["SEG", 26, "Livre"],
				["TER", 27, "Livre"],
				["QUA", 28, "Hoje"],
				["QUI", 29, "Livre"],
				["SEX", 30, "Poucos"],
				["SÁB", 31, "Poucos"],
				["DOM", 1, "Fechado"],
			];
			const slots = [
				["Manhã", "08:00 às 12:00", ["09:00", "09:45", "10:30", "11:15"], 3],
				[
					"Tarde",
					"12:00 às 18:00",
					["13:30", "14:15", "15:00", "15:45", "16:30", "17:15"],
					0,
				],
				["Noite", "18:00 às 21:00", ["18:00", "18:45", "19:30", "20:15"], 0],
			];
			return `<header class="col gap4"><h1 class="h-page">Escolha Data e Horário</h1><span class="legend">Disponibilidade em tempo real · Outubro 2026</span></header>${bar}
      <div class="chips" role="group" aria-label="Dias">${days.map(([d, n, st]) => `<button class="chip" style="min-width:72px;padding:8px 6px;display:flex;flex-direction:column;align-items:center" aria-pressed="${B.day === n}" ${st === "Fechado" ? "disabled" : ""} data-day="${n}"><small>${d}</small><b>${String(n).padStart(2, "0")}</b><small>${B.day === n ? "Selecionado" : st}</small></button>`).join("")}</div>
      ${slots.map(([n, r, hs, dis]) => `<section class="col gap8"><div class="row between"><span class="eyebrow" style="color:var(--text-strong)">${n}</span><span class="legend">${r}</span></div><div class="time-slots">${hs.map((h, i) => `<button class="chip ${B.time === h ? "on" : ""}" ${i < dis ? 'disabled style="text-decoration:line-through;opacity:.5"' : ""} data-time="${h}">${h}</button>`).join("")}</div></section>`).join("")}
      <div class="card"><div class="item" style="color:var(--text-strong)">Pontualidade &amp; Cancelamentos</div><div class="legend" style="color:var(--text-2)">Tolerância máxima de 15 minutos. Cancelamento sem custo com até 2 horas de antecedência.</div></div>
      <div class="col gap8"><div class="legend">Qua, ${B.day} Out às ${B.time} • ${pros.find((p) => p.id === B.pro)?.name || "Michel Nogueira"}</div><a class="btn primary" style="text-align:center;text-decoration:none" href="#/novo/4">Prosseguir para Revisão</a><a class="btn" style="text-align:center;text-decoration:none" href="#/novo/2">Voltar</a></div>`;
		}

		if (step === 4) {
			const sel = services.filter((x) => B.svc.includes(x.id));
			const pro = pros.find((p) => p.id === B.pro) || pros[0];
			const hasStarting = sel.some((x) => x.starting);
			return `<header class="col gap4"><h1 class="h-page">Revisão e Confirmação</h1><span class="legend">Confira os dados, procedimentos e valores antes de finalizar.</span></header>${bar}
      <section class="card"><span class="eyebrow" style="color:#4C6455">Quando &amp; onde</span><div class="item" style="font-size:0.875rem;color:var(--text-strong)">Quarta-feira, ${B.day} de Outubro de 2026</div><div class="legend">${B.time} · Unidade Sol &amp; Mar — Av. Carlos Augusto T. Garcia, 2040, Macaé - RJ</div></section>
      <section class="card"><span class="eyebrow" style="color:#4C6455">Profissional especialista</span><div class="item" style="font-size:0.875rem;color:var(--text-strong)">${pro.name}</div><div class="legend">${pro.role}</div></section>
      <section class="card"><span class="eyebrow" style="color:#4C6455">Procedimentos selecionados (${sel.length})</span>${sel.map((x) => `<div class="row between"><span class="item" style="color:var(--text-strong)">${x.name}</span><b style="color:var(--ink)">${fmt(x.price, x.starting)}</b></div>`).join("")}</section>
      <section class="card"><span class="eyebrow" style="color:#4C6455">Resumo financeiro</span>
        <div class="row between legend"><span>Forma de cobrança</span><span>Balcão / Recepção</span></div>
        <div class="row between"><b style="color:var(--text-2)">TOTAL ESTIMADO</b><b style="font-size:1.5rem;color:#003D1B">${hasStarting ? "A partir de " : ""}${fmt(total)}</b></div>
        ${hasStarting ? `<p class="legend" style="color:var(--text-2);font-size:0.6875rem">* Procedimentos com indicação "A partir de" têm preço base sujeito a variação após avaliação técnica presencial.</p>` : ""}
      </section>
      <label class="card" style="flex-direction:row;gap:12px;align-items:flex-start;font-size:0.6875rem;color:var(--text-strong)"><input type="checkbox" id="agree" ${B.agree ? "checked" : ""} style="width:20px;height:20px;accent-color:var(--forest);flex:none"><span>Li e concordo com os termos de comparecimento, tolerância de 15 minutos e política de cancelamento da Barbearia Motta.</span></label>
      <div class="col gap8"><button class="btn primary" id="confirm-book">Confirmar Agendamento</button><a class="btn" style="text-align:center;text-decoration:none" href="#/novo/3">Voltar e Modificar Dados</a></div>`;
		}

		const pro = pros.find((p) => p.id === B.pro) || pros[0];
		const svcNames = services
			.filter((x) => B.svc.includes(x.id))
			.map((x) => x.name)
			.join(" + ");
		const waText = encodeURIComponent(
			`Olá, Barbearia Motta! Acabei de agendar pelo aplicativo:\n\n` +
				`✂️ Procedimento(s): ${svcNames}\n` +
				`👤 Profissional: ${pro.name}\n` +
				`📅 Data: Quarta, ${B.day} de Outubro de 2026 às ${B.time}h\n` +
				`📍 Unidade Sol Mar — Av. Carlos Augusto T. Garcia, 2040\n` +
				`🎫 Voucher: #MOTTA-2026-8849\n` +
				`💰 Total: ${fmt(total)}\n\n` +
				`Favor confirmar o recebimento na recepção!`,
		);
		const waUrl = `https://wa.me/5522998389803?text=${waText}`;

		return `<header class="col gap4" style="text-align:center;align-items:center"><span class="badge" style="background:var(--warn-bg);color:var(--warn-text)">MOTTA CLUB PRIORITY • #MOTTA-2026-8849</span><h1 class="h-display" style="font-size:1.875rem;line-height:1.25;color:var(--text-strong)">Agendamento Confirmado!</h1><p class="body">Sua reserva foi processada. Apresente seu voucher digital ao chegar no balcão da unidade Sol &amp; Mar.</p></header>${bar}
      <section class="hero"><div class="row between"><span class="eyebrow">Unidade Macaé</span><img src="assets/logos/motta-symbol-gold.png" alt="Motta" style="width:24px;height:24px;object-fit:contain;"></div><h2>Barbearia Motta — Sol &amp; Mar</h2><div class="meta">Quarta, ${B.day} de Outubro, 2026<b>${B.time}h (comparecimento pontual)</b></div><div class="meta">Profissional<b>${pro.name}</b></div><div class="meta">A pagar no local<b style="color:var(--mint-on-dark);font-size:1rem">${fmt(total)}</b></div></section>
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
	if (route === "novo" && step === 5 && !state.book.done) {
		location.replace("#/novo/4");
		return;
	}
	if (route === "novo" && step < 5) state.book.done = false;

	view.innerHTML = screens[route](step);
	document.title = `Motta — ${titles[route] || "Barbearia"}`;

	// Atualizar Navbar conforme estado de login
	const nav = document.querySelector("nav");
	nav.classList.remove("is-hidden");
	if (!state.isLoggedIn) {
		nav.innerHTML = `
      <a href="#/inicio"><svg viewBox="0 0 24 24"><path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>Início</a>
      <a href="#/planos"><svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18"/></svg>Planos</a>
      <a href="#/login"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>Entrar</a>
    `;
	} else {
		nav.innerHTML = `
      <a href="#/inicio"><svg viewBox="0 0 24 24"><path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>Início</a>
      <a href="#/agendamentos"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>Agendamentos</a>
      <a href="#/clube"><svg viewBox="0 0 24 24"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.500l6.100-.9z"/></svg>Clube</a>
      <a href="#/planos"><svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18"/></svg>Planos</a>
      <a href="#/perfil"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>Perfil</a>
    `;
	}

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
}

window.addEventListener("hashchange", render);

let cancelId = null;
document.addEventListener("click", (e) => {
	const t = e.target.closest(
		"[data-copy],[data-toast],[data-ag],[data-pf],[data-cancel],[data-bf],[data-svc],[data-scat],[data-pro],[data-day],[data-time],#confirm-book,#logout-btn,#tab-login,#tab-register",
	);
	if (!t) return;

	// Alternar abas Login / Cadastro
	if (e.target.id === "tab-login") {
		$("#tab-login").classList.add("on");
		$("#tab-register").classList.remove("on");
		$("#register-fields").style.display = "none";
		$("#auth-submit-btn").textContent = "Acessar Minha Conta";
	} else if (e.target.id === "tab-register") {
		$("#tab-register").classList.add("on");
		$("#tab-login").classList.remove("on");
		$("#register-fields").style.display = "flex";
		$("#auth-submit-btn").textContent = "Finalizar Cadastro Entrar";
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
		render();
	} else if (t.dataset.svc) {
		const a = state.book.svc,
			k = t.dataset.svc;
		state.book.svc = a.includes(k)
			? a.length > 1
				? a.filter((x) => x !== k)
				: a
			: [...a, k];
		render();
	} else if (t.dataset.pro) {
		state.book.pro = t.dataset.pro;
		render();
	} else if (t.dataset.day) {
		state.book.day = +t.dataset.day;
		render();
	} else if (t.dataset.time) {
		state.book.time = t.dataset.time;
		render();
	} else if (t.id === "confirm-book") {
		if (!$("#agree").checked) {
			showToast("Aceite os termos para confirmar");
			return;
		}
		const B = state.book,
			pro = pros.find((p) => p.id === B.pro);
		state.appts.push({
			id: "a" + Date.now(),
			day: String(B.day).padStart(2, "0"),
			mon: "Out",
			time: B.time,
			barber: pro.name,
			role: pro.role,
			svc: services
				.filter((x) => B.svc.includes(x.id))
				.map((x) => x.name)
				.join(" + "),
			note: "Confirmado",
			total:
				"R$ " +
				services
					.filter((x) => B.svc.includes(x.id))
					.reduce((a, x) => a + x.price, 0)
					.toFixed(2)
					.replace(".", ","),
			when: `Quarta-feira, ${B.day} de Outubro`,
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
