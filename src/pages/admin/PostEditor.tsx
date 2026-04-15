import { useState, useEffect, useRef, useMemo } from 'react';
import DashboardLayout from '@/src/components/admin/DashboardLayout';
import { useAuth } from '@/src/hooks/useAuth';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Save,
  ArrowLeft,
  Sparkles,
  Code,
  Layout,
  FileText,
  Tag,
  Bold,
  Italic,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  List,
  Link as IconeLink,
  ImageUp,
  Eye,
  PencilLine,
  Columns2,
} from 'lucide-react';
import { Category, Post } from '@/src/types/admin';
import CodeSnippet from '@/src/components/admin/CodeSnippet';

type ModoEditor = 'escrever' | 'preview' | 'lado-a-lado';

function escaparHtml(texto: string) {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function aplicarFormatacaoInlineMarkdown(texto: string) {
  return texto
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="px-1.5 py-0.5 rounded bg-white/10 text-cyan-300">$1</code>')
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-cyan-400 underline">$1</a>',
    );
}

// Mantém a mesma lógica de renderização usada no blog para que preview e página final fiquem consistentes.
function converterMarkdownParaHtml(conteudo: string) {
  const linhas = conteudo.replace(/\r\n/g, '\n').split('\n');
  const blocos: string[] = [];
  let listaAberta = false;

  const fecharListaSeNecessario = () => {
    if (listaAberta) {
      blocos.push('</ul>');
      listaAberta = false;
    }
  };

  for (const linhaOriginal of linhas) {
    const linha = linhaOriginal.trim();

    if (!linha) {
      fecharListaSeNecessario();
      continue;
    }

    if (linha.startsWith('<')) {
      fecharListaSeNecessario();
      blocos.push(linhaOriginal);
      continue;
    }

    const linhaEscapada = aplicarFormatacaoInlineMarkdown(escaparHtml(linha));

    if (linha.startsWith('#### ')) {
      fecharListaSeNecessario();
      blocos.push(`<h4>${linhaEscapada.replace(/^####\s+/, '')}</h4>`);
      continue;
    }

    if (linha.startsWith('### ')) {
      fecharListaSeNecessario();
      blocos.push(`<h3>${linhaEscapada.replace(/^###\s+/, '')}</h3>`);
      continue;
    }

    if (linha.startsWith('## ')) {
      fecharListaSeNecessario();
      blocos.push(`<h2>${linhaEscapada.replace(/^##\s+/, '')}</h2>`);
      continue;
    }

    if (linha.startsWith('# ')) {
      fecharListaSeNecessario();
      blocos.push(`<h1>${linhaEscapada.replace(/^#\s+/, '')}</h1>`);
      continue;
    }

    if (linha.startsWith('> ')) {
      fecharListaSeNecessario();
      blocos.push(`<blockquote><p>${linhaEscapada.replace(/^>\s+/, '')}</p></blockquote>`);
      continue;
    }

    if (linha.startsWith('- ')) {
      if (!listaAberta) {
        blocos.push('<ul class="list-disc pl-6">');
        listaAberta = true;
      }
      blocos.push(`<li>${linhaEscapada.replace(/^-\s+/, '')}</li>`);
      continue;
    }

    fecharListaSeNecessario();
    blocos.push(`<p>${linhaEscapada}</p>`);
  }

  fecharListaSeNecessario();
  return blocos.join('\n');
}

