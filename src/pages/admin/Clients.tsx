import { Search, Plus, Building2, TrendingUp, BarChart3, Link as LinkIcon, MoreHorizontal, ExternalLink } from "lucide-react";
import { ClientB2B } from "../../types";
import { cn } from "../../lib/utils";

const mockClients: ClientB2B[] = [
  { id: '1', name: 'Construtora Apex', niche: 'Imobiliário', status: 'Mensal', ltv: 145000, activeCampaigns: 2, avatar: 'https://i.pravatar.cc/150?img=68' },
  { id: '2', name: 'GymPro Centro', niche: 'Saúde & Esporte', status: 'Avulso', ltv: 15000, activeCampaigns: 1, avatar: 'https://i.pravatar.cc/150?img=33' },
  { id: '3', name: 'Lojas União', niche: 'Varejo', status: 'Mensal', ltv: 340000, activeCampaigns: 3, avatar: 'https://i.pravatar.cc/150?img=47' },
  { id: '4', name: 'Auto Show Motors', niche: 'Automotivo', status: 'Avulso', ltv: 25000, activeCampaigns: 1, avatar: 'https://i.pravatar.cc/150?img=11' },
  { id: '5', name: 'Mobi Imóveis', niche: 'Imobiliário', status: 'Mensal', ltv: 85000, activeCampaigns: 2, avatar: 'https://i.pravatar.cc/150?img=5' },
];

export default function Clients() {
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
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-indigo-500/20">
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
          <div className="text-3xl font-bold text-white mb-2">42</div>
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
              {mockClients.map((client) => (
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
    </div>
  );
}
