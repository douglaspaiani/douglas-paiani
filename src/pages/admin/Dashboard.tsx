import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/src/components/admin/DashboardLayout';
import { useAuth } from '@/src/hooks/useAuth';
import { motion } from 'motion/react';
import { FileText, Layers, Sparkles, TrendingUp } from 'lucide-react';

interface AtividadeRecente {
  id: string;
  titulo: string;
  criadoEm: string;
  autor: string;
}

interface RespostaDashboard {
  totais: {
    postagens: number;
    categorias: number;
    usuarios: number;
    postagensHoje: number;
    orcamentosNaoVisualizados: number;
    acessosSitePrincipal: number;
  };
  acessosPostagens: {
    slug: string;
    total: number;
  }[];
  atividadesRecentes: AtividadeRecente[];
  statusSistema: {
    api: string;
    banco: string;
  };
}

function formatarTempoRelativo(dataIso: string) {
  const agora = Date.now();
  const dataEvento = new Date(dataIso).getTime();
  const diferencaSegundos = Math.max(1, Math.floor((agora - dataEvento) / 1000));

  if (diferencaSegundos < 60) return `Há ${diferencaSegundos}s`;
  if (diferencaSegundos < 3600) return `Há ${Math.floor(diferencaSegundos / 60)} min`;
  if (diferencaSegundos < 86400) return `Há ${Math.floor(diferencaSegundos / 3600)}h`;
  return `Há ${Math.floor(diferencaSegundos / 86400)}d`;
}

export default function Dashboard() {
  const { token } = useAuth();
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [dadosDashboard, setDadosDashboard] = useState<RespostaDashboard>({
    totais: {
      postagens: 0,
      categorias: 0,
      usuarios: 0,
      postagensHoje: 0,
      orcamentosNaoVisualizados: 0,
      acessosSitePrincipal: 0,
    },
    acessosPostagens: [],
    atividadesRecentes: [],
    statusSistema: {
      api: 'Operacional',
      banco: 'Conectado',
    },
  });

  useEffect(() => {
    const carregarDashboard = async () => {
      if (!token) return;

      try {
        setErro('');
        const resposta = await fetch('/api/admin/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const tipoConteudo = resposta.headers.get('content-type') || '';
        const ehJson = tipoConteudo.includes('application/json');

        if (!resposta.ok) {
          if (ehJson) {
            const dadosErro = await resposta.json();
            throw new Error(dadosErro.error || 'Erro ao carregar dashboard');
          }
          throw new Error('A API do dashboard não respondeu em JSON. Verifique se o backend está rodando.');
        }

        if (!ehJson) {
          throw new Error('Resposta inválida da API do dashboard. Verifique se o endpoint /api/admin/dashboard está disponível.');
        }

        const dados = (await resposta.json()) as RespostaDashboard;
        setDadosDashboard(dados);
      } catch (erroRequisicao) {
        setErro(erroRequisicao instanceof Error ? erroRequisicao.message : 'Erro ao carregar dashboard');
      } finally {
        setCarregando(false);
      }
    };

    carregarDashboard();
  }, [token]);

  const cardsIndicadores = [
    {
      label: 'Postagens',
      value: dadosDashboard.totais.postagens.toString(),
      icon: FileText,
      color: 'text-cyan-500',
      bg: 'bg-cyan-500/10',
    },
    {
      label: 'Categorias',
      value: dadosDashboard.totais.categorias.toString(),
      icon: Layers,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Publicadas Hoje',
      value: dadosDashboard.totais.postagensHoje.toString(),
      icon: TrendingUp,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
    {
      label: 'Novos Orçamentos',
      value: dadosDashboard.totais.orcamentosNaoVisualizados.toString(),
      icon: Sparkles,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
    },
    {
      label: 'Acessos no Site',
      value: dadosDashboard.totais.acessosSitePrincipal.toString(),
      icon: TrendingUp,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10',
    },
  ];

  return (
    <DashboardLayout>
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
          <Sparkles size={12} />
          Overview
        </div>
        <h1 className="text-5xl font-black text-white tracking-tighter leading-tight">
          BEM-VINDO AO <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">PAINEL DE CONTROLE.</span>
        </h1>
      </div>

      {erro && (
        <div className="mb-8 p-4 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-300 text-sm font-semibold">
          {erro}
        </div>
      )}

      {dadosDashboard.totais.orcamentosNaoVisualizados > 0 && (
        <div className="mb-8 p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-200 text-sm font-semibold">
          Você tem {dadosDashboard.totais.orcamentosNaoVisualizados} novo(s) orçamento(s) aguardando visualização.
          <Link to="/admin/orcamentos" className="ml-2 text-amber-300 underline">
            Abrir orçamentos
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
        {cardsIndicadores.map((indicador, i) => (
          <motion.div
            key={indicador.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#0a0a0a] border border-white/5 rounded-[32px] p-8 group hover:border-white/20 transition-all"
          >
            <div className={`w-12 h-12 rounded-2xl ${indicador.bg} ${indicador.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <indicador.icon size={24} />
            </div>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">{indicador.label}</p>
            <h3 className="text-3xl font-black text-white">{carregando ? '...' : indicador.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/5 rounded-[32px] p-8">
          <h3 className="text-xl font-bold text-white mb-8">Atividades Recentes</h3>
          <div className="space-y-6">
            {!carregando && dadosDashboard.atividadesRecentes.length === 0 && (
              <p className="text-white/30 text-sm">Nenhuma atividade recente encontrada.</p>
            )}

            {dadosDashboard.atividadesRecentes.map((atividade) => (
              <div key={atividade.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-white/10 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40">
                    <FileText size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                      Novo post publicado: "{atividade.titulo}"
                    </h4>
                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">
                      {formatarTempoRelativo(atividade.criadoEm)} • Por {atividade.autor}
                    </p>
                  </div>
                </div>
                <Link
                  to={`/admin/posts/edit/${atividade.id}`}
                  className="text-[10px] font-black text-cyan-500 uppercase tracking-widest hover:text-cyan-400 transition-colors"
                >
                  Editar
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-white/5 rounded-[32px] p-8 space-y-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-8">Status do Sistema</h3>
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">API Status</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <p className="text-sm font-bold text-emerald-500/60">{dadosDashboard.statusSistema.api}</p>
              </div>

              <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Database</span>
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                </div>
                <p className="text-sm font-bold text-blue-500/60">{dadosDashboard.statusSistema.banco}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-4">Top Postagens</h3>
            <div className="space-y-3">
              {dadosDashboard.acessosPostagens.slice(0, 5).map((acessoPostagem) => (
                <div
                  key={acessoPostagem.slug}
                  className="p-3 rounded-xl border border-white/10 bg-black/30 flex items-center justify-between gap-3"
                >
                  <p className="text-white/70 text-xs truncate">{acessoPostagem.slug}</p>
                  <p className="text-cyan-400 text-xs font-bold">{acessoPostagem.total}</p>
                </div>
              ))}
              {dadosDashboard.acessosPostagens.length === 0 && (
                <p className="text-white/30 text-xs">Sem acessos em postagens ainda.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
