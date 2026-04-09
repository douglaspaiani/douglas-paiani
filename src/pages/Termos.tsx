import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Termos() {
  return (
    <main className="bg-black min-h-screen pt-32 pb-24 px-6">
      <Helmet>
        <title>Termos de Uso | Douglas Paiani</title>
        <meta
          name="description"
          content="Termos de uso do site de Douglas Paiani com condições gerais de acesso e contratação."
        />
        <link rel="canonical" href="https://douglaspaiani.com.br/termos" />
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
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">Termos de Uso</h1>

          <section className="space-y-4">
            <h2 className="text-white text-xl font-bold">1. Aceitação dos Termos</h2>
            <p className="text-white/60 leading-relaxed">
              Ao acessar este site, você concorda com estes termos e com a legislação aplicável. Caso não concorde,
              interrompa o uso imediatamente.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-white text-xl font-bold">2. Uso Permitido</h2>
            <p className="text-white/60 leading-relaxed">
              O conteúdo disponibilizado é para informação institucional e comercial. É proibido uso indevido,
              engenharia reversa, tentativas de invasão, cópia não autorizada ou qualquer prática que prejudique
              sistemas e terceiros.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-white text-xl font-bold">3. Propriedade Intelectual</h2>
            <p className="text-white/60 leading-relaxed">
              Marcas, textos, layouts, códigos e demais materiais são protegidos por direitos autorais e pertencem aos
              respectivos titulares, salvo indicação em contrário.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-white text-xl font-bold">4. Limitação de Responsabilidade</h2>
            <p className="text-white/60 leading-relaxed">
              Empregamos esforços para manter informações atualizadas, porém não garantimos ausência total de erros,
              indisponibilidades temporárias ou interrupções causadas por fatores externos.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-white text-xl font-bold">5. Contratação de Serviços</h2>
            <p className="text-white/60 leading-relaxed">
              A contratação de serviços técnicos depende de proposta formal, escopo aprovado e condições comerciais
              específicas acordadas entre as partes.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-white text-xl font-bold">6. Alterações</h2>
            <p className="text-white/60 leading-relaxed">
              Estes termos podem ser alterados a qualquer momento. A versão vigente será sempre a publicada nesta
              página.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
