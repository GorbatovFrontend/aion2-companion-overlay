import { SearchBox } from "../../components/SearchBox";

export function WikiPage() {
  return <div className="page"><div className="page-heading"><div><span className="eyebrow">ЛОКАЛЬНАЯ БАЗА · RU + EN</span><h1>Wiki</h1><p>Предметы, боссы, инстансы, навыки и системы с прозрачными источниками.</p></div></div><SearchBox/><div className="wiki-categories"><span>Оружие</span><span>Броня</span><span>Аксессуары</span><span>Навыки</span><span>Инстансы</span><span>Боссы</span><span>Системы</span><span>Активности</span></div></div>;
}
