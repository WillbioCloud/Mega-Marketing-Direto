import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  ArrowRight,
  UserCircle2,
  Smartphone,
  Menu,
  X,
} from "lucide-react";
import { cn } from "../lib/utils";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <img
                src="https://res.cloudinary.com/dxplpg36m/image/upload/v1783612532/Logo-MMD_snwopp.ico"
                alt="Mega Marketing"
                className="w-9 h-9 object-contain group-hover:scale-105 transition-transform"
              />
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
          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link
              to="/"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Início
            </Link>
            <a
              href="/#services"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Serviços
            </a>
            <a
              href="/#tech"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Tecnologia
            </a>

            <div className="w-px h-6 bg-slate-200 mx-2"></div>

            <Link
              to="/admin/login"
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
            >
              <UserCircle2 className="w-4 h-4" />
              Área Restrita
            </Link>

            <Link
              to="/orcamento"
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white gradient-bg rounded-xl shadow-md shadow-pink-200/50 hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <span>Orçamento Rápido</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-3 text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
            >
              Início
            </Link>
            <a
              href="/#services"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-3 text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
            >
              Serviços
            </a>
            <a
              href="/#tech"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-3 text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
            >
              Tecnologia
            </a>
            <div className="h-px bg-slate-100 my-1" />
            <Link
              to="/admin/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-3 text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors flex items-center gap-2"
            >
              <UserCircle2 className="w-4 h-4" />
              Área Restrita
            </Link>
            <Link
              to="/orcamento"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 w-full px-5 py-3 text-sm font-semibold text-white gradient-bg rounded-xl shadow-md shadow-pink-200/50 transition-all"
            >
              <span>Orçamento Rápido</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
