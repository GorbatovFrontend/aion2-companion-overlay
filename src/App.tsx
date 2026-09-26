import { useEffect } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { AppShell } from "./layouts/AppShell";
import { useAppStore } from "./core/store/useAppStore";
import { RoadmapPage } from "./modules/roadmap/RoadmapPage";
import { WikiPage } from "./modules/wiki/WikiPage";
import { ProgressPage } from "./modules/progress/ProgressPage";
import { ChecklistPage } from "./modules/checklist/ChecklistPage";
import { SorcererPage } from "./modules/sorcerer/SorcererPage";
import { SearchBox } from "./components/SearchBox";
import { AdvisorPage } from "./modules/advisor/AdvisorPage";
import { ClassesPage } from "./modules/classes/ClassesPage";
import { BuildsPage } from "./modules/builds/BuildsPage";
import { DataSourcesPage } from "./modules/sources/DataSourcesPage";

export default function App() {
  const active = useAppStore(state => state.activeModule);
  useEffect(() => {
    const listener = (event: KeyboardEvent) => { if (event.key === "Escape" && "__TAURI_INTERNALS__" in window) void getCurrentWindow().hide(); };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);
  return <AppShell>{active === "advisor" && <AdvisorPage/>}{active === "roadmap" && <RoadmapPage/>}{active === "wiki" && <WikiPage/>}{active === "progress" && <ProgressPage/>}{active === "checklist" && <ChecklistPage/>}{active === "classes" && <ClassesPage/>}{active === "builds" && <BuildsPage/>}{active === "sorcerer" && <SorcererPage/>}{active === "sources" && <DataSourcesPage/>}{active === "search" && <div className="page"><div className="page-heading"><div><span className="eyebrow">ALT + SPACE</span><h1>Быстрый поиск</h1><p>RU, EN, aliases, сокращения и командный синтаксис.</p></div></div><SearchBox autoFocus/></div>}</AppShell>;
}
