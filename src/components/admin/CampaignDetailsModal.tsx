import { useState, useEffect } from "react";
import { X, MapPin, Calendar, Camera, Users, Activity, Image as ImageIcon, CheckCircle2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Campaign, AllocatedTeamMember } from "../../types";
import { cn } from "../../lib/utils";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";

interface CampaignDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign | null;
}


export function CampaignDetailsModal({ isOpen, onClose, campaign }: CampaignDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'geral' | 'equipe' | 'provas'>('geral');
  const [availableMembers, setAvailableMembers] = useState<any[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");
  const [allocating, setAllocating] = useState(false);

  useEffect(() => {
    if (isOpen && campaign) {
      fetchAvailableMembers();
    }
  }, [isOpen, campaign]);

  const fetchAvailableMembers = async () => {
    const { data } = await supabase
      .from('team_members')
      .eq('status', 'Disponível')
      .order('name', { ascending: true });
    if (data) setAvailableMembers(data);
  };

  const handleAllocateMember = async () => {
    if (!selectedMemberId || !campaign) return;
    setAllocating(true);

    // 1. Criar o registro de repasse/trabalho inicial na tabela de payouts
    const member = availableMembers.find(m => m.id.toString() === selectedMemberId);
    if (!member) return;

    // Busca o valor base configurado para calcular a diária padrão se necessário
    const { data: settings } = await supabase.from('global_settings').select('base_price_per_thousand').single();
    const amountToPay = (Number(campaign.amount) * Number(settings?.base_price_per_thousand || 80)) / (Number(campaign.estimated_promoters) || 1);

    const { error: payoutError } = await supabase.from('payouts').insert([{
      worker_name: member.name,
      campaign_title: campaign.title,
      amount: Math.round(amountToPay),
      pix_key: member.pix_key || 'Não cadastrada',
      status: 'Pendente'
    }]);

    if (!payoutError) {
      // 2. Mudar o status do colaborador para "Em Atividade"
      await supabase
        .from('team_members')
        .update({ status: 'Em Atividade' })
        .eq('id', selectedMemberId);

      toast.success(`${member.name} alocado com sucesso!`);
      setSelectedMemberId("");
      fetchAvailableMembers();
      // Executa callback de atualização do pai se houver
    } else {
      toast.error("Erro ao alocar colaborador.");
    }
    setAllocating(false);
  };

  const [photos, setPhotos] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (activeTab === 'provas' && campaign?.id) {
      fetchPhotos();
    }
  }, [activeTab, campaign?.id]);

  const fetchPhotos = async () => {
    if (!campaign?.id) return;
    const { data, error } = await supabase.from('proofs').select('*').eq('campaign_id', campaign.id).order('created_at', { ascending: false });
    if (!error && data) setPhotos(data);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !campaign) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${campaign.id}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('proofs_images').upload(fileName, file);

      if (uploadError) {
        toast.error(`Erro ao enviar: ${file.name}`);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage.from('proofs_images').getPublicUrl(fileName);

      await supabase.from('proofs').insert({
        campaign_id: campaign.id,
        image_url: publicUrl,
        location_text: 'Localização Registrada',
      });
    }

    toast.success("Evidências salvas com sucesso!");
    fetchPhotos();
    setUploading(false);
  };

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
              onClick={() => setActiveTab('geral')}
              className={cn(
                "px-5 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2",
                activeTab === 'geral' ? "border-indigo-500 text-indigo-400" : "border-transparent text-slate-400 hover:text-slate-200"
              )}
            >
              <Activity className="w-4 h-4" /> Visão Geral
            </button>
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
              {activeTab === 'geral' && (
                <motion.div
                  key="geral"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Resumo da Missão */}
                    <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-5 shadow-sm">
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Escopo da Missão</h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between border-b border-slate-800 pb-2">
                          <span className="text-slate-500">Volume Total:</span>
                          <span className="text-slate-200 font-bold">{campaign.amount}k em {campaign.logistics?.campaignDays || 1} dia(s)</span>
                        </div>
                        {campaign.services.includes("Bandeiradas Especiais") && campaign.logistics?.flagCount > 0 && (
                          <div className="flex justify-between border-b border-slate-800 pb-2">
                            <span className="text-slate-500">Ação de Bandeira:</span>
                            <span className="text-emerald-400 font-bold">{campaign.logistics.flagCount} unid. | {campaign.logistics.flagDays} dias | {campaign.logistics.shiftHours}h</span>
                          </div>
                        )}
                        <div className="pt-2">
                          <span className="text-slate-500 block mb-2">Bairros e Pontos Alvo:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {campaign.logistics?.bairros && campaign.logistics.bairros.length > 0 ? (
                              campaign.logistics.bairros.map((b: string, i: number) => (
                                <span key={i} className="bg-slate-800 text-slate-300 text-[10px] px-2 py-1 rounded-md">{b}</span>
                              ))
                            ) : (
                              <span className="text-xs text-slate-600 italic">Áreas não especificadas.</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Meta de Equipe Progress */}
                    <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-center">
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Meta de Alocação</h4>
                      
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-3xl font-bold text-white">{team.length} <span className="text-sm font-medium text-slate-500">/ {campaign.estimated_promoters || 0}</span></span>
                        <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-lg">Panfleteiros</span>
                      </div>
                      
                      <div className="w-full bg-slate-800 rounded-full h-3 mb-2 overflow-hidden">
                        <div 
                          className="bg-indigo-500 h-3 rounded-full transition-all duration-1000" 
                          style={{ width: `${Math.min(((team.length / (campaign.estimated_promoters || 1)) * 100), 100)}%` }} 
                        />
                      </div>
                      
                      <p className="text-xs text-slate-500 text-right">
                        {team.length >= (campaign.estimated_promoters || 0) 
                          ? <span className="text-emerald-400">Equipe completa para a missão!</span> 
                          : `Falta(m) ${(campaign.estimated_promoters || 0) - team.length} pessoa(s)`}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
              {activeTab === 'equipe' && (
                <motion.div
                  key="equipe"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6"
                >
                  {/* Seletor de Alocação de Pessoal */}
                  {campaign?.status !== 'concluido' && (
                    <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-end">
                      <div className="flex-1 w-full">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Disponíveis na rua</label>
                        <select
                          value={selectedMemberId}
                          onChange={e => setSelectedMemberId(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                        >
                          <option value="">-- Selecione um colaborador disponível --</option>
                          {availableMembers.map(m => (
                            <option key={m.id} value={m.id}>{m.name} (★ {m.rating || 0})</option>
                          ))}
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={handleAllocateMember}
                        disabled={allocating || !selectedMemberId}
                        className="w-full sm:w-auto px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all whitespace-nowrap"
                      >
                        {allocating ? 'Alocando...' : 'Confirmar Alocação'}
                      </button>
                    </div>
                  )}

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
                      <div className="flex gap-2">
                        <label className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-all cursor-pointer">
                          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                          {uploading ? "Enviando..." : "Nova Foto"}
                          <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileUpload} disabled={uploading} />
                        </label>
                      </div>
                    </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {photos.length === 0 ? (
                      <div className="col-span-3 flex flex-col items-center justify-center py-12 text-slate-500 gap-3">
                        <Camera className="w-8 h-8 opacity-30" />
                        <span className="text-sm">Nenhuma evidência registrada ainda.</span>
                      </div>
                    ) : (
                      photos.map((photo, i) => (
                        <div key={photo.id || i} className="group flex flex-col rounded-2xl overflow-hidden bg-slate-900/80 border border-slate-800 shadow-md hover:border-slate-700 transition-all">
                          <div className="relative aspect-square overflow-hidden bg-slate-800">
                            <img src={photo.image_url} alt={`Prova ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute top-3 right-3">
                              <span className="bg-emerald-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                                <CheckCircle2 className="w-3 h-3" /> Verificado
                              </span>
                            </div>
                          </div>
                          <div className="p-3.5 border-t border-slate-800 bg-slate-950/50 flex flex-col gap-2">
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                              <span className="text-xs font-semibold text-slate-200 leading-tight">{photo.location_text || 'Localização Registrada'}</span>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <span className="bg-slate-900 border border-slate-700 text-slate-400 text-[10px] uppercase tracking-wider font-mono px-2 py-1 rounded flex items-center gap-1.5">
                                <Calendar className="w-3 h-3 text-indigo-400" />
                                {photo.created_at ? new Date(photo.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                              </span>
                              <span className="text-[10px] text-slate-500 font-medium">Foto Sync</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
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
