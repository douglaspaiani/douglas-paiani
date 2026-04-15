import { motion } from "motion/react";
import { Helmet } from "react-helmet-async";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Twitter,
  Linkedin,
  Github,
  Instagram,
  Sparkles,
  Brain,
  Cpu,
  Rocket,
  ShieldCheck,
  Filter,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import MatrixRain from "@/src/components/MatrixRain";
import { cn } from "@/src/lib/utils";
import CodeSnippet from "@/src/components/admin/CodeSnippet";
import { Post, Category } from "../types/admin";

interface PostagemRender {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  author: {
    name: string;
    avatar: string;
    cargo: string;
    bio: string;
    instagramUrl: string;
    linkedinUrl: string;
    githubUrl: string;
  };
  category: string;
  tags: string[];
  image: string;
  readTime: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
}

interface PerfilAutorPublico {
  id: string;
  name: string;
  cargo: string;
  bio: string;
  fotoPerfil: string;
  instagramUrl: string;
  linkedinUrl: string;
  githubUrl: string;
}

function removerMarcacoesCodigo(texto: string) {
  return texto.replace(/\[code language=".*?"\](.*?)\[\/code\]/gs, "$1");
}

function removerHtml(texto: string) {
  return texto.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function escaparHtml(texto: string) {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function aplicarFormatacaoInlineMarkdown(texto: string) {
  return texto
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, '<code class="px-1.5 py-0.5 rounded bg-white/10 text-cyan-300">$1</code>')
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-cyan-400 underline">$1</a>',
    );
}

// Converte o conteúdo Markdown em HTML mantendo o padrão visual dos blocos no frontend.
function converterMarkdownParaHtml(conteudo: string) {
  const linhas = conteudo.replace(/\r\n/g, "\n").split("\n");
  const blocos: string[] = [];
  let listaAberta = false;

  const fecharListaSeNecessario = () => {
    if (listaAberta) {
      blocos.push("</ul>");
      listaAberta = false;
    }
  };

  for (const linhaOriginal of linhas) {
    const linha = linhaOriginal.trim();

    if (!linha) {
      fecharListaSeNecessario();
      continue;
    }

    // Permite HTML manual no conteúdo para casos avançados.
    if (linha.startsWith("<")) {
      fecharListaSeNecessario();
      blocos.push(linhaOriginal);
      continue;
    }

    const linhaEscapada = aplicarFormatacaoInlineMarkdown(escaparHtml(linha));

    if (linha.startsWith("#### ")) {
      fecharListaSeNecessario();
      blocos.push(`<h4>${linhaEscapada.replace(/^####\s+/, "")}</h4>`);
      continue;
    }

    if (linha.startsWith("### ")) {
      fecharListaSeNecessario();
      blocos.push(`<h3>${linhaEscapada.replace(/^###\s+/, "")}</h3>`);
      continue;
    }

    if (linha.startsWith("## ")) {
      fecharListaSeNecessario();
      blocos.push(`<h2>${linhaEscapada.replace(/^##\s+/, "")}</h2>`);
      continue;
    }

    if (linha.startsWith("# ")) {
      fecharListaSeNecessario();
      blocos.push(`<h1>${linhaEscapada.replace(/^#\s+/, "")}</h1>`);
      continue;
    }

    if (linha.startsWith("> ")) {
      fecharListaSeNecessario();
      blocos.push(`<blockquote><p>${linhaEscapada.replace(/^>\s+/, "")}</p></blockquote>`);
      continue;
    }

    if (linha.startsWith("- ")) {
      if (!listaAberta) {
        blocos.push('<ul class="list-disc pl-6">');
        listaAberta = true;
      }
      blocos.push(`<li>${linhaEscapada.replace(/^-\s+/, "")}</li>`);
      continue;
    }

    fecharListaSeNecessario();
    blocos.push(`<p>${linhaEscapada}</p>`);
  }

  fecharListaSeNecessario();
  return blocos.join("\n");
}

function montarResumo(conteudo: string, tamanho = 170) {
  const textoLimpo = removerHtml(removerMarcacoesCodigo(conteudo));
  if (textoLimpo.length <= tamanho) return textoLimpo;
  return `${textoLimpo.slice(0, tamanho).trim()}...`;
}

function calcularTempoLeitura(conteudo: string) {
  const textoLimpo = removerHtml(removerMarcacoesCodigo(conteudo));
  const quantidadePalavras = textoLimpo.split(/\s+/).filter(Boolean).length;
  const minutos = Math.max(1, Math.ceil(quantidadePalavras / 200));
  return `${minutos} min`;
}