export default function PostEditor() {
  const { token } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [content, setContent] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [enviandoImagem, setEnviandoImagem] = useState(false);
  const [slugEditadoManualmente, setSlugEditadoManualmente] = useState(false);
  const [modoEditor, setModoEditor] = useState<ModoEditor>('lado-a-lado');
  const referenciaTextareaConteudo = useRef<HTMLTextAreaElement | null>(null);
  const referenciaInputImagem = useRef<HTMLInputElement | null>(null);

  const quantidadePalavras = useMemo(
    () => content.trim().split(/\s+/).filter(Boolean).length,
    [content],
  );
  const tempoLeitura = useMemo(() => Math.max(1, Math.ceil(quantidadePalavras / 200)), [quantidadePalavras]);

  const partesPreview = useMemo(() => {
    const partes = content.split(/(\[code language=".*?"\].*?\[\/code\])/gs);
    return partes.map((parte, indice) => {
      const trechoCodigo = parte.match(/\[code language="(.*?)"\](.*?)\[\/code\]/s);
      if (trechoCodigo) {
        const [, linguagem, codigo] = trechoCodigo;
        return <CodeSnippet key={`codigo-${indice}`} language={linguagem} code={codigo.trim()} />;
      }

      if (!parte.trim()) return null;
      return (
        <div
          key={`texto-${indice}`}
          dangerouslySetInnerHTML={{ __html: converterMarkdownParaHtml(parte) }}
        />
      );
    });
  }, [content]);

  useEffect(() => {
    fetchCategories();
    if (isEditing) fetchPost();
  }, [id]);

  const fetchCategories = async () => {
    const res = await fetch('/api/categories');
    const data = await res.json();
    setCategories(data);
    if (data.length > 0 && !categoryId) setCategoryId(data[0].id);
  };

  const fetchPost = async () => {
    if (!id) return;
    const res = await fetch(`/api/posts/${id}`);
    if (!res.ok) return;
    const post: Post = await res.json();
    setTitle(post.title);
    setSlug(post.slug);
    setSlugEditadoManualmente(true);
    setCategoryId(post.categoryId);
    setContent(post.content);
    setSeoTitle(post.seoTitle || '');
    setSeoDescription(post.seoDescription || '');
    setSeoKeywords(post.seoKeywords || '');
  };

  const gerarSlug = (texto: string) =>
    texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

  const atualizarTitulo = (novoTitulo: string) => {
    setTitle(novoTitulo);
    if (!slugEditadoManualmente) {
      setSlug(gerarSlug(novoTitulo));
    }
  };

  const insertCodeSnippet = () => {
    inserirTrechoNoConteudo('\n[code language="javascript"]\n// Seu código aqui\n[/code]\n');
  };

  const atualizarConteudo = (novoConteudo: string) => {
    setContent(novoConteudo);
  };

  const inserirTrechoNoConteudo = (trecho: string) => {
    const textarea = referenciaTextareaConteudo.current;
    if (!textarea) {
      atualizarConteudo(content + trecho);
      return;
    }

    const inicio = textarea.selectionStart;
    const fim = textarea.selectionEnd;
    const antes = content.slice(0, inicio);
    const depois = content.slice(fim);
    const conteudoAtualizado = `${antes}${trecho}${depois}`;
    atualizarConteudo(conteudoAtualizado);

    requestAnimationFrame(() => {
      const posicaoCursor = inicio + trecho.length;
      textarea.focus();
      textarea.setSelectionRange(posicaoCursor, posicaoCursor);
    });
  };

  // Aplica formatação no trecho selecionado do editor e reposiciona o cursor.
  const aplicarFormatacaoSelecao = (abertura: string, fechamento = '', textoPadrao = 'texto') => {
    const textarea = referenciaTextareaConteudo.current;
    if (!textarea) return;

    const inicio = textarea.selectionStart;
    const fim = textarea.selectionEnd;
    const trechoSelecionado = content.slice(inicio, fim);
    const trechoFormatado = trechoSelecionado || textoPadrao;

    const novoConteudo =
      content.slice(0, inicio) +
      abertura +
      trechoFormatado +
      fechamento +
      content.slice(fim);

    atualizarConteudo(novoConteudo);

    requestAnimationFrame(() => {
      const inicioSelecao = inicio + abertura.length;
      const fimSelecao = inicioSelecao + trechoFormatado.length;
      textarea.focus();
      textarea.setSelectionRange(inicioSelecao, fimSelecao);
    });
  };

  const aplicarTitulo = (nivel: 1 | 2 | 3 | 4) => {
    const prefixo = '#'.repeat(nivel) + ' ';
    aplicarFormatacaoSelecao(prefixo, '', `Título H${nivel}`);
  };

  const aplicarCitacao = () => {
    const textarea = referenciaTextareaConteudo.current;
    if (!textarea) return;

    const inicio = textarea.selectionStart;
    const fim = textarea.selectionEnd;
    const trechoSelecionado = content.slice(inicio, fim) || 'Citação';
    const linhasCitadas = trechoSelecionado
      .split('\n')
      .map((linha) => `> ${linha}`)
      .join('\n');

    const novoConteudo =
      content.slice(0, inicio) + linhasCitadas + content.slice(fim);

    atualizarConteudo(novoConteudo);
  };

  const aplicarLista = () => {
    const textarea = referenciaTextareaConteudo.current;
    if (!textarea) return;

    const inicio = textarea.selectionStart;
    const fim = textarea.selectionEnd;
    const trechoSelecionado = content.slice(inicio, fim) || 'Item 1\nItem 2';
    const linhasLista = trechoSelecionado
      .split('\n')
      .map((linha) => `- ${linha}`)
      .join('\n');

    const novoConteudo = content.slice(0, inicio) + linhasLista + content.slice(fim);
    atualizarConteudo(novoConteudo);
  };

  const inserirBlocoRapido = (
    tipoBloco: 'titulo' | 'subtitulo' | 'lista' | 'citacao' | 'codigo' | 'divisor',
  ) => {
    const blocos = {
      titulo: '\n# Título principal\n\n',
      subtitulo: '\n## Subtítulo da seção\n\n',
      lista: '\n- Item 1\n- Item 2\n- Item 3\n\n',
      citacao: '\n> Destaque importante do conteúdo.\n\n',
      codigo: '\n[code language="javascript"]\n// Seu código aqui\n[/code]\n\n',
      divisor: '\n---\n\n',
    };

    inserirTrechoNoConteudo(blocos[tipoBloco]);
  };

  const abrirSeletorImagem = () => {
    referenciaInputImagem.current?.click();
  };

  const enviarImagemSelecionada = async (evento: React.ChangeEvent<HTMLInputElement>) => {
    const arquivoImagem = evento.target.files?.[0];
    evento.target.value = '';

    if (!arquivoImagem) return;
    if (!token) {
      alert('Você precisa estar autenticado para enviar imagens.');
      return;
    }

    const formulario = new FormData();
    formulario.append('imagem', arquivoImagem);

    setEnviandoImagem(true);

    try {
      const resposta = await fetch('/api/admin/upload-imagem', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formulario,
      });

      const dadosResposta = await resposta.json();
      if (!resposta.ok) {
        throw new Error(dadosResposta.error || 'Falha no upload da imagem');
      }

      inserirTrechoNoConteudo(`\n![${arquivoImagem.name}](${dadosResposta.url})\n`);
    } catch (erro) {
      console.error(erro);
      alert(erro instanceof Error ? erro.message : 'Erro ao enviar imagem');
    } finally {
      setEnviandoImagem(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const postData = {
      title,
      slug: slug || title.toLowerCase().replace(/ /g, '-'),
      categoryId,
      content,
      seoTitle,
      seoDescription,
      seoKeywords,
    };

    try {
      const url = isEditing ? `/api/posts/${id}` : '/api/posts';
      const method = isEditing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erro ao salvar postagem');
      }

      navigate('/admin/posts');
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : 'Erro ao salvar postagem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            <Sparkles size={12} />
            Editor
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter leading-tight">
            {isEditing ? 'EDITAR' : 'CRIAR'} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">POSTAGEM.</span>
          </h1>
        </div>
        <button
          onClick={() => navigate('/admin/posts')}
          className="px-8 py-4 bg-white/5 text-white/40 font-black text-xs rounded-2xl hover:bg-white/10 hover:text-white transition-all uppercase tracking-widest flex items-center gap-2"
        >
          <ArrowLeft size={18} /> Voltar
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[#0a0a0a] border border-white/5 rounded-[32px] p-8 space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-4 flex items-center gap-2">
                <FileText size={12} /> Título do Post
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => atualizarTitulo(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-cyan-500 focus:outline-none transition-all text-xl font-bold"
                placeholder="Ex: Como criar um SaaS com IA"
                required
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between ml-4">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest flex items-center gap-2">
                  <Layout size={12} /> Conteúdo
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-1">
                  <button
                    type="button"
                    onClick={() => setModoEditor('escrever')}
                    className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center gap-1.5 ${
                      modoEditor === 'escrever'
                        ? 'bg-cyan-500 text-black'
                        : 'text-white/60 hover:text-cyan-400'
                    }`}
                  >
                    <PencilLine size={12} /> Escrever
                  </button>
                  <button
                    type="button"
                    onClick={() => setModoEditor('preview')}
                    className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center gap-1.5 ${
                      modoEditor === 'preview'
                        ? 'bg-cyan-500 text-black'
                        : 'text-white/60 hover:text-cyan-400'
                    }`}
                  >
                    <Eye size={12} /> Preview
                  </button>
                  <button
                    type="button"
                    onClick={() => setModoEditor('lado-a-lado')}
                    className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center gap-1.5 ${
                      modoEditor === 'lado-a-lado'
                        ? 'bg-cyan-500 text-black'
                        : 'text-white/60 hover:text-cyan-400'
                    }`}
                  >
                    <Columns2 size={12} /> Lado a lado
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 px-4">
                <div className="flex items-center flex-wrap gap-2">
                  <input
                    ref={referenciaInputImagem}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={enviarImagemSelecionada}
                  />
                  <button
                    type="button"
                    onClick={() => aplicarFormatacaoSelecao('**', '**', 'negrito')}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
                    title="Negrito"
                  >
                    <Bold size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => aplicarFormatacaoSelecao('*', '*', 'itálico')}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
                    title="Itálico"
                  >
                    <Italic size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => aplicarFormatacaoSelecao('[texto do link](', ')', 'https://')}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
                    title="Link"
                  >
                    <IconeLink size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={abrirSeletorImagem}
                    disabled={enviandoImagem}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-cyan-400 hover:border-cyan-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    title={enviandoImagem ? 'Enviando imagem...' : 'Enviar imagem'}
                  >
                    <ImageUp size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={aplicarCitacao}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
                    title="Citação"
                  >
                    <Quote size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={aplicarLista}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
                    title="Lista"
                  >
                    <List size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => aplicarTitulo(1)}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
                    title="Título H1"
                  >
                    <Heading1 size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => aplicarTitulo(2)}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
                    title="Título H2"
                  >
                    <Heading2 size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => aplicarTitulo(3)}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
                    title="Título H3"
                  >
                    <Heading3 size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => aplicarTitulo(4)}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
                    title="Título H4"
                  >
                    <Heading4 size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={insertCodeSnippet}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-widest hover:bg-cyan-500 hover:text-black transition-all"
                  >
                    <Code size={12} /> Inserir Snippet
                  </button>
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                  {quantidadePalavras} palavras • {tempoLeitura} min leitura
                </div>
              </div>

              <div className="px-4 py-3 rounded-2xl border border-cyan-500/20 bg-cyan-500/5">
                <p className="text-[11px] text-cyan-300/80 font-medium">
                  Blocos rápidos para acelerar a escrita:
                </p>
                <div className="mt-2 flex items-center flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => inserirBlocoRapido('titulo')}
                    className="px-3 py-1.5 text-[10px] rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-cyan-400 hover:border-cyan-500/40 transition-all"
                  >
                    + Título
                  </button>
                  <button
                    type="button"
                    onClick={() => inserirBlocoRapido('subtitulo')}
                    className="px-3 py-1.5 text-[10px] rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-cyan-400 hover:border-cyan-500/40 transition-all"
                  >
                    + Subtítulo
                  </button>
                  <button
                    type="button"
                    onClick={() => inserirBlocoRapido('lista')}
                    className="px-3 py-1.5 text-[10px] rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-cyan-400 hover:border-cyan-500/40 transition-all"
                  >
                    + Lista
                  </button>
                  <button
                    type="button"
                    onClick={() => inserirBlocoRapido('citacao')}
                    className="px-3 py-1.5 text-[10px] rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-cyan-400 hover:border-cyan-500/40 transition-all"
                  >
                    + Citação
                  </button>
                  <button
                    type="button"
                    onClick={() => inserirBlocoRapido('codigo')}
                    className="px-3 py-1.5 text-[10px] rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-cyan-400 hover:border-cyan-500/40 transition-all"
                  >
                    + Código
                  </button>
                  <button
                    type="button"
                    onClick={() => inserirBlocoRapido('divisor')}
                    className="px-3 py-1.5 text-[10px] rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-cyan-400 hover:border-cyan-500/40 transition-all"
                  >
                    + Divisor
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-white/35 ml-4">
                Use os ícones para formatar e o modo Preview para validar o visual final do post.
              </p>

              <div
                className={`grid gap-4 ${modoEditor === 'lado-a-lado' ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1'}`}
              >
                {modoEditor !== 'preview' && (
                  <textarea
                    ref={referenciaTextareaConteudo}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-cyan-500 focus:outline-none transition-all min-h-[460px] font-mono text-sm leading-relaxed"
                    placeholder="Escreva seu post aqui... Você pode usar Markdown (#, ##, **, *, >, -) e [code language='js']...[/code]."
                    required
                  />
                )}

                {modoEditor !== 'escrever' && (
                  <div className="min-h-[460px] px-6 py-5 rounded-2xl bg-white/[0.03] border border-cyan-500/20 overflow-auto">
                    {content.trim() ? (
                      <div
                        className="article-content prose prose-invert prose-cyan max-w-none
                          prose-headings:font-bold prose-headings:text-white
                          prose-p:text-white/90 prose-p:leading-relaxed prose-p:mb-6
                          prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-10
                          prose-h2:text-3xl prose-h2:mb-5 prose-h2:mt-9
                          prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-8
                          prose-h4:text-xl prose-h4:mb-4 prose-h4:mt-7
                          prose-strong:text-white prose-em:text-cyan-300
                          prose-ul:space-y-2 prose-li:text-white/85
                          prose-blockquote:border-cyan-500 prose-blockquote:text-cyan-200"
                      >
                        {partesPreview}
                      </div>
                    ) : (
                      <div className="h-full min-h-[420px] flex items-center justify-center text-center text-white/35 text-sm">
                        Comece a escrever para visualizar o resultado final aqui.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-8">
          <div className="bg-[#0a0a0a] border border-white/5 rounded-[32px] p-8 space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-4 flex items-center gap-2">
                <Tag size={12} /> Categoria
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-cyan-500 focus:outline-none transition-all appearance-none"
                required
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-[#0a0a0a]">{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-4">URL Amigável (Slug)</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlugEditadoManualmente(true);
                  setSlug(e.target.value);
                }}
                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-cyan-500 focus:outline-none transition-all text-xs"
                placeholder="como-criar-um-saas"
              />
            </div>

            <div className="pt-4 border-t border-white/5 space-y-6">
              <h3 className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.2em] ml-4">Configurações SEO</h3>
              
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-4">Título SEO</label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-cyan-500 focus:outline-none transition-all text-xs"
                  placeholder="Título para motores de busca"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-4">Descrição SEO</label>
                <textarea
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-cyan-500 focus:outline-none transition-all text-xs min-h-[100px]"
                  placeholder="Meta descrição para o post"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-4">Palavras-chave (separadas por vírgula)</label>
                <input
                  type="text"
                  value={seoKeywords}
                  onChange={(e) => setSeoKeywords(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-cyan-500 focus:outline-none transition-all text-xs"
                  placeholder="ia, saas, tecnologia"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-cyan-500 text-black font-black text-sm rounded-2xl hover:bg-cyan-400 transition-all uppercase tracking-widest flex items-center justify-center gap-3 group disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar Postagem'}
              <Save size={18} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </form>
    </DashboardLayout>
  );
}
