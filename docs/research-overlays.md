# Overlay research

Checked: 2026-09-27. “Not documented” means no reliable public evidence was found; it is not a negative claim about the product. AION 2 tools that capture packets are studied only for UX. Their capture method is explicitly out of scope for this MVP.

| App | Game | Technology if known | Overlay method | Hotkeys | Click-through / resize / transparency | Multi-monitor | Data / offline | Plugin architecture | Strong UX ideas | Weak UX / risk | Adopt / improve |
|---|---|---|---|---|---|---|---|---|---|---|---|
| AionFlex | AION 2 | Not documented publicly | External always-on-top window; requires Npcap for DPS | Not reliably documented | Position and opacity advertised; other details not documented | Not documented | Packet-derived combat data, optional upload; offline behavior not documented | No public module API | Boss HP at a glance, relative bars, adjustable appearance | Packet capture and account policy uncertainty; feature tiers can complicate trust | Copy compact hierarchy and optional sharing; keep our MVP entirely local and passive |
| aion2t DPS Meter | AION 2 | WebView2 host; repository exposes web UI | Transparent always-on-top external window; Npcap packet capture | `Ctrl+R` reset | Resizable and transparent; click-through not documented | “Any resolution”; no explicit monitor policy | Packet stream; fight history and updater | No public plugin API | Lightweight panel, clear skill drilldown, multilingual UI | 500 ms live refresh is unnecessary for a wiki; Npcap setup friction | Copy dense rows and drilldown, not capture/polling |
| Aletheia | AION 2 | Windows executable; exact stack not established | External always-on-top; passive packet sniffing | `Alt+Q`, `Alt+E`, customizable | Overlay settings and high-opacity readability; full details not documented | Not documented | Npcap; community report upload; updater supports differential updates | No public plugin API | Separate main/overlay hotkeys, explicit consent, recovery-capable updates | Admin/Npcap friction; mandatory login/upload consent in current release reduces offline trust | Copy separate window roles and atomic updater; no required account |
| A2Tools DPS Meter | AION 2 | Tauri, Rust, React/TS (repository) | External Tauri transparent always-on-top; Npcap capture | Settings-driven; exact defaults vary | Resizable, transparent, themes | Not documented | Packet data; local fight history | No general module API | Closest proof that Tauri is viable; themes and target modes | Requires Npcap/admin; combat feature surface can become noisy | Copy Tauri footprint and explicit modes; isolate any future integration |
| Awakened PoE Trade | Path of Exile | Electron/Vue in upstream repository | External overlay triggered on demand, normally borderless game mode | `Ctrl+D`, `Alt+W`, `Shift+Space`; configurable | Transient and locked interaction modes | OS-dependent | Local parsing plus trade APIs; useful local features | Widget-oriented, not a general third-party API | Appears exactly at intent, auto-dismisses, keyboard-first | Hotkey conflicts and fullscreen/compositor differences are common support issues | Copy instant transient UX and explicit locked mode; detect registration conflicts |
| PoE Overlay | Path of Exile | Overwolf web app; older community fork Electron | Separate transparent windows by purpose | Many configurable bindings; `Alt+Q`, `F7`, etc. | Manifest separates resizable, click-through and focusable windows | Platform managed | Clipboard/game APIs plus web data; partial offline support | Feature selector, no stable external module ABI | Window-per-task, Esc closes latest dialog, keyboard-friendly settings | Too many hotkeys/windows and elevated privilege variants confuse users | Use only three memorable hotkeys and one source of truth for bindings |
| Blish HUD | Guild Wars 2 | .NET/MonoGame | External overlay aligned to the game window | Configurable hide/toggle; Esc closes windows | Dynamic HUD and DPI/interface scaling | Game-window alignment; docs emphasize DPI sync | Modules and GW2 API; can idle in tray | Mature `.bhm` modules, package repository, enable/disable | Strong service/module boundary, lifecycle and user control | Unbounded modules can hurt performance; setup surface is large | Copy manifest/lifecycle/permissions concept; postpone third-party loading |
| GW2 TacO | Guild Wars 2 | Native Windows app | External transparent overlay aligned with GW2 | Rebindable | Primarily pass-through world markers; interaction toggles | Scaling historically sensitive | Local marker packs plus GW2 API | Data packs rather than code plugins | Nearly disappears during play; portable data packs | Alignment, scaling and mouse interception are recurring pain points | Copy passive “only when useful” behavior; use per-monitor logical coordinates |
| Overwolf guidance | Multiple | Overwolf platform | Platform-managed in-game windows | User-configurable; pass-through semantics explicit | Dedicated click-through/focusable windows | Platform managed | App-specific | Platform apps/extensions | Remind users of active shortcuts, centralize configuration, release focus on hide | Transparent controller/toggle edge cases; platform overhead | Adopt hotkey discoverability and explicit focus state in a lighter native shell |

