import { motion, AnimatePresence } from "motion/react";
import { Helmet } from "react-helmet-async";
import {
  Search,
  Calendar,
  Clock,
  ArrowRight,
  ArrowLeft,
  Tag,
  Filter,
  Sparkles,
  Brain,
  Cpu,
  Rocket,
  ShieldCheck,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/src/lib/utils";
import MatrixRain from "@/src/components/MatrixRain";
import { Post, Category } from "../types/admin";

const POSTS_POR_PAGINA = 2;

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
  };
  category: string;
  tags: string[];
  image: string;
  readTime: string;
  createdAt: string;
}

interface PerfilAutorPublicoBlog {
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

function removerMarkdown(texto: string) {
  return texto
    .replace(/!\[.*?\]\(.*?\)/g, " ")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/[*_~`>#-]/g, " ");
}

function montarResumo(conteudo: string, tamanho = 170) {
  const textoLimpo = removerMarkdown(removerHtml(removerMarcacoesCodigo(conteudo))).replace(/\s+/g, " ").trim();
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

export default function Blog() {
  const location = useLocation();
  const [pesquisa, setPesquisa] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | "Todas">("Todas");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [postagensApi, setPostagensApi] = useState<Post[]>([]);
  const [categoriasApi, setCategoriasApi] = useState<Category[]>([]);
  const [perfilAutorBlog, setPerfilAutorBlog] = useState<PerfilAutorPublicoBlog | null>(null);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [respostaPostagens, respostaCategorias, respostaAutor] = await Promise.all([
          fetch("/api/posts"),
          fetch("/api/categories"),
          fetch("/api/publico/autor"),
        ]);

        if (respostaPostagens.ok) setPostagensApi(await respostaPostagens.json());
        if (respostaCategorias.ok) setCategoriasApi(await respostaCategorias.json());
        if (respostaAutor.ok) setPerfilAutorBlog(await respostaAutor.json());
      } catch (erro) {
        console.error("Erro ao carregar dados do blog:", erro);
      }
    };

    carregarDados();
  }, []);

  useEffect(() => {
    if (location.state && (location.state as any).category) {
      setCategoriaSelecionada((location.state as any).category);
      window.scrollTo(0, 0);
    }
  }, [location]);

  useEffect(() => {
    setPaginaAtual(1);
  }, [pesquisa, categoriaSelecionada]);

  const todasPostagens = useMemo<PostagemRender[]>(() => {
    return postagensApi.map((postagem) => {
      const nomeCategoria = categoriasApi.find((categoria) => categoria.id === postagem.categoryId)?.name || "Geral";
      const tags = extrairTags(postagem.seoKeywords);
      const resumo = montarResumo(postagem.content);

      return {
        id: postagem.id,
        title: postagem.title,
        slug: postagem.slug,
        excerpt: resumo,
        content: postagem.content,
        date: new Date(postagem.createdAt).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        author: {
          name: perfilAutorBlog?.name || "Douglas Paiani",
          avatar: perfilAutorBlog?.fotoPerfil || "https://picsum.photos/seed/douglas/100/100",
        },
        category: nomeCategoria,
        tags,
        image: postagem.imagemDestacada || `https://picsum.photos/seed/${postagem.slug}/1200/600`,
        readTime: calcularTempoLeitura(postagem.content),
        createdAt: postagem.createdAt,
      };
    });
  }, [postagensApi, categoriasApi, perfilAutorBlog]);

  const postagensFiltradas = useMemo(() => {
    return todasPostagens.filter((postagem) => {
      const correspondePesquisa =
        postagem.title.toLowerCase().includes(pesquisa.toLowerCase()) ||
        postagem.excerpt.toLowerCase().includes(pesquisa.toLowerCase()) ||
        postagem.tags.some((tag) => tag.toLowerCase().includes(pesquisa.toLowerCase()));

      const correspondeCategoria =
        categoriaSelecionada === "Todas" || postagem.category === categoriaSelecionada;

      return correspondePesquisa && correspondeCategoria;
    });
  }, [pesquisa, categoriaSelecionada, todasPostagens]);

  const totalPaginas = Math.ceil(postagensFiltradas.length / POSTS_POR_PAGINA);

  const postagensPaginadas = useMemo(() => {
    const inicio = (paginaAtual - 1) * POSTS_POR_PAGINA;
    return postagensFiltradas.slice(inicio, inicio + POSTS_POR_PAGINA);
  }, [postagensFiltradas, paginaAtual]);

  const tagsPopulares = useMemo(() => {
    const tags = new Set<string>();
    todasPostagens.forEach((postagem) => postagem.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags);
  }, [todasPostagens]);

  const listaCategorias = useMemo(() => {
    return categoriasApi.map((categoria) => categoria.name);
  }, [categoriasApi]);

  return (
    <main className="bg-black min-h-screen pt-32 pb-24 px-6 overflow-x-hidden">
      <Helmet>
        <title>Blog Sistêmico | Douglas Paiani - Insights sobre IA & Tecnologia</title>
        <meta
          name="description"
          content="Artigos e insights sobre Inteligência Artificial, Engenharia de Software, SaaS e o futuro da tecnologia por Douglas Paiani."
        />
        <meta property="og:title" content="Blog Sistêmico | Douglas Paiani - Insights sobre IA & Tecnologia" />
        <meta
          property="og:description"
          content="Artigos e insights sobre Inteligência Artificial, Engenharia de Software, SaaS e o futuro da tecnologia por Douglas Paiani."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://douglaspaiani.com.br/blog" />
        <link rel="canonical" href="https://douglaspaiani.com.br/blog" />
      </Helmet>

      <div className="fixed inset-0 z-0 pointer-events-none">
        <MatrixRain colorClass="text-cyan-500" opacity="opacity-[0.03]" columns={20} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.1),transparent_50%)]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-20 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6"
          >
            <Sparkles size={12} />
            Neural Insights & Tech
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">
            BLOG <span className="text-cyan-400">SISTÊMICO.</span>
          </h1>
          <p className="text-white/40 max-w-2xl text-lg font-light leading-relaxed">
            Explorando as fronteiras da Inteligência Artificial, arquiteturas neurais e o futuro do desenvolvimento de software.
          </p>
        </header>

        <div className="mb-16">
          <div className="relative w-full lg:max-w-2xl group mx-auto lg:mx-0">
            <Search
              className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-cyan-400 transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Pesquisar artigos, tags ou tecnologias..."
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 focus:outline-none transition-all duration-300 hover:border-white/20"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-12">
            <AnimatePresence mode="popLayout">
              {postagensPaginadas.length > 0 ? (
                <>
                  <div className="space-y-12">
                    {postagensPaginadas.map((postagem, indice) => (
                      <motion.article
                        key={postagem.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.5, delay: indice * 0.1 }}
                        className="group relative rounded-[40px] bg-[#0a0a0a] border border-white/10 overflow-hidden hover:border-cyan-500/30 transition-all duration-500"
                      >
                        <Link to={`/blog/${postagem.slug}`} className="flex flex-col md:flex-row h-full">
                          <div className="md:w-2/5 relative overflow-hidden">
                            <img
                              src={postagem.image}
                              alt={postagem.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute top-6 left-6 px-3 py-1 rounded-full bg-cyan-500 text-black text-[10px] font-black uppercase tracking-widest">
                              {postagem.category}
                            </div>
                          </div>
                          <div className="md:w-3/5 p-8 md:p-12 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-4 text-white/30 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                                <span className="flex items-center gap-1.5">
                                  <Calendar size={12} /> {postagem.date}
                                </span>
                                <span className="w-1 h-1 rounded-full bg-white/20" />
                                <span className="flex items-center gap-1.5">
                                  <Clock size={12} /> {postagem.readTime}
                                </span>
                              </div>
                              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors duration-300 tracking-tight leading-tight">
                                {postagem.title}
                              </h2>
                              <p className="text-white/40 text-sm leading-relaxed mb-6 line-clamp-2 font-light">
                                {postagem.excerpt}
                              </p>
                            </div>
                            <div className="flex items-center justify-between pt-6 border-t border-white/5">
                              <div className="flex items-center gap-3">
                                <img
                                  src={postagem.author.avatar}
                                  alt={postagem.author.name}
                                  className="w-8 h-8 rounded-full border border-white/10"
                                />
                                <span className="text-white/60 text-xs font-medium">{postagem.author.name}</span>
                              </div>
                              <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                                Ler Artigo <ArrowRight size={14} />
                              </span>
                            </div>
                          </div>
                        </Link>
                      </motion.article>
                    ))}
                  </div>

                  {totalPaginas > 1 && (
                    <div className="flex justify-center items-center gap-4 pt-8">
                      <button
                        onClick={() => setPaginaAtual((valor) => Math.max(valor - 1, 1))}
                        disabled={paginaAtual === 1}
                        className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-cyan-400 hover:border-cyan-500/50 disabled:opacity-20 disabled:hover:text-white/40 disabled:hover:border-white/10 transition-all"
                      >
                        <ArrowLeft size={20} />
                      </button>

                      <div className="flex gap-2">
                        {Array.from({ length: totalPaginas }).map((_, indice) => (
                          <button
                            key={indice}
                            onClick={() => setPaginaAtual(indice + 1)}
                            className={cn(
                              "w-12 h-12 rounded-2xl font-bold text-xs transition-all border",
                              paginaAtual === indice + 1
                                ? "bg-cyan-500 text-black border-cyan-500"
                                : "bg-white/5 text-white/40 border-white/10 hover:border-white/20 hover:text-white",
                            )}
                          >
                            {indice + 1}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => setPaginaAtual((valor) => Math.min(valor + 1, totalPaginas))}
                        disabled={paginaAtual === totalPaginas}
                        className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-cyan-400 hover:border-cyan-500/50 disabled:opacity-20 disabled:hover:text-white/40 disabled:hover:border-white/10 transition-all"
                      >
                        <ArrowRight size={20} />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-20 text-center rounded-[40px] border border-dashed border-white/10"
                >
                  <p className="text-white/20 text-lg">Nenhum artigo encontrado para sua busca.</p>
                  <button
                    onClick={() => {
                      setPesquisa("");
                      setCategoriaSelecionada("Todas");
                    }}
                    className="mt-4 text-cyan-400 text-sm font-bold uppercase tracking-widest hover:underline"
                  >
                    Limpar Filtros
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <aside className="lg:col-span-4 space-y-8">
            <div className="p-8 rounded-[32px] bg-white/5 border border-white/10">
              <h3 className="text-white font-bold mb-6 flex items-center gap-2 text-sm uppercase tracking-widest">
                <Filter size={16} className="text-cyan-400" /> Categorias
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => setCategoriaSelecionada("Todas")}
                  className={cn(
                    "w-full px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border text-left flex items-center justify-between group",
                    categoriaSelecionada === "Todas"
                      ? "bg-cyan-500 text-black border-cyan-500"
                      : "bg-white/5 text-white/40 border-white/10 hover:border-white/20 hover:text-white",
                  )}
                >
                  Todas
                  <span
                    className={cn(
                      "text-[10px] opacity-50",
                      categoriaSelecionada === "Todas" ? "text-black" : "text-white/40",
                    )}
                  >
                    {todasPostagens.length}
                  </span>
                </button>

                {listaCategorias.map((categoria) => {
                  const totalPorCategoria = todasPostagens.filter((postagem) => postagem.category === categoria).length;
                  return (
                    <button
                      key={categoria}
                      onClick={() => setCategoriaSelecionada(categoria)}
                      className={cn(
                        "w-full px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border text-left flex items-center justify-between group",
                        categoriaSelecionada === categoria
                          ? "bg-cyan-500 text-black border-cyan-500"
                          : "bg-white/5 text-white/40 border-white/10 hover:border-white/20 hover:text-white",
                      )}
                    >
                      {categoria}
                      <span
                        className={cn(
                          "text-[10px] opacity-50",
                          categoriaSelecionada === categoria ? "text-black" : "text-white/40",
                        )}
                      >
                        {totalPorCategoria}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-8 rounded-[32px] bg-white/5 border border-white/10">
              <h3 className="text-white font-bold mb-6 flex items-center gap-2 text-sm uppercase tracking-widest">
                <Tag size={16} className="text-cyan-400" /> Tags Populares
              </h3>
              <div className="flex flex-wrap gap-2">
                {tagsPopulares.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setPesquisa(tag)}
                    className="px-3 py-1.5 rounded-lg bg-black border border-white/10 text-white/40 text-[10px] font-bold uppercase hover:border-cyan-500/50 hover:text-white transition-all"
                  >
                    #{tag}
                  </button>
                ))}
                {tagsPopulares.length === 0 && (
                  <p className="text-white/30 text-xs">Ainda sem tags cadastradas.</p>
                )}
              </div>
            </div>

            <div className="p-8 rounded-[32px] bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 relative overflow-hidden group">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-cyan-500/10 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-1000" />
              <h3 className="text-white font-bold mb-4 relative z-10">Neural Newsletter</h3>
              <p className="text-white/40 text-xs leading-relaxed mb-6 relative z-10 font-light">
                Receba insights exclusivos sobre IA e tecnologia diretamente no seu email. Sem spam, apenas inteligência.
              </p>
              <form className="space-y-3 relative z-10" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 text-white text-xs focus:border-cyan-500 focus:outline-none transition-all"
                />
                <button className="w-full py-3 bg-cyan-500 text-black font-black text-[10px] rounded-xl hover:bg-cyan-400 transition-all uppercase tracking-widest">
                  Inscrever-se
                </button>
              </form>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Brain, label: "IA Core" },
                { icon: Cpu, label: "Hardware" },
                { icon: Rocket, label: "SaaS Scale" },
                { icon: ShieldCheck, label: "Security" },
              ].map((item, indice) => (
                <div
                  key={indice}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center gap-3 hover:bg-white/10 transition-colors cursor-default"
                >
                  <item.icon size={24} className="text-cyan-400" />
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{item.label}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
