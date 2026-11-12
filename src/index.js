import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@/index.css";
import App from "@/App";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);

console.log(
  "%c JENISH SHOBHIT %c reading the console? so am i — jenshobhit@gmail.com",
  "background:#38bdf8;color:#09090b;font:600 11px ui-monospace,monospace;padding:4px 6px;border-radius:4px",
  "color:#94a3b8;font:11px ui-monospace,monospace"
);
