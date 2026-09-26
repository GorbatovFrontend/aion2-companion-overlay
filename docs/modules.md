# Modules

Modules now include Personal Advisor, Classes, Builds and Data Sources alongside Wiki, Roadmap, My Progress, Daily/Weekly, Sorcerer and Quick Search. The registry manifest contains `id`, localized name, semantic version, default enable state and required permissions.

```ts
interface ModuleManifest {
  id: string;
  name: string;
  version: string;
  enabledByDefault: boolean;
  permissions: readonly ModulePermission[];
}
```

Core services are capability-based: database read/write, quick-search window, notifications, updater and settings. Disabling a module removes its navigation and prevents its background lifecycle from starting.

Third-party code is deliberately unsupported in v1. A future plugin package needs signing, compatibility ranges, permission consent, resource budgets, crash isolation and an update/revocation channel before arbitrary modules are loaded. Map, timers, DPS integration, crafting, auction and build sharing are reserved IDs/interfaces only.
