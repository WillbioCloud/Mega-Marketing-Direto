import { motion } from "motion/react";
import { TrendingUp, Sparkles, Activity, Building2, ShoppingBag, Store, Coffee } from "lucide-react";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-8 items-center">
        {/* Left Column - Copy */}
        <div className="max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100/50 border border-orange-200 text-orange-700 text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            Distribuição Inteligente 2.0
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1] mb-6"
          >
            Gestão logística avançada para <span className="gradient-text">escalar</span> suas vendas B2B.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-slate-600 mb-8 max-w-xl leading-relaxed"
          >
            A plataforma definitiva de distribuição e auditoria fotográfica. Escale a presença local da sua marca com eficiência operacional, métricas precisas e relatórios estruturados.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Link to="/orcamento" className="px-8 py-3.5 text-base font-semibold text-white gradient-bg rounded-xl shadow-lg shadow-fuchsia-200/60 hover:-translate-y-1 hover:shadow-xl transition-all flex items-center gap-2 w-max">
              <TrendingUp className="w-5 h-5" />
              <span>Agendar Distribuição</span>
            </Link>
            <button className="px-8 py-3.5 text-base font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-sm transition-all focus:ring-2 focus:ring-indigo-100">
              Ver Como Funciona
            </button>
          </motion.div>
        </div>

        {/* Right Column - Live Tracker Mockup */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative lg:h-[500px] flex items-center justify-center mt-4 lg:mt-0"
        >
          {/* Subtle background glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-300/20 via-fuchsia-300/20 to-orange-300/20 blur-3xl rounded-full" />
          
          {/* Main Card */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="relative bg-white/60 backdrop-blur-xl border border-white p-6 rounded-[2rem] shadow-2xl shadow-indigo-100 w-full max-w-md mx-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Auditoria Express™</h3>
                  <p className="text-xs font-medium text-slate-500">Relatório Fotográfico</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-semibold">
                Verificado
              </div>
            </div>

            {/* Map/Image Placeholder */}
            <div className="rounded-2xl overflow-hidden bg-slate-100 aspect-video mb-6 relative border border-slate-200/50 shadow-inner group">
              <img 
                src="/img/Distribuicao-de-panfletos.webp" 
                alt="Distribuição de panfletos"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                <div className="text-white">
                  <div className="text-sm font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-orange-400" />
                    Caldas Novas, GO
                  </div>
                  <div className="text-xs text-slate-200 mt-1">Evidência Fotográfica</div>
                </div>
                <div className="bg-white/20 backdrop-blur-md px-2 py-1 rounded text-white text-xs font-medium border border-white/30">
                  Auditado
                </div>
              </div>
            </div>

            {/* Status Line */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-700">Conclusão da Distribuição</span>
                <span className="text-sm font-bold text-indigo-600">100%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 h-2 rounded-full w-full" />
              </div>
              <div className="mt-3 flex justify-between text-xs text-slate-500 font-medium">
                <span>Total: 5.000 un</span>
                <span>Relatório Emitido</span>
              </div>
            </div>
          </motion.div>

          {/* Floating badge - hidden on mobile to avoid overflow */}
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
            className="hidden lg:flex absolute -right-6 top-12 bg-white rounded-xl shadow-lg border border-slate-100 p-3 items-center gap-3 z-10"
          >
            <div className="relative">
              <img src="https://i.pravatar.cc/100?img=12" alt="Supervisor" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-800">Roberto S.</div>
              <div className="text-xs text-slate-500">Supervisor de Equipe</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Trusted By / Parceiros Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-20 pt-10 border-t border-slate-200/60 pb-8"
      >
        <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">
          Empresas que confiam na nossa inteligência logística
        </p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-500">
          {/* Logo 1 */}
          <div className="flex items-center gap-2 font-black text-xl text-slate-800 tracking-tighter">
            <Building2 className="w-7 h-7 text-indigo-600" /> FBZ Construtora
          </div>
          {/* Logo 2 */}
          <div className="flex items-center gap-2 font-black text-xl text-slate-800 tracking-tighter">
            <ShoppingBag className="w-7 h-7 text-orange-500" /> Singapura Shopping
          </div>
          {/* Logo 3 */}
          <div className="flex items-center gap-2 font-black text-xl text-slate-800 tracking-tighter">
            <Store className="w-7 h-7 text-emerald-600" /> Empadão Goiano
          </div>
          {/* Logo 4 */}
          <div className="flex items-center gap-2 font-black text-xl text-slate-800 tracking-tighter">
            <Coffee className="w-7 h-7 text-amber-700" /> Ollivander Café
          </div>
        </div>
      </motion.div>
    </section>
  );
}
