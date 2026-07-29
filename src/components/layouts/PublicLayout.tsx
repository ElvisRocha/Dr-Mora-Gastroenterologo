import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { WhatsAppFAB } from "@/components/public/WhatsAppFAB";
import { CitaManagerFAB } from "@/components/public/CitaManagerFAB";

export function PublicLayout() {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFAB />
      <CitaManagerFAB />
    </div>
  );
}
