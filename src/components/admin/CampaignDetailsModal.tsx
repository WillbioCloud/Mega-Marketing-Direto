import { useState } from "react";
import { X, Download, MapPin, Calendar, Camera, Users, Map, DollarSign, Activity, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Campaign, AllocatedTeamMember } from "../../types";
import { cn } from "../../lib/utils";

interface CampaignDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign | null;
}

const mockPhotos = [
  { url: "https://images.unsplash.com/photo-1596701518331-50e567265a1f?auto=format&fit=crop&q=80&w=300&h=300", time: "09:15 AM", location: "Av. T-63, Bueno" },
  { url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=300&h=300", time: "09:42 AM", location: "Rua 15, Marista" },
  { url: "https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?auto=format&fit=crop&q=80&w=300&h=300", time: "10:05 AM", location: "Av. 85, Sul" },
  { url: "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&q=80&w=300&h=300", time: "10:30 AM", location: "Rua 9, Oeste" },
  { url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=300&h=300", time: "11:15 AM", location: "Praça do Sol" },
  { url: "https://images.unsplash.com/photo-1481277542470-605612bd2d61?auto=format&fit=crop&q=80&w=300&h=300", time: "11:45 AM", location: "Parque Flamboyant" }
];

export function CampaignDetailsModal({ isOpen, onClose, campaign }: CampaignDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'equipe' | 'provas'>('equipe');

  if (!isOpen || !campaign) return null;

  const team = campaign.allocatedTeam || [];
  const revenue = campaign.revenue || 0;

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
          className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{campaign.title}</h3>
                  <p className="text-sm text-slate-400">{campaign.client} • {campaign.amount} unid.</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={cn("text-xs font-semibold px-3 py-1.5 rounded-lg border", campaign.serviceColor, "border-current/20")}>
                {campaign.service}
              </span>
              <button 
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tabs Nav */}
          <div className="flex px-6 space-x-1 bg-slate-900 border-b border-slate-800 overflow-x-auto hide-scrollbar">
            <button
              onClick={() => setActiveTab('equipe')}
              className={cn(
                "px-5 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2",
                activeTab === 'equipe' ? "border-indigo-500 text-indigo-400" : "border-transparent text-slate-400 hover:text-slate-200"
              )}
            >
              <Users className="w-4 h-4" /> Equipe Alocada
            </button>
            <button
              onClick={() => setActiveTab('provas')}
              className={cn(
                "px-5 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2",
                activeTab === 'provas' ? "border-orange-500 text-orange-400" : "border-transparent text-slate-400 hover:text-slate-200"
              )}
            >
              <ImageIcon className="w-4 h-4" /> Evidências Integradas
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 relative">
            <AnimatePresence mode="wait">
              {activeTab === 'equipe' && (
                <motion.div
                  key="equipe"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4"
                >
                  <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    Panfleteiros Escalados
                  </h4>
                  {team.length === 0 ? (
                    <div className="text-slate-500 text-sm py-4">Nenhuma equipe alocada a esta campanha.</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {team.map((member) => (
                        <div key={member.id} className="bg-slate-950/50 border border-slate-800 rounded-2xl p-4 shadow-sm transition-all flex items-center gap-4">
                          <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-full border-2 border-slate-700" />
                          <div>
                            <div className="text-slate-200 font-semibold">{member.name}</div>
                            <div className="text-sm text-slate-500">{member.phone}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'provas' && (
                <motion.div
                  key="provas"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Galeria de Evidências Fotográficas
                    </h4>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-all">
                      <Download className="w-4 h-4" /> Baixar Lote
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {mockPhotos.map((photo, i) => (
                      <div key={i} className="group flex flex-col rounded-2xl overflow-hidden bg-slate-900/80 border border-slate-800 shadow-md hover:border-slate-700 transition-all">
                        <div className="relative aspect-square overflow-hidden bg-slate-800">
                          <img src={photo.url} alt={`Prova ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          <div className="absolute top-3 right-3">
                            <span className="bg-emerald-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                              <CheckCircle2 className="w-3 h-3" /> Verificado
                            </span>
                          </div>
                        </div>
                        <div className="p-3.5 border-t border-slate-800 bg-slate-950/50 flex flex-col gap-2">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                            <span className="text-xs font-semibold text-slate-200 leading-tight">{photo.location}</span>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <span className="bg-slate-900 border border-slate-700 text-slate-400 text-[10px] uppercase tracking-wider font-mono px-2 py-1 rounded flex items-center gap-1.5">
                              <Calendar className="w-3 h-3 text-indigo-400" />
                              {photo.time}
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium">Foto Sync</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
