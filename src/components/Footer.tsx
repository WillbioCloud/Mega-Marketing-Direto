import { MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200/60 bg-white/50 backdrop-blur-sm py-12 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
        <div className="flex items-center gap-2 group">
          <img src="/favicon.ico" alt="Mega Marketing" className="w-9 h-9 object-contain" />
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
          © {new Date().getFullYear()} Mega Marketing Direto. Todos os direitos reservados.
        </p>

        <div className="flex items-center gap-6">
          <a href="#" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">Termos</a>
          <a href="#" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">Privacidade</a>
          <a href="#" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">Contato</a>
        </div>
      </div>
    </footer>
  );
}
