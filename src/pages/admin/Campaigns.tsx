import { useState, useEffect } from "react";
import { MoreHorizontal, Plus, Search } from "lucide-react";
import { CampaignDetailsModal } from "../../components/admin/CampaignDetailsModal";
import { CreateCampaignModal } from "../../components/admin/CreateCampaignModal";
import { cn } from "../../lib/utils";
import { Campaign, CampaignStatus } from "../../types";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";


interface ColumnProps {
  title: string;
  status: string;
  count: number;
  items: Campaign[];
}

export default function Campaigns() {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [campaigns, setCampaigns] = useState<Record<string, Campaign[]>>({ agendado: [], emRota: [], concluido: [] });
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [draggedItem, setDraggedItem] = useState<{id: string, sourceStatus: string} | null>(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('campaigns').select('*').order('created_at', { ascending: false });

    if (error) {
      toast.error("Erro ao carregar campanhas");
    } else if (data) {
      const grouped = {
        agendado: data.filter(c => c.status === 'agendado').map(formatCampaign),
        emRota: data.filter(c => c.status === 'emRota').map(formatCampaign),
        concluido: data.filter(c => c.status === 'concluido').map(formatCampaign)
      };
      setCampaigns(grouped);
    }
    setLoading(false);
  };

  const formatCampaign = (c: any): Campaign => ({
    id: c.id, title: c.title, client: c.client_name || 'Cliente B2B', service: c.service,
    amount: c.amount.toString(), status: c.status, serviceColor: c.service_color,
    revenue: c.revenue, allocatedTeam: []
  });

  const handleDragStart = (e: React.DragEvent, id: string, sourceStatus: string) => {
    e.dataTransfer.effectAllowed = 'move';
    setDraggedItem({ id, sourceStatus });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Permite que o item seja solto aqui
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();
    if (!draggedItem) return;
    const { id, sourceStatus } = draggedItem;

    if (sourceStatus === targetStatus) {
      setDraggedItem(null);
      return;
    }

    // 1. Atualização Otimista na UI (Move o card instantaneamente)
    const itemToMove = campaigns[sourceStatus as keyof typeof campaigns].find(c => c.id === id);
    if (!itemToMove) return;

    setCampaigns(prev => {
      const updatedItem = { ...itemToMove, status: targetStatus as CampaignStatus };
      return {
        ...prev,
        [sourceStatus]: prev[sourceStatus as keyof typeof prev].filter(c => c.id !== id),
        [targetStatus]: [updatedItem, ...prev[targetStatus as keyof typeof prev]]
      };
    });

    // 2. Atualiza no Supabase em Background
    const { error } = await supabase.from('campaigns').update({ status: targetStatus }).eq('id', id);
    
    if (error) {
      toast.error("Erro ao mover campanha.");
      fetchCampaigns(); // Reverte caso dê erro no banco
    } else {
      toast.success("Status atualizado!");
    }
    setDraggedItem(null);
  };

  const Column = ({ title, status, count, items }: ColumnProps) => (
    <div 
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, status)}
      className="flex flex-col bg-slate-900/50 border border-slate-800 rounded-3xl p-5 min-h-[500px] w-[280px] sm:w-[320px] lg:w-full shrink-0 snap-center transition-colors hover:bg-slate-800/20"
    >
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
            draggable
            onDragStart={(e) => handleDragStart(e, item.id, status)}
            onClick={() => setSelectedCampaign(item)}
            className="group cursor-grab active:cursor-grabbing bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 rounded-2xl p-4 transition-all"
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
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-700/50 hover:border-indigo-500/50 rounded-2xl text-slate-400 hover:text-indigo-400 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Nova Campanha
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Quadro Operacional</h1>
          <p className="text-slate-400 text-sm">Gerencie o fluxo de entrega das campanhas ativas.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Buscar campanha..." 
              className="pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-64 transition-all"
            />
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white font-medium text-sm rounded-xl transition-colors w-full md:w-auto justify-center"
          >
            <Plus className="w-4 h-4" />
            Nova Campanha
          </button>
        </div>
      </div>

      {/* Contêiner restrito à tela do celular para evitar vazar pro fundo branco */}
      <div className="w-full max-w-[calc(100vw-32px)] md:max-w-full mx-auto">
        <div className="overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar">
          <div className="flex lg:grid lg:grid-cols-3 gap-6 flex-1 items-start w-max lg:w-full px-1">
            {loading ? (
              <div className="col-span-3 flex items-center justify-center py-20 text-slate-500 w-[80vw] lg:w-full">Carregando campanhas...</div>
            ) : (
              <>
                <Column title="Agendado" status="agendado" count={campaigns.agendado.length} items={campaigns.agendado} />
                <Column title="Ativa" status="emRota" count={campaigns.emRota.length} items={campaigns.emRota} />
                <Column title="Concluído" status="concluido" count={campaigns.concluido.length} items={campaigns.concluido} />
              </>
            )}
          </div>
        </div>
      </div>

      <CampaignDetailsModal
        isOpen={!!selectedCampaign}
        onClose={() => setSelectedCampaign(null)}
        campaign={selectedCampaign}
      />
      <CreateCampaignModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchCampaigns}
      />
    </div>
  );
}
