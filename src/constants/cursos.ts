export interface CursoSite {
  slug: string;
  titulo: string;
  subtitulo: string;
  descricaoCurta: string;
  descricaoCompleta: string;
  definicaoMvp: string;
  tempoAprendizado: string;
  duracaoAulaParticular: string;
  precoEmReais: number;
  beneficios: string[];
  trilhaAprendizado: string[];
  faq: Array<{ pergunta: string; resposta: string }>;
}

export const cursosDisponiveis: CursoSite[] = [
  {
    slug: "programacao-mvp-inteligencia-artificial-no-code",
    titulo: "Programação MVP com Inteligência Artificial (No-Code)",
    subtitulo:
      "Aprenda a tirar uma ideia do papel e lançar uma primeira versão funcional sem programar.",
    descricaoCurta:
      "Método direto para criar um MVP validável com IA e ferramentas no-code, mesmo começando do zero.",
    descricaoCompleta:
      "Neste curso você vai aprender um processo prático para estruturar, desenhar e publicar um MVP completo usando Inteligência Artificial e plataformas no-code. O foco é ganhar velocidade, validar a ideia e chegar ao mercado com clareza.",
    definicaoMvp:
      "MVP significa Produto Mínimo Viável: a versão mais enxuta de um produto que já resolve um problema real e permite validar rapidamente a aceitação do mercado.",
    tempoAprendizado:
      "Em até 2h você aprende o passo a passo para criar um MVP do zero, sem programar.",
    duracaoAulaParticular: "Aula particular online de 1h",
    precoEmReais: 199,
    beneficios: [
      "Clareza para transformar uma ideia em produto de verdade",
      "Ganhar velocidade com IA para construir estrutura, fluxo e páginas",
      "Evitar erros comuns de quem tenta lançar sem método",
      "Validar hipótese com uma versão enxuta antes de grandes investimentos",
      "Aprender um framework reaplicável em novos projetos",
      "Mentoria direta para sair da aula com plano acionável",
    ],
    trilhaAprendizado: [
      "Definição estratégica do MVP e recorte da primeira versão",
      "Mapeamento da jornada do usuário e fluxos essenciais",
      "Uso de IA para estrutura, copy e validação de proposta",
      "Montagem prática no-code com foco em publicação rápida",
      "Checklist de validação para lançar com confiança",
      "Próximos passos para evoluir o MVP após feedback inicial",
    ],
    faq: [
      {
        pergunta: "Preciso saber programar para fazer o curso?",
        resposta:
          "Não. O curso foi criado para quem quer construir um MVP sem código, usando ferramentas no-code e IA guiada.",
      },
      {
        pergunta: "Em quanto tempo realmente consigo aplicar?",
        resposta:
          "Você já sai com um roteiro prático e pode começar a construir no mesmo dia. A metodologia foi desenhada para aplicação imediata.",
      },
      {
        pergunta: "A aula é gravada ou ao vivo?",
        resposta:
          "A aula é particular, online e ao vivo, com duração de 1 hora e foco total no seu objetivo.",
      },
      {
        pergunta: "Quanto custa a aula particular?",
        resposta:
          "O investimento é de 199 reais pela aula particular online de 1 hora, com parcelamento em até 6x no cartão de crédito.",
      },
      {
        pergunta: "Quais são os horários disponíveis para as aulas?",
        resposta:
          "As aulas estão disponíveis de segunda a sexta, das 19h às 00h. Nos finais de semana, há disponibilidade em qualquer horário.",
      },
      {
        pergunta: "Como funciona a metodologia de desenvolver sem gastar 1 real?",
        resposta:
          "Você aprende a estruturar e validar o MVP usando ferramentas no-code e IA na fase inicial, reduzindo custo antes de investir em etapas mais avançadas.",
      },
      {
        pergunta: "Vou sair com MVP pronto?",
        resposta:
          "Você sai com estrutura, direção e execução encaminhada para concluir e publicar seu MVP com mais segurança e velocidade.",
      },
      {
        pergunta: "Esse curso serve para qualquer nicho?",
        resposta:
          "Sim. O método funciona para diferentes modelos de negócio, desde produtos digitais até serviços especializados.",
      },
    ],
  },
  {
    slug: "sites-elite-inteligencia-artificial",
    titulo: "Sites Elite com Inteligência Artificial",
    subtitulo:
      "Aprenda em apenas 1 aula a criar seu site completo com posicionamento premium e acabamento profissional.",
    descricaoCurta:
      "Treinamento prático para você sair da aula com seu site de alto nível pronto, usando IA para acelerar criação e conteúdo.",
    descricaoCompleta:
      "Neste curso você aprende meu método para construir um site completo com padrão elite em uma única aula. O foco é estrutura estratégica, design de alto nível, copy inteligente com IA e publicação final com qualidade profissional.",
    definicaoMvp:
      "Um Site Elite é uma presença digital de alto nível, com identidade forte, comunicação clara e estrutura pronta para gerar autoridade e conversão.",
    tempoAprendizado:
      "Aprenda em apenas 1 aula a criar seu site completo e sair com ele pronto.",
    duracaoAulaParticular: "Aula particular online de 1h",
    precoEmReais: 199,
    beneficios: [
      "Sair da aula com seu site de alto nível pronto",
      "Aplicar IA para escrever conteúdos mais persuasivos",
      "Criar estrutura profissional sem travar em decisões técnicas",
      "Montar páginas com foco em autoridade e conversão",
      "Aprender um processo replicável para novos sites",
      "Receber direção prática para publicar com segurança",
    ],
    trilhaAprendizado: [
      "Definição do posicionamento e objetivo do site",
      "Estrutura das seções principais para conversão",
      "Criação de textos estratégicos com IA",
      "Construção visual com acabamento premium",
      "Ajustes finais de performance e responsividade",
      "Publicação do site com checklist profissional",
    ],
    faq: [
      {
        pergunta: "Preciso saber programar para fazer esse curso?",
        resposta:
          "Não. O método foi desenhado para execução prática com IA e ferramentas visuais, sem necessidade de programação.",
      },
      {
        pergunta: "Em uma aula eu realmente consigo sair com o site pronto?",
        resposta:
          "Sim. A aula é intensiva e estruturada para você concluir seu site completo com padrão de alto nível.",
      },
      {
        pergunta: "Quanto custa a aula particular?",
        resposta:
          "O valor é 199 reais por aula particular online de 1 hora, com parcelamento em até 6x no cartão de crédito.",
      },
      {
        pergunta: "Quais são os horários disponíveis para as aulas?",
        resposta:
          "As aulas acontecem de segunda a sexta, das 19h às 00h. Nos finais de semana, há disponibilidade em qualquer horário.",
      },
      {
        pergunta: "Existem pacotes com mais horas?",
        resposta:
          "Sim. Você pode contratar pacotes de horas adicionais com condições especiais para evoluir seu projeto.",
      },
    ],
  },
];

export function buscarCursoPorSlug(slug?: string) {
  if (!slug) return null;
  return cursosDisponiveis.find((curso) => curso.slug === slug) ?? null;
}
