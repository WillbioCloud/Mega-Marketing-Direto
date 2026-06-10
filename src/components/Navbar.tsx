import { Link } from "react-router-dom";
import { MapPin, ArrowRight, UserCircle2, Smartphone } from "lucide-react";
import { cn } from "../lib/utils";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-orange-400 flex items-center justify-center text-white shadow-md shadow-fuchsia-200 group-hover:scale-105 transition-transform">
                <span className="font-black text-xl leading-none font-sans">M</span>
              </div>
              <span className="flex flex-col">
                <span className="font-bold text-xl tracking-tight text-slate-800 leading-none">
                  Mega
                </span>
                <span className="text-[10px] font-medium text-slate-500 tracking-widest uppercase leading-tight mt-0.5">
                  marketing direto
                </span>
              </span>
            </Link>
          </div>
          <div className="hidden md:flex space-x-6 items-center">
            <a href="#services" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Serviços</a>
            <a href="#tech" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Tecnologia</a>
            
            <div className="w-px h-6 bg-slate-200 mx-2"></div>

            <Link to="/admin/login" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
              <UserCircle2 className="w-4 h-4" />
              Área Restrita
            </Link>
            
            <Link to="/orcamento" className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white gradient-bg rounded-xl shadow-md shadow-pink-200/50 hover:shadow-lg hover:-translate-y-0.5 transition-all">
              <span>Orçamento Rápido</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
