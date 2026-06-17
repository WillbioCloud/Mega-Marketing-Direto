import { useState, useEffect } from "react";
import { X, Cookie } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("mega_cookie_consent");
    if (!consent) {
      // Pequeno delay para a animação ficar bonita após carregar o site
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("mega_cookie_consent", "accepted");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 p-4 sm:p-6 z-[9999] pointer-events-none flex justify-center"
        >
          <div className="bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl p-5 sm:p-6 max-w-4xl w-full pointer-events-auto flex flex-col sm:flex-row items-center gap-6">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center shrink-0">
                <Cookie className="w-6 h-6 text-indigo-400" />
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Nós usamos cookies para melhorar sua experiência em nosso site, otimizar nosso motor de orçamentos e analisar o tráfego. 
                Ao continuar navegando, você concorda com a nossa <Link to="/privacidade" className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2">Política de Privacidade</Link>.
              </p>
            </div>
            <div className="flex w-full sm:w-auto gap-3 shrink-0">
              <button 
                onClick={() => setIsVisible(false)}
                className="flex-1 sm:flex-none p-2 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-xl transition-colors flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
              <button 
                onClick={handleAccept}
                className="flex-1 sm:flex-none px-6 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold rounded-xl shadow-lg transition-colors"
              >
                Aceitar e Continuar
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