## Findings

Patterns that work:

- Separate a focusable panel from a passive compact surface and a transient command palette.
- Open at the user’s moment of intent, focus immediately, and close with `Esc`.
- Keep the passive view to one current action, one tracked item and one reminder.
- Make lock/click-through visible and reversible by hotkey.
- Persist physical monitor identity plus logical size/position; clamp restored windows to a visible work area.
- Let modules be disabled and never wake/render disabled modules.
- Use atomic, recoverable data updates and keep launch independent of network availability.

Patterns that irritate:

- Exclusive-fullscreen promises that Windows desktop overlays cannot reliably satisfy. Borderless/windowed fullscreen must be the supported mode.
- Hotkey collisions with the game or other overlays, especially broad `Alt` combinations, without a conflict warning.
- Invisible click-through state that leaves users unable to interact with a window.
- Overlay opacity low enough to destroy text contrast, or a full dashboard that permanently covers combat UI.
- Mandatory accounts, uploads or administrator rights for features that do not inherently need them.
- Polling/render loops for static information.

## Proposed Windows behavior

Tauri creates three top-level WebView2 windows. `always_on_top` supplies z-order without DirectX/Vulkan injection. Tauri's ignore-cursor-events capability maps to OS hit-test pass-through; on Windows the underlying concept is a layered top-level window with transparent hit testing. The official window-state plugin persists bounds. On restore, a small Window Manager service will validate bounds against current monitor work areas and DPI scale before showing.

Global shortcuts are registered by the Tauri 2 global-shortcut plugin. Failure is non-fatal and must be surfaced in Settings because another app may own the binding. When the game is not foreground, the safe default is to leave Panel usable and hide Compact only if the user enables that option. A future implementation should use WinEvent hooks rather than one-second polling.

Compact and Panel share data but not layout. Compact has no background animation and renders only on state changes. Panel is focusable. Quick Search is centered on the active monitor, focuses its input, and hides on `Esc` or loss of focus (the latter remains a Phase 1 polish item).

## What this project can do better

It makes provenance a first-class UI element rather than an afterthought, keeps all core value offline without an account, separates Global-confirmed data from TW/community references, and puts explanation beside every recommendation. The module boundary is present before third-party code is allowed, so a later plugin ecosystem does not require turning core services into global mutable state.

## Sources

- [AionFlex product page](https://aionflex.gg/shop)
- [aion2t DPS Meter repository](https://github.com/Grachy/aion2t-dps-meter)
- [Aletheia repository](https://github.com/p62003/aletheia_AION2_DPS_Meter)
- [A2Tools repository](https://github.com/taengu/A2Tools-DPS-Meter)
- [Awakened PoE Trade quick start](https://github.com/SnosMe/awakened-poe-trade/blob/master/docs/quick-start.md)
- [PoE Overlay manifest](https://github.com/Kyusung4698/PoE-Overlay/blob/master/manifest.json)
- [Blish HUD overview](https://blishhud.com/docs/user/)
- [Blish HUD overlay settings](https://blishhud.com/docs/user/guides/overlay-settings/)
- [Overwolf hotkey guidance](https://dev.overwolf.com/ow-electron/guides/product-guidelines/app-screen-behavior/hot-key-and-settings/)
- [Microsoft layered window behavior](https://learn.microsoft.com/en-us/windows/win32/winmsg/window-features)
- [Tauri global shortcut plugin](https://v2.tauri.app/plugin/global-shortcut/)

