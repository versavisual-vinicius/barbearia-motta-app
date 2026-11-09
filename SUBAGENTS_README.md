# Subagents for Antigravity — MOTTA

Copy the `.agents/` directory into the root of your Antigravity project. The five agents appear under `/agents` when supported. `.agents/AGENTS.md` provides orchestration rules. `workflow.json` documents the process but is **not** an executable Antigravity agent definition.

To use the same agents in all repositories, place their `.md` files under `~/.gemini/config/agents/` (check your installation version).

## Initial task prompt

Use the custom audit team. In parallel delegate the project investigation to `code-investigator`, layout/accessibility audit to `responsive-auditor`, and booking-state diagnosis to `booking-state-auditor`. Verify the observed MOTTA issues without assuming selectors or fixed dates in code. After consolidating evidence, use only `targeted-implementer` to correct confirmed causes in a localized manner. Then use `regression-qa` and the built-in browser agent for actual interaction and viewport checks at 320, 375, 390, 768, 1024 and 1440 px, short height and landscape when relevant. Report file changes, proof, executed tests and unverified items. Do not claim a visual check from static code inspection.

## Scope of observations

- Lounge heading spacing and empty card area on wide screens
- Login/register tab clipped at 320px
- Treatment category clipped at 320px
- Booking list days 09–15 versus summary day 28 at 15:00
- Professional rating position inconsistency at 320px
- Other clipping, tap/focus, horizontal scrolling affordances and fixed-bottom nav overlap

## Note

Exact tool names and policies depend on Antigravity version and enabled tools; inspect `/agents` and adjust frontmatter if your local installation reports unsupported tools.
