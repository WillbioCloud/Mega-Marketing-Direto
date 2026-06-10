import { Search, Plus, Star, Phone } from "lucide-react";
import { TeamMember } from "../../types";

const teamData: TeamMember[] = [
  { id: 1, name: "Roberto Silva", phone: "(62) 98888-1111", rating: 4.8, reviews: 124, status: "Em Atividade", avatar: "https://i.pravatar.cc/150?img=11" },
  { id: 2, name: "Amanda Costa", phone: "(62) 97777-2222", rating: 4.9, reviews: 89, status: "Disponível", avatar: "https://i.pravatar.cc/150?img=5" },
  { id: 3, name: "Jorge Ferreira", phone: "(62) 96666-3333", rating: 4.5, reviews: 210, status: "Em Atividade", avatar: "https://i.pravatar.cc/150?img=15" },
  { id: 4, name: "Lucas Mendes", phone: "(62) 95555-4444", rating: 4.7, reviews: 56, status: "Indisponível", avatar: "https://i.pravatar.cc/150?img=33" },
  { id: 5, name: "Fernanda Alves", phone: "(62) 94444-5555", rating: 5.0, reviews: 42, status: "Disponível", avatar: "https://i.pravatar.cc/150?img=42" },
];

export default function Team() {
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
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white font-medium text-sm rounded-xl transition-colors">
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
              {teamData.map((member) => (
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
          <span>Mostrando 1 a 5 de 42 colaboradores</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors disabled:opacity-50">Anterior</button>
            <button className="px-3 py-1 rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors bg-slate-800 text-slate-200">1</button>
            <button className="px-3 py-1 rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors">2</button>
            <button className="px-3 py-1 rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors">3</button>
            <button className="px-3 py-1 rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors">Próxima</button>
          </div>
        </div>
      </div>
    </div>
  );
}
