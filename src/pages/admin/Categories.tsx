import { useState, useEffect } from 'react';
import DashboardLayout from '@/src/components/admin/DashboardLayout';
import { useAuth } from '@/src/hooks/useAuth';
import { motion, AnimatePresence } from 'motion/react';
import { Layers, Plus, Trash2, Sparkles, Tag, Pencil, Check, X } from 'lucide-react';
import { Category } from '@/src/types/admin';

function gerarSlug(texto: string) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function Categories() {
  const { token } = useAuth();
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [nomeNovaCategoria, setNomeNovaCategoria] = useState('');
  const [idCategoriaEmEdicao, setIdCategoriaEmEdicao] = useState<string | null>(null);
  const [nomeCategoriaEmEdicao, setNomeCategoriaEmEdicao] = useState('');
  const [carregandoCadastro, setCarregandoCadastro] = useState(false);
  const [carregandoEdicao, setCarregandoEdicao] = useState(false);

  useEffect(() => {
    carregarCategorias();
  }, []);

  const carregarCategorias = async () => {
    const resposta = await fetch('/api/categories');
    const dados = await resposta.json();
    setCategorias(dados);
  };

  const enviarNovaCategoria = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeNovaCategoria.trim()) return;

    setCarregandoCadastro(true);
    try {
      const resposta = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: nomeNovaCategoria.trim(),
          slug: gerarSlug(nomeNovaCategoria),
        }),
      });

      if (!resposta.ok) {
        const erro = await resposta.json();
        throw new Error(erro.error || 'Erro ao criar categoria');
      }

      setNomeNovaCategoria('');
      await carregarCategorias();
    } catch (erro) {
      console.error(erro);
      alert(erro instanceof Error ? erro.message : 'Erro ao criar categoria');
    } finally {
      setCarregandoCadastro(false);
    }
  };

  const iniciarEdicaoCategoria = (categoria: Category) => {
    setIdCategoriaEmEdicao(categoria.id);
    setNomeCategoriaEmEdicao(categoria.name);
  };

  const cancelarEdicaoCategoria = () => {
    setIdCategoriaEmEdicao(null);
    setNomeCategoriaEmEdicao('');
  };

  const salvarEdicaoCategoria = async (idCategoria: string) => {
    if (!nomeCategoriaEmEdicao.trim()) return;

    setCarregandoEdicao(true);
    try {
      const resposta = await fetch(`/api/categories/${idCategoria}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: nomeCategoriaEmEdicao.trim(),
          slug: gerarSlug(nomeCategoriaEmEdicao),
        }),
      });

      if (!resposta.ok) {
        const erro = await resposta.json();
        throw new Error(erro.error || 'Erro ao atualizar categoria');
      }

      cancelarEdicaoCategoria();
      await carregarCategorias();
    } catch (erro) {
      console.error(erro);
      alert(erro instanceof Error ? erro.message : 'Erro ao atualizar categoria');
    } finally {
      setCarregandoEdicao(false);
    }
  };

  const excluirCategoria = async (idCategoria: string) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return;

    try {
      const resposta = await fetch(`/api/categories/${idCategoria}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!resposta.ok) {
        const erro = await resposta.json();
        throw new Error(erro.error || 'Erro ao excluir categoria');
      }

      await carregarCategorias();
    } catch (erro) {
      console.error(erro);
      alert(erro instanceof Error ? erro.message : 'Erro ao excluir categoria');
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
          <Sparkles size={12} />
          Taxonomy
        </div>
        <h1 className="text-5xl font-black text-white tracking-tighter leading-tight">
          GERENCIE SUAS <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">CATEGORIAS.</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1">
          <form onSubmit={enviarNovaCategoria} className="bg-[#0a0a0a] border border-white/5 rounded-[32px] p-8 space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Plus size={20} className="text-cyan-500" /> Nova Categoria
            </h3>
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-4">Nome da Categoria</label>
              <input
                type="text"
                value={nomeNovaCategoria}
                onChange={(e) => setNomeNovaCategoria(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-cyan-500 focus:outline-none transition-all"
                placeholder="Ex: Inteligência Artificial"
                required
              />
            </div>
            <button
              type="submit"
              disabled={carregandoCadastro}
              className="w-full py-4 bg-cyan-500 text-black font-black text-xs rounded-2xl hover:bg-cyan-400 transition-all uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {carregandoCadastro ? 'Adicionando...' : 'Adicionar Categoria'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-[#0a0a0a] border border-white/5 rounded-[32px] p-8">
            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
              <Layers size={20} className="text-cyan-500" /> Categorias Existentes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {categorias.map((categoria) => {
                  const estaEditando = idCategoriaEmEdicao === categoria.id;

                  return (
                    <motion.div
                      key={categoria.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-white/10 transition-all gap-3"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                          <Tag size={14} />
                        </div>

                        {estaEditando ? (
                          <input
                            type="text"
                            value={nomeCategoriaEmEdicao}
                            onChange={(e) => setNomeCategoriaEmEdicao(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:border-cyan-500 focus:outline-none transition-all text-sm"
                            autoFocus
                          />
                        ) : (
                          <span className="text-sm font-bold text-white">{categoria.name}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        {estaEditando ? (
                          <>
                            <button
                              onClick={() => salvarEdicaoCategoria(categoria.id)}
                              disabled={carregandoEdicao}
                              className="p-2 text-white/20 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-all disabled:opacity-50"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={cancelarEdicaoCategoria}
                              className="p-2 text-white/20 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                            >
                              <X size={16} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => iniciarEdicaoCategoria(categoria)}
                              className="p-2 text-white/20 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => excluirCategoria(categoria.id)}
                              className="p-2 text-white/20 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              {categorias.length === 0 && (
                <p className="text-white/20 text-xs font-bold uppercase tracking-widest col-span-2 text-center py-12">Nenhuma categoria encontrada.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
