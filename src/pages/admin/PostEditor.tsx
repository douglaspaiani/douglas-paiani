import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '@/src/components/admin/DashboardLayout';
import { useAuth } from '@/src/hooks/useAuth';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Save, ArrowLeft, Sparkles, Code, Layout, FileText, Tag, Bold, Italic, Quote, Heading1, Heading2, Heading3, Heading4, List, Link as IconeLink, ImageUp } from 'lucide-react';
import { Category, Post } from '@/src/types/admin';

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
  const referenciaTextareaConteudo = useRef<HTMLTextAreaElement | null>(null);
  const referenciaInputImagem = useRef<HTMLInputElement | null>(null);

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
    setCategoryId(post.categoryId);
    setContent(post.content);
    setSeoTitle(post.seoTitle || '');
    setSeoDescription(post.seoDescription || '');
    setSeoKeywords(post.seoKeywords || '');
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
                onChange={(e) => setTitle(e.target.value)}
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
              </div>
              <p className="text-[11px] text-white/35 ml-4">
                Use os ícones para formatar: negrito, itálico, citação, lista, links e títulos H1-H4.
              </p>
              <textarea
                ref={referenciaTextareaConteudo}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-cyan-500 focus:outline-none transition-all min-h-[400px] font-mono text-sm leading-relaxed"
                placeholder="Escreva seu post aqui... Você pode usar Markdown (#, ##, **, *, >, -) e [code language='js']...[/code]."
                required
              />
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
                onChange={(e) => setSlug(e.target.value)}
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
