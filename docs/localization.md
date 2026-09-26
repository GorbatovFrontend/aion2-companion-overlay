# Localization

Russian is the primary UI language. Entities keep `name_ru` and `name_en`; cards show Russian first and English as secondary text.

Allowed localization statuses:

- `official_ru`: verified official client/publisher wording.
- `community_ru`: human community translation, visibly non-official.
- `machine_translation`: machine-generated and visibly labelled.
- `unknown`: no Russian label; display English without inventing an official name.

Translation status belongs to the record/package and is upgradeable after Global client verification. Search indexes both languages, aliases and common abbreviations. A localization update never silently changes entity identity; stable external/source IDs and an alias history prevent broken favorites.

The bundled seed intentionally labels Russian game terms as community/reference where official Global terminology was not verified.

