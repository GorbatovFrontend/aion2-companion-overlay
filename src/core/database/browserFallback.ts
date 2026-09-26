import type { Bootstrap, CharacterProfile, ClassBuild, ClassDefinition, ProviderStatus, RecommendationRule, SearchResult } from "../../types";

const classNames = [
  ["templar","Храмовник","Templar","Танк","Меч и щит","Физический"], ["gladiator","Гладиатор","Gladiator","Боец","Двуручное оружие","Физический"],
  ["assassin","Убийца","Assassin","Ближний DPS","Парное оружие","Физический"], ["ranger","Стрелок","Ranger","Дальний DPS","Лук","Физический"],
  ["sorcerer","Волшебник","Sorcerer","Дальний DPS / контроль","Книга","Магический"], ["spiritmaster","Заклинатель","Spiritmaster","Дальний DPS / призыв","Сфера","Магический"],
  ["cleric","Целитель","Cleric","Лечение / поддержка","Булава","Магический"], ["chanter","Чародей","Chanter","Поддержка / боец","Посох","Физический / поддержка"]
] as const;
const classes: ClassDefinition[] = classNames.map(([id,nameRu,nameEn,roleRu,weaponRu,damageTypeRu]) => ({ id,nameRu,nameEn,roleRu,weaponRu,damageTypeRu,region:"multi",patch:"research-2026-09-27",confidence:id === "sorcerer" ? "medium" : "low",source:"Official / research registry" }));
const builds: ClassBuild[] = [
  { id:"sorcerer-pve",classId:"sorcerer",nameRu:"PvE: контроль и burst",nameEn:"PvE Boss",mode:"pve",conceptRu:"Безопасный путь развития без неподтверждённых BiS-заявлений.",region:"TW / Global LST",patch:"research-2026-09-27",confidence:"low",components:[
    {id:1,componentType:"item",targetId:"2",labelRu:"Защита Вакрона",weight:25,required:true,stage:"midgame",acquisitionRu:"Небесный остров Вакрона",reasonRu:"Долгоживущий off-hand upgrade.",priority:"S"},
    {id:2,componentType:"skill",targetId:"hellfire",labelRu:"Адское пламя",weight:25,required:true,stage:"fresh45",reasonRu:"Высокий приоритет; breakpoint не подтверждён.",priority:"S"},
    {id:3,componentType:"system",targetId:"arcana:5",labelRu:"Пять слотов Арканы",weight:20,required:true,stage:"midgame",reasonRu:"Сначала ширина, затем качество.",priority:"A"},
    {id:4,componentType:"item",targetId:"1",labelRu:"Книга Кромеды",weight:30,required:true,stage:"late",acquisitionRu:"Храм Огня",reasonRu:"Поздняя цель оружия.",priority:"S"}],stats:[{nameRu:"Магический урон",orderIndex:1,explanationRu:"Базовый offensive приоритет.",confirmed:false},{nameRu:"Точность",orderIndex:2,explanationRu:"Проверяйте требования контента.",confirmed:false}] },
  { id:"sorcerer-solo",classId:"sorcerer",nameRu:"Solo PvP",nameEn:"Solo PvP",mode:"solo_pvp",conceptRu:"Контроль дистанции и сохранение defensive tools.",region:"TW / Global LST",patch:"research-2026-09-27",confidence:"low",components:[],stats:[{nameRu:"Контроль / status accuracy",orderIndex:1,explanationRu:"Точный Global cap неизвестен.",confirmed:false}] }
];
const rules: RecommendationRule[] = [
  {id:"general-fresh45",conditions:{and:[{path:"currentLevel",gte:45},{path:"currentGs",lt:1600}]},recommendation:{type:"progression",priority:"S",title:"Закрыть постоянные системы",reason:"Постоянный прогресс безопаснее глубоких вложений во временный gear.",gain:"Сохранение ресурсов и стабильный рост.",consequence:"Дорогие вложения потеряют ценность при замене gear.",target:"roadmap"},region:"TW / Global LST",patch:"research-2026-09-27",confidence:"medium",source:"Kodex reference"},
  {id:"sorc-hellfire",classId:"sorcerer",buildId:"sorcerer-pve",conditions:{and:[{path:"currentGs",lte:1900},{path:"skills.hellfire",lt:10}]},recommendation:{type:"upgrade_skill",priority:"S",title:"Hellfire: повысить приоритет",reason:"Навык помечен как ключевой burst; точный Global breakpoint не подтверждён.",gain:"Усиление ключевого damage window.",consequence:"Burst останется слабее целевого профиля.",target:"hellfire",targetLevel:10},region:"TW / Global LST",patch:"research-2026-09-27",confidence:"low",source:"Kodex reference"},
  {id:"sorc-solo-control",classId:"sorcerer",buildId:"sorcerer-solo",conditions:{path:"primaryMode",equals:"solo_pvp"},recommendation:{type:"change_build",priority:"S",title:"Переключиться на контроль и защитные инструменты",reason:"Solo PvP требует иного профиля, чем PvE burst preset.",gain:"Больше контроля дистанции и устойчивости.",consequence:"PvE preset оставит меньше ответов на давление игрока.",target:"sorcerer-solo"},region:"TW / Global LST",patch:"research-2026-09-27",confidence:"low",source:"Local curated rule"},
  {id:"sorc-vakron",classId:"sorcerer",buildId:"sorcerer-pve",conditions:{and:[{path:"currentGs",gte:1600},{path:"currentGs",lt:2200},{path:"items.2.obtained",equals:false}]},recommendation:{type:"obtain_item",priority:"S",title:"Получить Защиту Вакрона",reason:"Guard — отсутствующий долгоживущий slot upgrade.",gain:"Закрывает слабый off-hand slot.",consequence:"Комплект останется несбалансированным.",target:"2"},region:"TW / Global LST",patch:"research-2026-09-27",confidence:"medium",source:"Kodex reference"},
  {id:"arcana-fill",conditions:{path:"systems.arcana.filledSlots",lt:5},recommendation:{type:"fill_system",priority:"A",title:"Заполнить пустые слоты Арканы",reason:"Пустой слот не даёт силы.",gain:"Эффективный ранний прирост.",consequence:"Часть системы останется пустой.",target:"arcana"},region:"TW / Global LST",patch:"research-2026-09-27",confidence:"medium",source:"Kodex reference"},
  {id:"stop-theostone",conditions:{and:[{path:"currentGs",lt:1800},{path:"systems.theostone.installed",equals:false}]},recommendation:{type:"stop",priority:"STOP",title:"Не устанавливать дорогой Theostone",reason:"Текущее оружие скоро будет заменено; transfer path не подтверждён.",gain:"Сохранение редкого ресурса.",consequence:"Камень может быть потерян.",target:"theostone"},region:"TW / Global LST",patch:"research-2026-09-27",confidence:"medium",source:"Kodex reference"}
];
const providerStatuses: ProviderStatus[] = [
  {id:"official",name:"Official AION 2",enabled:true,status:"manual_only",lastChecked:"2026-09-27"}, {id:"aion2hub",name:"AION2Hub",enabled:false,status:"disabled"}, {id:"kodex",name:"Aion 2 Kodex",enabled:true,status:"manual_only",lastChecked:"2026-09-27"}, {id:"questlog",name:"QuestLog",enabled:false,status:"disabled"}, {id:"aion2app",name:"Aion2.app",enabled:false,status:"disabled"}
];
const defaultCharacter: CharacterProfile = { id:1,name:"Основной",classId:"sorcerer",className:"Волшебник",server:"",faction:"",currentLevel:45,currentGs:1180,primaryMode:"pve",playContext:"solo",activeBuildId:"sorcerer-pve",profileCompleteness:45,skills:{hellfire:7},systems:{arcana:{filledSlots:3},theostone:{installed:false}},items:{"1":{obtained:false,equipped:false,enhancement:0},"2":{obtained:false,equipped:false,enhancement:0},"3":{obtained:false,equipped:false,enhancement:0}} };

