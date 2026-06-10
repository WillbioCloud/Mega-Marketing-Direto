import { useState, useEffect } from "react";
import { Download, CheckCircle2, DollarSign, Wallet, ArrowUpRight, ArrowDownRight, Search, FileText, TrendingUp } from "lucide-react";
import { Payout, PayoutStatus } from "../../types";
import { cn } from "../../lib/utils";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";

export default function Finance() {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ grossRevenue: 0, totalCosts: 0 });

  useEffect(() => {
    fetchFinanceData();
  }, []);

  const fetchFinanceData = async () => {
    setLoading(true);

    // 1. Buscar Pagamentos
    const { data: payoutsData, error: payoutsError } = await supabase
      .from('payouts').select('*').order('created_at', { ascending: false });
    if (!payoutsError && payoutsData) {
      setPayouts(payoutsData.map(p => ({
        id: p.id, workerName: p.worker_name, campaignTitle: p.campaign_title,
        amount: p.amount, pixKey: p.pix_key, status: p.status
      })));
    }

    // 2. Calcular Faturamento Bruto
    const { data: campaignsData } = await supabase.from('campaigns').select('revenue');
    if (campaignsData) {
      const gross = campaignsData.reduce((acc, curr) => acc + Number(curr.revenue), 0);
      setStats(prev => ({ ...prev, grossRevenue: gross }));
    }

    setLoading(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const handleMarkAsPaid = async (id: string) => {
    const { error } = await supabase.from('payouts').update({ status: 'Pago' }).eq('id', id);
    if (error) {
      toast.error("Erro ao registrar pagamento");
    } else {
      setPayouts(prev => prev.map(p => p.id === id ? { ...p, status: 'Pago' as PayoutStatus } : p));
      toast.success("Pagamento processado com sucesso!");
    }
  };

  const totalCosts = stats.totalCosts;
  const totalGross = stats.grossRevenue;
  const netProfit = totalGross - totalCosts;

  return (
    <div className="space-y-8 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Acertos e Financeiro</h1>
          <p className="text-sm text-slate-400">Fechamento diário, lucratividade e pagamentos da equipe.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white text-sm font-medium rounded-xl transition-colors">
            <Download className="w-4 h-4" />
            Relatório
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-emerald-500/20">
            <FileText className="w-4 h-4" />
            Exportar Remessa PIX
          </button>
        </div>
      </div>

      {/* Profitability Panel (Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <ArrowUpRight className="w-16 h-16 text-indigo-500" />
          </div>
          <div className="text-slate-400 text-sm font-medium mb-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <DollarSign className="w-4 h-4" />
            </div>
            Receita Bruta Total
          </div>
          <div className="text-3xl font-bold text-white mb-2">{formatCurrency(totalGross)}</div>
          <div className="text-sm text-slate-500">
            Faturamento acumulado das campanhas
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <ArrowDownRight className="w-16 h-16 text-orange-500" />
          </div>
          <div className="text-slate-400 text-sm font-medium mb-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400">
              <Wallet className="w-4 h-4" />
            </div>
            Custos Operacionais
          </div>
          <div className="text-3xl font-bold text-white mb-2">{formatCurrency(totalCosts)}</div>
          <div className="text-sm text-slate-500">
            Custo Diárias de Equipe e Materiais Impressos
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-900/40 border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden group shadow-[0_0_30px_rgba(16,185,129,0.05)]">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingUp className="w-16 h-16 text-emerald-500" />
          </div>
          <div className="text-emerald-400 text-sm font-medium mb-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            Lucro Líquido
          </div>
          <div className="text-3xl font-bold text-emerald-400 mb-2">{formatCurrency(netProfit)}</div>
          <div className="text-sm font-medium text-emerald-500/70">
            Disponível após o fechamento
          </div>
        </div>
      </div>

      {/* Payout Table */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div>
            <h3 className="font-semibold text-white text-lg">Quadro de Pagamentos (Fechamento)</h3>
            <p className="text-sm text-slate-400">Pague as diárias pendentes da equipe e conclua a logística.</p>
          </div>
          <div className="relative w-full md:w-auto">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Buscar colaborador..." 
              className="pl-9 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-full md:w-64 transition-all"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500 bg-slate-900/40">
                <th className="px-6 py-4 font-medium">Panfleteiro</th>
                <th className="px-6 py-4 font-medium">Campanha Concluída</th>
                <th className="px-6 py-4 font-medium">Chave PIX</th>
                <th className="px-6 py-4 font-medium">Valor Diária</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Ação Rápida</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {payouts.map((payout) => (
                <tr key={payout.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-200">{payout.workerName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-400">{payout.campaignTitle}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="bg-slate-950 border border-slate-800 px-2 py-1 rounded inline-flex items-center text-xs font-mono text-slate-400">
                      {payout.pixKey}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-white">{formatCurrency(payout.amount)}</div>
                  </td>
                  <td className="px-6 py-4">
                    {payout.status === 'Pago' ? (
                      <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        Pago
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs font-medium text-orange-400">
                        <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                        Pendente
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {payout.status === 'Pendente' ? (
                       <button 
                         onClick={() => handleMarkAsPaid(payout.id)}
                         className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/20 hover:border-emerald-500 text-emerald-400 hover:text-white text-xs font-medium rounded-lg transition-all"
                       >
                         <CheckCircle2 className="w-3.5 h-3.5" />
                         Marcar como Pago
                       </button>
                    ) : (
                      <button disabled className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 text-slate-500 text-xs font-medium rounded-lg cursor-not-allowed">
                        Concluído
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {payouts.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            Nenhum pagamento pendente no momento.
          </div>
        )}
      </div>
    </div>
  );
}
