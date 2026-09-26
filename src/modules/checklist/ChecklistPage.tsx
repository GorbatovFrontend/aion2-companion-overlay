import { Minus, Plus } from "lucide-react";
import { PriorityBadge } from "../../components/PriorityBadge";
import { WhyButton } from "../../components/WhyButton";
import { useBootstrap, useChecklistMutation } from "../../core/database/hooks";

export function ChecklistPage() {
  const { data } = useBootstrap();
  const mutation = useChecklistMutation();
  if (!data) return null;
  return <div className="page"><div className="page-heading"><div><span className="eyebrow">РУЧНОЙ ТРЕКИНГ · БЕЗ АВТОМАТИЗАЦИИ ИГРЫ</span><h1>Daily / Weekly</h1><p>Сбросы рассчитываются локально; действия в клиенте не выполняются.</p></div></div>
    {(["daily","weekly"] as const).map(cadence => <section className="check-section" key={cadence}><div className="section-header"><h2>{cadence === "daily" ? "Сегодня" : "На этой неделе"}</h2><span>{data.checklist.filter(item => item.cadence === cadence && item.completed >= item.limit).length}/{data.checklist.filter(item => item.cadence === cadence).length} закрыто</span></div>
      {data.checklist.filter(item => item.cadence === cadence).map(item => <article className="check-row" key={item.id}><button className={`check-toggle ${item.completed >= item.limit ? "done" : ""}`} onClick={() => mutation.mutate({id:item.id,count:item.completed >= item.limit ? 0 : item.limit})}>{item.completed >= item.limit ? "✓" : ""}</button><PriorityBadge value={item.priority}/><div className="check-copy"><strong>{item.name}</strong><span>{item.reward}</span></div><div className="counter"><button onClick={() => mutation.mutate({id:item.id,count:Math.max(0,item.completed-1)})}><Minus size={13}/></button><strong>{item.completed} / {item.limit}</strong><button onClick={() => mutation.mutate({id:item.id,count:Math.min(item.limit,item.completed+1)})}><Plus size={13}/></button></div><WhyButton explanation={item.reason} source="TW reference"/></article>)}
    </section>)}
  </div>;
}
