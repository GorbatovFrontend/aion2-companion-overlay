# Data sources

Last checked: 2026-09-27. No automated provider is enabled in the MVP. “Unknown” means written permission, license, rate limit or redistribution terms were not found in the public material reviewed; it means **do not ingest automatically** until resolved.

| Source | Endpoint / surface found | Entity | Auth | Rate limit | License / ToS status | Cache? | Redistribute? | Region | Decision |
|---|---|---|---|---|---|---|---|---|---|
| AION 2 / NCSOFT | `https://aion2.plaync.com/` notices and patch notes | Official announcements, patch/version facts | Public pages | Not documented | Publisher terms apply; no blanket content/data redistribution grant established | Only links and minimal factual normalized records pending review | Unknown | Global/KR/TW by host | Manual/reference provider only |
| NCSOFT character search | Observed public web endpoint family under `/api/search/aion2/search/v2/character`; no official developer documentation found | Character profile/armory | Public site behavior; contract unknown | Not documented | Undocumented site API, stability and reuse rights unknown | No automated cache in MVP | Unknown | KR/TW | Keep manual profile; legal/API review required |
| AION2Hub | `https://aion2hub.com/database` | Items and database facts | Public UI | Not documented | No public API/license or redistribution permission established in research | No automated cache | Unknown | Multi-region | Reference/manual source only; contact owner for feed/license |
| QuestLog | `https://questlog.gg/aion-2/en-nc/db/search` | Database, builds, armory | Public UI; some user features may require login | Not documented | No public API/license established | No automated cache | Unknown | NC/regions | Reference/manual source only; request API terms |
| Aion2.app | `https://aion2.app/` | News/tools/community data | Public UI | Not documented | Developer statements mention official announcements, but no reusable API/license established | No automated cache | Unknown | Multi-region | Reference/manual source only |
| Aion 2 Kodex | `https://kodex.yavuz.app/en/roadmap/` | Progression logic, explanations, stop rules | None | N/A for manual reading | Copyrighted editorial guide; privacy page exists, no license for copying | Store only our short independently written recommendations plus citation after permission/terms review | No article redistribution | TW reference + Global LST | Manual editorial reference; paraphrase and cite |
| Local signed package | User-selected/package updater endpoint (future) | Normalized game data | Signature, no account | Release CDN policy | Project-owned schema and package license | Yes, offline-first | Per package license | Explicit in manifest | Preferred production update path |

## Robots and endpoint status

The browsing environment could not reliably retrieve the five `robots.txt` files as raw text during this check. Therefore no automated crawler is authorized by this document. Before implementing any fetcher, repeat the check from a normal network, archive the relevant ToS/license version, inspect `robots.txt`, obtain owner permission where needed, and document rate limits and cache/redistribution rights.

No stable public item/drop API with explicit redistribution terms was confirmed. The existence of JSON calls used by a website does not by itself create permission or a supported API contract.

## Provider contract

```ts
interface DataProvider {
  readonly id: string;
  readonly region: "global" | "kr" | "tw" | "multi";
  checkForUpdates(signal: AbortSignal): Promise<UpdateCheck>;
  fetchVersion(signal: AbortSignal): Promise<ProviderVersion | null>;
  fetchClasses(signal: AbortSignal): Promise<ImportEntity[]>;
  fetchBuilds(signal: AbortSignal): Promise<ImportEntity[]>;
  fetchGuides(signal: AbortSignal): Promise<ImportEntity[]>;
  getItems(signal: AbortSignal): Promise<ImportItem[]>;
  getSkills(signal: AbortSignal): Promise<ImportSkill[]>;
  getInstances(signal: AbortSignal): Promise<ImportInstance[]>;
  getBosses(signal: AbortSignal): Promise<ImportBoss[]>;
  getDrops(signal: AbortSignal): Promise<ImportDrop[]>;
  getSystems(signal: AbortSignal): Promise<ImportSystem[]>;
  getRoadmap(signal: AbortSignal): Promise<ImportRoadmapStep[]>;
}
```

An unsupported entity returns an empty capability/result, not fabricated data. Providers attach source URL, fetched time, region, version and verification status to every record.

## Update policy

Providers write a staging database. Validation checks schema version, referential integrity, source metadata, entity counts and signed package digest. The updater then performs an atomic replacement while retaining the last known-good package. Source failure never blocks startup.

## Research references

- [AION2Hub database](https://aion2hub.com/database)
- [QuestLog AION 2 database](https://questlog.gg/aion-2/en-nc/db/search)
- [Aion 2 Kodex](https://kodex.yavuz.app/en/)
- [Kodex roadmap](https://kodex.yavuz.app/en/roadmap/)
- [Aion2.app](https://aion2.app/)
- [NCSOFT AION 2](https://aion2.plaync.com/)
