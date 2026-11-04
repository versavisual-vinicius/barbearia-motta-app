# Barbearia Motta — Portal do Cliente & Clube Motta

Aplicação web mobile-first de agendamento de serviços, gestão de assinaturas e clube de benefícios para a **Barbearia Motta** (Macaé - RJ).

---

## ✂️ Visão Geral

O projeto foi construído com base na identidade visual oficial e nas 14 telas do Figma, oferecendo uma experiência premium com foco em hospitalidade, agilidade e visagismo masculino.

### O Clube MOTTA

O **Clube MOTTA** é o modelo de assinatura recorrente da **Barbearia Motta** em Macaé, estruturado para fidelização de clientes e manutenção contínua do visual.

#### Pilares do Conceito

* **Modelo por Assinatura (Membro/Club):** Posicionada como pioneira no modelo de assinatura na cidade de Macaé, a barbearia oferece planos mensais fixos que permitem ao membro realizar cortes, barba e manutenções com frequência programada, sem cobrança avulsa por visita.
* **Segmentação em Categorias (Club Motta & Club Black):** Divide os membros em níveis de serviço e benefícios:
  - *Club Motta:* foco no alinhamento contínuo (apenas corte, apenas barba ou combo corte + barba).
  - *Club Black:* nível VIP com atendimento prioritário, linha profissional de tratamentos (hidratação capilar, selagem) e barboterapia completa.
* **Posicionamento Exclusivo ("Clube para homens exigentes"):** O formato transcende o corte tradicional e opera como um espaço de conveniência e autocuidado masculino contínuo, reduzindo o atrito de agendamento e garantindo padronização de atendimento e produtos da linha profissional.

#### Funcionamento Operacional & Contato

1. **Recorrência & Gestão:** Contratação via plataforma de assinatura/agendamento digital integrada (via link da bio ou aplicativo).
2. **Atendimento Prioritário/Frequente:** Foco em clientes que mantêm a barba e o corte alinhados semanal ou quinzenalmente.
3. **Localização & Contato Oficial:**
   - **Endereço:** Av. Carlos Augusto T. Garcia, 2040 – Sol e Mar, Macaé/RJ.
   - **WhatsApp / Agendamentos:** (22) 99838-9803 (`https://wa.me/5522998389803`).

---

### Principais Funcionalidades

- **Onboarding e Conversão de Novos Clientes**: Tela inicial com chamada dedicada para agendamento avulso (a partir de R$ 49,99) ou com assinatura do Clube Motta.
- **Tabela Oficial de Serviços e Preços (Cashbarber)**: Catálogo com os 20 procedimentos oficiais organizados em 5 categorias (Corte & Barba, Visagismo, Tratamentos & Cuidados, Pigmentação & Lavagem, Depilação & Sobrancelha), tabela responsiva semântica e sem exibição de tempo estimado nos cards conforme especificação.
- **Navegação Condicional**: Menus públicos para visitantes (`Início`, `Planos`, `Entrar`) e menus restritos após login (`Agendamentos`, `Clube`, `Perfil`).
- **Fluxo Completo de Agendamento em 5 Etapas**:
  1. *Seleção de Serviços* (cortes, barboterapia, combos, sobrancelha);
  2. *Escolha de Profissional* (fotos reais dos barbeiros integradas do Google Drive);
  3. *Data & Horário* (disponibilidade matutina, vespertina e noturna em tempo real);
  4. *Revisão & Condições Financeiras* (cálculo de descontos automáticos de assinante);
  5. *Confirmação & Voucher Digital* (com QR Code SVG `#MOTTA-2026-8849` para check-in na recepção).
- **Gestão de Assinatura & Cotas**: Acompanhamento de cotas mensais utilizadas e saldo disponível no Clube Gold / Black.
- **Políticas e Cancelamento Nativo**: Modal `<dialog closedby="any">` com cancelamento gratuito com até 2h de antecedência e estorno imediato de cota.
- **Parcerias Homologadas**: Cupons de desconto exclusivos para produtos das bancadas (Don Alcides, Red Nek, B.URB).

---

## 🎨 Design System & Identidade Visual

As diretrizes canônicas, tokens e regras estão documentados em [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md).

- **Fundo Principal (Canvas)**: `#F8F7F3`
- **Primário (Forest Green)**: `#15552D`
- **Títulos e Hero (Deep Ink)**: `#071E13`
- **Acentos e Ícones (Classic Gold)**: `#C7A566`
- **Tipografia**: `Inter` (UI / Textos) e `DM Serif Display` (Títulos / Display)

---

## 📁 Estrutura do Projeto

```
.
├── app/                      # Aplicação web estática
│   ├── index.html            # Estrutura HTML com modal nativo e tags semânticas
│   ├── styles.css            # Variáveis CSS dos tokens do Design System e utilitários
│   ├── app.js                # Roteador SPA por hash, gerenciamento de estado e fluxo
│   └── assets/               # Imagens e ícones
│       ├── logos/            # Identidade oficial: Club Motta, Club Black e Isótipos (Dark, Green, Gold, White)
│       ├── barbeiros/        # Fotos reais dos profissionais (Google Drive)
│       └── svgs/             # Ícones vetoriais
├── DESIGN_SYSTEM.md          # Documentação oficial de tokens e componentes
├── TODO.md                   # Registro de marcos e sincronização
└── README.md                 # Este documento
```

---

## 🚀 Como Executar Localmente

Como a aplicação é estática e não exige etapas pesadas de build ou dependências externas, você pode rodá-la com qualquer servidor HTTP:

```bash
# Entrar na pasta da aplicação
cd app

# Rodar servidor HTTP nativo do Python (porta 5180)
python3 -m http.server 5180

# Ou utilizando o Node / npx
# npx serve . -p 5180
```

Acesse em seu navegador:
- Local: `http://localhost:5180`
- Dispositivos na mesma rede Wi-Fi: `http://<IP-DO-SEU-COMPUTADOR>:5180`

---

## 🌐 Deploy na Vercel

O projeto está configurado para deploy imediato como site estático na Vercel apontando para a pasta raiz `app`:

```bash
vercel --prod
```

---

## 📄 Licença & Direitos

Projeto desenvolvido para a **Barbearia Motta Macaé • Ateliê & Estética Masculina**. Todos os direitos reservados.