function extrairTags(seoKeywords?: string | null) {
  if (!seoKeywords) return [];
  return seoKeywords
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function mapearPostagem(postagem: Post, categorias: Category[], perfilAutor?: PerfilAutorPublico | null): PostagemRender {
  const categoriaNome = categorias.find((categoria) => categoria.id === postagem.categoryId)?.name || "Geral";
  const autorPadrao = {
    name: "Douglas Paiani",
    cargo: "Autor & Engenheiro",
    bio: "Engenheiro de Software com 15 anos de experiência, especialista em IA e criador de SaaS de alto nível.",
    avatar: "https://picsum.photos/seed/douglas/100/100",
    instagramUrl: "https://instagram.com/douglaspaiani",
    linkedinUrl: "https://www.linkedin.com/in/douglaspaiani/",
    githubUrl: "https://github.com/douglaspaiani",
  };
  const autor = perfilAutor
    ? {
        name: perfilAutor.name,
        cargo: perfilAutor.cargo,
        bio: perfilAutor.bio,
        avatar: perfilAutor.fotoPerfil,
        instagramUrl: perfilAutor.instagramUrl,
        linkedinUrl: perfilAutor.linkedinUrl,
        githubUrl: perfilAutor.githubUrl,
      }
    : autorPadrao;

  return {
    id: postagem.id,
    title: postagem.title,
    slug: postagem.slug,
    excerpt: montarResumo(postagem.content),
    content: postagem.content,
    date: new Date(postagem.createdAt).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    author: autor,
    category: categoriaNome,
    tags: extrairTags(postagem.seoKeywords),
    image: `https://picsum.photos/seed/${postagem.slug}/1200/600`,
    readTime: calcularTempoLeitura(postagem.content),
    seoTitle: postagem.seoTitle || undefined,
    seoDescription: postagem.seoDescription || undefined,
    seoKeywords: postagem.seoKeywords || undefined,
  };
}

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [postagemAtual, setPostagemAtual] = useState<PostagemRender | null>(null);
  const [postagensApi, setPostagensApi] = useState<Post[]>([]);
  const [categoriasApi, setCategoriasApi] = useState<Category[]>([]);
  const [perfilAutor, setPerfilAutor] = useState<PerfilAutorPublico | null>(null);

  useEffect(() => {
    const carregarDadosPostagem = async () => {
      if (!slug) return;

      try {
        const [respostaPostagem, respostaPostagens, respostaCategorias, respostaAutor] = await Promise.all([
          fetch(`/api/posts/slug/${slug}`),
          fetch("/api/posts"),
          fetch("/api/categories"),
          fetch("/api/publico/autor"),
        ]);

        if (!respostaPostagem.ok) {
          navigate("/blog");
          return;
        }

        const dadosCategorias: Category[] = respostaCategorias.ok ? await respostaCategorias.json() : [];
        const dadosPostagens: Post[] = respostaPostagens.ok ? await respostaPostagens.json() : [];
        const dadosPostagem: Post = await respostaPostagem.json();
        const dadosAutor: PerfilAutorPublico | null = respostaAutor.ok ? await respostaAutor.json() : null;

        setCategoriasApi(dadosCategorias);
        setPostagensApi(dadosPostagens);
        setPerfilAutor(dadosAutor);
        setPostagemAtual(mapearPostagem(dadosPostagem, dadosCategorias, dadosAutor));
      } catch (erro) {
        console.error(erro);
        navigate("/blog");
      }
    };

    carregarDadosPostagem();
  }, [slug, navigate]);

  useEffect(() => {
    if (postagemAtual) window.scrollTo(0, 0);
  }, [postagemAtual]);

  useEffect(() => {
    if (!slug) return;

    const chaveControle = `controle_acesso_postagem_${slug}`;
    const agora = Date.now();
    const ultimoRegistro = Number(sessionStorage.getItem(chaveControle) || "0");

    // Evita duplicidade imediata em ambiente de desenvolvimento/Strict Mode.
    if (agora - ultimoRegistro < 10000) return;

    sessionStorage.setItem(chaveControle, agora.toString());
    fetch(`/api/analytics/postagens/${slug}`, { method: "POST" }).catch(() => {});
  }, [slug]);

  const postagensRelacionadas = useMemo(() => {
    if (!postagemAtual) return [];

    return postagensApi
      .filter((postagem) => postagem.id !== postagemAtual.id)
      .map((postagem) => mapearPostagem(postagem, categoriasApi, perfilAutor))
      .filter((postagem) => postagem.category === postagemAtual.category)
      .slice(0, 2);
  }, [postagensApi, categoriasApi, postagemAtual, perfilAutor]);

  const categoriasComTotal = useMemo(() => {
    const postagensMapeadas = postagensApi.map((postagem) =>
      mapearPostagem(postagem, categoriasApi, perfilAutor),
    );
    return categoriasApi.map((categoria) => ({
      nome: categoria.name,
      total: postagensMapeadas.filter((postagem) => postagem.category === categoria.name).length,
    }));
  }, [categoriasApi, postagensApi, perfilAutor]);

  const renderizarConteudo = (conteudo: string) => {
    const partes = conteudo.split(/(\[code language=".*?"\].*?\[\/code\])/gs);
    return partes.map((parte, indice) => {
      const trechoCodigo = parte.match(/\[code language="(.*?)"\](.*?)\[\/code\]/s);
      if (trechoCodigo) {
        const [, linguagem, codigo] = trechoCodigo;
        return <CodeSnippet key={indice} language={linguagem} code={codigo.trim()} />;
      }
      return <div key={indice} dangerouslySetInnerHTML={{ __html: converterMarkdownParaHtml(parte) }} />;
    });
  };

  if (!postagemAtual) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Carregando...</div>;
  }

  return (
    <main className="bg-black min-h-screen pt-32 pb-24 px-6 overflow-x-hidden">
      <Helmet>
        <title>{postagemAtual.seoTitle || `${postagemAtual.title} | Blog | Douglas Paiani Systems`}</title>
        <meta name="description" content={postagemAtual.seoDescription || postagemAtual.excerpt} />
        {postagemAtual.seoKeywords && <meta name="keywords" content={postagemAtual.seoKeywords} />}
        <meta property="og:title" content={postagemAtual.seoTitle || postagemAtual.title} />
        <meta property="og:description" content={postagemAtual.seoDescription || postagemAtual.excerpt} />
        <meta property="og:image" content={postagemAtual.image} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="fixed inset-0 z-0 pointer-events-none">
        <MatrixRain colorClass="text-cyan-500" opacity="opacity-[0.03]" columns={20} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.1),transparent_50%)]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-white/40 hover:text-cyan-400 transition-all mb-12 group text-xs font-bold uppercase tracking-widest"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Voltar para o Blog
        </Link>

        <header className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8"
          >
            <Sparkles size={12} />
            {postagemAtual.category}
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter leading-tight">{postagemAtual.title}</h1>

          <div className="flex flex-wrap items-center gap-8 pt-8 border-t border-white/5">
            <div className="flex items-center gap-4">
              <img
                src={postagemAtual.author.avatar}
                alt={postagemAtual.author.name}
                className="w-12 h-12 rounded-full border border-white/10"
              />
              <div>
                <p className="text-white font-bold text-sm tracking-tight">{postagemAtual.author.name}</p>
                <p className="text-white/30 text-[10px] uppercase tracking-widest font-bold">{postagemAtual.author.cargo}</p>
              </div>
            </div>
            <div className="flex items-center gap-8 text-white/30 text-[10px] font-bold uppercase tracking-[0.2em]">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} /> {postagemAtual.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} /> {postagemAtual.readTime} de leitura
              </span>
            </div>
          </div>
        </header>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative aspect-video rounded-[40px] overflow-hidden mb-16 border border-white/10"
        >
          <img
            src={postagemAtual.image}
            alt={postagemAtual.title}
            className="w-full h-full object-cover opacity-80"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8">
            <div
              className="article-content conteudo-blog-formatado max-w-none"
            >
              {renderizarConteudo(postagemAtual.content)}
            </div>

            <div className="mt-16 pt-12 border-t border-white/5">
              <div className="flex flex-wrap gap-2">
                {postagemAtual.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/40 text-[10px] font-bold uppercase tracking-widest"
                  >
                    #{tag}
                  </span>
                ))}
                {postagemAtual.tags.length === 0 && (
                  <span className="text-white/30 text-xs">Sem tags cadastradas para esta postagem.</span>
                )}
              </div>
            </div>

            <div className="mt-12 flex items-center gap-6">
              <span className="text-white/20 text-[10px] font-bold uppercase tracking-[0.3em]">Compartilhar:</span>
              <div className="flex gap-4">
                <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-cyan-400 hover:border-cyan-500/50 transition-all">
                  <Twitter size={18} />
                </button>
                <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-cyan-400 hover:border-cyan-500/50 transition-all">
                  <Linkedin size={18} />
                </button>
                <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-cyan-400 hover:border-cyan-500/50 transition-all">
                  <Github size={18} />
                </button>
                <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-cyan-400 hover:border-cyan-500/50 transition-all">
                  <Share2 size={18} />
                </button>
              </div>
            </div>

            <div className="mt-16 rounded-[28px] border border-white/10 bg-white/5 p-8">
              <p className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Sobre mim</p>
              <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
                <img
                  src={postagemAtual.author.avatar}
                  alt={postagemAtual.author.name}
                  className="w-20 h-20 rounded-full border border-cyan-500/40 object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-white text-xl font-bold tracking-tight">{postagemAtual.author.name}</h3>
                  <p className="text-white/40 text-xs uppercase tracking-widest font-bold mt-1">{postagemAtual.author.cargo}</p>
                  <p className="text-white/70 text-sm leading-relaxed mt-3">{postagemAtual.author.bio}</p>
                  <div className="flex items-center gap-3 mt-4">
                    <a href={postagemAtual.author.instagramUrl} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-cyan-400 hover:border-cyan-500/50 transition-all"><Instagram size={16} /></a>
                    <a href={postagemAtual.author.linkedinUrl} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-cyan-400 hover:border-cyan-500/50 transition-all"><Linkedin size={16} /></a>
                    <a href={postagemAtual.author.githubUrl} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-cyan-400 hover:border-cyan-500/50 transition-all"><Github size={16} /></a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-4 space-y-12">
            <div className="p-8 rounded-[32px] bg-white/5 border border-white/10">
              <h3 className="text-white font-bold mb-6 flex items-center gap-2 text-sm uppercase tracking-widest">
                <Filter size={16} className="text-cyan-400" /> Categorias
              </h3>
              <div className="space-y-2">
                <Link
                  to="/blog"
                  className="w-full px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border border-white/10 text-white/40 hover:border-white/20 hover:text-white flex items-center justify-between group"
                >
                  Todas
                  <span className="text-[10px] opacity-50 text-white/40">{postagensApi.length}</span>
                </Link>
                {categoriasComTotal.map((categoria) => (
                  <Link
                    key={categoria.nome}
                    to="/blog"
                    state={{ category: categoria.nome }}
                    className={cn(
                      "w-full px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border flex items-center justify-between group",
                      postagemAtual.category === categoria.nome
                        ? "bg-cyan-500 text-black border-cyan-500"
                        : "bg-white/5 text-white/40 border-white/10 hover:border-white/20 hover:text-white",
                    )}
                  >
                    {categoria.nome}
                    <span
                      className={cn(
                        "text-[10px] opacity-50",
                        postagemAtual.category === categoria.nome ? "text-black" : "text-white/40",
                      )}
                    >
                      {categoria.total}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <a
              href={postagemAtual.author.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-8 rounded-[32px] bg-gradient-to-br from-cyan-500/15 via-cyan-500/5 to-transparent border border-cyan-500/30 hover:border-cyan-400 transition-all"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300/80 mb-3">Instagram</p>
              <h3 className="text-white font-black text-xl leading-tight">
                Acompanhe meu perfil no Instagram
              </h3>
              <span className="mt-5 inline-flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase tracking-widest group-hover:text-cyan-200 transition-colors">
                <Instagram size={14} />
                Abrir perfil
              </span>
            </a>

            {postagensRelacionadas.length > 0 && (
              <div className="space-y-8">
                <h3 className="text-white font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                  <Rocket size={16} className="text-cyan-400" /> Relacionados
                </h3>
                {postagensRelacionadas.map((postagemRelacionada) => (
                  <Link key={postagemRelacionada.id} to={`/blog/${postagemRelacionada.slug}`} className="group block space-y-4">
                    <div className="aspect-video rounded-2xl overflow-hidden border border-white/10">
                      <img
                        src={postagemRelacionada.image}
                        alt={postagemRelacionada.title}
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                      />
                    </div>
                    <h4 className="text-white font-bold text-sm group-hover:text-cyan-400 transition-colors line-clamp-2 leading-tight">
                      {postagemRelacionada.title}
                    </h4>
                  </Link>
                ))}
              </div>
            )}

            <div className="p-8 rounded-[32px] bg-white/5 border border-white/10">
              <h3 className="text-white font-bold mb-6 flex items-center gap-2 text-sm uppercase tracking-widest">
                <Brain size={16} className="text-cyan-400" /> Neural Core
              </h3>
              <div className="space-y-4">
                {[
                  { icon: Cpu, label: "Processing", val: "Optimal" },
                  { icon: ShieldCheck, label: "Security", val: "Encrypted" },
                ].map((item, indice) => (
                  <div key={indice} className="flex items-center justify-between p-4 rounded-xl bg-black border border-white/5">
                    <div className="flex items-center gap-3">
                      <item.icon size={16} className="text-cyan-400/60" />
                      <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{item.label}</span>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400">{item.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
