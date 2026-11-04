import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ProdutosBeneficios(): React.ReactElement {
  const [activeTab, setActiveTab] = useState<string>("produtos");
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2500);
  };

  const partnerProducts = [
    {
      id: "red-nek",
      badge: "RN",
      name: "Red Nek Grooming",
      description: "Pomadas e óleos de alta performance",
      discount: "5% OFF",
      image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80",
      overlay: "Apresente seu app na recepção",
      availability: "Disponível a pronta entrega",
      coupon: "MOTTA-REDNEK5",
    },
    {
      id: "don-alcides",
      badge: "DA",
      name: "Don Alcides",
      description: "Cuidados completos para barba e pele",
      discount: "5% OFF",
      image: "https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=600&q=80",
      overlay: "Kit Barba & Bigode completo",
      availability: "Compre com o barbeiro ou online",
      coupon: "MOTTA-DON5",
    },
    {
      id: "b-urb",
      badge: "B",
      name: "B.URB Urban Care",
      description: "Inovação e finalizadores modernos",
      discount: "5% OFF",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
      overlay: "Linha de acabamento e fixação",
      availability: "Desconto cumulativo em kits",
      coupon: "MOTTA-BURB5",
    },
  ];

  const otherBenefits = [
    {
      title: "Antecedência no agendamento",
      desc: "Agende horários com até 7 dias de antecedência",
      icon: (
        <svg className="w-5 h-5 text-emerald-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "Serviços simultâneos",
      desc: "Cabelo e barba atendidos ao mesmo tempo",
      icon: (
        <svg className="w-5 h-5 text-emerald-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      title: "Serviços cortesia inclusos",
      desc: "Sobrancelha ou higienização capilar mensal",
      icon: (
        <svg className="w-5 h-5 text-emerald-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "Prioridade na lista de espera",
      desc: "Vaga automática em caso de desistências",
      icon: (
        <svg className="w-5 h-5 text-emerald-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="w-full min-h-screen bg-[#F8F7F3] flex justify-center text-neutral-800 antialiased font-sans selection:bg-[#15552D] selection:text-white">
      {/* Toast de notificação de cópia */}
      {copiedCoupon && (
        <div className="fixed top-5 z-50 px-4 py-2 bg-[#071E13] text-[#C7A566] text-xs font-semibold rounded-full shadow-xl border border-[#C7A566]/30 animate-bounce">
          Cupom {copiedCoupon} copiado com sucesso!
        </div>
      )}

      {/* Frame Mobile 390px (Padrão Figma) */}
      <main className="w-full max-w-[390px] min-h-screen bg-[#F8F7F3] shadow-2xl flex flex-col relative pb-28 border-x border-neutral-200/60">
        
        {/* Header Superior Fixo */}
        <header className="sticky top-0 z-40 bg-[#F8F7F3]/95 backdrop-blur-md px-4 h-16 border-b border-neutral-200/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#071E13] flex items-center justify-center text-[#C7A566] shadow-sm">
              <span className="font-bold text-sm tracking-tighter">M</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-base font-bold tracking-tight text-[#071E13] leading-none">Motta</h1>
              <span className="text-[10px] tracking-wider uppercase font-semibold text-neutral-400">Portal do Cliente</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button aria-label="Notificações" className="w-9 h-9 rounded-full flex items-center justify-center text-neutral-600 hover:bg-neutral-200/50 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="w-8 h-8 rounded-full bg-[#071E13] text-[#C7A566] font-semibold text-xs flex items-center justify-center ring-2 ring-[#C7A566]/30">
              VC
            </div>
          </div>
        </header>

        {/* Conteúdo da Tela */}
        <div className="px-4 pt-4 flex flex-col gap-6">

          {/* 1. Header Title & Subtitle */}
          <section className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-semibold text-[#15552D] uppercase tracking-wider text-[11px]">CLUBE MOTTA</span>
              <span className="w-1 h-1 rounded-full bg-[#C7A566]"></span>
              <span className="text-neutral-500 text-[11px]">Vantagens Exclusivas</span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <h2 className="text-2xl font-serif text-[#071E13] tracking-tight">Produtos e benefícios</h2>
              <span className="text-xl leading-none">🛍️</span>
            </div>
            <p className="text-neutral-600 text-[13px] leading-relaxed mt-1">
              Aproveite descontos exclusivos em marcas parceiras e privilégios desenhados para elevar o seu ritual de cuidado.
            </p>
          </section>

          {/* 2. Horizontal Scrollable Segment Pills */}
          <nav className="flex gap-2 overflow-x-auto -mx-4 px-4 py-1 no-scrollbar">
            <button
              onClick={() => setActiveTab("produtos")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition shadow-sm ${
                activeTab === "produtos"
                  ? "bg-[#15552D] text-white shadow-[#15552D]/25"
                  : "bg-white text-neutral-600 border border-neutral-200/80 hover:bg-neutral-50"
              }`}
            >
              <svg className={`w-3.5 h-3.5 ${activeTab === "produtos" ? "text-[#C7A566]" : "text-neutral-500"}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.707 9.293l-5-5a.999.999 0 00-.707-.293H3a1 1 0 00-1 1v9a1 1 0 00.293.707l5 5a1 1 0 001.414 0l9-9a1 1 0 000-1.414zM5 7a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
              Produtos e benefícios
            </button>
            <button
              onClick={() => setActiveTab("plano")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                activeTab === "plano"
                  ? "bg-[#15552D] text-white border-[#15552D]"
                  : "bg-white text-neutral-600 border-neutral-200/80 hover:bg-neutral-50"
              }`}
            >
              <svg className="w-3.5 h-3.5 text-neutral-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z" />
              </svg>
              Meu plano
            </button>
            <button
              onClick={() => setActiveTab("agendamentos")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                activeTab === "agendamentos"
                  ? "bg-[#15552D] text-white border-[#15552D]"
                  : "bg-white text-neutral-600 border-neutral-200/80 hover:bg-neutral-50"
              }`}
            >
              <svg className="w-3.5 h-3.5 text-neutral-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Agendamentos
            </button>
            <button
              onClick={() => setActiveTab("perfil")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                activeTab === "perfil"
                  ? "bg-[#15552D] text-white border-[#15552D]"
                  : "bg-white text-neutral-600 border-neutral-200/80 hover:bg-neutral-50"
              }`}
            >
              <svg className="w-3.5 h-3.5 text-neutral-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editar perfil
            </button>
          </nav>

          {/* 3. Plan Status Card / Compact Banner */}
          <section className="relative bg-[#071E13] rounded-2xl p-4.5 text-white overflow-hidden shadow-lg shadow-[#071E13]/25 flex flex-col gap-3.5 border border-[#C7A566]/20">
            <div className="flex justify-between items-center">
              <span className="text-[#C7A566] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-[#C7A566]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                SEU PLANO
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#15552D] text-emerald-300 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Ativo
              </span>
            </div>

            <div>
              <h3 className="text-xl font-serif text-white tracking-wide">Clube Motta Master</h3>
              <p className="text-neutral-300 text-xs mt-1 leading-relaxed">
                Descontos automáticos aplicados no caixa e atendimento com prioridade absoluta.
              </p>
            </div>

            <div className="pt-3 border-t border-neutral-700/60 flex items-center justify-between">
              <div>
                <span className="block text-neutral-400 text-[11px]">Próxima renovação</span>
                <strong className="text-white text-xs font-medium">15 de Junho, 2025</strong>
              </div>
              <div className="h-6 w-px bg-neutral-700/70"></div>
              <div>
                <span className="block text-neutral-400 text-[11px]">Economia acumulada</span>
                <strong className="text-[#C7A566] text-xs font-bold">R$ 148,00</strong>
              </div>
            </div>
          </section>

          {/* 4. Section: Partner Product Discounts */}
          <section className="flex flex-col gap-3">
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-[#071E13] text-base font-bold">Descontos em produtos</h3>
                <p className="text-neutral-500 text-xs">Linha profissional selecionada para cuidados diários</p>
              </div>
              <button className="text-[#15552D] text-xs font-bold hover:underline flex items-center gap-0.5">
                Ver todos
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Lista de Cards de Parceiros */}
            <div className="flex flex-col gap-3.5">
              {partnerProducts.map((p) => (
                <article key={p.id} className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-200/70 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center font-bold text-sm text-[#071E13] border border-neutral-200/80">
                        {p.badge}
                      </div>
                      <div>
                        <h4 className="text-[#071E13] text-sm font-semibold leading-tight">{p.name}</h4>
                        <p className="text-neutral-500 text-xs leading-normal">{p.description}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-emerald-50 text-[#15552D] font-bold text-xs border-emerald-200/60 px-2 py-0.5">
                      {p.discount}
                    </Badge>
                  </div>

                  <div className="relative h-32 rounded-xl overflow-hidden bg-neutral-100 group">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-[#071E13]/85 backdrop-blur-md rounded-lg text-white text-[11px] font-medium">
                      {p.overlay}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-neutral-100">
                    <span className="text-neutral-500 text-xs">{p.availability}</span>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => handleCopy(p.coupon)}
                      className="h-8 text-xs font-semibold px-3 gap-1.5 bg-neutral-50 hover:bg-neutral-100 text-[#15552D] border border-neutral-200"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                      </svg>
                      {copiedCoupon === p.coupon ? "Copiado!" : "Copiar cupom"}
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* 5. Section: Other Plan Benefits (Disclosures / Accordion) */}
          <section className="flex flex-col gap-3">
            <div>
              <h3 className="text-[#071E13] text-base font-bold">Outros benefícios do seu plano</h3>
              <p className="text-neutral-500 text-xs">Privilégios que garantem comodidade e agilidade em cada visita</p>
            </div>

            <div className="flex flex-col gap-2">
              {otherBenefits.map((b, idx) => (
                <div key={idx} className="bg-white rounded-xl p-3 shadow-sm border border-neutral-200/70 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                      {b.icon}
                    </div>
                    <div>
                      <h4 className="text-[#071E13] text-xs font-semibold">{b.title}</h4>
                      <p className="text-neutral-500 text-[11px] leading-tight">{b.desc}</p>
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-neutral-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              ))}
            </div>
          </section>

          {/* 6. Bottom CTA Banner: Manage Plan */}
          <section className="bg-[#071E13] text-white rounded-2xl p-4 shadow-lg flex flex-col gap-3 border border-[#C7A566]/20">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#15552D] text-[#C7A566] flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Aproveite todos os benefícios</h4>
                <p className="text-neutral-300 text-[11px]">Gerencie forma de pagamento, dependentes e recibos</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="button" className="flex-1 h-9 bg-white text-[#071E13] hover:bg-neutral-100 font-bold text-xs rounded-xl">
                Gerenciar meu plano
              </Button>
              <Button type="button" aria-label="Mais opções" className="w-9 h-9 bg-[#15552D] hover:bg-[#15552D]/80 text-[#C7A566] p-0 rounded-xl">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Button>
            </div>
          </section>

        </div>

        {/* 7. Bottom Navigation Fixo (Sticky) */}
        <nav className="fixed bottom-0 z-40 w-full max-w-[390px] bg-[#F8F7F3]/95 backdrop-blur-md border-t border-neutral-200/80 px-2 h-16 flex justify-around items-center">
          <button className="flex flex-col items-center gap-1 text-neutral-400 hover:text-[#071E13] transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-[10px] font-medium">Início</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-neutral-400 hover:text-[#071E13] transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-[10px] font-medium">Agendamentos</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-[#15552D] font-bold">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-[10px]">Clube</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-neutral-400 hover:text-[#071E13] transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span className="text-[10px] font-medium">Planos</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-neutral-400 hover:text-[#071E13] transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-[10px] font-medium">Perfil</span>
          </button>
        </nav>

      </main>
    </div>
  );
}

