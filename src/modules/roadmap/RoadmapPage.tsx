import { ArrowRight, ShieldAlert } from "lucide-react";
import { PriorityBadge } from "../../components/PriorityBadge";
import { WhyButton } from "../../components/WhyButton";
import { useBootstrap } from "../../core/database/hooks";

export function RoadmapPage() {
  const { data } = useBootstrap();
  if (!data) return <div className="loading">Загрузка локальной базы…</div>;
  const daily = data.checklist.filter(item => item.cadence === "daily");
  const weekly = data.checklist.filter(item => item.cadence === "weekly");
  const progress = (items: typeof daily) => `${items.reduce((sum, item) => sum + Math.min(item.completed, item.limit), 0)}/${items.reduce((sum, item) => sum + item.limit, 0)}`;
  return <div className="page dashboard-page">
    <div className="page-heading"><div><span className="eyebrow">ВАШ МАРШРУТ</span><h1>Сейчас</h1><p>{data.roadmap.title} · {data.roadmap.description}</p></div><div className="profile-chip"><strong>{data.profile.className} · {data.profile.currentLevel}</strong><span>GS {data.profile.currentGs}</span></div></div>
    <section className="action-list">
      {data.roadmap.actions.map(action => <article className="action-row" key={action.id}>
        <PriorityBadge value={action.priority}/><div className="action-copy"><strong>{action.title}</strong><span>{action.explanation}</span></div><WhyButton explanation={action.explanation} source={action.sourceStatus}/><ArrowRight className="row-arrow" size={18}/>
      </article>)}
    </section>
    <div className="dashboard-grid">
      <section className="resource-panel"><div className="section-label">ОДИЛЬ</div><div className="resource-value">80 <span>/ 120</span></div><div className="meter"><i style={{width:"66%"}}/></div><div className="risk-callout caution"><ShieldAlert size={17}/><div><strong>Сохранить для более высокого tier</strong><small>TW reference · Global не подтверждён</small></div></div></section>
      <section className="next-panel"><div className="section-label">СЛЕДУЮЩИЙ CHECKPOINT</div><strong className="next-value">{data.roadmap.maxGs < 99999 ? data.roadmap.maxGs + 1 : "ENDGAME"}</strong><span>Roadmap пересчитается автоматически после изменения GS.</span></section>
      <section className="summary-panel"><div><span>Daily</span><strong>{progress(daily)}</strong></div><div><span>Weekly</span><strong>{progress(weekly)}</strong></div></section>
    </div>
    <div className="verification-banner"><span className="status-dot amber"/><span>Данные прогрессии сейчас основаны на TW/reference-источниках. Неподтверждённые числа не помечаются как Global.</span><small>База: {data.databaseVersion}</small></div>
  </div>;
}
