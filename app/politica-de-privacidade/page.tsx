import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PoliticaPrivacidade() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-brown-900 py-12 px-6 md:py-20">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-terracotta hover:text-brown-800 font-medium mb-12 transition-colors">
          <ArrowLeft size={20} />
          Voltar para a página inicial
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-display font-bold text-brown-950 mb-8">Política de Privacidade</h1>
        
        <div className="prose prose-brown max-w-none space-y-6 text-brown-800 leading-relaxed text-lg">
          <p>
            A <strong>Escola de Dança Estações</strong> valoriza a sua privacidade e está comprometida em proteger os seus dados pessoais. 
            Esta Política de Privacidade explica como coletamos, usamos e protegemos as informações que você nos fornece ao utilizar nosso site, 
            em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
          </p>

          <h2 className="text-2xl font-display font-bold text-brown-900 mt-12 mb-4">1. Informações que Coletamos</h2>
          <p>
            Podemos coletar os seguintes tipos de informações:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Dados de Navegação (Cookies):</strong> Utilizamos ferramentas como o Google Analytics para entender como os visitantes interagem com nosso site. Isso inclui informações como endereço IP, tipo de navegador, páginas visitadas e tempo de permanência. Esses dados são anonimizados e usados apenas para fins estatísticos.</li>
            <li><strong>Dados Fornecidos Voluntariamente:</strong> Caso você entre em contato conosco via WhatsApp, e-mail ou formulários, coletaremos as informações que você decidir compartilhar (como nome, telefone e e-mail) para podermos responder à sua solicitação.</li>
          </ul>

          <h2 className="text-2xl font-display font-bold text-brown-900 mt-12 mb-4">2. Como Usamos Suas Informações</h2>
          <p>
            As informações coletadas são utilizadas exclusivamente para:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Melhorar a experiência de navegação e o desempenho do nosso site;</li>
            <li>Analisar métricas de acesso e comportamento dos usuários (Google Analytics);</li>
            <li>Responder a dúvidas, solicitações de matrícula ou contato comercial;</li>
            <li>Cumprir obrigações legais ou regulatórias.</li>
          </ul>

          <h2 className="text-2xl font-display font-bold text-brown-900 mt-12 mb-4">3. Compartilhamento de Dados</h2>
          <p>
            Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros para fins de marketing. 
            Seus dados de navegação podem ser processados por serviços de terceiros (como o Google) estritamente para os fins de análise estatística mencionados acima.
          </p>

          <h2 className="text-2xl font-display font-bold text-brown-900 mt-12 mb-4">4. Cookies</h2>
          <p>
            Cookies são pequenos arquivos de texto armazenados no seu dispositivo quando você visita nosso site. 
            Eles nos ajudam a fazer o site funcionar corretamente e a entender como você o utiliza. 
            Você pode configurar seu navegador para recusar todos os cookies ou para indicar quando um cookie está sendo enviado. 
            No entanto, algumas funcionalidades do site podem não funcionar adequadamente sem eles.
          </p>

          <h2 className="text-2xl font-display font-bold text-brown-900 mt-12 mb-4">5. Seus Direitos (LGPD)</h2>
          <p>
            De acordo com a LGPD, você tem o direito de:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Confirmar a existência de tratamento de dados;</li>
            <li>Acessar seus dados;</li>
            <li>Corrigir dados incompletos, inexatos ou desatualizados;</li>
            <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários;</li>
            <li>Revogar o consentimento a qualquer momento.</li>
          </ul>

          <h2 className="text-2xl font-display font-bold text-brown-900 mt-12 mb-4">6. Contato</h2>
          <p>
            Se você tiver qualquer dúvida sobre esta Política de Privacidade ou sobre como tratamos seus dados, entre em contato conosco através dos nossos canais oficiais de atendimento (WhatsApp ou E-mail) disponibilizados no site.
          </p>

          <p className="text-sm text-brown-500 mt-16 pt-8 border-t border-brown-200">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>
    </div>
  );
}
