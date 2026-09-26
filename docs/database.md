# Database

SQLite is the local source of truth. Advisor v0.2 separates replaceable reference content from personal state: `reference.db` is opened as the main database and `user.db` is attached as schema `user`. The pre-v0.2 `companion.db` remains available to legacy screens during migration. WAL mode is enabled, foreign keys are enforced and migrations run transactionally at startup. FTS5 indexes Russian names, English names, aliases and a short details field.

## Entity groups

- Knowledge: `items`, `item_stats`, `skills`, `instances`, `bosses`, `drops`, `pity_rewards`, `systems`.
- Advice: `roadmap_steps`, `roadmap_actions`, `activities`.
- User state in `user.db`: `characters`, `character_items`, `character_skills`, `character_systems`, `character_checklist`, `favorite_builds`, `app_settings`, `update_history`.
- Builds/advice in `reference.db`: `classes`, `class_builds`, `build_components`, `stat_priorities`, `skill_breakpoints`, `recommendation_rules`, `provider_versions`.
- Provenance: `sources`, `source_records`.
- Search: `search_index` (FTS5).
- Operations: `schema_migrations`.

All imported facts must carry region/version via their entity or `source_records`. A value from KR/TW must never overwrite a confirmed Global value without keeping both variants and their provenance.

## Migrations

Migrations are numbered and immutable. Legacy migrations remain at the root. Split migrations live under `migrations/reference` and `migrations/user`. On first v0.2 launch, the active legacy profile is copied once when `user.characters` is empty. Future content updates should normally be validated data packages, while schema changes remain SQL migrations.

## Reset semantics

Daily/weekly reset is data-domain logic, not a timer that must keep running. On read or resume, calculate the relevant Global server reset boundary from an explicit timezone/versioned rule, compare with `reset_at`, and reset in one transaction. The MVP stores completion state but the authoritative launch reset schedule is intentionally not guessed.

## Search performance

FTS narrows candidates; fuzzy ranking is applied only to those candidates. Production benchmarks should include warm/cold searches at 10k, 100k and 1m rows, with a target below 50 ms at the UI command boundary.
