import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '@/src/hooks/useAuth';
import { Link, useLocation, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Layers,
  User,
  LogOut,
  Sparkles,
  ChevronRight,
  Bell,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface ResumoOrcamentos {
  total: number;
  naoVisualizados: number;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, loading, logout, token } = useAuth();
  const location = useLocation();
  const [resumoOrcamentos, setResumoOrcamentos] = useState<ResumoOrcamentos>({ total: 0, naoVisualizados: 0 });

  useEffect(() => {
    let intervaloResumo: number | undefined;

    const carregarResumoOrcamentos = async () => {
      if (!token) return;

      try {
        const resposta = await fetch('/api/admin/orcamentos/resumo', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!resposta.ok) return;
        const dados = (await resposta.json()) as ResumoOrcamentos;
        setResumoOrcamentos(dados);
      } catch (erro) {
        console.error('Erro ao carregar resumo de orçamentos:', erro);
      }
    };

    carregarResumoOrcamentos();
    const aoAtualizarOrcamentos = () => carregarResumoOrcamentos();
    window.addEventListener('orcamentos-atualizados', aoAtualizarOrcamentos);
    intervaloResumo = window.setInterval(carregarResumoOrcamentos, 15000);

    return () => {
      window.removeEventListener('orcamentos-atualizados', aoAtualizarOrcamentos);
      if (intervaloResumo) window.clearInterval(intervaloResumo);
    };
  }, [token, location.pathname]);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Carregando...</div>;
  if (!user) return <Navigate to="/admin/login" />;

  const itensMenu = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Bell, label: 'Orçamentos', path: '/admin/orcamentos', badge: resumoOrcamentos.naoVisualizados },
    { icon: FileText, label: 'Postagens', path: '/admin/posts' },
    { icon: Layers, label: 'Categorias', path: '/admin/categories' },
    { icon: User, label: 'Perfil', path: '/admin/profile' },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex">
      <aside className="w-72 border-r border-white/5 bg-[#050505] flex flex-col fixed h-full z-20">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center text-black font-black">DP</div>
            <div>
              <h1 className="text-sm font-black tracking-tighter">ADMINISTRADOR</h1>
              <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Douglas Paiani</p>
            </div>
          </div>

          <nav className="space-y-2">
            {itensMenu.map((item) => {
              const ativo = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center justify-between p-4 rounded-2xl transition-all group',
                    ativo ? 'bg-cyan-500 text-black' : 'text-white/40 hover:bg-white/5 hover:text-white',
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={cn(
                          'min-w-6 h-6 px-1 rounded-full flex items-center justify-center text-[10px] font-black',
                          ativo ? 'bg-black/20 text-black' : 'bg-cyan-500 text-black',
                        )}
                      >
                        {item.badge > 99 ? '99+' : item.badge}
                      </span>
                    )}
                    {ativo && <ChevronRight size={14} />}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-8">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-3 p-4 rounded-2xl text-cyan-400/70 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all group mb-3"
          >
            <ExternalLink size={18} />
            <span className="text-xs font-bold uppercase tracking-widest">Visualizar Site</span>
          </a>

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 p-4 rounded-2xl text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-all group"
          >
            <LogOut size={18} />
            <span className="text-xs font-bold uppercase tracking-widest">Sair do Sistema</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-72 p-12 relative">
        <div className="absolute top-0 right-0 p-12 pointer-events-none opacity-20">
          <Sparkles className="text-cyan-500 animate-pulse" size={120} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
