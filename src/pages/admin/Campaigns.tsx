import { useState } from "react";
import { MoreHorizontal, Plus, Search } from "lucide-react";
import { CampaignDetailsModal } from "../../components/admin/CampaignDetailsModal";
import { cn } from "../../lib/utils";
import { Campaign, CampaignStatus } from "../../types";

const mockTeam = [
  { id: '101', name: 'Roberto S.', phone: '(62) 98888-1111', avatar: 'https://i.pravatar.cc/150?img=11' },
  { id: '102', name: 'Amanda C.', phone: '(62) 97777-2222', avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: '103', name: 'Jorge F.', phone: '(62) 96666-3333', avatar: 'https://i.pravatar.cc/150?img=15' },
];

const mockTeam2 = [
  { id: '104', name: 'Lucas M.', phone: '(62) 95555-4444', avatar: 'https://i.pravatar.cc/150?img=33' },
];

const initialCampaigns: Record<string, Campaign[]> = {
  agendado: [
    { id: '1', title: 'Lançamento Condomínio Oasis', client: 'Construtora Apex', service: 'Porta a Porta', amount: '15.000', status: 'agendado', serviceColor: 'bg-indigo-500/20 text-indigo-400', revenue: 4500, allocatedTeam: mockTeam },
    { id: '2', title: 'Inauguração Academia GymPro', client: 'GymPro Centro', service: 'Semáforo Premium', amount: '5.000', status: 'agendado', serviceColor: 'bg-fuchsia-500/20 text-fuchsia-400', revenue: 1200, allocatedTeam: mockTeam2 },
  ],
  emRota: [
    { id: '3', title: 'Promoção Dia das Mães', client: 'Lojas União', service: 'Centro & Comércio', amount: '20.000', status: 'emRota', serviceColor: 'bg-orange-500/20 text-orange-400', revenue: 6000, allocatedTeam: mockTeam },
    { id: '4', title: 'Plantão Residencial Sul', client: 'Mobi Imóveis', service: 'Bandeiradas Especiais', amount: 'N/A', status: 'emRota', serviceColor: 'bg-emerald-500/20 text-emerald-400', revenue: 2500, allocatedTeam: mockTeam2 },
  ],
  concluido: [
    { id: '5', title: 'Feirão de Veículos Semi-novos', client: 'Auto Show', service: 'Semáforo Premium', amount: '10.000', status: 'concluido', serviceColor: 'bg-fuchsia-500/20 text-fuchsia-400', revenue: 3000, allocatedTeam: mockTeam },
  ]
};

interface ColumnProps {
  title: string;
  status: string;
  count: number;
  items: Campaign[];
}

export default function Campaigns() {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const Column = ({ title, status, count, items }: ColumnProps) => (
    <div className="flex flex-col bg-slate-900/50 border border-slate-800 rounded-3xl p-5 min-h-[500px]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-white flex items-center gap-3">
          <div className={cn(
            "w-3 h-3 rounded-full",
            status === 'agendado' ? 'bg-slate-400' :
            status === 'emRota' ? 'bg-indigo-500' : 'bg-emerald-500'
          )} />
          {title}
          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-xs text-slate-400">{count}</span>
        </h3>
        <button className="text-slate-500 hover:text-slate-300">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div 
            key={item.id} 
            onClick={() => setSelectedCampaign(item)}
            className="group cursor-pointer bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 rounded-2xl p-4 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-md", item.serviceColor)}>
                  {item.service}
                </span>
                <span className={cn(
                  "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                  status === 'agendado' ? "bg-slate-800/80 text-slate-400 border border-slate-700" :
                  status === 'emRota' ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                  "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                )}>
                  {status === 'agendado' ? 'Planejada' : status === 'emRota' ? 'Ativa' : 'Concluída'}
                </span>
              </div>
              <span className="text-xs font-medium text-slate-400 bg-slate-900 px-2 py-1 rounded-md border border-slate-800">
                {item.amount} un
              </span>
            </div>
            <h4 className="font-bold text-slate-200 group-hover:text-white transition-colors mb-1">{item.title}</h4>
            <p className="text-sm text-slate-500 font-medium">{item.client}</p>
          </div>
        ))}
        
        {status === 'agendado' && (
          <button className="flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-700/50 hover:border-slate-600 rounded-2xl text-slate-400 hover:text-slate-300 transition-colors text-sm font-medium">
            <Plus className="w-4 h-4" />
            Nova Campanha
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Quadro Operacional</h1>
          <p className="text-slate-400 text-sm">Gerencie o fluxo de entrega das campanhas ativas.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Buscar campanha..." 
              className="pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-64 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white font-medium text-sm rounded-xl transition-colors">
            <Plus className="w-4 h-4" />
            Nova Campanha
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 items-start">
        <Column title="Agendado" status="agendado" count={initialCampaigns.agendado.length} items={initialCampaigns.agendado} />
        <Column title="Ativa" status="emRota" count={initialCampaigns.emRota.length} items={initialCampaigns.emRota} />
        <Column title="Concluído" status="concluido" count={initialCampaigns.concluido.length} items={initialCampaigns.concluido} />
      </div>

      <CampaignDetailsModal 
        isOpen={!!selectedCampaign} 
        onClose={() => setSelectedCampaign(null)} 
        campaign={selectedCampaign} 
      />
    </div>
  );
}