const base: Bootstrap = {
  profile: { className: "Волшебник", faction: "", server: "", currentGs: 1180, currentLevel: 45, pvpEnabled: true },
  roadmap: {
    id: 1, title: "Фундамент после 45", description: "Закройте постоянные системы и сохраните ограниченные ресурсы.", minGs: 0, maxGs: 1599,
    actions: [
      { id: 1, title: "Strongholds → пояс", priority: "S", explanation: "Пояс — долгоживущий слот и безопаснее для вложений.", sourceStatus: "tw_reference" },
      { id: 2, title: "Sealed Dungeons → Даэванион", priority: "S", explanation: "Постоянный прогресс ценнее временной экипировки.", sourceStatus: "tw_reference" },
      { id: 3, title: "Сохранять Одиль", priority: "A", explanation: "Высокие tiers дают больше ценности на единицу ограниченной энергии.", sourceStatus: "tw_reference" }
    ]
  },
  checklist: [
    { id: 1, name: "Ежедневное подземелье", cadence: "daily", limit: 1, completed: 0, reward: "Очки развития", reason: "Стабильный ежедневный прогресс.", priority: "A" },
    { id: 2, name: "Shugo", cadence: "daily", limit: 1, completed: 1, reward: "Кристаллы Даэваниона", reason: "Постоянная сила.", priority: "S" },
    { id: 3, name: "Nightmare", cadence: "weekly", limit: 14, completed: 0, reward: "Валюта прогресса", reason: "Permanent progression.", priority: "S" }
  ],
  items: [
    { id: 1, nameRu: "Книга Кромеды", nameEn: "Enraged Kromede Spellbook", obtained: false, enhancement: 0, favorite: true },
    { id: 2, nameRu: "Защита Вакрона", nameEn: "Vakron Guard", obtained: false, enhancement: 0, favorite: false },
    { id: 3, nameRu: "Книга Ауламуса", nameEn: "Aulamus Spellbook", obtained: false, enhancement: 0, favorite: false }
  ],
  databaseVersion: "browser-preview-2026-09-27"
};

