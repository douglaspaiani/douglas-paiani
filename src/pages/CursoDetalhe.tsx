import { AnimatePresence, motion } from "motion/react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  Gauge,
  Layers3,
  MessageSquare,
  Minus,
  Plus,
  Rocket,
  Sparkles,
  Target,
} from "lucide-react";
import { useMemo, useState } from "react";
import MatrixRain from "@/src/components/MatrixRain";
import { buscarCursoPorSlug } from "@/src/constants/cursos";

const blocosResultados = [
  {
    titulo: "Clareza Estratégica",
    descricao: "Você aprende a recortar o MVP certo para validar com agilidade.",
    icone: Target,
  },
  {
    titulo: "Execução Acelerada",
    descricao: "Passo a passo de criação usando IA e ferramentas no-code na prática.",
    icone: Rocket,
  },
  {
    titulo: "Visão de Produto",
    descricao: "Entenda como evoluir depois da versão inicial com base em feedback real.",
    icone: Layers3,
  },
];

type CursoDetalhado = NonNullable<ReturnType<typeof buscarCursoPorSlug>>;

interface BlocoConteudoCurso {
  id: string;
  selo: string;
  titulo: string;
  descricao: string;
  complemento: string;
  destaques: string[];
  tipoVisual: "ideia-pronta" | "mvp-pratico" | "trilha-2h";
}

const etapasMetodologiaExclusiva = [
  {
    titulo: "Estratégia Sem Custo Inicial",
    descricao:
      "Mapeamos o MVP com recursos no-code e IA para construir a base sem gastar 1 real na fase inicial.",
    icone: Target,
  },
  {
    titulo: "Execução Inteligente",
    descricao:
      "Aplicamos um fluxo validado nos meus projetos para acelerar a entrega sem dependência de desenvolvimento caro.",
    icone: Rocket,
  },
  {
    titulo: "Validação Antes de Investir",
    descricao:
      "Você testa o mercado primeiro e só investe em estrutura avançada quando houver sinal real de tração.",
    icone: Layers3,
  },
];

function formatarPrecoEmReais(precoEmReais: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(precoEmReais);
}

function montarLinkWhatsappCurso(nomeCurso: string, precoEmReais: number) {
  const numeroWhatsapp = "5551994727036";
  const mensagemCurso = encodeURIComponent(
    `Olá! Quero garantir minha aula do curso "${nomeCurso}" no valor de ${formatarPrecoEmReais(precoEmReais)}.`,
  );
  return `https://wa.me/${numeroWhatsapp}?text=${mensagemCurso}`;
}

