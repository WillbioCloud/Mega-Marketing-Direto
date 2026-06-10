import { motion } from "motion/react";
import { Crosshair, Camera, ShieldBan, Trophy } from "lucide-react";

const features = [
  {
    icon: Crosshair,
    title: "Estratégia Territorial Integrada",
    description: "Definimos taticamente as áreas e focamos onde seu público-alvo está. Menos desperdício, mais conversão."
  },
  {
    icon: Camera,
    title: "Relatórios Fotográficos",
    description: "Desconfiança nunca mais. Nossa equipe realiza registros estruturados das entregas nas caixas de correio e abordagens."
  },
  {
    icon: ShieldBan,
    title: "Tolerância Zero a Descarte",
    description: "Controle de amostragem rigoroso. Panfleto no lixo é quebra de contrato. Nossa auditoria é invisível e constante."
  }
];

export function TechProof() {
  return (
    <section id="tech" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24 pb-24">
      <div className="bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-8 md:p-16 relative overflow-hidden text-white">
        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-fuchsia-500/20 rounded-full blur-3xl" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 md:mb-6">
              A panfletagem antiga morreu. <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-orange-300">
                Conheça o padrão 2.0
              </span>
            </h2>
            <p className="text-slate-300 text-lg mb-12 max-w-xl leading-relaxed">
              Diga adeus ao dinheiro jogado no bueiro. Desenvolvemos uma infraestrutura logística proprietária focada em transparência absoluta para o cliente.
            </p>

            <div className="space-y-8">
              {features.map((feat, i) => (
                <motion.div 
                  key={feat.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="flex gap-5"
                >
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-sm">
                      <feat.icon className="w-6 h-6 text-indigo-300" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">{feat.title}</h4>
                    <p className="text-slate-400 leading-relaxed font-medium">{feat.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="lg:pl-10 mt-2 lg:mt-0">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl"
            >
              <div className="flex items-center gap-3 mb-8">
                <Trophy className="w-8 h-8 text-orange-400" />
                <h3 className="text-2xl font-bold">Na Prática</h3>
              </div>
              
              <div className="space-y-6">
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/5">
                  <p className="text-slate-300 italic mb-4 font-medium text-lg">
                    "Foi a primeira vez que fiz panfletagem e tive certeza de que o material foi entregue. As vendas do lançamento do nosso loteamento subiram 40% no fim de semana."
                  </p>
                  <div className="flex items-center gap-4">
                    <img src="https://i.pravatar.cc/100?img=47" className="w-12 h-12 rounded-full border border-slate-600" alt="Cliente" />
                    <div>
                      <div className="font-bold text-white">Carlos Mendes</div>
                      <div className="text-sm text-slate-400">Construtora Apex</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                  <div>
                    <div className="text-4xl font-bold text-white mb-1">+2.5M</div>
                    <div className="text-sm text-slate-400 font-medium">Panfletos Auditados</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-white mb-1">99.8%</div>
                    <div className="text-sm text-slate-400 font-medium">Taxa de Conformidade</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