const searchRows: SearchResult[] = [
  { entityType: "item", entityId: 1, nameRu: "Книга Кромеды", nameEn: "Enraged Kromede Spellbook", details: "Оружие · Книга", localizationStatus: "community_ru", sourceStatus: "TW reference" },
  { entityType: "boss", entityId: 1, nameRu: "Разгневанная Кромеда", nameEn: "Enraged Kromede", details: "Босс", localizationStatus: "community_ru", sourceStatus: "TW reference" },
  { entityType: "instance", entityId: 1, nameRu: "Храм Огня", nameEn: "Fire Temple", details: "3★ Экспедиция · FT · Кромеда", localizationStatus: "community_ru", sourceStatus: "TW reference" },
  { entityType: "system", entityId: 1, nameRu: "Энергия Одиль", nameEn: "Odyle Energy", details: "Ограниченный ресурс", localizationStatus: "community_ru", sourceStatus: "TW reference" }
];

function roadmapFor(gs: number): Bootstrap["roadmap"] {
  if (gs >= 2400) return { id: 5, title: "Храм Огня", description: "Оружие и аксессуары позднего этапа.", minGs: 2400, maxGs: 99999, actions: [{ id: 8, title: "Храм Огня → оружие", priority: "S", explanation: "Оружие даёт крупнейший одиночный прирост этого этапа.", sourceStatus: "tw_reference" }] };
  if (gs >= 2200) return { id: 4, title: "Аркана и Transcendence", description: "Заполните слоты арканы и улучшайте качество карт.", minGs: 2200, maxGs: 2399, actions: [{ id: 7, title: "Аркана: ширина до глубины", priority: "S", explanation: "Пустой слот не даёт силы; сначала заполните все пять.", sourceStatus: "tw_reference" }] };
  if (gs >= 1800) return { id: 3, title: "Этап Вакрона", description: "Соберите weapon/guard и равномерно улучшайте комплект.", minGs: 1800, maxGs: 2199, actions: [{ id: 6, title: "Небесный остров Вакрона", priority: "S", explanation: "Здесь начинается долгоживущий комплект; сначала weapon и guard.", sourceStatus: "tw_reference" }] };
  if (gs >= 1600) return { id: 2, title: "Аксессуары и подготовка", description: "Abyss accessories, weekly content и подготовка к transcendence.", minGs: 1600, maxGs: 1799, actions: [{ id: 4, title: "Abyss → аксессуары", priority: "S", explanation: "Аксессуары заменяются реже оружия.", sourceStatus: "tw_reference" }, { id: 5, title: "Nightmare", priority: "A", explanation: "Еженедельный источник ресурсов permanent progression.", sourceStatus: "tw_reference" }] };
  return structuredClone(base.roadmap);
}

