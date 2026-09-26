# Security and policy

The MVP is an external local application. It does not inject DLLs, hook DirectX/Vulkan, read/write process memory, modify game files, capture or alter network packets, simulate input, automate play, evade anti-cheat or conceal itself.

## Trust boundaries

- WebView content is bundled; CSP permits only self, local assets and Tauri IPC.
- No remote HTML is embedded and no iframe is used.
- Database commands expose typed operations rather than arbitrary SQL.
- No secrets/API keys are stored in the repository.
- Updates must be signed and verified before activation; failed updates retain the last known-good DB.
- Source URLs are data, never executable content.

## Deferred features

Packet capture, OCR, DPS integration and character auto-import remain separate optional modules. Before any implementation, repeat a dated review of AION 2/NCSOFT rules and obtain a documented public API or explicit permission. Absence of a ban is not treated as permission. Packet capture is not approved for this project by the current research.

## Privacy

The local profile, checklist and favorites stay on device. No telemetry, login or upload is required. Any future sharing/sync is opt-in with an exact preview of transmitted fields and a deletion path.

## Supply chain

Release CI should pin lockfiles, audit Rust/npm dependencies, generate SBOMs, sign Windows binaries and updater manifests, publish hashes, and build from a protected tag. Third-party module loading remains off until isolation and revocation exist.

