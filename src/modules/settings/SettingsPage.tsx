import { modules } from "../../core/modules/registry";
import { useAppStore } from "../../core/store/useAppStore";

export function SettingsPage() {
  const store = useAppStore();
  return <div className="page"><div className="page-heading"><div><span className="eyebrow">НАСТРОЙКИ CORE</span><h1>Модули</h1><p>Каждый модуль можно отключить независимо.</p></div></div><section className="module-list">{modules.map(module => { const enabled = !store.disabledModules.includes(module.id); return <article key={module.id}><div><strong>{module.name}</strong><small>v{module.version} · {module.permissions.join(", ")}</small></div><button className={`switch ${enabled ? "on" : ""}`} onClick={() => store.toggleModule(module.id)}><i/></button></article>; })}</section></div>;
}
