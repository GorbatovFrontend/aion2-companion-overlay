import type { AdvisorAction, CharacterProfile, RecommendationRule, RuleCondition, RuleConditionLeaf } from "../../types";

function getPath(input: unknown, path: string): unknown {
  const normalized = path === "level" ? "currentLevel" : path === "gs" ? "currentGs" : path;
  return normalized.split(".").reduce<unknown>((value, key) => value && typeof value === "object" ? (value as Record<string, unknown>)[key] : undefined, input);
}

function leafMatches(profile: CharacterProfile, condition: RuleConditionLeaf): boolean {
  const value = getPath(profile, condition.path);
  if (condition.missing !== undefined && condition.missing !== (value === undefined || value === null)) return false;
  if (condition.equals !== undefined && value !== condition.equals) return false;
  if (condition.notEquals !== undefined && value === condition.notEquals) return false;
  if (condition.gt !== undefined && !(typeof value === "number" && value > condition.gt)) return false;
  if (condition.gte !== undefined && !(typeof value === "number" && value >= condition.gte)) return false;
  if (condition.lt !== undefined && !(typeof value === "number" && value < condition.lt)) return false;
  if (condition.lte !== undefined && !(typeof value === "number" && value <= condition.lte)) return false;
  if (condition.contains !== undefined && !(Array.isArray(value) && value.includes(condition.contains))) return false;
  if (condition.obtained !== undefined && getPath(profile, `${condition.path}.obtained`) !== condition.obtained) return false;
  if (condition.equipped !== undefined && getPath(profile, `${condition.path}.equipped`) !== condition.equipped) return false;
  return true;
}

export function matchesRule(profile: CharacterProfile, condition: RuleCondition): boolean {
  if ("and" in condition) return condition.and.every(child => matchesRule(profile, child));
  if ("or" in condition) return condition.or.some(child => matchesRule(profile, child));
  return leafMatches(profile, condition);
}

export function evaluateRules(profile: CharacterProfile, rules: RecommendationRule[]): AdvisorAction[] {
  const rank = { STOP: 0, S: 1, A: 2, B: 3 } as const;
  return rules.filter(rule => (!rule.classId || rule.classId === profile.classId) && (!rule.buildId || rule.buildId === profile.activeBuildId) && matchesRule(profile, rule.conditions)).map(rule => ({ ...rule.recommendation, ruleId: rule.id, region: rule.region, patch: rule.patch, confidence: rule.confidence, source: rule.source })).sort((a, b) => rank[a.priority] - rank[b.priority]);
}
