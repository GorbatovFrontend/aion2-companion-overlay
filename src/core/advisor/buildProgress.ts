import type { BuildComponent, CharacterProfile } from "../../types";

export function componentComplete(profile: CharacterProfile, component: BuildComponent): boolean {
  if (component.componentType === "item") return profile.items[component.targetId]?.obtained === true;
  if (component.componentType === "skill") return (profile.skills[component.targetId] ?? 0) > 0;
  if (component.componentType === "system" && component.targetId === "arcana:5") return Number(profile.systems.arcana?.filledSlots ?? 0) >= 5;
  return false;
}

export function weightedCompletion(profile: CharacterProfile, components: BuildComponent[]): number {
  const total = components.reduce((sum, component) => sum + component.weight, 0);
  if (total === 0) return 0;
  const complete = components.filter(component => componentComplete(profile, component)).reduce((sum, component) => sum + component.weight, 0);
  return Math.round(complete / total * 100);
}
