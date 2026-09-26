import { invoke } from "@tauri-apps/api/core";
import type { Bootstrap, CharacterProfile, Profile, SearchResult, TrackedItem } from "../../types";
import { browserBootstrap, browserCreateCharacter, browserSaveCharacter, browserSearch, browserSetActiveCharacter } from "./browserFallback";

const isTauri = (): boolean => "__TAURI_INTERNALS__" in window;

export async function getBootstrap(): Promise<Bootstrap> {
  if (!isTauri()) return browserBootstrap();
  const [legacy, advisor] = await Promise.all([
    invoke<Bootstrap>("get_bootstrap"),
    invoke<Partial<Bootstrap>>("get_advisor_bundle"),
  ]);
  return { ...legacy, ...advisor };
}

export async function saveProfile(profile: Profile): Promise<Bootstrap> {
  if (!isTauri()) return browserBootstrap({ profile });
  return invoke<Bootstrap>("save_profile", { profile });
}

export async function setChecklistCount(activityId: number, count: number): Promise<Bootstrap> {
  if (!isTauri()) return browserBootstrap({ checklist: { activityId, count } });
  return invoke<Bootstrap>("set_checklist_count", { activityId, count });
}

export async function setItemState(item: TrackedItem): Promise<Bootstrap> {
  if (!isTauri()) return browserBootstrap({ item });
  return invoke<Bootstrap>("set_item_state", { itemId: item.id, obtained: item.obtained, favorite: item.favorite, enhancement: item.enhancement });
}

export async function searchLocal(query: string): Promise<SearchResult[]> {
  if (!isTauri()) return browserSearch(query);
  return invoke<SearchResult[]>("search", { query, limit: 20 });
}

export async function setClickThrough(enabled: boolean): Promise<void> {
  if (isTauri()) await invoke("set_click_through", { enabled });
}

export async function saveCharacter(character: CharacterProfile): Promise<Bootstrap> {
  if (!isTauri()) return browserSaveCharacter(character);
  await invoke("save_character", { character });
  return getBootstrap();
}

export async function createCharacter(classId: string): Promise<Bootstrap> {
  if (!isTauri()) return browserCreateCharacter(classId);
  await invoke("create_character", { classId });
  return getBootstrap();
}

export async function setActiveCharacter(characterId: number): Promise<Bootstrap> {
  if (!isTauri()) return browserSetActiveCharacter(characterId);
  await invoke("set_active_character", { characterId });
  return getBootstrap();
}

export async function checkDataUpdates(providerId?: string): Promise<Bootstrap> {
  if (!isTauri()) return browserBootstrap();
  await invoke("check_data_updates", { providerId: providerId ?? null });
  return getBootstrap();
}
