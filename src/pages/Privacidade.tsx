import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Privacidade() {
  return (
    <main className="bg-black min-h-screen pt-32 pb-24 px-6">
      <Helmet>
        <title>Política de Privacidade | Douglas Paiani</title>
        <meta
          name="description"
          content="Política de privacidade de Douglas Paiani com detalhes sobre coleta, uso e proteção de dados."
        />
        <link rel="canonical" href="https://douglaspaiani.com.br/privacidade" />
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-white/50 hover:text-cyan-400 transition-colors text-xs font-bold uppercase tracking-widest mb-10"
        >
          <ArrowLeft size={16} />
          Voltar para o site
        </Link>

        <div className="rounded-[32px] border border-white/10 bg-[#0a0a0a] p-8 md:p-12 space-y-8">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">Política de Privacidade</h1>

          <section className="space-y-4">
            <h2 className="text-white text-xl font-bold">1. Coleta de Dados</h2>
            <p className="text-white/60 leading-relaxed">
              Coletamos dados informados voluntariamente em formulários de contato, como nome, e-mail, telefone e
              dados do projeto, com a finalidade de atender solicitações comerciais e técnicas.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-white text-xl font-bold">2. Uso das Informações</h2>
            <p className="text-white/60 leading-relaxed">
              As informações são usadas para comunicação com clientes, elaboração de propostas, execução de serviços,
              melhoria da experiência no site e cumprimento de obrigações legais.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-white text-xl font-bold">3. Compartilhamento</h2>
            <p className="text-white/60 leading-relaxed">
              Não vendemos dados pessoais. O compartilhamento ocorre apenas quando necessário para prestação de serviço,
              integração com ferramentas contratadas ou exigência legal.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-white text-xl font-bold">4. Armazenamento e Segurança</h2>
            <p className="text-white/60 leading-relaxed">
              Aplicamos medidas técnicas e organizacionais para proteger dados contra acesso não autorizado, perda,
              alteração ou divulgação indevida.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-white text-xl font-bold">5. Direitos do Titular</h2>
            <p className="text-white/60 leading-relaxed">
              Você pode solicitar acesso, correção, atualização ou exclusão de dados pessoais, respeitando as bases
              legais aplicáveis e prazos regulatórios.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-white text-xl font-bold">6. Contato</h2>
            <p className="text-white/60 leading-relaxed">
              Para dúvidas sobre privacidade e tratamento de dados, utilize os canais de contato disponíveis no site.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
