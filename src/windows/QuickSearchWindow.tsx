import { getCurrentWindow } from "@tauri-apps/api/window";
import { useEffect } from "react";
import { SearchBox } from "../components/SearchBox";

export function QuickSearchWindow() {
  useEffect(() => {
    const listener = (event: KeyboardEvent) => { if (event.key === "Escape") void getCurrentWindow().hide(); };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);
  return <div className="quick-window"><SearchBox autoFocus compact/></div>;
}
