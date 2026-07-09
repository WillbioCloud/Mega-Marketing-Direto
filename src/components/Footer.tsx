import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-slate-200/60 bg-white/50 backdrop-blur-sm py-12 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
        <div className="flex items-center gap-2 group">
          <img
            src="https://res.cloudinary.com/dxplpg36m/image/upload/v1783612532/Logo-MMD_snwopp.ico"
            alt="Mega Marketing"
            className="w-9 h-9 object-contain"
          />
          <span className="flex flex-col">
            <span className="font-bold text-xl tracking-tight text-slate-800 leading-none">
              Mega
            </span>
            <span className="text-[10px] font-medium text-slate-500 tracking-widest uppercase leading-tight mt-0.5">
              marketing direto
            </span>
          </span>
        </div>

        <p className="text-slate-500 text-sm font-medium">
          © 2015 - {new Date().getFullYear()} Mega Marketing Direto. Todos os
          direitos reservados.
        </p>

        <div className="flex items-center gap-6">
          <Link
            to="/termos"
            className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
          >
            Termos
          </Link>
          <Link
            to="/privacidade"
            className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
          >
            Privacidade
          </Link>
          <a
            href="https://wa.me/5564999391905?text=Olá!%20Gostaria%20de%20falar%20com%20o%20comercial."
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
          >
            Contato
          </a>
        </div>
      </div>
    </footer>
  );
}