function renderizarElementoBlocoConteudo(tipoVisual: BlocoConteudoCurso["tipoVisual"], curso: CursoDetalhado) {
  const cursoEhSiteElite = curso.slug === "sites-elite-inteligencia-artificial";

  // Cada tipo de bloco renderiza um painel visual próprio para alternar linguagem entre conceito e prática.
  if (tipoVisual === "ideia-pronta") {
    return (
      <div className="relative rounded-[28px] overflow-hidden border border-cyan-400/30 min-h-[320px]">
        <img
          src="/douglas-ia.jpg"
          alt={
            cursoEhSiteElite
              ? "Mentoria prática para transformar ideia em site profissional pronto"
              : "Mentoria prática para transformar ideia em MVP pronto"
          }
          className="w-full h-full min-h-[320px] object-cover opacity-70"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
        <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/15 bg-black/60 backdrop-blur-xl p-4">
          <p className="text-cyan-300 text-[10px] uppercase tracking-[0.2em] font-black">Saída da Aula</p>
          <div className="mt-3 space-y-2">
            <div className="flex items-start gap-2 text-white/85 text-sm">
              <CheckCircle2 size={16} className="text-cyan-300 mt-0.5 shrink-0" />
              {cursoEhSiteElite
                ? "Estrutura completa do site definida para executar sem travas."
                : "Escopo de MVP definido para executar sem travas."}
            </div>
            <div className="flex items-start gap-2 text-white/85 text-sm">
              <CheckCircle2 size={16} className="text-cyan-300 mt-0.5 shrink-0" />
              {cursoEhSiteElite
                ? "Sequência clara para publicar seu site com padrão de alto nível."
                : "Sequência clara para publicar e começar validação."}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (tipoVisual === "mvp-pratico") {
    const etapasEstruturaMvp = [
      {
        titulo: "Problema Real",
        descricao: "Dor específica que o usuário quer resolver agora",
        icone: Target,
      },
      {
        titulo: "Solução Mínima",
        descricao: "Funcionalidade essencial com entrega rápida",
        icone: Layers3,
      },
      {
        titulo: "Métrica de Validação",
        descricao: "Critério claro para confirmar interesse real",
        icone: Gauge,
      },
    ];

    return (
      <div className="relative rounded-[30px] p-[1px] bg-gradient-to-br from-cyan-400/45 via-cyan-200/10 to-transparent">
        <div className="relative rounded-[29px] border border-white/20 bg-white/[0.08] backdrop-blur-2xl p-6 md:p-7 overflow-hidden shadow-[0_18px_50px_rgba(0,0,0,0.32)]">
          <motion.div
            animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.08, 1] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-28 -right-24 w-72 h-72 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.22),transparent_65%)]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(130deg,rgba(34,211,238,0.08),transparent_35%,transparent_60%,rgba(34,211,238,0.08))]" />

          <div className="relative z-10 flex items-center justify-between gap-3">
            <p className="text-cyan-300 text-[10px] uppercase tracking-[0.2em] font-black">
              {cursoEhSiteElite ? "Estrutura de Site Elite" : "Estrutura de MVP"}
            </p>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-cyan-400/35 bg-cyan-500/10 text-cyan-200 text-[9px] uppercase tracking-[0.18em] font-black">
              Validação em Ciclos
            </span>
          </div>

          <div className="relative z-10 mt-5 space-y-3.5">
            {etapasEstruturaMvp.map((etapa, indice) => (
              <div
                key={etapa.titulo}
                className="relative rounded-2xl border border-white/15 bg-white/[0.08] backdrop-blur-xl p-4 md:p-5 hover:border-cyan-400/40 transition-colors"
              >
                {indice < etapasEstruturaMvp.length - 1 && (
                  <div className="absolute left-[1.42rem] -bottom-3 h-3 border-l border-dashed border-cyan-400/35" />
                )}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl border border-cyan-400/35 bg-cyan-500/10 flex items-center justify-center shrink-0">
                    <etapa.icone size={16} className="text-cyan-300" />
                  </div>
                  <div>
                    <p className="text-white/45 text-[10px] uppercase tracking-[0.2em] font-black">{etapa.titulo}</p>
                    <p className="text-white font-semibold mt-1 leading-relaxed">{etapa.descricao}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="relative z-10 mt-5 rounded-2xl border border-white/15 bg-white/[0.08] backdrop-blur-xl p-4">
            <p className="text-white/35 text-[10px] uppercase tracking-[0.2em] font-black">Fluxo Essencial</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-white/10 text-white/75 text-[11px] font-semibold">Diagnóstico</span>
              <span className="text-cyan-300/70 text-xs">→</span>
              <span className="px-2.5 py-1 rounded-full bg-white/10 text-white/75 text-[11px] font-semibold">Construção</span>
              <span className="text-cyan-300/70 text-xs">→</span>
              <span className="px-2.5 py-1 rounded-full bg-white/10 text-white/75 text-[11px] font-semibold">Validação</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const etapasSprint = curso.trilhaAprendizado.slice(0, 4);

  return (
    <div className="relative rounded-[30px] p-[1px] bg-gradient-to-br from-cyan-400/45 via-cyan-300/15 to-transparent">
      <div className="relative rounded-[29px] border border-white/20 bg-white/[0.08] backdrop-blur-2xl p-6 md:p-7 overflow-hidden shadow-[0_18px_50px_rgba(0,0,0,0.32)]">
        <motion.div
          animate={{ opacity: [0.2, 0.55, 0.2], x: ["-20%", "15%", "-20%"] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -left-10 w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.18),transparent_68%)]"
        />
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(140deg,rgba(34,211,238,0.08),transparent_35%,transparent_65%,rgba(34,211,238,0.06))]" />

        <div className="relative z-10 flex items-center justify-between gap-3">
          <p className="text-cyan-300 text-[10px] uppercase tracking-[0.2em] font-black">Sprint de 2 Horas</p>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-cyan-400/30 bg-cyan-500/10 text-cyan-200 text-[9px] uppercase tracking-[0.18em] font-black">
            Ritmo Intensivo
          </span>
        </div>

        <div className="relative z-10 mt-5 space-y-3.5">
          {etapasSprint.map((etapa, indice) => (
            <div
              key={etapa}
              className="relative rounded-2xl border border-white/15 bg-white/[0.08] backdrop-blur-xl p-4 md:p-5 hover:border-cyan-400/45 transition-colors"
            >
              {indice < etapasSprint.length - 1 && (
                <div className="absolute left-[1.42rem] -bottom-3 h-3 border-l border-dashed border-cyan-400/35" />
              )}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl border border-cyan-400/35 bg-cyan-500/10 flex items-center justify-center text-cyan-300 text-sm font-black shrink-0">
                  {indice + 1}
                </div>
                <p className="text-white/88 font-medium leading-relaxed">{etapa}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="relative z-10 mt-5 grid sm:grid-cols-3 gap-3">
          {blocosResultados.map((bloco) => (
            <div
              key={bloco.titulo}
              className="rounded-xl border border-white/15 bg-white/[0.09] backdrop-blur-xl p-3.5"
            >
              <bloco.icone size={15} className="text-cyan-300" />
              <p className="text-white/85 text-xs font-semibold mt-2">{bloco.titulo}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CursoDetalhe() {
  const { slug } = useParams();
  const curso = buscarCursoPorSlug(slug);
  const [indiceFaqAberto, setIndiceFaqAberto] = useState(0);
  const linkWhatsappCurso = curso ? montarLinkWhatsappCurso(curso.titulo, curso.precoEmReais) : "#";

  const dadosEstruturadosCurso = useMemo(() => {
    if (!curso) return null;

    return {
      "@context": "https://schema.org",
      "@type": "Course",
      name: curso.titulo,
      description: curso.descricaoCompleta,
      provider: {
        "@type": "Organization",
        name: "Douglas Paiani",
        url: "https://douglaspaiani.com.br",
      },
      offers: {
        "@type": "Offer",
        price: curso.precoEmReais,
        priceCurrency: "BRL",
        availability: "https://schema.org/InStock",
        url: `https://douglaspaiani.com.br/cursos/${curso.slug}`,
      },
    };
  }, [curso]);

  if (!curso) {
    return (
      <main className="bg-black min-h-screen pt-32 pb-20 px-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/70 text-lg">Curso não encontrado.</p>
          <Link
            to="/cursos"
            className="inline-flex items-center gap-2 mt-5 px-5 py-3 rounded-xl bg-cyan-500 text-black font-bold text-sm"
          >
            <ArrowLeft size={16} />
            Voltar para Cursos
          </Link>
        </div>
      </main>
    );
  }

  const blocosConteudoCurso: BlocoConteudoCurso[] = [
    {
      id: "chamado-ideia-pronta",
      selo: "Aula Personalizada",
      titulo: curso.slug === "sites-elite-inteligencia-artificial"
        ? "Traga sua ideia de site para aula e saia com ele pronto"
        : "Traga sua ideia para aula e saia com ela pronta",
      descricao: curso.slug === "sites-elite-inteligencia-artificial"
        ? "Você chega com um conceito inicial e sai com seu site estruturado, com páginas definidas e direção de execução."
        : "Você chega com um conceito inicial e sai com um MVP estruturado, com fluxo definido e direção de execução.",
      complemento: curso.slug === "sites-elite-inteligencia-artificial"
        ? "A mentoria é prática, focada em transformar sua ideia em um site de alto nível pronto para publicar."
        : "A mentoria é prática, focada em tirar ambiguidade e transformar sua ideia em um plano de ação publicável.",
      destaques: curso.slug === "sites-elite-inteligencia-artificial"
        ? [
            "Diagnóstico rápido do posicionamento e público do site",
            "Definição objetiva das páginas e estrutura principal",
            "Plano para publicar um site profissional com segurança",
          ]
        : [
            "Diagnóstico rápido da ideia e do nicho",
            "Definição objetiva do recorte da primeira versão",
            "Plano para lançar, validar e evoluir com segurança",
          ],
      tipoVisual: "ideia-pronta",
    },
    {
      id: "conceito-mvp",
      selo: "Base Estratégica",
      titulo: curso.slug === "sites-elite-inteligencia-artificial"
        ? "Entenda como criar um Site Elite com Inteligência Artificial"
        : "Entenda o que é um MVP e como ele acelera seu resultado",
      descricao: curso.definicaoMvp,
      complemento: curso.slug === "sites-elite-inteligencia-artificial"
        ? "Você aprende a combinar estrutura, design e copy com IA para lançar um site profissional sem desperdício de tempo."
        : "Você aprende a separar o essencial do excesso, evitando desperdício de tempo e investimento antes da validação.",
      destaques: curso.slug === "sites-elite-inteligencia-artificial"
        ? [
            "Estratégia clara para posicionar seu site",
            "Execução premium com apoio da IA",
            "Entrega final pronta para publicar",
          ]
        : [
            "Menos complexidade e mais velocidade",
            "Validação real com usuários em estágio inicial",
            "Evolução orientada por dados e feedback",
          ],
      tipoVisual: "mvp-pratico",
    },
    {
      id: "trilha-aprendizado",
      selo: "Aplicação Imediata",
      titulo: curso.slug === "sites-elite-inteligencia-artificial"
        ? "Em 1 aula você cria seu site completo e sai com ele pronto"
        : "Em até 2h você aprende a criar um MVP do zero sem programar",
      descricao: curso.tempoAprendizado,
      complemento:
        "O processo combina IA e no-code para você sair da aula com clareza técnica e próximos passos bem definidos.",
      destaques: curso.beneficios.slice(0, 3),
      tipoVisual: "trilha-2h",
    },
  ];

  return (
    <main className="bg-black min-h-screen pt-32 pb-24 px-6 overflow-x-hidden">
      <Helmet>
        <title>{curso.titulo} | Cursos | Douglas Paiani</title>
        <meta
          name="description"
          content="Aprenda em até 2 horas a criar um MVP do zero sem programar com IA e no-code. Aula particular online de 1h por 199 reais."
        />
        <meta property="og:title" content={`${curso.titulo} | Douglas Paiani`} />
        <meta
          property="og:description"
          content="Curso intensivo para construir um MVP funcional sem programação, com estratégia de produto e execução prática."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://douglaspaiani.com.br/cursos/${curso.slug}`} />
        <link rel="canonical" href={`https://douglaspaiani.com.br/cursos/${curso.slug}`} />
        {dadosEstruturadosCurso && (
          <script type="application/ld+json">{JSON.stringify(dadosEstruturadosCurso)}</script>
        )}
      </Helmet>

      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 mix-blend-screen">
          <MatrixRain colorClass="text-blue-400" opacity="opacity-[0.2]" columns={36} />
        </div>
        <div className="absolute inset-0 mix-blend-screen blur-[0.4px]">
          <MatrixRain colorClass="text-cyan-300" opacity="opacity-[0.13]" columns={24} />
        </div>
        <div className="absolute inset-0 mix-blend-screen">
          <MatrixRain colorClass="text-sky-300" opacity="opacity-[0.08]" columns={14} />
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(59,130,246,0.28),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_84%_24%,rgba(6,182,212,0.2),transparent_48%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,8,20,0.14),rgba(0,0,0,0.45))]" />

        <motion.div
          animate={{ opacity: [0.16, 0.42, 0.16], scale: [1, 1.06, 1] }}
          transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 right-0 w-[58rem] h-[58rem] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.22),transparent_60%)]"
        />
        <motion.div
          animate={{ x: ["-15%", "15%", "-15%"], opacity: [0.08, 0.18, 0.08] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-12 left-0 w-[56rem] h-[24rem] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.2),transparent_65%)]"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <Link
          to="/cursos"
          className="inline-flex items-center gap-2 text-white/40 hover:text-cyan-400 transition-colors text-xs font-black uppercase tracking-[0.18em] mb-10"
        >
          <ArrowLeft size={16} />
          Voltar para Cursos
        </Link>

        <section className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start mb-20">
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-[10px] uppercase tracking-[0.2em] font-black mb-6"
            >
              <Sparkles size={12} />
              Formação Intensiva
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight"
            >
              {curso.titulo}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mt-6 text-lg text-white/60 leading-relaxed max-w-3xl"
            >
              {curso.descricaoCompleta}
            </motion.p>

            <div className="mt-8 flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/20 bg-white/[0.08] backdrop-blur-xl text-white/85 text-sm">
                <Clock3 size={16} className="text-cyan-400" />
                Aprenda em até 2h
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/20 bg-white/[0.08] backdrop-blur-xl text-white/85 text-sm">
                <BrainCircuit size={16} className="text-cyan-400" />
                Sem programar
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/20 bg-white/[0.08] backdrop-blur-xl text-white/85 text-sm">
                <Gauge size={16} className="text-cyan-400" />
                IA + No-Code
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative overflow-hidden rounded-3xl border border-white/22 bg-cyan-500/[0.1] backdrop-blur-2xl p-7 shadow-[0_24px_70px_rgba(0,0,0,0.4)]"
            >
              <div className="absolute -top-20 -right-20 w-52 h-52 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.25),transparent_70%)]" />

              <p className="text-cyan-200 text-[10px] uppercase tracking-[0.2em] font-black">Aula Particular</p>
              <div className="relative z-10 mt-2 flex items-end gap-2">
                <p className="text-white text-5xl md:text-6xl font-black tracking-tighter leading-none">
                  {formatarPrecoEmReais(curso.precoEmReais)}
                </p>
                <span className="mb-1 px-2.5 py-1 rounded-full border border-cyan-400/35 bg-cyan-500/10 text-cyan-200 text-[10px] font-black uppercase tracking-[0.16em]">
                  por aula
                </span>
              </div>

              <p className="relative z-10 text-white/90 mt-3 text-lg font-semibold">Duração de 1 hora</p>
              <p className="relative z-10 text-white/65 mt-1">{curso.duracaoAulaParticular}</p>

              <div className="relative z-10 mt-4 rounded-2xl border border-cyan-300/35 bg-cyan-500/[0.1] backdrop-blur-xl p-3">
                <p className="text-cyan-100 text-sm leading-relaxed">
                  Pacotes com mais horas disponíveis com preços especiais.
                </p>
              </div>

              <div className="relative z-10 mt-3 rounded-2xl border border-emerald-300/35 bg-emerald-500/[0.14] backdrop-blur-xl p-3">
                <p className="text-emerald-200 text-sm leading-relaxed font-semibold">
                  Pagamento parcelado em até 6x no cartão de crédito.
                </p>
              </div>

              <div className="relative z-10 mt-3 rounded-2xl border border-white/20 bg-white/[0.1] backdrop-blur-xl p-3">
                <p className="text-white/85 text-sm font-semibold">Horários disponíveis para aulas</p>
                <div className="mt-2 space-y-1.5 text-white/70 text-sm">
                  <p className="flex items-start gap-2">
                    <Clock3 size={14} className="text-cyan-300 mt-0.5 shrink-0" />
                    Segunda a sexta: das 19h às 00h
                  </p>
                  <p className="flex items-start gap-2">
                    <Clock3 size={14} className="text-cyan-300 mt-0.5 shrink-0" />
                    Finais de semana: a qualquer horário
                  </p>
                </div>
              </div>

              <a
                href={linkWhatsappCurso}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 group mt-6 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-cyan-500 text-black text-xs font-black uppercase tracking-[0.18em]"
              >
                Quero Reservar Minha Aula
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          </div>
        </section>

        <section className="mb-20 space-y-7">
          {blocosConteudoCurso.map((bloco, indice) => {
            const textoPrimeiro = indice % 2 === 0;
            const blocoAplicacaoImediata = bloco.id === "trilha-aprendizado";

            return (
              <motion.article
                key={bloco.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: indice * 0.06 }}
                className={`relative overflow-hidden rounded-[34px] border border-white/22 backdrop-blur-2xl p-6 md:p-8 lg:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.35)] ${
                  blocoAplicacaoImediata
                    ? "bg-cyan-500/[0.08]"
                    : "bg-white/[0.07]"
                }`}
              >
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(120deg,rgba(255,255,255,0.05),transparent_30%,transparent_70%,rgba(34,211,238,0.08))]" />
                <div className="absolute -top-20 -right-12 w-72 h-72 pointer-events-none rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.16),transparent_65%)]" />

                <div className="relative z-10 grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                  <div className={`lg:col-span-6 ${textoPrimeiro ? "lg:order-1" : "lg:order-2"}`}>
                    <p className="inline-flex items-center gap-2 text-cyan-300 text-[10px] uppercase tracking-[0.2em] font-black relative z-10">
                      <Sparkles size={11} />
                      {bloco.selo}
                    </p>
                    <h2 className={`mt-4 text-3xl md:text-4xl font-black tracking-tight leading-tight relative z-10 ${
                      blocoAplicacaoImediata ? "text-cyan-50" : "text-white"
                    }`}>
                      {bloco.titulo}
                    </h2>
                    <p className="mt-4 text-white/68 text-lg leading-relaxed relative z-10">{bloco.descricao}</p>
                    <p className="mt-4 text-white/58 leading-relaxed relative z-10">{bloco.complemento}</p>

                    <div className="mt-6 space-y-2.5 relative z-10">
                      {bloco.destaques.map((destaque) => (
                        <div key={destaque} className="flex items-start gap-2.5 text-white/80">
                          <MessageSquare size={15} className="text-cyan-300 mt-1 shrink-0" />
                          <p className="leading-relaxed">{destaque}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={`lg:col-span-6 ${textoPrimeiro ? "lg:order-2" : "lg:order-1"}`}>
                    {renderizarElementoBlocoConteudo(bloco.tipoVisual, curso)}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </section>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          className="mb-20 relative overflow-hidden rounded-[34px] border border-white/22 bg-cyan-500/[0.09] backdrop-blur-2xl p-7 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
        >
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(120deg,rgba(34,211,238,0.12),transparent_35%,transparent_65%,rgba(34,211,238,0.08))]" />
          <div className="absolute -top-20 -right-10 w-72 h-72 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.22),transparent_70%)]" />

          <div className="relative z-10 grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            <div className="lg:col-span-5">
              <p className="inline-flex items-center gap-2 text-cyan-300 text-[10px] uppercase tracking-[0.2em] font-black">
                <Sparkles size={12} />
                Metodologia Única
              </p>
              <h2 className="mt-4 text-2xl md:text-3xl font-black tracking-tight text-cyan-50 leading-tight">
                Vou te ensinar minha metodologia única para desenvolver sem gastar NADA
              </h2>
              <p className="mt-5 text-white/70 text-lg leading-relaxed">
                Você aprende o processo completo que utilizo para desenvolver projetos digitais sem gastar 1 real na fase inicial,
                com foco em validação, velocidade e decisão inteligente.
              </p>
              <div className="mt-6 rounded-2xl border border-cyan-300/35 bg-cyan-500/[0.1] backdrop-blur-xl p-4">
                <p className="text-cyan-100 font-semibold leading-relaxed">
                  Começamos com estrutura enxuta, testamos rápido e só avançamos investimento quando o mercado responde.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              {etapasMetodologiaExclusiva.map((etapa, indice) => (
                <motion.article
                  key={etapa.titulo}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: indice * 0.08 }}
                  className="rounded-2xl border border-white/18 bg-white/[0.1] backdrop-blur-xl p-5"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl border border-cyan-400/35 bg-cyan-500/12 flex items-center justify-center shrink-0">
                      <etapa.icone size={18} className="text-cyan-300" />
                    </div>
                    <div>
                      <h3 className="text-white text-lg font-bold tracking-tight">{etapa.titulo}</h3>
                      <p className="mt-2 text-white/70 leading-relaxed">{etapa.descricao}</p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </motion.section>

        <section className="mb-6">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-8">Perguntas Frequentes</h2>

          <div className="space-y-3">
            {curso.faq.map((itemFaq, indice) => {
              const estaAberto = indiceFaqAberto === indice;

              return (
                <motion.div
                  key={itemFaq.pergunta}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: indice * 0.04 }}
                  className="rounded-2xl border border-white/18 bg-white/[0.1] backdrop-blur-xl overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setIndiceFaqAberto((valorAtual) => (valorAtual === indice ? -1 : indice))}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4"
                    aria-expanded={estaAberto}
                  >
                    <span className="text-white font-semibold">{itemFaq.pergunta}</span>
                    <span className="text-cyan-300 shrink-0">
                      {estaAberto ? <Minus size={18} /> : <Plus size={18} />}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {estaAberto && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 text-white/65 leading-relaxed">{itemFaq.resposta}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="mt-14 rounded-[30px] border border-white/22 bg-cyan-500/[0.11] backdrop-blur-2xl p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="inline-flex items-center gap-2 text-cyan-200 text-[10px] uppercase tracking-[0.2em] font-black">
                <BadgeCheck size={12} />
                Vagas Limitadas
              </p>
              <h3 className="mt-3 text-2xl md:text-4xl font-black tracking-tight text-white">
                Aula particular online de 1h por {formatarPrecoEmReais(curso.precoEmReais)}
              </h3>
              <p className="mt-3 text-white/75">
                Pacotes de mais horas com preços especiais sob consulta.
              </p>
              <p className="mt-2 text-emerald-200 font-semibold">
                Parcelamento disponível em até 6x no cartão de crédito.
              </p>
              <p className="mt-2 text-white/70">
                Horários: segunda a sexta das 19h às 00h, e finais de semana a qualquer horário.
              </p>
            </div>
            <a
              href={linkWhatsappCurso}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-cyan-500 text-black text-xs font-black uppercase tracking-[0.18em]"
            >
              Garantir Minha Aula
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
