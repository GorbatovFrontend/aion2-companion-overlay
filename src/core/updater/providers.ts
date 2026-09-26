export type SourceRegion = "global" | "kr" | "tw" | "multi";

export interface Provenance {
  sourceId: string;
  sourceUrl: string;
  region: SourceRegion;
  fetchedAt: string;
  sourceVersion: string;
  status: "global_confirmed" | "global_lst" | "regional_reference" | "community" | "unverified";
}

export interface ImportEntity {
  externalId: string;
  nameRu?: string;
  nameEn: string;
  provenance: Provenance;
}

export interface ProviderVersion {
  version: string;
  publishedAt: string;
  changelog?: string;
}

export interface UpdateCheck {
  available: boolean;
  currentVersion?: string;
  remoteVersion?: string;
}

export interface DataProvider {
  readonly id: string;
  readonly region: SourceRegion;
  checkForUpdates(signal: AbortSignal): Promise<UpdateCheck>;
  fetchVersion(signal: AbortSignal): Promise<ProviderVersion | null>;
  fetchClasses(signal: AbortSignal): Promise<ImportEntity[]>;
  fetchBuilds(signal: AbortSignal): Promise<ImportEntity[]>;
  fetchGuides(signal: AbortSignal): Promise<ImportEntity[]>;
  getItems(signal: AbortSignal): Promise<ImportEntity[]>;
  getSkills(signal: AbortSignal): Promise<ImportEntity[]>;
  getInstances(signal: AbortSignal): Promise<ImportEntity[]>;
  getBosses(signal: AbortSignal): Promise<ImportEntity[]>;
  getDrops(signal: AbortSignal): Promise<ImportEntity[]>;
  getSystems(signal: AbortSignal): Promise<ImportEntity[]>;
  getRoadmap(signal: AbortSignal): Promise<ImportEntity[]>;
}

/** Disabled placeholder: official endpoints and reuse terms are not yet confirmed. */
export abstract class DisabledRemoteProvider implements DataProvider {
  abstract readonly id: string;
  abstract readonly region: SourceRegion;
  private disabled(): Promise<ImportEntity[]> { return Promise.resolve([]); }
  checkForUpdates(): Promise<UpdateCheck> { return Promise.resolve({ available: false }); }
  fetchVersion(): Promise<ProviderVersion | null> { return Promise.resolve(null); }
  fetchClasses(): Promise<ImportEntity[]> { return this.disabled(); }
  fetchBuilds(): Promise<ImportEntity[]> { return this.disabled(); }
  fetchGuides(): Promise<ImportEntity[]> { return this.disabled(); }
  getItems(): Promise<ImportEntity[]> { return this.disabled(); }
  getSkills(): Promise<ImportEntity[]> { return this.disabled(); }
  getInstances(): Promise<ImportEntity[]> { return this.disabled(); }
  getBosses(): Promise<ImportEntity[]> { return this.disabled(); }
  getDrops(): Promise<ImportEntity[]> { return this.disabled(); }
  getSystems(): Promise<ImportEntity[]> { return this.disabled(); }
  getRoadmap(): Promise<ImportEntity[]> { return this.disabled(); }
}

export class OfficialProvider extends DisabledRemoteProvider { readonly id = "official"; readonly region = "global" as const; }
export class Aion2AppProvider extends DisabledRemoteProvider { readonly id = "aion2app"; readonly region = "kr" as const; }
export class Aion2HubProvider extends DisabledRemoteProvider { readonly id = "aion2hub"; readonly region = "multi" as const; }
export class QuestLogProvider extends DisabledRemoteProvider { readonly id = "questlog"; readonly region = "multi" as const; }
export class KodexProvider extends DisabledRemoteProvider { readonly id = "kodex"; readonly region = "tw" as const; }
