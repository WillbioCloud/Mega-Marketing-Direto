import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const SERVICE_OPTIONS = [
  { label: "Porta a Porta", color: "bg-indigo-500/20 text-indigo-400" },
  { label: "Semáforo Premium", color: "bg-fuchsia-500/20 text-fuchsia-400" },
  { label: "Centro & Comércio", color: "bg-orange-500/20 text-orange-400" },
  { label: "Bandeiradas Especiais", color: "bg-emerald-500/20 text-emerald-400" },
  { label: "Evento / Blitz", color: "bg-sky-500/20 text-sky-400" },
];

export function CreateCampaignModal({ isOpen, onClose, onSuccess }: CreateCampaignModalProps) {
  const [clientsList, setClientsList] = useState<{ id: string; name: string }[]>([]);
  const [bairros, setBairros] = useState<any[]>([]);
  const [selectedBairros, setSelectedBairros] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>(['Porta a Porta']);
  const [form, setForm] = useState({
    title: "",
    client_id: "",
    client_name: "",
    amount: 0,
    revenue: 0,
  });
  const [submitting, setSubmitting] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [suggestedRevenue, setSuggestedRevenue] = useState(0);
  const [estimatedPromoters, setEstimatedPromoters] = useState(0);

  // Novos estados para controle de Bandeiradas
  const [flagCount, setFlagCount] = useState<number>(0);
  const [shiftHours, setShiftHours] = useState<number>(4); // Padrão 4h ou 8h (dia todo)
  const [flagDays, setFlagDays] = useState<number>(1); // Quantidade de dias da ação
  const [campaignDays, setCampaignDays] = useState(1); // Duração total da panfletagem

  useEffect(() => {
    if (isOpen) {
      fetchClients();
      fetchMapZones();
      fetchSettings();
    }
  }, [isOpen]);

  const fetchMapZones = async () => {
    const { data } = await supabase.from("map_zones").select("id, name, required_flyers_thousands, required_promoters").eq('type', 'area').eq('is_active', true);
    if (data) setBairros(data);
  };

  const fetchSettings = async () => {
    const { data } = await supabase.from("global_settings").select("*").limit(1).single();
    if (data) setSettings(data);
  };

  // 1. Sincroniza marcações do mapa com o volume de milheiros
  useEffect(() => {
    let totalFlyers = 0;
    selectedBairros.forEach(bairroId => {
      const b = bairros.find(x => x.id === bairroId);
      if (b) totalFlyers += Number(b.required_flyers_thousands || 0);
    });
    setForm(prev => ({ ...prev, amount: totalFlyers }));
  }, [selectedBairros, bairros]);

  // 2. O Cérebro Reativo: Calcula Preço e Equipe baseado no form.amount (automático ou digitado manualmente)
  useEffect(() => {
    let calcRevenue = 0;

    if (selectedServices.includes("Porta a Porta")) {
      calcRevenue += Number(form.amount) * Number(settings?.base_price_per_thousand || 80);
    }

    if (selectedServices.includes("Semáforo Premium") || selectedServices.includes("Centro & Comércio")) {
      selectedBairros.forEach(pointId => {
        const p = bairros.find(x => x.id === pointId);
        if (p) calcRevenue += Number(p.price_modifier || 0);
      });
    }

    if (selectedServices.includes("Bandeiradas Especiais")) {
      const flagRate = settings?.flag_price_per_hour || 15;
      calcRevenue += flagCount * shiftHours * flagDays * flagRate;
    }

    // Cálculo da Equipe Ideal (Por Dia)
    const capacity = Number(settings?.promoter_daily_capacity || 2);
    let promoters = Math.ceil((Number(form.amount) / capacity) / campaignDays);
    
    // Adiciona 1 pessoa dedicada (braço) para cada bandeira
    if (selectedServices.includes("Bandeiradas Especiais")) {
      promoters += Number(flagCount);
    }
    
    // Margem de coordenação/segurança para serviços múltiplos
    if (selectedServices.length > 1 && Number(form.amount) > 0) {
      promoters += 1;
    }

    setEstimatedPromoters(promoters);
    setSuggestedRevenue(calcRevenue);
    
    // Atualiza o form.revenue evitando loop infinito
    setForm(prev => prev.revenue !== calcRevenue ? { ...prev, revenue: calcRevenue } : prev);
  }, [form.amount, selectedBairros, selectedServices, flagCount, shiftHours, flagDays, bairros, settings, campaignDays]);

  const fetchClients = async () => {
    const { data } = await supabase.from("clients").select("id, name").order("name");
    if (data) setClientsList(data);
  };

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = clientsList.find(c => c.id === e.target.value);
    setForm(p => ({ ...p, client_id: e.target.value, client_name: selected?.name || "" }));
  };

  const getServiceColor = (label: string) =>
    SERVICE_OPTIONS.find(s => s.label === label)?.color || "bg-slate-500/20 text-slate-400";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.client_id) { toast.error("Selecione um cliente."); return; }
    setSubmitting(true);

    const { error } = await supabase.from("campaigns").insert([{
      title: form.title,
      client_id: form.client_id,
      client_name: form.client_name,
      services: selectedServices, // Array de serviços
      service: selectedServices[0] || 'Personalizado', // Fallback para compatibilidade do layout Kanban
      service_color: getServiceColor(selectedServices[0] || 'Porta a Porta'),
      amount: Number(form.amount), // Agora salva em Milheiros
      revenue: Number(form.revenue) || 0,
      estimated_promoters: estimatedPromoters,
      logistics: {
        bairros: bairros.filter(b => selectedBairros.includes(b.id)).map(b => b.name),
        campaignDays,
        flagCount,
        flagDays,
        shiftHours
      },
      status: "agendado",
    }]);

    if (error) {
      toast.error("Erro ao criar campanha.");
    } else {
      toast.success("Campanha criada com sucesso!");
      setForm({ title: "", client_id: "", client_name: "", amount: 0, revenue: 0 });
      setSelectedServices(['Porta a Porta']);
      setSelectedBairros([]);
      onSuccess?.();
      onClose();
    }
    setSubmitting(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
            className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/60 bg-slate-900/50">
              <h2 className="text-xl font-bold text-white">Nova Campanha</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-5">
              <form id="create-campaign-form" onSubmit={handleSubmit} className="space-y-5">

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Título da Campanha</label>
                  <input
                    type="text" required
                    value={form.title}
                    onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                    placeholder="Ex: Lançamento Residencial Flores"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Cliente</label>
                  <select
                    required
                    value={form.client_id}
                    onChange={handleClientChange}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  >
                    <option value="">Selecione um cliente...</option>
                    {clientsList.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Checkboxes de Serviços */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Tipos de Serviço (Múltipla Escolha)</label>
                  <div className="grid grid-cols-2 gap-2">
                    {SERVICE_OPTIONS.map(s => {
                      const isSelected = selectedServices.includes(s.label);
                      return (
                        <button
                          key={s.label} type="button"
                          onClick={() => setSelectedServices(prev => prev.includes(s.label) ? prev.filter(x => x !== s.label) : [...prev, s.label])}
                          className={`text-left px-3 py-2 rounded-lg border text-sm transition-all ${isSelected ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300' : 'bg-slate-800/30 border-slate-700 text-slate-400 hover:border-slate-600'}`}
                        >
                          {s.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Seleção Inteligente de Bairros */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Bairros Alvo (Cálculo Automático)</label>
                  <div className="max-h-[120px] overflow-y-auto bg-slate-800/30 border border-slate-700 rounded-xl p-2 custom-scrollbar">
                    {bairros.map(b => (
                      <label key={b.id} className="flex items-center gap-2 p-2 hover:bg-slate-800 rounded-lg cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedBairros.includes(b.id)}
                          onChange={(e) => {
                            if(e.target.checked) setSelectedBairros(p => [...p, b.id]);
                            else setSelectedBairros(p => p.filter(id => id !== b.id));
                          }}
                          className="rounded border-slate-600 bg-slate-900 text-indigo-500 focus:ring-offset-slate-900" 
                        />
                        <span className="text-sm text-slate-300">{b.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Configuração de Bandeiras - Aparece apenas se o serviço estiver marcado */}
                {selectedServices.includes("Bandeiradas Especiais") && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950/40 p-4 rounded-xl border border-slate-800 animate-fadeIn">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Qtd de Bandeiras</label>
                      <input 
                        type="number" min="0"
                        value={flagCount}
                        onChange={e => setFlagCount(Number(e.target.value))}
                        placeholder="Ex: 4"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Dias de Ação</label>
                      <input 
                        type="number" min="1"
                        value={flagDays}
                        onChange={e => setFlagDays(Number(e.target.value))}
                        placeholder="Ex: 2"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Turno Diário</label>
                      <select
                        value={shiftHours}
                        onChange={e => setShiftHours(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
                      >
                        <option value="4">4 Horas (Meio Período)</option>
                        <option value="8">8 Horas (Manhã + Tarde)</option>
                        <option value="12">12 Horas (Estendido)</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Painel de Resultados da Calculadora */}
                <div className="bg-slate-950/50 border border-slate-700/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Resumo Operacional</h3>
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded font-mono border border-indigo-500/20">Calculado automaticamente</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Carga Total</div>
                      <div className="text-lg font-bold text-white">{form.amount} <span className="text-xs text-slate-500 font-normal">k</span></div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Duração</div>
                      <div className="text-lg font-bold text-white">{campaignDays} <span className="text-xs text-slate-500 font-normal">dia(s)</span></div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Equipe/Dia</div>
                      <div className="text-lg font-bold text-indigo-400">{estimatedPromoters} <span className="text-xs text-indigo-500/70 font-normal">pessoas</span></div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Valor Sugerido</div>
                      <div className="text-lg font-bold text-emerald-400">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(suggestedRevenue)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Grid Final de Ajustes */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4">
                  <div>
                    <label className="block text-[10px] font-bold text-indigo-300 uppercase tracking-wider mb-2">Ajustar Milheiros</label>
                    <input
                      type="number" required min="1"
                      value={form.amount}
                      onChange={e => setForm(p => ({ ...p, amount: Number(e.target.value) }))}
                      className="w-full px-4 py-2 bg-slate-900/50 border border-indigo-500/30 rounded-lg text-white font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-indigo-300 uppercase tracking-wider mb-2">Dias de Panfletagem</label>
                    <input
                      type="number" required min="1"
                      value={campaignDays}
                      onChange={e => setCampaignDays(Number(e.target.value))}
                      className="w-full px-4 py-2 bg-slate-900/50 border border-indigo-500/30 rounded-lg text-white font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-emerald-300 uppercase tracking-wider mb-2">Receita Acordada (R$)</label>
                    <input
                      type="number" min="0" step="0.01"
                      value={form.revenue}
                      onChange={e => setForm(p => ({ ...p, revenue: Number(e.target.value) }))}
                      className="w-full px-4 py-2 bg-slate-900/50 border border-emerald-500/30 rounded-lg text-white font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

              </form>
            </div>

            <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="create-campaign-form"
                disabled={submitting}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                {submitting ? "Salvando..." : "Criar Campanha"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
