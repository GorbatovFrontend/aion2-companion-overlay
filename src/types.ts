export type Priority = "S" | "A" | "B" | "STOP";

export interface Profile {
  className: string;
  faction: string;
  server: string;
  currentGs: number;
  currentLevel: number;
  pvpEnabled: boolean;
}

export interface RoadmapAction {
  id: number;
  title: string;
  priority: Priority;
  explanation: string;
  sourceStatus: string;
}

export interface RoadmapStep {
  id: number;
  title: string;
  description: string;
  minGs: number;
  maxGs: number;
  actions: RoadmapAction[];
}

export interface ChecklistItem {
  id: number;
  name: string;
  cadence: "daily" | "weekly";
  limit: number;
  completed: number;
  reward: string;
  reason: string;
  priority: Priority;
}

export interface TrackedItem {
  id: number;
  nameRu: string;
  nameEn: string;
  obtained: boolean;
  enhancement: number;
  favorite: boolean;
}

export interface Bootstrap {
  profile: Profile;
  roadmap: RoadmapStep;
  checklist: ChecklistItem[];
  items: TrackedItem[];
  databaseVersion: string;
  activeCharacter?: CharacterProfile;
  characters?: CharacterProfile[];
  classes?: ClassDefinition[];
  builds?: ClassBuild[];
  rules?: RecommendationRule[];
  providerStatuses?: ProviderStatus[];
}

export interface SearchResult {
  entityType: "item" | "instance" | "boss" | "skill" | "system" | "class";
  entityId: number;
  nameRu: string;
  nameEn: string;
  details: string;
  localizationStatus: string;
  sourceStatus: string;
}

export type PlayMode = "pve" | "solo_pvp" | "small_scale" | "group_pvp";

export interface CharacterProfile {
  id: number;
  name: string;
  classId: string;
  className: string;
  server: string;
  faction: string;
  currentLevel: number;
  currentGs: number;
  primaryMode: PlayMode;
  playContext: "solo" | "small_scale" | "group";
  activeBuildId?: string;
  profileCompleteness: number;
  skills: Record<string, number>;
  systems: Record<string, Record<string, unknown>>;
  items: Record<string, { obtained: boolean; equipped: boolean; enhancement: number }>;
}

export interface ClassDefinition {
  id: string;
  nameRu: string;
  nameEn: string;
  roleRu?: string;
  weaponRu?: string;
  damageTypeRu?: string;
  mechanicsRu?: string;
  strengthsRu?: string;
  weaknessesRu?: string;
  region: string;
  patch: string;
  confidence: "high" | "medium" | "low";
  source: string;
}

export interface BuildComponent {
  id: number;
  componentType: "item" | "skill" | "system" | "stigma";
  targetId: string;
  labelRu: string;
  weight: number;
  required: boolean;
  stage: string;
  acquisitionRu?: string;
  reasonRu?: string;
  priority: Priority;
}

export interface ClassBuild {
  id: string;
  classId: string;
  nameRu: string;
  nameEn: string;
  mode: PlayMode;
  conceptRu: string;
  region: string;
  patch: string;
  confidence: "high" | "medium" | "low";
  components: BuildComponent[];
  stats: Array<{ nameRu: string; orderIndex: number; explanationRu: string; breakpoint?: string; confirmed: boolean }>;
}

export interface RuleConditionLeaf {
  path: string;
  equals?: unknown;
  notEquals?: unknown;
  gt?: number;
  gte?: number;
  lt?: number;
  lte?: number;
  contains?: unknown;
  missing?: boolean;
  obtained?: boolean;
  equipped?: boolean;
}
export type RuleCondition = RuleConditionLeaf | { and: RuleCondition[] } | { or: RuleCondition[] };
export interface RecommendationRule {
  id: string;
  classId?: string;
  buildId?: string;
  conditions: RuleCondition;
  recommendation: { type: string; priority: Priority; title: string; reason: string; gain: string; consequence: string; target: string; targetLevel?: number };
  region: string;
  patch: string;
  confidence: "high" | "medium" | "low";
  source: string;
}
export type AdvisorAction = RecommendationRule["recommendation"] & { ruleId: string; region: string; patch: string; confidence: "high" | "medium" | "low"; source: string };

export interface ProviderStatus {
  id: string;
  name: string;
  enabled: boolean;
  status: "current" | "updated" | "unchanged" | "error" | "disabled" | "manual_only";
  lastChecked?: string;
  lastSuccess?: string;
  version?: string;
  error?: string;
}
