import { EyeOff, GripHorizontal, Lock, X } from "lucide-react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useState } from "react";
import { useBootstrap, useChecklistMutation } from "../core/database/hooks";
import { setClickThrough } from "../core/database/api";
import { PriorityBadge } from "../components/PriorityBadge";
import { evaluateRules } from "../core/advisor/ruleEngine";

export function CompactOverlay() {
  const { data } = useBootstrap();
  const checklist = useChecklistMutation();
  const [locked, setLocked] = useState(false);
  if (!data) return <div className="compact-window">Загрузка…</div>;
  const next = data.checklist.find(item => item.completed < item.limit);
  const pinned = data.items.find(item => item.favorite);
  const advice = data.activeCharacter ? evaluateRules(data.activeCharacter, data.rules ?? []) : [];
  const top = advice.filter(value=>value.priority!=="STOP").slice(0,3);
  const stop = advice.find(value=>value.priority==="STOP");
  return <div className="compact-window">
    <header data-tauri-drag-region={!locked}><GripHorizontal size={18}/><strong>A2 COMPANION</strong><span className="compact-gs">GS {data.profile.currentGs}</span><button onClick={() => setLocked(value => !value)} className={locked ? "active" : ""}><Lock size={14}/></button><button onClick={() => void getCurrentWindow().hide()}><X size={15}/></button></header>
    <section><span className="eyebrow">СЕЙЧАС</span>{(top.length?top:[{priority:data.roadmap.actions[0]?.priority??"A",title:data.roadmap.actions[0]?.title??"Roadmap",reason:data.roadmap.title}]).map((action,index)=><div className="compact-target" key={`${action.title}-${index}`}><PriorityBadge value={action.priority}/><div><strong>{action.title}</strong><small>{action.reason}</small></div></div>)}</section>
    {stop&&<section className="compact-stop"><span className="eyebrow">НЕ ДЕЛАТЬ</span><strong>{stop.title}</strong></section>}
    {pinned && <section><span className="eyebrow">ОТСЛЕЖИВАЕТСЯ</span><div className="pinned-item"><span>◆</span><div><strong>{pinned.nameRu}</strong><small>{pinned.nameEn}</small></div></div></section>}
    {next && <section><span className="eyebrow">СЛЕДУЮЩЕЕ</span><button className="compact-check" onClick={() => checklist.mutate({id:next.id,count:next.limit})}><i/><span>{next.name}</span><strong>{next.completed}/{next.limit}</strong></button></section>}
    <footer><button onClick={() => void setClickThrough(true)}><EyeOff size={14}/> Click-through</button><span>Alt Shift L</span></footer>
  </div>;
}
