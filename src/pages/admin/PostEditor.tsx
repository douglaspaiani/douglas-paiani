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
  Undo2,
  Redo2,
  ListOrdered,
  Highlighter,
} from 'lucide-react';
import { Category, Post } from '@/src/types/admin';
import CodeSnippet from '@/src/components/admin/CodeSnippet';

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

function converterMarkdownParaHtml(conteudo: string) {
  const linhas = conteudo.replace(/\r\n/g, '\n').split('\n');
  const blocos: string[] = [];
  let listaAberta = false;
  let listaOrdenadaAberta = false;

  const fecharListasSeNecessario = () => {
    if (listaAberta) {
      blocos.push('</ul>');
      listaAberta = false;
    }
    if (listaOrdenadaAberta) {
      blocos.push('</ol>');
      listaOrdenadaAberta = false;
    }
  };

  for (const linhaOriginal of linhas) {
    const linha = linhaOriginal.trim();
    if (!linha) {
      fecharListasSeNecessario();
      continue;
    }

    const linhaEscapada = aplicarFormatacaoInlineMarkdown(escaparHtml(linha));

    if (linha.startsWith('## ')) {
      fecharListasSeNecessario();
      blocos.push(`<h2>${linhaEscapada.replace(/^##\s+/, '')}</h2>`);
      continue;
    }

    if (linha.startsWith('# ')) {
      fecharListasSeNecessario();
      blocos.push(`<h1>${linhaEscapada.replace(/^#\s+/, '')}</h1>`);
      continue;
    }

    if (linha.startsWith('> ')) {
      fecharListasSeNecessario();
      blocos.push(`<blockquote><p>${linhaEscapada.replace(/^>\s+/, '')}</p></blockquote>`);
      continue;
    }

    if (linha.startsWith('- ')) {
      if (!listaAberta) {
        fecharListasSeNecessario();
        blocos.push('<ul class="list-disc pl-6">');
        listaAberta = true;
      }
      blocos.push(`<li>${linhaEscapada.replace(/^-\s+/, '')}</li>`);
      continue;
    }

    if (/^\d+\.\s+/.test(linha)) {
      if (!listaOrdenadaAberta) {
        fecharListasSeNecessario();
        blocos.push('<ol class="list-decimal pl-6">');
        listaOrdenadaAberta = true;
      }
      blocos.push(`<li>${linhaEscapada.replace(/^\d+\.\s+/, '')}</li>`);
      continue;
    }

    fecharListasSeNecessario();
    blocos.push(`<p>${linhaEscapada}</p>`);
  }

  fecharListasSeNecessario();
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
  const [podeDesfazer, setPodeDesfazer] = useState(false);
  const [podeRefazer, setPodeRefazer] = useState(false);
  const referenciaTextareaConteudo = useRef<HTMLTextAreaElement | null>(null);
  const referenciaInputImagem = useRef<HTMLInputElement | null>(null);
  const referenciaHistoricoConteudo = useRef<string[]>(['']);
  const referenciaIndiceHistorico = useRef(0);

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

  const sincronizarBotoesHistorico = () => {
    const indice = referenciaIndiceHistorico.current;
    const historico = referenciaHistoricoConteudo.current;
    setPodeDesfazer(indice > 0);
    setPodeRefazer(indice < historico.length - 1);
  };

  const reiniciarHistorico = (conteudoInicial: string) => {
    referenciaHistoricoConteudo.current = [conteudoInicial];
    referenciaIndiceHistorico.current = 0;
    sincronizarBotoesHistorico();
  };

  const registrarHistoricoConteudo = (novoConteudo: string) => {
    const historicoAtual = referenciaHistoricoConteudo.current;
    const indiceAtual = referenciaIndiceHistorico.current;

    if (historicoAtual[indiceAtual] === novoConteudo) return;

    const historicoAjustado = historicoAtual.slice(0, indiceAtual + 1);
    historicoAjustado.push(novoConteudo);

    const tamanhoMaximoHistorico = 200;
    if (historicoAjustado.length > tamanhoMaximoHistorico) {
      historicoAjustado.splice(0, historicoAjustado.length - tamanhoMaximoHistorico);
    }

    referenciaHistoricoConteudo.current = historicoAjustado;
    referenciaIndiceHistorico.current = historicoAjustado.length - 1;
    sincronizarBotoesHistorico();
  };

  useEffect(() => {
    fetchCategories();
    if (isEditing) fetchPost();
    if (!isEditing) reiniciarHistorico('');
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
    reiniciarHistorico(post.content);
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

  const atualizarConteudo = (novoConteudo: string, registrarNoHistorico = true) => {
    setContent(novoConteudo);
    if (registrarNoHistorico) {
      registrarHistoricoConteudo(novoConteudo);
    }
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

  const aplicarListaOrdenada = () => {
    const textarea = referenciaTextareaConteudo.current;
    if (!textarea) return;

    const inicio = textarea.selectionStart;
    const fim = textarea.selectionEnd;
    const trechoSelecionado = content.slice(inicio, fim) || 'Item 1\nItem 2';
    const linhasListaOrdenada = trechoSelecionado
      .split('\n')
      .map((linha, indice) => `${indice + 1}. ${linha}`)
      .join('\n');

    const novoConteudo = content.slice(0, inicio) + linhasListaOrdenada + content.slice(fim);
    atualizarConteudo(novoConteudo);
  };

  const aplicarDestaque = () => {
    const textarea = referenciaTextareaConteudo.current;
    if (!textarea) return;

    const inicio = textarea.selectionStart;
    const fim = textarea.selectionEnd;
    const trechoSelecionado = content.slice(inicio, fim) || 'Ponto importante';
    const blocoDestaque = `> 🔥 **${trechoSelecionado}**`;
    const novoConteudo = content.slice(0, inicio) + blocoDestaque + content.slice(fim);
    atualizarConteudo(novoConteudo);
  };

  const desfazerConteudo = () => {
    const indiceAtual = referenciaIndiceHistorico.current;
    if (indiceAtual <= 0) return;

    const novoIndice = indiceAtual - 1;
    referenciaIndiceHistorico.current = novoIndice;
    const conteudoHistorico = referenciaHistoricoConteudo.current[novoIndice] || '';
    atualizarConteudo(conteudoHistorico, false);
    sincronizarBotoesHistorico();
  };

  const refazerConteudo = () => {
    const indiceAtual = referenciaIndiceHistorico.current;
    const historico = referenciaHistoricoConteudo.current;
    if (indiceAtual >= historico.length - 1) return;

    const novoIndice = indiceAtual + 1;
    referenciaIndiceHistorico.current = novoIndice;
    const conteudoHistorico = historico[novoIndice] || '';
    atualizarConteudo(conteudoHistorico, false);
    sincronizarBotoesHistorico();
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
              <div className="ml-2 mr-2">
                <label className="text-2xl font-bold text-white">Conteúdo</label>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.03] p-4 md:p-5">
                <input
                  ref={referenciaInputImagem}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={enviarImagemSelecionada}
                />

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={desfazerConteudo}
                    disabled={!podeDesfazer}
                    className="px-4 py-2 rounded-2xl border border-white/10 bg-[#1a2131] text-white/80 text-sm font-semibold flex items-center gap-2 hover:border-cyan-500/40 hover:text-cyan-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Undo2 size={16} /> Desfazer
                  </button>
                  <button
                    type="button"
                    onClick={refazerConteudo}
                    disabled={!podeRefazer}
                    className="px-4 py-2 rounded-2xl border border-white/10 bg-[#1a2131] text-white/80 text-sm font-semibold flex items-center gap-2 hover:border-cyan-500/40 hover:text-cyan-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Redo2 size={16} /> Refazer
                  </button>
                  <button
                    type="button"
                    onClick={() => aplicarFormatacaoSelecao('**', '**', 'negrito')}
                    className="px-4 py-2 rounded-2xl border border-white/10 bg-[#1a2131] text-white text-sm font-semibold flex items-center gap-2 hover:border-cyan-500/40 transition-all"
                  >
                    <Bold size={16} /> Bold
                  </button>
                  <button
                    type="button"
                    onClick={() => aplicarFormatacaoSelecao('*', '*', 'itálico')}
                    className="px-4 py-2 rounded-2xl border border-white/10 bg-[#1a2131] text-white text-sm font-semibold flex items-center gap-2 hover:border-cyan-500/40 transition-all"
                  >
                    <Italic size={16} /> Itálico
                  </button>
                  <button
                    type="button"
                    onClick={() => aplicarFormatacaoSelecao('[texto do link](', ')', 'https://')}
                    className="px-4 py-2 rounded-2xl border border-white/10 bg-[#1a2131] text-white text-sm font-semibold flex items-center gap-2 hover:border-cyan-500/40 transition-all"
                  >
                    <IconeLink size={16} /> Link
                  </button>
                  <button
                    type="button"
                    onClick={() => aplicarTitulo(2)}
                    className="px-4 py-2 rounded-2xl border border-white/10 bg-[#1a2131] text-white text-sm font-semibold flex items-center gap-2 hover:border-cyan-500/40 transition-all"
                  >
                    <Heading2 size={16} /> Título
                  </button>
                  <button
                    type="button"
                    onClick={aplicarLista}
                    className="px-4 py-2 rounded-2xl border border-white/10 bg-[#1a2131] text-white text-sm font-semibold flex items-center gap-2 hover:border-cyan-500/40 transition-all"
                  >
                    <List size={16} /> Lista
                  </button>
                  <button
                    type="button"
                    onClick={aplicarListaOrdenada}
                    className="px-4 py-2 rounded-2xl border border-white/10 bg-[#1a2131] text-white text-sm font-semibold flex items-center gap-2 hover:border-cyan-500/40 transition-all"
                  >
                    <ListOrdered size={16} /> Ordenada
                  </button>
                  <button
                    type="button"
                    onClick={aplicarCitacao}
                    className="px-4 py-2 rounded-2xl border border-white/10 bg-[#1a2131] text-white text-sm font-semibold flex items-center gap-2 hover:border-cyan-500/40 transition-all"
                  >
                    <Quote size={16} /> Citação
                  </button>
                  <button
                    type="button"
                    onClick={aplicarDestaque}
                    className="px-4 py-2 rounded-2xl border border-white/10 bg-[#1a2131] text-white text-sm font-semibold flex items-center gap-2 hover:border-cyan-500/40 transition-all"
                  >
                    <Highlighter size={16} /> Destaque
                  </button>
                  <button
                    type="button"
                    onClick={insertCodeSnippet}
                    className="px-4 py-2 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-sm font-semibold flex items-center gap-2 hover:bg-cyan-500 hover:text-black transition-all"
                  >
                    <Code size={16} /> Código
                  </button>
                  <button
                    type="button"
                    onClick={abrirSeletorImagem}
                    disabled={enviandoImagem}
                    className="px-4 py-2 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-sm font-semibold flex items-center gap-2 hover:bg-cyan-500 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ImageUp size={16} /> {enviandoImagem ? 'Enviando...' : 'Imagem'}
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-white/45 ml-2">
                {quantidadePalavras} palavras • {tempoLeitura} min leitura • Suporta Markdown e [code language=&quot;javascript&quot;]...[/code]
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <textarea
                  ref={referenciaTextareaConteudo}
                  value={content}
                  onChange={(e) => atualizarConteudo(e.target.value)}
                  className="w-full px-7 py-6 rounded-[28px] bg-[#1a2131] border border-white/10 text-white focus:border-cyan-500 focus:outline-none transition-all min-h-[520px] text-base leading-8 tracking-[0] font-medium"
                  placeholder="Escreva seu conteúdo..."
                  required
                />

                <div className="min-h-[520px] px-7 py-6 rounded-[28px] bg-[#1a2131] border border-cyan-500/30 overflow-auto">
                  {content.trim() ? (
                    <div
                      className="article-content prose prose-invert prose-cyan max-w-none
                        prose-headings:font-bold prose-headings:text-white
                        prose-p:text-white/90 prose-p:leading-relaxed prose-p:mb-6
                        prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-8
                        prose-h2:text-3xl prose-h2:mb-5 prose-h2:mt-7
                        prose-strong:text-white prose-em:text-cyan-300
                        prose-ul:space-y-2 prose-li:text-white/85
                        prose-ol:space-y-2 prose-blockquote:border-cyan-500 prose-blockquote:text-cyan-200"
                    >
                      {partesPreview}
                    </div>
                  ) : (
                    <div className="h-full min-h-[440px] flex items-center justify-center text-center text-white/35 text-sm">
                      A prévia formatada aparece aqui em tempo real.
                    </div>
                  )}
                </div>
              </div>
              <p className="text-[11px] text-white/35 ml-2">
                Dica: para código use o botão Código ou o formato [code language=&quot;js&quot;]...[/code].
              </p>
              <div className="flex flex-wrap gap-2">
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
