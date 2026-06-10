import { useState, useEffect } from "react";
import { Search, Plus, Star, Phone } from "lucide-react";
import { TeamMember } from "../../types";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";

export default function Team() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', phone: '', pix_key: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('team_members').select('*').order('created_at', { ascending: false });
    if (error) {
      toast.error("Erro ao carregar equipa");
    } else if (data) {
      setTeam(data.map(d => ({
        id: d.id, name: d.name, phone: d.phone, rating: d.rating,
        reviews: d.reviews, status: d.status, avatar: d.avatar_url || 'https://i.pravatar.cc/150'
      })));
    }
    setLoading(false);
  };

  const handleCreateTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { data, error } = await supabase.from('team_members').insert([{
      name: newMember.name,
      phone: newMember.phone,
      pix_key: newMember.pix_key,
      status: 'Disponível',
      rating: 0,
      reviews: 0,
    }]).select();
    if (error) {
      toast.error('Erro ao cadastrar colaborador.');
    } else if (data) {
      toast.success('Colaborador cadastrado com sucesso!');
      setIsCreateModalOpen(false);
      setNewMember({ name: '', phone: '', pix_key: '' });
      fetchTeam();
    }
    setSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Equipe de Panfleteiros</h1>
          <p className="text-slate-400 text-sm">Gerencie o cadastro, avaliações e disponibilidade do seu time.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Buscar colaborador..." 
              className="pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-64 transition-all"
            />
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white font-medium text-sm rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Novo Colaborador
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-950/50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Colaborador</th>
                <th className="px-6 py-4">Contato</th>
                <th className="px-6 py-4 text-center">Avaliação (App)</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">Carregando colaboradores...</td></tr>
              ) : team.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">Nenhum colaborador cadastrado.</td></tr>
              ) : team.map((member) => (
                <tr key={member.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full border border-slate-700" />
                      <div>
                        <div className="text-slate-200 font-semibold">{member.name}</div>
                        <div className="text-xs text-slate-500">ID: #{1000 + Number(member.id)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Phone className="w-4 h-4 text-slate-500" />
                      {member.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-center justify-center">
                      <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded-md border border-yellow-500/20">
                        <Star className="w-3.5 h-3.5 fill-yellow-500" />
                        <span className="font-bold">{member.rating}</span>
                      </div>
                      <span className="text-xs text-slate-500 mt-1">{member.reviews} avaliações</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
                      ${member.status === 'Em Atividade' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                        member.status === 'Disponível' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 
                        'bg-slate-800 text-slate-400 border border-slate-700'
                      }
                    `}>
                      <span className={`w-1.5 h-1.5 rounded-full 
                        ${member.status === 'Em Atividade' ? 'bg-emerald-500 animate-pulse' : 
                          member.status === 'Disponível' ? 'bg-indigo-400' : 'bg-slate-500'
                        }
                      `} />
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-indigo-400 hover:text-indigo-300 font-medium text-sm">
                      Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination minimal */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/30 flex items-center justify-between text-sm text-slate-500">
          <span>Mostrando {team.length} colaborador(es)</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors disabled:opacity-50">Anterior</button>
            <button className="px-3 py-1 rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors bg-slate-800 text-slate-200">1</button>
            <button className="px-3 py-1 rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors">2</button>
            <button className="px-3 py-1 rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors">3</button>
            <button className="px-3 py-1 rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors">Próxima</button>
          </div>
        </div>
      </div>

      {/* Modal Novo Colaborador */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsCreateModalOpen(false)} />
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Phone className="w-5 h-5 text-indigo-400" />
                Novo Panfleteiro
              </h2>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors">
                <span className="text-xl leading-none">&times;</span>
              </button>
            </div>
            <form onSubmit={handleCreateTeamMember} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Nome Completo</label>
                <input
                  type="text" required
                  value={newMember.name}
                  onChange={e => setNewMember(p => ({ ...p, name: e.target.value }))}
                  placeholder="Ex: Roberto Silva"
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Telefone / WhatsApp</label>
                <input
                  type="tel" required
                  value={newMember.phone}
                  onChange={e => setNewMember(p => ({ ...p, phone: e.target.value }))}
                  placeholder="(62) 98888-0000"
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Chave PIX</label>
                <input
                  type="text" required
                  value={newMember.pix_key}
                  onChange={e => setNewMember(p => ({ ...p, pix_key: e.target.value }))}
                  placeholder="CPF, e-mail, telefone ou chave aleatória"
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/20">
                  {submitting ? 'Salvando...' : 'Cadastrar Colaborador'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
