import { Menu, Minus, Search, X } from "lucide-react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import type { PropsWithChildren } from "react";
import { modules } from "../core/modules/registry";
import { useAppStore } from "../core/store/useAppStore";

const tauriWindow = () => "__TAURI_INTERNALS__" in window ? getCurrentWindow() : null;

export function AppShell({ children }: PropsWithChildren) {
  const store = useAppStore();
  const visibleModules = modules.filter(module => !store.disabledModules.includes(module.id));
  return <div className={`app-shell ${store.sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
    <header className="titlebar" data-tauri-drag-region>
      <div className="brand-mark">A2</div><strong>AION 2 <span>COMPANION</span></strong>
      <div className="titlebar-spacer" data-tauri-drag-region />
      <button className="title-action search-action" onClick={() => store.setActiveModule("search")}><Search size={15}/> <kbd>Alt Space</kbd></button>
      <button className="title-action" onClick={() => void tauriWindow()?.minimize()} aria-label="Свернуть"><Minus size={17}/></button>
      <button className="title-action close-window" onClick={() => void tauriWindow()?.hide()} aria-label="Скрыть"><X size={17}/></button>
    </header>
    <aside className="sidebar">
      <button className="collapse-button" onClick={store.toggleSidebar}><Menu size={17}/><span>Модули</span></button>
      <nav>{visibleModules.map(module => { const Icon = module.icon; return <button key={module.id} className={store.activeModule === module.id ? "active" : ""} onClick={() => store.setActiveModule(module.id)}><Icon size={18}/><span>{module.name}</span></button>; })}</nav>
      <div className="sidebar-foot"><span className="status-dot"/><span>OFFLINE READY</span></div>
    </aside>
    <main>{children}</main>
  </div>;
}
