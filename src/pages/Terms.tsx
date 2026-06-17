import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen relative bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-slate-100">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">Termos de Uso</h1>
          <div className="prose prose-slate prose-indigo max-w-none space-y-6 text-slate-600">
            <p><strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}</p>
            
            <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">1. Aceitação dos Termos</h2>
            <p>Ao acessar e utilizar os serviços da Mega Marketing Direto, você concorda em cumprir e ficar vinculado a estes Termos de Uso. Caso não concorde com qualquer parte destes termos, você não deverá utilizar nossos serviços.</p>

            <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">2. Nossos Serviços</h2>
            <p>A Mega Marketing Direto fornece inteligência logística, panfletagem estratégica e auditoria de entregas. Os volumes, datas e valores são definidos individualmente no ato do fechamento do orçamento no painel.</p>

            <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">3. Responsabilidades e Auditoria</h2>
            <p>Garantimos a distribuição através do nosso sistema de acompanhamento tático e registro fotográfico (Auditoria Express™). O cliente atesta a ciência de que variáveis climáticas severas podem postergar datas de entrega agendadas, prezando pela segurança da equipe de campo.</p>

            <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">4. Cancelamentos</h2>
            <p>O cancelamento de campanhas previamente agendadas e com equipe já alocada poderá estar sujeito a multas proporcionais aos custos de logística já engatilhados pela nossa central.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