export async function browserBootstrap(change?: { profile?: Bootstrap["profile"]; checklist?: {activityId: number; count: number}; item?: Bootstrap["items"][number] }): Promise<Bootstrap> {
  const saved = localStorage.getItem("aion2-preview");
  const state: Bootstrap = saved ? JSON.parse(saved) as Bootstrap : structuredClone(base);
  state.classes = classes;
  state.builds = builds;
  state.rules = rules;
  state.providerStatuses = providerStatuses;
  state.characters ??= [structuredClone(defaultCharacter)];
  state.activeCharacter ??= state.characters[0];
  if (state.activeCharacter) {
    state.activeCharacter.currentGs = state.profile.currentGs;
    state.activeCharacter.currentLevel = state.profile.currentLevel;
    state.activeCharacter.className = state.profile.className;
  }
  if (change?.profile) state.profile = change.profile;
  if (change?.checklist) state.checklist = state.checklist.map(item => item.id === change.checklist?.activityId ? { ...item, completed: change.checklist.count } : item);
  if (change?.item) {
    state.items = state.items.map(item => item.id === change.item?.id ? change.item : item);
    if (state.activeCharacter) state.activeCharacter.items[String(change.item.id)] = { obtained: change.item.obtained, equipped: change.item.obtained, enhancement: change.item.enhancement };
  }
  state.roadmap = roadmapFor(state.profile.currentGs);
  const hasAulamus = state.items.some(item => item.id === 3 && item.obtained);
  state.roadmap.actions = state.roadmap.actions.filter(action => action.id !== -1);
  if (hasAulamus && state.roadmap.id === 1) state.roadmap.actions.unshift({ id: -1, title: "✓ Оружие midgame закрыто → приоритет Guard", priority: "S", explanation: "Книга Ауламуса отмечена как полученная, поэтому второй промежуточный weapon больше не приоритет.", sourceStatus: "local_profile" });
  localStorage.setItem("aion2-preview", JSON.stringify(state));
  return structuredClone(state);
}

export async function browserSaveCharacter(character: CharacterProfile): Promise<Bootstrap> {
  const state = await browserBootstrap();
  state.characters = (state.characters ?? []).map(value => value.id === character.id ? character : value);
  state.activeCharacter = character;
  state.profile = { ...state.profile, className: character.className, currentGs: character.currentGs, currentLevel: character.currentLevel };
  localStorage.setItem("aion2-preview", JSON.stringify(state));
  return structuredClone(state);
}

export async function browserCreateCharacter(classId: string): Promise<Bootstrap> {
  const state = await browserBootstrap();
  const definition = classes.find(value => value.id === classId) ?? classes[0]!;
  const character: CharacterProfile = { ...structuredClone(defaultCharacter), id:Math.max(0,...(state.characters ?? []).map(value=>value.id))+1,name:`${definition.nameRu} ${(state.characters?.length ?? 0)+1}`,classId,className:definition.nameRu,activeBuildId:builds.find(value=>value.classId===classId)?.id };
  state.characters = [...(state.characters ?? []), character]; state.activeCharacter = character;
  state.profile = { ...state.profile, className: character.className, currentGs: character.currentGs, currentLevel: character.currentLevel };
  localStorage.setItem("aion2-preview", JSON.stringify(state)); return structuredClone(state);
}

export async function browserSetActiveCharacter(characterId: number): Promise<Bootstrap> {
  const state = await browserBootstrap(); const character = state.characters?.find(value=>value.id===characterId); if (character) { state.activeCharacter=character; state.profile={...state.profile,className:character.className,currentGs:character.currentGs,currentLevel:character.currentLevel}; }
  localStorage.setItem("aion2-preview", JSON.stringify(state)); return structuredClone(state);
}

export async function browserSearch(query: string): Promise<SearchResult[]> {
  const value = query.toLocaleLowerCase("ru").replace(/^>\s*(item|boss|dungeon|skill)\s*/i, "");
  if (!value) return [];
  return searchRows.filter(item => `${item.nameRu} ${item.nameEn} ${item.details}`.toLocaleLowerCase("ru").includes(value) || (value === "ft" && item.entityType === "instance"));
}
