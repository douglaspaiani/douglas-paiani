import { motion } from "motion/react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Clock3,
  GraduationCap,
  Laptop,
  Rocket,
  Sparkles,
  Target,
  WandSparkles,
  CheckCircle2,
} from "lucide-react";
import MatrixRain from "@/src/components/MatrixRain";
import { cursosDisponiveis } from "@/src/constants/cursos";

const blocosDiferenciais = [
  {
    titulo: "Método Direto ao Ponto",
    descricao:
      "Você aprende sem enrolação, com foco no que realmente acelera a criação de um MVP validável.",
    icone: Target,
  },
  {
    titulo: "Aplicação Imediata",
    descricao:
      "Cada bloco já vira execução prática para você montar sua primeira versão sem depender de programação.",
    icone: Rocket,
  },
  {
    titulo: "IA + No-Code",
    descricao:
      "Combinação perfeita para ganhar velocidade, clareza estratégica e qualidade na entrega inicial.",
    icone: WandSparkles,
  },
];

function formatarPrecoEmReais(precoEmReais: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(precoEmReais);
}

function obterResumoAprendizadoCurso(tempoAprendizado: string) {
  const tempoMinusculo = tempoAprendizado.toLowerCase();
  if (tempoMinusculo.includes("1 aula")) return "1 aula";
  if (tempoMinusculo.includes("2h")) return "Até 2h";
  return tempoAprendizado;
}

function obterFocoCurso(tituloCurso: string) {
  const tituloMinusculo = tituloCurso.toLowerCase();
  if (tituloMinusculo.includes("site")) return "Site Elite + IA";
  return "No-Code + IA";
}

