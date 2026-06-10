import { X, Download, MapPin, Calendar, Camera } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Campaign } from "../../types";

interface AuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign | null;
}

const mockPhotos = [
  "https://images.unsplash.com/photo-1596701518331-50e567265a1f?auto=format&fit=crop&q=80&w=300&h=300",
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=300&h=300",
  "https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?auto=format&fit=crop&q=80&w=300&h=300",
  "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&q=80&w=300&h=300",
  "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=300&h=300",
  "https://images.unsplash.com/photo-1481277542470-605612bd2d61?auto=format&fit=crop&q=80&w=300&h=300"
];

export function AuditModal({ isOpen, onClose, campaign }: AuditModalProps) {
  if (!isOpen || !campaign) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{campaign.title}</h3>
                  <p className="text-sm text-slate-400">{campaign.client} • Central de Provas</p>
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-500 font-medium">Serviço</span>
                <p className="text-sm font-semibold text-slate-200 mt-1">{campaign.service}</p>
              </div>
              <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-500 font-medium">Volume</span>
                <p className="text-sm font-semibold text-slate-200 mt-1">{campaign.amount} unid.</p>
              </div>
              <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-500 font-medium">Localização</span>
                <p className="text-sm font-semibold text-slate-200 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-orange-400" />
                  Setor Bueno, Sul
                </p>
              </div>
              <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-500 font-medium">Início</span>
                <p className="text-sm font-semibold text-slate-200 mt-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  Hoje, 08:00
                </p>
              </div>
            </div>

            <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Relatório Fotográfico Auditado
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {mockPhotos.map((url, i) => (
                <div key={i} className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-800 border border-slate-700">
                  <img src={url} alt={`Prova ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-xs font-medium text-white shadow-sm flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-orange-400" />
                      Validação: Auditado
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-end">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-semibold rounded-xl shadow-lg transition-all focus:ring-2 focus:ring-indigo-500/50">
              <Download className="w-4 h-4" />
              Gerar Relatório PDF
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
