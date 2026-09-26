import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ModuleId } from "../modules/registry";

interface AppState {
  activeModule: ModuleId;
  sidebarCollapsed: boolean;
  disabledModules: ModuleId[];
  setActiveModule: (module: ModuleId) => void;
  toggleSidebar: () => void;
  toggleModule: (module: ModuleId) => void;
}

export const useAppStore = create<AppState>()(persist((set) => ({
  activeModule: "advisor",
  sidebarCollapsed: false,
  disabledModules: [],
  setActiveModule: activeModule => set({ activeModule }),
  toggleSidebar: () => set(state => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  toggleModule: module => set(state => ({ disabledModules: state.disabledModules.includes(module) ? state.disabledModules.filter(id => id !== module) : [...state.disabledModules, module] }))
}), { name: "aion2-companion-ui", partialize: state => ({ sidebarCollapsed: state.sidebarCollapsed, disabledModules: state.disabledModules }) }));
