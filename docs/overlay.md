# Overlay behavior

## Windows

Panel is an interactive 1100×720 desktop window, shown/hidden with `Alt+Q`, and hidden with `Esc`. Compact is a 330×410 topmost window, shown/hidden with `Alt+Shift+Q`; it is draggable, resizable and can enter click-through with `Alt+Shift+L`. Quick Search is a centered 680×440 focusable palette shown with `Alt+Space`.

All windows are external WebView2 top-level windows. There is no overlay injection and no game rendering hook. Borderless/windowed fullscreen is the supported game mode; exclusive fullscreen is not promised.

## State and monitors

The Tauri window-state plugin persists size and position. Before production release, restore must additionally validate the saved monitor and clamp bounds into the current work area. Logical coordinates should be converted using that monitor’s scale factor so a move between 100% and 150% DPI does not strand or distort a window.

Do not choose a universal HUD corner: users place Compact around their own party frames/minimap/skill bar. “Reset window position” must remain available from tray/settings.

## Focus and pass-through

Panel and Quick Search request focus only when explicitly invoked. Compact does not steal focus when merely restored. Click-through calls the native window ignore-cursor-events API and must always have a global escape hotkey; the UI control disappears by definition once enabled.

Opacity should apply to the window chrome/background, not text independently. The intended safe range is 30–100%, but values below roughly 60% should show a contrast warning.

## Game lifecycle

The MVP does not identify a process because the final Global executable identity/policy has not been verified. The planned implementation uses Windows foreground/window events rather than per-second polling. User policy options: always show; show only while AION 2 is foreground; hide when minimized. Panel remains accessible for desktop research.

## Performance

No animation loop, combat polling or second-based timer exists. React Query does not refetch on focus. Each window updates only after IPC/state changes. Compact renders a tiny snapshot rather than mounting the whole panel.

