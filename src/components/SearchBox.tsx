import { ArrowDown, ArrowUp, CornerDownLeft, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearch } from "../core/database/hooks";
import { rankResults } from "../core/search/rank";

const labels: Record<string, string> = { item: "Предметы", boss: "Боссы", instance: "Инстансы", skill: "Навыки", system: "Системы", class: "Классы" };

export function SearchBox({ autoFocus = false, compact = false }: { autoFocus?: boolean; compact?: boolean }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const search = useSearch(query);
  const results = useMemo(() => rankResults(query.replace(/^>\s*\w+\s*/, ""), search.data ?? []), [query, search.data]);
  useEffect(() => { if (autoFocus) inputRef.current?.focus(); }, [autoFocus]);
  useEffect(() => setSelected(0), [query]);

  return <section className={`search-shell ${compact ? "search-shell-compact" : ""}`}>
    <div className="search-input-row"><Search size={20}/><input ref={inputRef} value={query} onChange={event => setQuery(event.target.value)} onKeyDown={event => {
      if (event.key === "ArrowDown") { event.preventDefault(); setSelected(value => Math.min(value + 1, results.length - 1)); }
      if (event.key === "ArrowUp") { event.preventDefault(); setSelected(value => Math.max(value - 1, 0)); }
    }} placeholder="Поиск AION 2…  или > dungeon fire"/><kbd>Esc</kbd></div>
    {query && <div className="search-results">
      {search.isFetching && <div className="empty-state">Ищу в локальной базе…</div>}
      {!search.isFetching && results.length === 0 && <div className="empty-state">Ничего не найдено. Попробуйте RU, EN или сокращение.</div>}
      {results.map((result, index) => <button key={`${result.entityType}-${result.entityId}`} className={`search-result ${selected === index ? "selected" : ""}`}>
        <span className="result-kind">{labels[result.entityType] ?? result.entityType}</span>
        <span className="result-main"><strong>{result.nameRu}</strong><small>{result.nameEn}</small></span>
        <span className="result-details">{result.details}</span>
        {selected === index && <CornerDownLeft size={15}/>} 
      </button>)}
    </div>}
    <footer className="search-footer"><span><ArrowUp size={12}/><ArrowDown size={12}/> выбор</span><span><CornerDownLeft size={12}/> открыть</span><span>Работает локально</span></footer>
  </section>;
}
