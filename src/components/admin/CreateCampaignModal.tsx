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
  const [form, setForm] = useState({
    title: "",
    client_id: "",
    client_name: "",
    service: SERVICE_OPTIONS[0].label,
    amount: "",
    revenue: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) fetchClients();
  }, [isOpen]);

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
      service: form.service,
      service_color: getServiceColor(form.service),
      amount: Number(form.amount),
      revenue: Number(form.revenue) || 0,
      status: "agendado",
    }]);

    if (error) {
      toast.error("Erro ao criar campanha.");
    } else {
      toast.success("Campanha criada com sucesso!");
      setForm({ title: "", client_id: "", client_name: "", service: SERVICE_OPTIONS[0].label, amount: "", revenue: "" });
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

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Tipo de Serviço</label>
                  <select
                    value={form.service}
                    onChange={e => setForm(p => ({ ...p, service: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  >
                    {SERVICE_OPTIONS.map(s => (
                      <option key={s.label} value={s.label}>{s.label}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Quantidade (unid.)</label>
                    <input
                      type="number" required min="1"
                      value={form.amount}
                      onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
                      placeholder="Ex: 10000"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Receita (R$)</label>
                    <input
                      type="number" min="0" step="0.01"
                      value={form.revenue}
                      onChange={e => setForm(p => ({ ...p, revenue: e.target.value }))}
                      placeholder="Ex: 4500"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
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
