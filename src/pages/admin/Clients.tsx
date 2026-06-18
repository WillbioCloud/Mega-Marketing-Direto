import { useState, useEffect } from "react";
import { Search, Plus, Building2, TrendingUp, BarChart3, Link as LinkIcon, MoreHorizontal, ExternalLink, Star, ShoppingBag, Store, Coffee, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";
import { ClientB2B } from "../../types";
import { cn } from "../../lib/utils";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";

export default function Clients() {
  const [clients, setClients] = useState<ClientB2B[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ mrr: 0, totalCampaigns: 0 });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', niche: '', status: 'Avulso' as 'Avulso' | 'Mensal' });
  const [submitting, setSubmitting] = useState(false);

  // Estados para Parceiros (Marcas)
  const [partners, setPartners] = useState<any[]>([]);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [partnerName, setPartnerName] = useState('');
  const [partnerFile, setPartnerFile] = useState<File | null>(null);
  const [partnerUrl, setPartnerUrl] = useState('');
  const [uploadStep, setUploadStep] = useState<'idle' | 'compressing' | 'uploading' | 'saving'>('idle');
  const [editingPartnerId, setEditingPartnerId] = useState<string | null>(null);

  const openNewPartnerModal = () => {
    setEditingPartnerId(null);
    setPartnerName('');
    setPartnerUrl('');
    setPartnerFile(null);
    setIsPartnerModalOpen(true);
  };

  const openEditPartnerModal = (partner: any) => {
    setEditingPartnerId(partner.id);
    setPartnerName(partner.name);
    setPartnerUrl(partner.website_url || '');
    setPartnerFile(null); // O arquivo só precisa ser setado se for trocar a imagem
    setIsPartnerModalOpen(true);
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    const { data } = await supabase.from('partners').select('*').order('created_at', { ascending: false });
    if (data) setPartners(data);
  };

  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerName) return;
    // Se não estiver editando, o arquivo é obrigatório
    if (!editingPartnerId && !partnerFile) return; 

    try {
      let publicUrl = '';

      // 1. Só faz Compressão e Upload se houver um arquivo NOVO
      if (partnerFile) {
        setUploadStep('compressing');
        const webpBlob = await compressToWebP(partnerFile);
        const fileName = `${Date.now()}-${partnerName.replace(/\s+/g, '-').toLowerCase()}.webp`;

        setUploadStep('uploading');
        const { error: uploadError } = await supabase.storage
          .from('partners')
          .upload(fileName, webpBlob, { contentType: 'image/webp' });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('partners').getPublicUrl(fileName);
        publicUrl = data.publicUrl;
      }

      setUploadStep('saving');

      // 2. Salva ou Atualiza no Banco de Dados
      if (editingPartnerId) {
        const updateData: any = { name: partnerName, website_url: partnerUrl || null };
        if (publicUrl) updateData.logo_url = publicUrl; // Só atualiza a logo se subiu uma nova

        const { error: dbError } = await supabase.from('partners').update(updateData).eq('id', editingPartnerId);
        if (dbError) throw dbError;
        toast.success('Parceiro atualizado com sucesso!');
      } else {
        const { error: dbError } = await supabase.from('partners').insert([{
          name: partnerName, logo_url: publicUrl, website_url: partnerUrl || null
        }]);
        if (dbError) throw dbError;
        toast.success('Parceiro adicionado com sucesso!');
      }

      setIsPartnerModalOpen(false);
      setEditingPartnerId(null);
      setPartnerName('');
      setPartnerUrl('');
      setPartnerFile(null);
      fetchPartners();
    } catch (error) {
      toast.error('Erro ao processar marca.');
      console.error(error);
    } finally {
      setUploadStep('idle');
    }
  };

  const compressToWebP = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('Erro no Canvas');
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject('Falha na conversão');
        }, 'image/webp', 0.8);
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const handleDeletePartner = async (id: string) => {
    await supabase.from('partners').delete().eq('id', id);
    fetchPartners();
    toast.success('Parceiro removido');
  };

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
      // Cálculo Dinâmico
      const currentMRR = data.filter(c => c.status === 'Mensal').reduce((acc, curr) => acc + Number(curr.ltv), 0);
      const activeCamps = data.reduce((acc, curr) => acc + Number(curr.active_campaigns), 0);
      setStats({ mrr: currentMRR, totalCampaigns: activeCamps });
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
          <div className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
            Atualizado em tempo real
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
          <div className="text-3xl font-bold text-white mb-2">{loading ? '...' : formatCurrency(stats.mrr)}</div>
          <div className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
            Métrica atualizada em tempo real
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
          <div className="text-3xl font-bold text-white mb-2">{loading ? '...' : stats.totalCampaigns}</div>
          <div className="text-sm font-medium text-slate-500">Campanhas atreladas aos clientes</div>
        </div>
      </div>

      {/* Vitrine de Marcas Parceiras (Site) */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-indigo-500/5 to-transparent pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Star className="w-4 h-4 text-orange-400 fill-orange-400" /> 
              Marcas em Destaque (Integração com o Site)
            </h3>
            <p className="text-xs text-slate-400 mt-1">Essas são as logos exibidas publicamente na Landing Page (Carrossel).</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 items-center">
          {partners.map(partner => (
            <div 
              key={partner.id} 
              onClick={() => openEditPartnerModal(partner)}
              className="group relative px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center shadow-inner hover:border-slate-700 transition-colors w-28 h-16 cursor-pointer"
            >
              <img src={partner.logo_url} alt={partner.name} title={partner.name} className="max-h-full max-w-full object-contain drop-shadow-md" />
              <button 
                onClick={(e) => { e.stopPropagation(); handleDeletePartner(partner.id); }} 
                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-110 z-10"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}

          <button 
            onClick={openNewPartnerModal}
            className="px-4 py-3 h-[58px] border border-dashed border-slate-700 rounded-xl flex items-center gap-2 text-slate-500 font-medium text-sm hover:text-slate-300 hover:border-slate-500 hover:bg-slate-800/30 transition-all"
          >
            <Plus className="w-4 h-4"/> Adicionar Parceiro
          </button>
        </div>
      </div>

      {/* Grid of Clients */}
      <div className="w-full max-w-[calc(100vw-32px)] md:max-w-full mx-auto bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-semibold text-white">Carteira de Clientes</h3>
          <button className="text-slate-400 hover:text-white transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
        
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[700px] whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500 bg-slate-900/40">
                <th className="px-6 py-4 font-medium whitespace-nowrap">Empresa</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">Nicho</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">Status / Contrato</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">LTV (Total Gasto)</th>
                <th className="px-6 py-4 font-medium text-right whitespace-nowrap">Ações de Retenção</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">Carregando clientes...</td></tr>
              ) : clients.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">Nenhum cliente cadastrado.</td></tr>
              ) : clients.map((client) => (
                <tr key={client.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <img src={client.avatar} alt={client.name} className="w-10 h-10 rounded-xl border border-slate-700 bg-slate-800 object-cover" />
                      <div>
                        <div className="font-semibold text-slate-200">{client.name}</div>
                        <div className="text-xs text-slate-500">{client.activeCampaigns} campanha(s) em andamento</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400 whitespace-nowrap">
                    {client.niche}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      "text-xs font-semibold px-2.5 py-1 rounded-md border",
                      client.status === 'Mensal' 
                        ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" 
                        : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                    )}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-slate-300">{formatCurrency(client.ltv)}</div>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
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
      {/* Modal Novo Parceiro */}
      {isPartnerModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => uploadStep === 'idle' && setIsPartnerModalOpen(false)} />
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-indigo-400" />
                {editingPartnerId ? 'Editar Marca' : 'Adicionar Nova Marca'}
              </h2>
            </div>
            <form onSubmit={handlePartnerSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Nome da Empresa</label>
                <input
                  type="text" required disabled={uploadStep !== 'idle'}
                  value={partnerName}
                  onChange={e => setPartnerName(e.target.value)}
                  placeholder="Ex: Construtora FBZ"
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Link do Site (Opcional)</label>
                <div className="flex bg-slate-800 border border-slate-700 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 transition-all disabled:opacity-50">
                  <span className="flex items-center px-4 bg-slate-900/50 text-slate-500 border-r border-slate-700 text-sm font-medium select-none">
                    https://
                  </span>
                  <input
                    type="text" disabled={uploadStep !== 'idle'}
                    value={partnerUrl.replace(/^https?:\/\//, '')}
                    onChange={e => {
                      const val = e.target.value.trim();
                      setPartnerUrl(val ? `https://${val.replace(/^https?:\/\//, '')}` : '');
                    }}
                    placeholder="site-do-cliente.com.br"
                    className="w-full px-4 py-2.5 bg-transparent text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Logotipo (Fundo Transparente)</label>
                <div className="flex items-center justify-center w-full">
                  <label className="group flex flex-col items-center justify-center w-full h-32 border-2 border-slate-700 border-dashed rounded-xl cursor-pointer bg-slate-800/50 hover:bg-slate-800 transition-colors relative overflow-hidden">
                    {partnerFile ? (
                      <div className="flex flex-col items-center z-10">
                        <ImageIcon className="w-8 h-8 text-indigo-400 mb-2" />
                        <p className="text-sm text-slate-300 font-medium">{partnerFile.name}</p>
                      </div>
                    ) : editingPartnerId && partners.find(p => p.id === editingPartnerId)?.logo_url ? (
                      <div className="w-full h-full p-4 flex items-center justify-center">
                        <img src={partners.find(p => p.id === editingPartnerId)?.logo_url} alt="Logo Atual" className="max-h-full max-w-full object-contain drop-shadow-md" />
                        <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all duration-300">
                          <ImageIcon className="w-6 h-6 text-white mb-1.5" />
                          <span className="text-xs text-white font-medium">Trocar Imagem</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 z-10">
                        <Plus className="w-8 h-8 text-slate-500 mb-2" />
                        <p className="text-sm text-slate-400">Clique para selecionar imagem</p>
                      </div>
                    )}
                    <input type="file" accept="image/png, image/jpeg" className="hidden" onChange={e => setPartnerFile(e.target.files?.[0] || null)} disabled={uploadStep !== 'idle'} />
                  </label>
                </div>
                <p className="text-[10px] text-slate-500 mt-2 text-center">
                  O sistema irá converter automaticamente para WebP de alta performance.
                </p>
              </div>

              {/* Status de Upload Visual */}
              {uploadStep !== 'idle' && (
                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
                  <div className="text-sm font-medium text-indigo-300">
                    {uploadStep === 'compressing' && 'Comprimindo e convertendo para WebP...'}
                    {uploadStep === 'uploading' && 'Enviando para a nuvem...'}
                    {uploadStep === 'saving' && 'Registrando no banco de dados...'}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setIsPartnerModalOpen(false); setEditingPartnerId(null); }} disabled={uploadStep !== 'idle'} className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors disabled:opacity-50">
                  Cancelar
                </button>
                <button type="submit" disabled={uploadStep !== 'idle' || (!partnerFile && !editingPartnerId)} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50">
                  {editingPartnerId ? 'Salvar Alterações' : 'Adicionar Marca'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
