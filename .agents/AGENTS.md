# MOTTA engineering orchestration

When assigned an audit-and-fix request:
1. Preserve the user's observations literally; do not promote hypothetical selectors, component names, test coverage or code details into facts.
2. Invoke `code-investigator`, `responsive-auditor`, and `booking-state-auditor` as independent subagents concurrently if the environment supports it. These agents are read-only. Use the built-in browser subagent via `/browser` for actual interactive browser verification when available.
3. Consolidate findings into a minimal patch plan. Explicitly record evidence, affected components, risk and acceptance criteria.
4. Delegate approved or requested implementation to `targeted-implementer` only, sequentially after investigations finish. Do not allow simultaneous source edits.
5. Delegate independent verification to `regression-qa` after code changes; for browser rendering ask the built-in browser agent. Return failed checks for focused fixes and re-test.
6. Present a final report: observed issues, confirmed causes, changes, edited files, actual executed tests by viewport, pass/fail/not-verified status, risks and pending work.

Safety: inspect the repository before executing any project script, avoid destructive operations and leaking secrets. Follow any higher-priority instructions and existing project conventions. Agent availability and tool permissions may vary; do not claim delegation succeeded without checking.
