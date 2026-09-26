import { BookOpen, CheckSquare, Compass, Database, Layers3, Search, Sparkles, UserRound, WandSparkles } from "lucide-react";
import type { ComponentType } from "react";

export type ModuleId = "advisor" | "roadmap" | "wiki" | "progress" | "checklist" | "classes" | "builds" | "sorcerer" | "sources" | "search";

export interface ModuleManifest {
  id: ModuleId;
  name: string;
  version: string;
  enabledByDefault: boolean;
  permissions: readonly ("database:read" | "database:write" | "window:quick-search")[];
  icon: ComponentType<{ size?: number }>;
}

export const modules: readonly ModuleManifest[] = [
  { id: "advisor", name: "Советник", version: "0.2.0", enabledByDefault: true, permissions: ["database:read", "database:write"], icon: WandSparkles },
  { id: "roadmap", name: "Roadmap", version: "0.1.0", enabledByDefault: true, permissions: ["database:read"], icon: Compass },
  { id: "wiki", name: "Wiki", version: "0.1.0", enabledByDefault: true, permissions: ["database:read"], icon: BookOpen },
  { id: "progress", name: "Мой прогресс", version: "0.1.0", enabledByDefault: true, permissions: ["database:read", "database:write"], icon: UserRound },
  { id: "checklist", name: "Daily / Weekly", version: "0.1.0", enabledByDefault: true, permissions: ["database:read", "database:write"], icon: CheckSquare },
  { id: "classes", name: "Классы", version: "0.2.0", enabledByDefault: true, permissions: ["database:read"], icon: UserRound },
  { id: "builds", name: "Сборки", version: "0.2.0", enabledByDefault: true, permissions: ["database:read", "database:write"], icon: Layers3 },
  { id: "sorcerer", name: "Волшебник", version: "0.1.0", enabledByDefault: true, permissions: ["database:read"], icon: Sparkles },
  { id: "sources", name: "Источники", version: "0.2.0", enabledByDefault: true, permissions: ["database:read", "database:write"], icon: Database },
  { id: "search", name: "Быстрый поиск", version: "0.1.0", enabledByDefault: true, permissions: ["database:read", "window:quick-search"], icon: Search }
] as const;
