import { describe, expect, it } from "vitest";
import { evaluateRules, matchesRule } from "./ruleEngine";
import type { CharacterProfile, RecommendationRule } from "../../types";

const profile: CharacterProfile = { id:1,name:"Test",classId:"sorcerer",className:"Волшебник",server:"",faction:"",currentLevel:45,currentGs:1800,primaryMode:"pve",playContext:"solo",activeBuildId:"sorcerer-pve",profileCompleteness:60,skills:{hellfire:7},systems:{arcana:{filledSlots:3}},items:{"2":{obtained:false,equipped:false,enhancement:0}} };
it("supports nested AND and numeric comparisons", () => expect(matchesRule(profile,{and:[{path:"currentLevel",gte:45},{path:"skills.hellfire",lt:10}]})).toBe(true));
it("filters class/build and returns deterministic order", () => { const rules = [{id:"x",classId:"sorcerer",conditions:{path:"currentGs",gte:1800},recommendation:{type:"x",priority:"S",title:"x",reason:"x",gain:"x",consequence:"x",target:"x"},region:"TW",patch:"p",confidence:"low",source:"s"}] as RecommendationRule[]; expect(evaluateRules(profile,rules)[0]?.ruleId).toBe("x"); });
