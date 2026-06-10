import { useState, useEffect } from "react";
import { 
  Map, 
  TrendingUp,
  AlertCircle,
  FileCheck,
  Plus,
  Download
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { CreateCampaignModal } from "../../components/admin/CreateCampaignModal";
import { supabase } from "../../lib/supabase";

const chartData = [
  { name: 'Seg', entregas: 4000 },
  { name: 'Ter', entregas: 3000 },
  { name: 'Qua', entregas: 5200 },
  { name: 'Qui', entregas: 4500 },
  { name: 'Sex', entregas: 6000 },
  { name: 'Sáb', entregas: 8000 },
  { name: 'Dom', entregas: 1500 },
];

const alerts = [
  { id: 1, type: 'warning', message: 'Relatório da campanha "Construtora Apex" pendente de envio.', time: 'Há 2h' },
  { id: 2, type: 'info', message: 'Equipe Alfa (Setor Sul) finalizou a rota 4 do dia.', time: 'Há 45m' },
  { id: 3, type: 'success', message: 'Pagamento da fatura #4092 confirmado.', time: 'Há 3h' },
];

export default function Dashboard() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [dashStats, setDashStats] = useState({ activeCampaigns: 0, activeTeam: 0, grossRevenue: 0, loadingStats: true });

  useEffect(() => {
    fetchDashStats();
  }, []);

  const fetchDashStats = async () => {
    const [campaignsRes, teamRes, revenueRes] = await Promise.all([
      supabase.from('campaigns').select('id', { count: 'exact', head: true }).eq('status', 'emRota'),
      supabase.from('team_members').select('id', { count: 'exact', head: true }).eq('status', 'Em Atividade'),
      supabase.from('campaigns').select('revenue'),
    ]);

    const gross = revenueRes.data
      ? revenueRes.data.reduce((acc, c) => acc + Number(c.revenue), 0)
      : 0;

    setDashStats({
      activeCampaigns: campaignsRes.count ?? 0,
      activeTeam: teamRes.count ?? 0,
      grossRevenue: gross,
      loadingStats: false,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Visão Geral</h1>
          <p className="text-slate-400 text-sm">Acompanhe as métricas e o volume de operações B2B.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-xl border border-slate-700 transition-colors">
            <Download className="w-4 h-4" />
            Gerar Relatório
          </button>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-all shadow-lg shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4" />
            Nova Campanha
          </button>
        </div>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-400">Total Distribuído no Mês</h3>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">
              {dashStats.loadingStats ? '...' : new Intl.NumberFormat('pt-BR').format(dashStats.grossRevenue)}
            </span>
            <span className="text-xs font-medium text-slate-400">
               R$ acumulado
            </span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-400">Campanhas Ativas Hoje</h3>
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
              <Map className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">
              {dashStats.loadingStats ? '...' : dashStats.activeCampaigns}
            </span>
            <span className="flex text-xs font-medium text-slate-400 items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-1.5 animate-pulse"></span>
              Em Execução
            </span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-400">Performance da Equipe</h3>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">
              {dashStats.loadingStats ? '...' : dashStats.activeTeam}
            </span>
            <span className="text-xs font-medium text-emerald-400 flex items-center">
              em atividade
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-white">Volume de Entregas</h3>
              <p className="text-sm text-slate-400">Últimos 7 dias</p>
            </div>
            <select className="bg-slate-950 border border-slate-700 text-slate-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2">
              <option>Esta semana</option>
              <option>Semana passada</option>
            </select>
          </div>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEntregas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.5rem', color: '#f8fafc' }}
                  itemStyle={{ color: '#818cf8' }}
                />
                <Area type="monotone" dataKey="entregas" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorEntregas)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mini-list of Alerts */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-semibold text-white">Alertas Operacionais</h3>
            <button className="text-sm font-medium text-indigo-400 hover:text-indigo-300">
              Ver todos
            </button>
          </div>
          
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex gap-4 items-start p-4 rounded-xl bg-slate-950/50 border border-slate-800">
                <div className={`mt-0.5 p-2 rounded-lg shrink-0 ${
                  alert.type === 'warning' ? 'bg-orange-500/10 text-orange-500' :
                  alert.type === 'info' ? 'bg-indigo-500/10 text-indigo-400' :
                  'bg-emerald-500/10 text-emerald-500'
                }`}>
                  {alert.type === 'warning' && <AlertCircle className="w-4 h-4" />}
                  {alert.type === 'info' && <Map className="w-4 h-4" />}
                  {alert.type === 'success' && <FileCheck className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-300 leading-snug">{alert.message}</p>
                  <span className="text-xs font-medium text-slate-500 mt-2 block">{alert.time}</span>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-xl transition-colors">
            Adicionar Relatório Rápido
          </button>
        </div>
      </div>

      <CreateCampaignModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </div>
  );
}
