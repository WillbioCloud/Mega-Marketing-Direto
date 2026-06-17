import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen relative bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-slate-100">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">Política de Privacidade</h1>
          <div className="prose prose-slate prose-indigo max-w-none space-y-6 text-slate-600">
            <p><strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}</p>
            
            <p>A privacidade da sua empresa e dos seus dados estratégicos é nossa maior prioridade. Esta política descreve como a Mega Marketing Direto coleta, usa e protege suas informações.</p>

            <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">1. Coleta de Dados</h2>
            <p>Coletamos apenas as informações necessárias para a prestação do serviço logístico: nome da empresa, contato, áreas de interesse para panfletagem e dados orçamentários simulados em nossa plataforma.</p>

            <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">2. Uso das Informações</h2>
            <p>Seus dados são utilizados exclusivamente para o planejamento de rotas, geração de contratos, faturamento (via plataforma de pagamento segura) e envio de relatórios de auditoria fotográfica para sua segurança.</p>

            <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">3. Proteção e Sigilo Territorial</h2>
            <p>Nós não vendemos, alugamos ou compartilhamos as estratégias territoriais (bairros escolhidos) da sua empresa com concorrentes. As rotas inseridas no nosso painel de controle contam com criptografia no banco de dados.</p>
            
            <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">4. Direitos do Usuário (LGPD)</h2>
            <p>Em conformidade com a LGPD, você possui o direito de solicitar a exclusão da sua conta, remoção de contatos comerciais ou exportação dos seus dados a qualquer momento entrando em contato conosco.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
