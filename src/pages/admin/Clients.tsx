import { useState, useEffect } from "react";
import { Search, Plus, Building2, TrendingUp, BarChart3, Link as LinkIcon, MoreHorizontal, ExternalLink } from "lucide-react";
import { ClientB2B } from "../../types";
import { cn } from "../../lib/utils";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";

export default function Clients() {
  const [clients, setClients] = useState<ClientB2B[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', niche: '', status: 'Avulso' as 'Avulso' | 'Mensal' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
    if (error) {
      toast.error("Erro ao carregar clientes");
    } else if (data) {
      setClients(data.map(c => ({
        id: c.id, name: c.name, niche: c.niche, status: c.status,
        ltv: c.ltv, activeCampaigns: c.active_campaigns,
        avatar: c.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=1e293b&color=818cf8`
      })));
    }
    setLoading(false);
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { data, error } = await supabase.from('clients').insert([{
      name: newClient.name,
      niche: newClient.niche,
      status: newClient.status,
    }]).select();
    if (error) {
      toast.error('Erro ao criar cliente.');
    } else if (data) {
      toast.success('Cliente cadastrado com sucesso!');
      setIsCreateModalOpen(false);
      setNewClient({ name: '', niche: '', status: 'Avulso' });
      fetchClients();
    }
    setSubmitting(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Gestão de Clientes B2B</h1>
          <p className="text-sm text-slate-400">Gerencie contratos, histórico financeiro e transparência.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white text-sm font-medium rounded-xl transition-colors">
            <Search className="w-4 h-4" />
            Filtrar
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4" />
            Novo Cliente
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Building2 className="w-16 h-16 text-indigo-500" />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="text-slate-400 text-sm font-medium">Clientes Ativos</div>
          </div>
          <div className="text-3xl font-bold text-white mb-2">{loading ? '...' : clients.length}</div>
          <div className="text-sm font-medium text-emerald-400 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4" /> +3 este mês
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <BarChart3 className="w-16 h-16 text-emerald-500" />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="text-slate-400 text-sm font-medium">MRR (Recorrente)</div>
          </div>
          <div className="text-3xl font-bold text-white mb-2">R$ 185.500</div>
          <div className="text-sm font-medium text-emerald-400 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4" /> +12% do mês anterior
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <LinkIcon className="w-16 h-16 text-orange-500" />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div className="text-slate-400 text-sm font-medium">Campanhas no Mês</div>
          </div>
          <div className="text-3xl font-bold text-white mb-2">124</div>
          <div className="text-sm font-medium text-slate-500">68 ativas neste momento</div>
        </div>
      </div>

      {/* Grid of Clients */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-semibold text-white">Carteira de Clientes</h3>
          <button className="text-slate-400 hover:text-white transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500 bg-slate-900/40">
                <th className="px-6 py-4 font-medium">Empresa</th>
                <th className="px-6 py-4 font-medium">Nicho</th>
                <th className="px-6 py-4 font-medium">Status / Contrato</th>
                <th className="px-6 py-4 font-medium">LTV (Total Gasto)</th>
                <th className="px-6 py-4 font-medium text-right">Ações de Retenção</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">Carregando clientes...</td></tr>
              ) : clients.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">Nenhum cliente cadastrado.</td></tr>
              ) : clients.map((client) => (
                <tr key={client.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img src={client.avatar} alt={client.name} className="w-10 h-10 rounded-xl border border-slate-700 bg-slate-800 object-cover" />
                      <div>
                        <div className="font-semibold text-slate-200">{client.name}</div>
                        <div className="text-xs text-slate-500">{client.activeCampaigns} campanha(s) em andamento</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">
                    {client.niche}
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "text-xs font-semibold px-2.5 py-1 rounded-md border",
                      client.status === 'Mensal' 
                        ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" 
                        : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                    )}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-300">{formatCurrency(client.ltv)}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-indigo-500 border border-slate-700 hover:border-indigo-400 text-slate-300 hover:text-white text-xs font-medium rounded-lg transition-all group-hover:shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                      <ExternalLink className="w-3.5 h-3.5" />
                      Link de Transparência
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Novo Cliente */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsCreateModalOpen(false)} />
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-400" />
                Novo Cliente B2B
              </h2>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors">
                <span className="text-xl leading-none">&times;</span>
              </button>
            </div>
            <form onSubmit={handleCreateClient} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Nome da Empresa</label>
                <input
                  type="text" required
                  value={newClient.name}
                  onChange={e => setNewClient(p => ({ ...p, name: e.target.value }))}
                  placeholder="Ex: Construtora Apex"
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Nicho / Setor</label>
                <input
                  type="text" required
                  value={newClient.niche}
                  onChange={e => setNewClient(p => ({ ...p, niche: e.target.value }))}
                  placeholder="Ex: Imobiliário, Varejo, Saúde..."
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Tipo de Contrato</label>
                <select
                  value={newClient.status}
                  onChange={e => setNewClient(p => ({ ...p, status: e.target.value as 'Avulso' | 'Mensal' }))}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                >
                  <option value="Avulso">Avulso</option>
                  <option value="Mensal">Mensal (Recorrente)</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/20">
                  {submitting ? 'Salvando...' : 'Cadastrar Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
