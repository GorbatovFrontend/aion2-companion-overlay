# Architecture

The application is a Tauri 2 process hosting three WebView2 windows. Rust owns durable data, native windows and hotkeys. React owns presentation and ephemeral interaction. Modules consume narrow core APIs and never call platform APIs directly.

```text
Windows / global shortcuts
        │
Tauri core (window manager, overlay manager, command boundary)
        ├── reference.db ── classes / builds / rules / FTS5
        ├── user.db ── characters / progress / settings
        ├── companion.db ── legacy feature compatibility
        ├── updater ── provider adapters ── staging DB ── atomic swap
        └── module registry ── permissions / enable state / lifecycle
                     │
React + TanStack Query (server/data state)
Zustand (ephemeral UI state)
        │
Panel | Compact overlay | Quick Search
```

## Boundaries

- `src/core/database`: typed IPC client and query hooks.
- `src/core/search`: presentation ranking; authoritative index is SQLite FTS5.
- `src/core/modules`: manifests and module state.
- `src/modules/*`: feature UI, one directory per module.
- `src/windows`: window-specific shells with deliberately small payloads.
- `src-tauri/src`: commands, window/hotkey setup and repository layer.
- `src-tauri/migrations`: immutable, ordered schema/data changes.
- Future `backend/providers`: network adapters used only by the updater.

## Data flow

The frontend merges `get_bootstrap` with `get_advisor_bundle` into one coherent snapshot. Character mutations commit `user.db`, then refetch both views; TanStack Query replaces its cache. The rule engine is deterministic and data-driven: nested AND/OR conditions and whitelisted operators are interpreted without `eval`, scripts or a runtime model.

Search uses a normalized FTS table and a LIKE fallback for fragments/aliases. The UI performs deterministic fuzzy re-ranking over the small candidate set, keeping typo logic out of every feature module.

## Proposed production interfaces

`WindowManager`: create/show/hide/focus, clamp saved bounds to current monitors, choose active monitor, persist logical bounds.

`OverlayManager`: topmost state, opacity, lock, click-through, optional game-foreground visibility policy.

`DataUpdater`: fetch manifest, verify signature/hash, download diff or package, migrate staging DB, validate, atomically activate, retain rollback.

`ModuleRuntime`: register manifest, validate permissions, start/stop module, expose services and health/performance telemetry.

## Reversible decisions

The seed lives in migrations to make the MVP reproducible. Production content should move to signed packages without changing UI contracts. Third-party modules are not loaded; manifests exist now so adding a sandbox/ABI later does not reshape navigation. Game process detection is deferred until the executable identity for Global is known and policy-reviewed.
