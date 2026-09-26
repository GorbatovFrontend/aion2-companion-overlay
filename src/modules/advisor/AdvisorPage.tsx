import { AlertTriangle, ChevronDown, Plus, UserRound } from "lucide-react";
import { useMemo } from "react";
import { PriorityBadge } from "../../components/PriorityBadge";
import { WhyButton } from "../../components/WhyButton";
import { evaluateRules } from "../../core/advisor/ruleEngine";
import { weightedCompletion } from "../../core/advisor/buildProgress";
import { useBootstrap, useCharacterMutations } from "../../core/database/hooks";

export function AdvisorPage() {
  const { data } = useBootstrap();
  const characters = useCharacterMutations();
  const character = data?.activeCharacter;
  const actions = useMemo(() => character ? evaluateRules(character, data?.rules ?? []) : [], [character, data?.rules]);
  const relevantBuilds = (data?.builds ?? []).filter(build => build.classId === character?.classId);
  if (!data || !character) return <div className="page"><div className="empty-state">Настройте профиль для персонального советника.</div></div>;
  return <div className="page advisor-page">
    <div className="advisor-hero"><div className="character-switch"><UserRound size={16}/><select value={character.id} onChange={event=>characters.activate.mutate(Number(event.target.value))}>{data.characters?.map(value=><option key={value.id} value={value.id}>{value.name} · {value.className}</option>)}</select><ChevronDown size={14}/><button onClick={()=>characters.create.mutate("sorcerer")} title="Добавить персонажа"><Plus size={15}/></button></div><div className="advisor-identity"><span className="eyebrow">PERSONAL ADVISOR</span><h1>{character.className}</h1><p>{character.currentLevel} уровень · GS {character.currentGs} · {character.primaryMode === "pve" ? "PvE" : "Solo PvP"}</p></div><div className="completeness"><strong>{character.profileCompleteness}%</strong><span>профиль заполнен</span><i><b style={{width:`${character.profileCompleteness}%`}}/></i></div></div>
    <section><div className="section-header"><h2>Сейчас</h2><span>{actions.length ? "Детерминированные правила" : "Недостаточно подтверждённых данных"}</span></div><div className="advisor-actions">{actions.map(action=><article className={`advisor-action ${action.priority === "STOP" ? "stop" : ""}`} key={action.ruleId}><PriorityBadge value={action.priority}/><div><strong>{action.title}</strong><span>{action.reason}</span></div><WhyButton explanation={action.reason} source={action.source} gain={action.gain} consequence={action.consequence} region={action.region} patch={action.patch} confidence={action.confidence}/></article>)}{!actions.length&&<div className="insufficient"><AlertTriangle size={18}/> Недостаточно подтверждённых данных для точного совета.</div>}</div></section>
    <div className="advisor-columns"><section><div className="section-header"><h2>Экипировка</h2><span>ключевые slots</span></div><div className="gear-strip"><div><span>Weapon</span><b className={character.items["1"]?.obtained?"ok":"missing"}>{character.items["1"]?.obtained?"✓":"!"}</b></div><div><span>Guard</span><b className={character.items["2"]?.obtained?"ok":"missing"}>{character.items["2"]?.obtained?"✓":"!"}</b></div><div><span>Arcana</span><b className={Number(character.systems.arcana?.filledSlots??0)>=5?"ok":"missing"}>{String(character.systems.arcana?.filledSlots??0)}/5</b></div></div></section><section><div className="section-header"><h2>Сборки</h2><span>weighted readiness</span></div>{relevantBuilds.map(build=><div className="build-summary" key={build.id}><div><strong>{build.nameRu}</strong><small>{build.region} · {build.confidence}</small></div><b>{weightedCompletion(character,build.components)}%</b></div>)}</section></div>
  </div>;
}
