import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { CompactOverlay } from "./windows/CompactOverlay";
import { QuickSearchWindow } from "./windows/QuickSearchWindow";
import "./styles.css";

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } } });
const windowKind = new URLSearchParams(location.search).get("window");
const Root = windowKind === "compact" ? CompactOverlay : windowKind === "quick-search" ? QuickSearchWindow : App;

ReactDOM.createRoot(document.getElementById("root")!).render(<React.StrictMode><QueryClientProvider client={queryClient}><Root/></QueryClientProvider></React.StrictMode>);
