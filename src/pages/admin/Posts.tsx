import { useState, useEffect } from 'react';
import DashboardLayout from '@/src/components/admin/DashboardLayout';
import { useAuth } from '@/src/hooks/useAuth';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Plus, Trash2, Edit2, Sparkles, Search, Calendar, Tag, Eye } from 'lucide-react';
import { Post, Category } from '@/src/types/admin';
import { Link } from 'react-router-dom';

export default function Posts() {
  const { token } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  const fetchPosts = async () => {
    const res = await fetch('/api/posts');
    const data = await res.json();
    setPosts(data);
  };

  const fetchCategories = async () => {
    const res = await fetch('/api/categories');
    const data = await res.json();
    setCategories(data);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta postagem?')) return;

    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            <Sparkles size={12} />
            Content Management
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter leading-tight">
            GERENCIE SUAS <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">POSTAGENS.</span>
          </h1>
        </div>
        <Link
          to="/admin/posts/new"
          className="px-8 py-4 bg-cyan-500 text-black font-black text-xs rounded-2xl hover:bg-cyan-400 transition-all uppercase tracking-widest flex items-center gap-2"
        >
          <Plus size={18} /> Nova Postagem
        </Link>
      </div>

      <div className="bg-[#0a0a0a] border border-white/5 rounded-[32px] p-8 overflow-hidden">
        <div className="relative mb-8">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-cyan-500 focus:outline-none transition-all"
            placeholder="Buscar postagens..."
          />
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post) => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 group hover:border-white/10 transition-all"
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-cyan-400 transition-colors">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">{post.title}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="flex items-center gap-1.5 text-[10px] text-white/30 font-bold uppercase tracking-widest">
                        <Calendar size={12} /> {new Date(post.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                      <span className="flex items-center gap-1.5 text-[10px] text-cyan-500/60 font-bold uppercase tracking-widest">
                        <Tag size={12} /> {categories.find(c => c.id === post.categoryId)?.name || 'Sem Categoria'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/blog/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 text-white/20 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-xl transition-all"
                    title="Visualizar postagem"
                  >
                    <Eye size={18} />
                  </Link>
                  <Link
                    to={`/admin/posts/edit/${post.id}`}
                    className="p-3 text-white/20 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-xl transition-all"
                  >
                    <Edit2 size={18} />
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-3 text-white/20 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {filteredPosts.length === 0 && (
            <p className="text-white/20 text-xs font-bold uppercase tracking-widest text-center py-24">Nenhuma postagem encontrada.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
