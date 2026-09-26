import { describe, expect, it } from "vitest";
import { rankResults } from "./rank";
import type { SearchResult } from "../../types";

const rows: SearchResult[] = [
  { entityType:"instance",entityId:1,nameRu:"Храм Огня",nameEn:"Fire Temple",details:"",localizationStatus:"community_ru",sourceStatus:"reference" },
  { entityType:"boss",entityId:2,nameRu:"Разгневанная Кромеда",nameEn:"Enraged Kromede",details:"",localizationStatus:"community_ru",sourceStatus:"reference" }
];

describe("rankResults", () => {
  it("puts prefix matches first", () => expect(rankResults("храм", rows)[0]?.entityType).toBe("instance"));
  it("does not mutate source rows", () => { const copy = [...rows]; rankResults("кром", rows); expect(rows).toEqual(copy); });
});
