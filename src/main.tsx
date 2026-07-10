import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import App from "./App";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ClinicStoreProvider } from "@/store/clinicStore";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <ClinicStoreProvider>
          <BrowserRouter>
            <App />
            <Toaster position="top-right" richColors closeButton />
          </BrowserRouter>
        </ClinicStoreProvider>
      </LanguageProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
