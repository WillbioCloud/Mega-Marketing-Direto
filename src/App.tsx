/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Quote from "./pages/Quote";
import Login from "./pages/admin/Login";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/admin/Dashboard";
import Campaigns from "./pages/admin/Campaigns";
import Team from "./pages/admin/Team";
import Clients from "./pages/admin/Clients";
import Finance from "./pages/admin/Finance";
import MapEditor from "./pages/admin/MapEditor";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import { CookieConsent } from "./components/CookieConsent";

export default function App() {
  return (
    <Router>
      <Toaster position="top-right" toastOptions={{ style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155' } }} />
      <CookieConsent />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/orcamento" element={<Quote />} />
        <Route path="/termos" element={<Terms />} />
        <Route path="/privacidade" element={<Privacy />} />
        <Route path="/admin/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="campanhas" element={<Campaigns />} />
            <Route path="equipe" element={<Team />} />
            <Route path="mapa" element={<MapEditor />} />
            <Route path="clientes" element={<Clients />} />
            <Route path="financeiro" element={<Finance />} />
            <Route path="relatorios" element={<div className="text-white">Relatórios (Em breve)</div>} />
            <Route path="configuracoes" element={<div className="text-white">Configurações (Em breve)</div>} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
