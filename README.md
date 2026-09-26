# AION 2 Companion Overlay

Windows desktop companion for AION 2 Global: an offline Russian wiki, progression assistant, checklist and compact overlay. The MVP is an external Tauri 2 application. It does not inject code, read game memory, capture packets, modify files, automate input or bypass anti-cheat.

Unofficial community project. Not affiliated with, endorsed by, or sponsored by NCSOFT. AION and related names and marks belong to their respective owners.

> Data status: the included records are a deliberately small research seed used to exercise the complete product flow. TW/community values are visibly marked and must not be treated as confirmed Global data.

## Download and install

Download the latest Windows installer from [GitHub Releases](https://github.com/gorbatovfrontend-cmd/aion2-companion-overlay/releases). For most users, the NSIS `setup.exe` is the simplest option; `.msi` is also published.

The preview builds are currently unsigned. Windows SmartScreen may show an unknown publisher warning. Verify that the download comes from this repository's Releases page before choosing **More info → Run anyway**. Node.js, Rust and pnpm are not required to run the installed application.

## What works

- Three native windows: Panel (`Alt+Q`), Compact (`Alt+Shift+Q`) and Quick Search (`Alt+Space`).
- Always-on-top transparent windows, drag/resize, persisted geometry and compact click-through (`Alt+Shift+L`).
- Local SQLite database with versioned migrations and FTS5 index.
- RU/EN search, aliases, command filters such as `> dungeon fire` and client-side fuzzy ranking.
- Editable character level/GS; roadmap recalculates after saving.
- Persistent obtained/favorite/enhancement state and daily/weekly counters.
- Module registry with explicit permissions and per-module enable state.
- Browser fallback (`pnpm dev`) for UI development without the Rust host.
- Personal Advisor driven by deterministic local rules, including explicit `STOP` advice and explanations.
- Multiple character profiles, all eight class registry entries, PvE/Solo PvP build selection and weighted build readiness.
- Separate `reference.db` and `user.db` stores for updateable content and durable personal progress.
- Data Sources screen with provider health/version state; remote providers remain disabled or manual-only until their API and reuse terms are confirmed.

## Development

Requirements: Windows 10/11, WebView2, Node.js 20+, pnpm 9+, Rust stable 1.77.2+ and the Visual Studio C++ Build Tools.

```powershell
pnpm install
pnpm tauri dev
```

Frontend-only preview:

```powershell
pnpm dev
```

Tests and production build:

```powershell
pnpm test
pnpm build
pnpm tauri build
```

CI verifies frontend and Rust tests on Windows. Pushing a version tag such as `v0.2.0` builds both Windows installers and creates a draft prerelease through `.github/workflows/release.yml`.

The Tauri build produces Windows installers under `src-tauri/target/release/bundle/`. A portable binary is the unsigned `src-tauri/target/release/aion2-companion-overlay.exe`; release distribution should add code signing and an updater signature.

Before a signed release, generate platform icon sizes from `assets/app-icon.svg` with `pnpm tauri icon assets/app-icon.svg`, then add the generated icon paths to the bundle configuration.

## Local data

The legacy feature store remains `companion.db`. Advisor v0.2 adds `reference.db` plus `user.db` in the same OS app-data directory; reference data can be replaced independently while user profiles/checklists remain intact. Migrations live in `src-tauri/migrations/`. The current seed is intentionally small and source-labelled.

To update data safely:

1. Add a new numbered SQL migration or import a signed/versioned data package.
2. Preserve source, region, localization status and verification date.
3. Rebuild `search_index` in the same transaction.
4. Run Rust and frontend tests before publishing the package.

## Add a provider

Implement the `DataProvider` contract described in [docs/architecture.md](docs/architecture.md), map remote records into normalized import DTOs, and put all network access in the updater process. Providers must never write directly to the live database; validate into a staging database and atomically swap after checks pass.

## Add a module

Add a feature directory under `src/modules/`, register its manifest in `src/core/modules/registry.ts`, declare only the permissions it needs, and add its route/render entry. Modules receive core services; they do not own windows, global shortcuts or raw database connections.

## Documentation

- [Overlay research](docs/research-overlays.md)
- [Architecture](docs/architecture.md)
- [Data sources](docs/data-sources.md)
- [Database](docs/database.md)
- [Overlay behavior](docs/overlay.md)
- [Module system](docs/modules.md)
- [Localization](docs/localization.md)
- [Security](docs/security.md)
- [Delivery roadmap](docs/roadmap.md)
- [Advisor v0.2 and acceptance matrix](docs/advisor-v0.2.md)
