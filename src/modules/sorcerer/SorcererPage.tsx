import { PriorityBadge } from "../../components/PriorityBadge";
import { WhyButton } from "../../components/WhyButton";

export function SorcererPage() {
  return <div className="page"><div className="page-heading"><div><span className="eyebrow">КЛАССОВЫЙ МОДУЛЬ</span><h1>Волшебник</h1><p>Сборки разделены по контексту; числа до Global-проверки отмечены как reference.</p></div></div><div className="compact-tabs"><button className="active">PvE</button><button>Solo PvP</button><button>Small Scale</button></div><section className="skill-table"><div className="skill-row header"><span>Навык</span><span>Fresh 45</span><span>Late</span><span>Приоритет</span><span/></div><div className="skill-row"><span><strong>Адское пламя</strong><small>Hellfire</small></span><span>10</span><span>20</span><PriorityBadge value="S"/><WhyButton explanation="Ключевой burst-навык; уровни требуют проверки после Global launch." source="TW reference"/></div></section><div className="verification-banner"><span className="status-dot amber"/><span>Preset — исследовательский seed, не финальный build guide.</span><small>Patch: TW-reference</small></div></div>;
}
