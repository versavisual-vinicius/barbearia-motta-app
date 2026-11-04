# DESIGN_SYSTEM — Clube Motta (Portal do Cliente)

Fonte: tokens colados do Figma + `tailwind.config.js` + `index.html`. Mobile-first, 390px, canvas `#F8F7F3`.

## Cores

| Token CSS | Hex | Uso |
| --- | --- | --- |
| `--canvas` | `#F8F7F3` | Fundo do app |
| `--surface` | `#FFFFFF` | Cards |
| `--surface-soft` | `#F1F4EF` | Chips inativos, avatar, thumbs |
| `--mint` | `#E6F1E5` | Badge de desconto |
| `--ink` | `#071E13` | Títulos, hero escuro (brand-950) |
| `--forest-900` | `#0B2C1C` | Preço, passos concluídos |
| `--forest-800` | `#123D26` | Texto em badge, divisores escuros |
| `--forest` | `#15552D` | Primário: botões, links, item ativo (brand-700) |
| `--forest-600` | `#1A6B3A` | Hover/realce |
| `--success` | `#187044` | Status "Concluído" |
| `--gold` | `#C7A566` | Acento: eyebrow em hero, preço econ., ícones |
| `--gold-soft` | `#FFDEA5` | Nível/Prazo em fundo escuro |
| `--mint-on-dark` | `#B0F2BC` | "Ativo", valores em fundo escuro |
| `--text` | `#4B544E` | Corpo |
| `--text-strong` | `#191D19` | Texto forte (agendamentos) |
| `--text-2` | `#404941` | Corpo secundário (agendamentos) |
| `--muted` | `#717B75` | Legendas, labels |
| `--on-dark` | `#D4DAD4` | Texto secundário em fundo `--ink` |
| `--danger` | `#BA1A1A` | Cancelar |
| `--scarcity` | `#B53438` | "Vagas limitadas" |
| `--warn-bg` / `--warn-text` | `#FFDEA5` / `#271900` | Badges âmbar ("Mais rápido", "15% OFF") |

## Tipografia

Famílias: **Inter** (UI, 400/500/600/700) e **DM Serif Display** (títulos, 400). Mono (`Liberation Mono`) apenas em valores/códigos na revisão.

| Papel | Fonte | Tamanho/Linha | Peso | Extras |
| --- | --- | --- | --- | --- |
| Display página | DM Serif Display | 28/34 | 400 | |
| Título página | DM Serif Display | 23–26/28–32 | 400 | |
| Título card hero | DM Serif Display | 23/28 | 400 | |
| Preço plano | DM Serif Display | 32/32 | 600 | |
| Título seção | Inter | 19/25 | 600 | |
| Item / botão | Inter | 13/18 | 600 | `letter-spacing: .13px` |
| Corpo | Inter | 14/20 | 400 | |
| Legenda | Inter | 12/16 | 400 | |
| Eyebrow | Inter | 12/16 | 600 | MAIÚSCULAS, `.6px` (hero `1.92px`) |
| Nav / micro | Inter | 11/16.5 | 400–600 | |

## Espaçamento, raio, sombra

- Escala: 4 · 6 · 8 · 12 · 16 · 24 · 32. Padding de tela `16px`; gap entre blocos `24px`; padding de card `16px`; gap interno de card `16px`.
- Topo `64px`, base `112px` (barra inferior).
- Raios: chip/botão/thumb `12px`; card `16px`; badge/ponto `9999px`; overlay legenda `8px`.
- Sombras: card `0 8px 24px rgba(7,30,19,.06)`; hero `0 8px 24px rgba(7,30,19,.18)`; chip ativo `0 2px 8px rgba(21,85,45,.25)`.

## Logotipos & Identidade de Marca

Arquivos oficiais localizados em `app/assets/logos/`:

| Elemento | Arquivo | Aplicação |
| --- | --- | --- |
| **Isótipo Dark** | `motta-symbol-dark.png` / `.svg` | Topo da home, cabeçalhos em fundo claro |
| **Isótipo Green** | `motta-symbol-green.png` / `.svg` | Favicon do app, cards de planos Gold, boas-vindas |
| **Isótipo Gold** | `motta-symbol-gold.png` / `.svg` | Selos VIP, cabeçalhos de hero escuro, vouchers |
| **Isótipo White** | `motta-symbol-white.png` / `.svg` | Aplicações sobre fundos escuros (`--ink`) |
| **Club Motta Logo** | `club-motta-transparent.png` | Header principal, tela de login, voucher digital |
| **Club Black Logo** | `club-black-transparent.png` | Cards de planos Clube Black e Clube Black Prime |

## Componentes

- **Eyebrow + título**: eyebrow forest + ponto gold 4px + legenda muted; título serif.
- **Chip de aba**: 14×8 padding, raio 12. Ativo `--forest` + texto branco + sombra; inativo `--surface-soft` + `--text`.
- **Hero escuro** (plano): fundo `--ink`, raio 16, gradiente só sobre imagem (`90deg ink → transparente`), selo "Ativo" mint-on-dark em pílula.
- **Card de parceiro**: avatar 44px raio 12, nome 13/600, badge mint "5% OFF", imagem 144px raio 12 com legenda translúcida (`rgba(7,30,19,.7)` + blur), rodapé com "Copiar cupom".
- **Barra de progresso de etapas**: "ETAPA n DE 5", 5 passos, ativo forest, concluídos forest-900.
- **Card de agendamento**: data em bloco (dia 19/700 + mês 12 maiúsculo), barbeiro 16/600, status `--success`, ações "Detalhes" (secundário) e "Reagendar" (primário).
- **Card de plano**: claro (Gold 1/2) ou escuro (Gold 3, Black); preço serif; selo de vagas `--scarcity`; CTA "Comprar"/"Assinar agora"/"Garantir vaga".
- **Barra inferior**: 5 itens (Início, Agendamentos, Clube, Planos, Perfil), 12px; ativo `--forest`, demais `--muted`.
- **Toast**: pílula `--ink` + texto gold.

## Regras

1. Fundo sempre `--canvas`; branco só em cards.
2. Gold é acento (nunca fundo de botão grande); primário é sempre forest.
3. Títulos de página em serif; todo o resto em Inter.
4. Sem gradiente colorido; gradiente apenas escuro sobre foto.
5. Alvos de toque ≥ 44px; foco visível (`outline: 2px solid --forest`).
6. Dados dos protótipos são ilustrativos.