export default function Cursos() {
  return (
    <main className="bg-black min-h-screen pt-32 pb-24 px-4 sm:px-6 overflow-x-hidden">
      <Helmet>
        <title>Cursos | Douglas Paiani</title>
        <meta
          name="description"
          content="Cursos práticos para acelerar sua construção de produtos digitais com IA, no-code e visão de mercado."
        />
        <meta property="og:title" content="Cursos | Douglas Paiani" />
        <meta
          property="og:description"
          content="Aprenda a criar MVPs e produtos digitais com método direto, inteligência artificial e execução prática."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://douglaspaiani.com.br/cursos" />
        <link rel="canonical" href="https://douglaspaiani.com.br/cursos" />
      </Helmet>

      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 mix-blend-screen">
          <MatrixRain colorClass="text-blue-400" opacity="opacity-[0.18]" columns={34} />
        </div>
        <div className="absolute inset-0 mix-blend-screen blur-[0.4px]">
          <MatrixRain colorClass="text-cyan-300" opacity="opacity-[0.12]" columns={22} />
        </div>
        <div className="absolute inset-0 mix-blend-screen">
          <MatrixRain colorClass="text-sky-300" opacity="opacity-[0.07]" columns={12} />
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_12%,rgba(59,130,246,0.24),transparent_52%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_24%,rgba(6,182,212,0.18),transparent_48%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,8,20,0.12),rgba(0,0,0,0.42))]" />

        <motion.div
          animate={{
            opacity: [0.28, 0.6, 0.28],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-[60rem] h-[60rem] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.22),transparent_60%)]"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="text-center mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-[10px] font-black uppercase tracking-[0.2em]"
          >
            <Sparkles size={12} />
            Trilhas Intensivas
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter text-white"
          >
            CURSOS PARA
            <span className="text-cyan-400"> CRIAR RÁPIDO.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-white/55 max-w-3xl mx-auto text-base sm:text-lg leading-relaxed"
          >
            Formação prática para tirar ideias do papel com velocidade, clareza e execução real usando Inteligência Artificial.
          </motion.p>
        </header>

        <section aria-label="Lista de cursos" className="mb-24 space-y-10">
          {cursosDisponiveis.map((curso, indiceCurso) => (
            <motion.article
              key={curso.slug}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6, delay: indiceCurso * 0.08 }}
              className="relative overflow-hidden rounded-[26px] sm:rounded-[34px] border border-white/18 bg-white/[0.04] backdrop-blur-2xl shadow-[0_22px_70px_rgba(0,0,0,0.4)]"
            >
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(120deg,rgba(255,255,255,0.08),transparent_30%,transparent_70%,rgba(34,211,238,0.12))]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(34,211,238,0.22),transparent_45%)]" />

              <div className="relative p-5 sm:p-6 md:p-10 lg:p-12 grid lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12">
                <div className="lg:col-span-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] uppercase tracking-[0.2em] font-black mb-5">
                    <GraduationCap size={12} />
                    {indiceCurso === 0 ? "Metodologia única" : "Desenvolva a custo zero"}
                  </div>

                  <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight leading-tight text-white">
                    {curso.titulo}
                  </h2>

                  <p className="mt-4 sm:mt-5 text-white/55 text-base sm:text-lg leading-relaxed max-w-3xl">
                    {curso.descricaoCurta}
                  </p>

                  <div className="mt-8 grid sm:grid-cols-3 gap-3">
                    <div className="rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/16 px-4 py-3">
                      <p className="text-white/35 text-[10px] font-bold uppercase tracking-[0.18em]">Aprendizado</p>
                      <p className="text-white mt-1 font-semibold">{obterResumoAprendizadoCurso(curso.tempoAprendizado)}</p>
                    </div>
                    <div className="rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/16 px-4 py-3">
                      <p className="text-white/35 text-[10px] font-bold uppercase tracking-[0.18em]">Formato</p>
                      <p className="text-white mt-1 font-semibold">Online e Particular</p>
                    </div>
                    <div className="rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/16 px-4 py-3">
                      <p className="text-white/35 text-[10px] font-bold uppercase tracking-[0.18em]">Método</p>
                      <p className="text-white mt-1 font-semibold">{obterFocoCurso(curso.titulo)}</p>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col items-start gap-3 w-full pr-14 sm:pr-0">
                    <Link
                      to={`/cursos/${curso.slug}`}
                      className="group inline-flex w-full sm:w-auto justify-center items-center gap-2 px-6 py-3 rounded-2xl bg-cyan-500 text-black text-xs font-black uppercase tracking-[0.18em] whitespace-nowrap"
                    >
                      Conhecer o curso
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <span className="inline-flex items-center gap-2 text-white/55 text-sm leading-relaxed">
                      <Clock3 size={15} className="text-cyan-400" />
                      {curso.tempoAprendizado}
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-4">
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="rounded-3xl border border-white/18 bg-cyan-500/[0.08] backdrop-blur-2xl p-6 h-full shadow-[0_18px_60px_rgba(0,0,0,0.3)]"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center mb-5">
                      <Laptop size={22} className="text-cyan-300" />
                    </div>

                    <p className="text-white/35 text-[10px] uppercase tracking-[0.2em] font-black">Investimento</p>
                    <p className="text-white text-5xl font-black tracking-tighter mt-2">
                      {formatarPrecoEmReais(curso.precoEmReais)}
                    </p>
                    <p className="mt-3 text-cyan-100/90 font-medium">{curso.duracaoAulaParticular}</p>

                    <div className="mt-6 space-y-3">
                      {curso.beneficios.slice(0, 3).map((beneficio) => (
                        <div key={beneficio} className="flex items-start gap-2.5 text-sm text-white/75">
                          <CheckCircle2 size={16} className="text-cyan-300 mt-0.5 shrink-0" />
                          <span>{beneficio}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.article>
          ))}
        </section>

        <section className="grid md:grid-cols-3 gap-6" aria-label="Diferenciais da metodologia">
          {blocosDiferenciais.map((bloco, indice) => (
            <motion.article
              key={bloco.titulo}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: indice * 0.1 }}
              className="rounded-3xl p-6 border border-white/16 bg-white/[0.05] backdrop-blur-2xl hover:border-cyan-400/35 transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl border border-white/16 bg-white/[0.06] backdrop-blur-xl flex items-center justify-center mb-5">
                <bloco.icone className="text-cyan-400" size={22} />
              </div>
              <h3 className="text-white text-xl font-bold tracking-tight">{bloco.titulo}</h3>
              <p className="mt-3 text-white/55 leading-relaxed">{bloco.descricao}</p>
            </motion.article>
          ))}
        </section>
      </div>
    </main>
  );
}
