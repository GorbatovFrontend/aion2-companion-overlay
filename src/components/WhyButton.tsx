import { CircleHelp, X } from "lucide-react";
import { useState } from "react";

export function WhyButton({ explanation, source, gain, consequence, region, patch, confidence }: { explanation: string; source: string; gain?: string; consequence?: string; region?: string; patch?: string; confidence?: string }) {
  const [open, setOpen] = useState(false);
  return <>
    <button className="why-button" onClick={() => setOpen(true)}><CircleHelp size={14}/> Почему?</button>
    {open && <div className="popover-backdrop" onClick={() => setOpen(false)}>
      <article className="why-popover" onClick={event => event.stopPropagation()}>
        <button className="icon-button close" onClick={() => setOpen(false)} aria-label="Закрыть"><X size={18}/></button>
        <span className="eyebrow">ЛОГИКА РЕШЕНИЯ</span>
        <p>{explanation}</p>
        {gain && <div className="explanation-field"><span>Какой выигрыш</span><strong>{gain}</strong></div>}
        {consequence && <div className="explanation-field"><span>Если пропустить</span><strong>{consequence}</strong></div>}
        <div className="source-line"><span>Источник</span><strong>{source === "tw_reference" ? "TW reference · не подтверждено Global" : source}</strong></div>
        {(region || patch || confidence) && <div className="evidence-grid"><span>Region<strong>{region ?? "unknown"}</strong></span><span>Patch<strong>{patch ?? "unknown"}</strong></span><span>Confidence<strong>{confidence ?? "unknown"}</strong></span></div>}
      </article>
    </div>}
  </>;
}
