import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { PublicLayout } from "@/components/layouts/PublicLayout";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

import Index from "@/pages/Index";
import Galeria from "@/pages/Galeria";
import Contacto from "@/pages/Contacto";
import SobreElDoctor from "@/pages/SobreElDoctor";
import AgendarCita from "@/pages/AgendarCita";
import NotFound from "@/pages/NotFound";

import Login from "@/pages/admin/Login";
import Dashboard from "@/pages/admin/Dashboard";
import Pacientes from "@/pages/admin/Pacientes";
import PacienteDetalle from "@/pages/admin/PacienteDetalle";
import Calendario from "@/pages/admin/Calendario";
import Conversaciones from "@/pages/admin/Conversaciones";
import ListaEspera from "@/pages/admin/ListaEspera";
import Configuracion from "@/pages/admin/Configuracion";

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Index />} />
          <Route path="/galeria" element={<Galeria />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/sobre-el-doctor" element={<SobreElDoctor />} />
          <Route path="/agendar-cita" element={<AgendarCita />} />
        </Route>

        <Route path="/admin/login" element={<Login />} />

        <Route element={<ProtectedRoute roles={["admin", "doctor", "secretaria"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="pacientes" element={<Pacientes />} />
            <Route path="pacientes/:id" element={<PacienteDetalle />} />
            <Route path="calendario" element={<Calendario />} />
            <Route path="conversaciones" element={<Conversaciones />} />
            <Route path="lista-espera" element={<ListaEspera />} />
            <Route element={<ProtectedRoute roles={["admin"]} />}>
              <Route path="configuracion" element={<Configuracion />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
