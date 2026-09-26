# Advisor v0.2

## Runtime contract

The Personal Advisor is a local deterministic interpreter. Rules are rows in `recommendation_rules`; the UI supports nested `and`/`or` groups and only these leaf operators: `equals`, `notEquals`, `gt`, `gte`, `lt`, `lte`, `contains`, `missing`, `obtained`, and `equipped`. No rule is JavaScript, SQL, `eval`, prompt text, or remote executable code.

Each recommendation includes priority, reason, expected gain, consequence of skipping, source, region, patch and confidence. `STOP` sorts above ordinary S/A/B actions. Unknown or weakly supported class details are rendered as insufficient data instead of being invented.

## Data ownership and migration

- `reference.db`: source-labelled classes, builds, skills, items, systems, roadmap and rules.
- `user.db`: multiple characters, item/skill/system progress, checklist, favourites, settings and update history.
- `companion.db`: retained for compatibility with pre-v0.2 Wiki/Roadmap/checklist screens.

On the first v0.2 launch, an active character is created from the legacy profile only when the new character table is empty. Legacy inventory/checklist commands mirror writes into the active character so both generations of UI remain coherent. Replacing reference content never replaces `user.db`.

## Update safety boundary

Remote providers are disabled or manual-only until a documented API, rate limit and reuse permission exist. The package validator rejects unsupported schema versions, oversized packages, missing fields, unknown entity types, duplicate provider IDs and suspicious record-count collapse. A production provider must additionally verify a signed manifest/hash and apply a validated staging database atomically while retaining the last known-good reference database.

## Acceptance matrix

| Case | Verification | Result |
|---|---|---|
| Sorcerer 45 / GS 1100 | deterministic smoke test selects Fresh 45 rule | Pass |
| Sorcerer 45 / GS 1800 / Hellfire 7 | skill progression rule selected | Pass |
| target gear obtained | missing-gear rule disappears | Pass |
| PvE → Solo PvP | active build and advice change to control/defence | Pass |
| provider version changes | provider abstraction/version records implemented; live fetch disabled pending authorization | Manual-only |
| malformed provider data | Rust validator rejects truncated and duplicate packages before mutation | Pass by unit source; native execution requires Rust toolchain |
| no internet | bootstrap/rules use only local SQLite/browser fallback | Pass |
| reference update | user state is physically isolated in `user.db` | Pass by schema/foreign-key smoke test |

The frontend smoke test is `work/advisor-smoke.ts`; database validation is `work/validate-advisor-db.mjs`.
