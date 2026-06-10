import { motion } from "motion/react";
import { DoorOpen, Map, Store, Flag, ArrowUpRight } from "lucide-react";
import { cn } from "../lib/utils";

const services = [
  {
    title: "Porta a Porta",
    description: "Cobertura total de bairros residenciais. Ideal para supermercados, farmácias e serviços locais.",
    icon: DoorOpen,
    className: "md:col-span-2 md:row-span-2 bg-gradient-to-br from-indigo-50 to-white",
    iconBg: "bg-indigo-100/80 text-indigo-600",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=600&h=400",
    metrics: "Até 5.000 lares / dia"
  },
  {
    title: "Semáforo Premium",
    description: "Abordagem rápida em cruzamentos estratégicos de alto fluxo de veículos.",
    icon: Flag,
    className: "md:col-span-1 md:row-span-1 bg-gradient-to-br from-fuchsia-50 to-white",
    iconBg: "bg-fuchsia-100/80 text-fuchsia-600",
    metrics: "Alto impacto visual"
  },
  {
    title: "Centro & Comércio",
    description: "Foco no polo comercial, entregando diretamente para lojistas e pedestres.",
    icon: Store,
    className: "md:col-span-1 md:row-span-1 bg-gradient-to-br from-orange-50 to-white",
    iconBg: "bg-orange-100/80 text-orange-600",
    metrics: "B2B e B2C Direto"
  },
  {
    title: "Bandeiradas Especiais",
    description: "Equipes uniformizadas com bandeiras, chamando atenção máxima para plantões de vendas imobiliários.",
    icon: Map,
    className: "md:col-span-2 md:row-span-1 bg-gradient-to-br from-slate-50 to-white flex-row items-center",
    iconBg: "bg-slate-200/80 text-slate-700",
    metrics: "Exclusivo Plantões"
  }
];

export function ServicesBento() {
  return (
    <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
      <div className="mb-12 md:mb-16">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
          Operações Táticas de <br/><span className="gradient-text">Alta Performance</span>
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl">
          Terceirize o trabalho de campo com quem entende de logística promocional B2B e distribuição estratégica. Capilaridade máxima para sua marca.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:auto-rows-[minmax(200px,auto)]">
        {services.map((service, index) => {
          const isLarge = index === 0;
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              key={service.title}
              className={cn(
                "group relative overflow-hidden rounded-3xl border border-slate-200/60 p-6 md:p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300",
                service.className
              )}
            >
              {isLarge && service.image && (
                <div className="mb-6 rounded-2xl overflow-hidden aspect-[2/1] relative">
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
              )}
              
              <div className="flex flex-col h-full justify-between gap-6">
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn("p-3 rounded-2xl", service.iconBg)}>
                      <service.icon className="w-6 h-6" />
                    </div>
                    <button className="text-slate-400 hover:text-slate-700 transition-colors">
                      <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </button>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">{service.title}</h3>
                  <p className="text-slate-600 leading-relaxed font-medium text-sm md:text-base">
                    {service.description}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 mt-auto">
                  <span className="text-xs font-bold tracking-wider uppercase bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm text-slate-700 group-hover:border-indigo-200 transition-colors">
                    {service.metrics}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
