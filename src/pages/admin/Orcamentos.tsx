import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '@/src/components/admin/DashboardLayout';
import { useAuth } from '@/src/hooks/useAuth';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Sparkles, Eye, Mail, Phone, Building2, Calendar, Trash2 } from 'lucide-react';
import { Orcamento } from '@/src/types/admin';

function formatarData(dataIso: string) {
  return new Date(dataIso).toLocaleString('pt-BR');
}

export default function Orcamentos() {
  const { token } = useAuth();
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [idAberto, setIdAberto] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);

  const totalNaoVisualizados = useMemo(
    () => orcamentos.filter((orcamento) => !orcamento.visualizado).length,
    [orcamentos],
  );

  const carregarOrcamentos = async () => {
    if (!token) return;
    try {
      const resposta = await fetch('/api/admin/orcamentos', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!resposta.ok) return;
      const dados = (await resposta.json()) as Orcamento[];
      setOrcamentos(dados);
    } catch (erro) {
      console.error('Erro ao carregar orçamentos:', erro);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarOrcamentos();
  }, [token]);

  const visualizarOrcamento = async (idOrcamento: string) => {
    if (!token) return;

    const proximoAberto = idAberto === idOrcamento ? null : idOrcamento;
    setIdAberto(proximoAberto);

    const orcamentoSelecionado = orcamentos.find((orcamento) => orcamento.id === idOrcamento);
    if (!orcamentoSelecionado || orcamentoSelecionado.visualizado) return;

    try {
      const resposta = await fetch(`/api/admin/orcamentos/${idOrcamento}/visualizar`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!resposta.ok) return;

      setOrcamentos((estadoAtual) =>
        estadoAtual.map((orcamento) =>
          orcamento.id === idOrcamento
            ? { ...orcamento, visualizado: true, visualizadoEm: new Date().toISOString() }
            : orcamento,
        ),
      );
      window.dispatchEvent(new Event('orcamentos-atualizados'));
    } catch (erro) {
      console.error('Erro ao marcar orçamento como visualizado:', erro);
    }
  };

  const apagarOrcamento = async (idOrcamento: string) => {
    if (!token) return;
    if (!confirm('Tem certeza que deseja apagar este orçamento?')) return;

    try {
      const resposta = await fetch(`/api/admin/orcamentos/${idOrcamento}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!resposta.ok) {
        const erro = await resposta.json();
        throw new Error(erro.error || 'Erro ao apagar orçamento');
      }

      setOrcamentos((estadoAtual) => estadoAtual.filter((orcamento) => orcamento.id !== idOrcamento));
      if (idAberto === idOrcamento) {
        setIdAberto(null);
      }
      window.dispatchEvent(new Event('orcamentos-atualizados'));
    } catch (erro) {
      console.error('Erro ao apagar orçamento:', erro);
      alert(erro instanceof Error ? erro.message : 'Erro ao apagar orçamento');
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
          <Sparkles size={12} />
          Leads
        </div>
        <h1 className="text-5xl font-black text-white tracking-tighter leading-tight">
          CENTRAL DE <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">ORÇAMENTOS.</span>
        </h1>
        <p className="text-white/50 mt-5">
          {totalNaoVisualizados > 0
            ? `Você possui ${totalNaoVisualizados} orçamento(s) novo(s).`
            : 'Não há novos orçamentos no momento.'}
        </p>
      </div>

      <div className="bg-[#0a0a0a] border border-white/5 rounded-[32px] p-8">
        {carregando && <p className="text-white/40">Carregando orçamentos...</p>}

        {!carregando && orcamentos.length === 0 && (
          <p className="text-white/30 text-sm">Nenhum orçamento recebido ainda.</p>
        )}

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {orcamentos.map((orcamento) => {
              const aberto = idAberto === orcamento.id;
              return (
                <motion.div
                  key={orcamento.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden"
                >
                  <button
                    onClick={() => visualizarOrcamento(orcamento.id)}
                    className="w-full text-left p-6 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <Bell size={16} className={orcamento.visualizado ? 'text-white/30' : 'text-cyan-400'} />
                        <h3 className="text-white font-bold truncate">{orcamento.nome}</h3>
                        {!orcamento.visualizado && (
                          <span className="px-2 py-1 rounded-full bg-cyan-500 text-black text-[10px] font-black uppercase">
                            Novo
                          </span>
                        )}
                      </div>
                      <p className="text-white/40 text-sm truncate">{orcamento.tipoProjeto}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-white/50 text-xs flex items-center gap-1 justify-end">
                        <Calendar size={12} />
                        {formatarData(orcamento.createdAt)}
                      </p>
                      <div className="mt-2 flex items-center justify-end gap-3">
                        <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1 justify-end">
                          <Eye size={12} /> {aberto ? 'Ocultar' : 'Visualizar'}
                        </p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            void apagarOrcamento(orcamento.id);
                          }}
                          className="text-red-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1 hover:text-red-300 transition-colors"
                        >
                          <Trash2 size={12} /> Apagar
                        </button>
                      </div>
                    </div>
                  </button>

                  {aberto && (
                    <div className="px-6 pb-6 pt-2 border-t border-white/10">
                      <div className="grid md:grid-cols-2 gap-4 mb-5">
                        <p className="text-white/70 text-sm flex items-center gap-2">
                          <Mail size={14} className="text-cyan-400" />
                          {orcamento.email}
                        </p>
                        <p className="text-white/70 text-sm flex items-center gap-2">
                          <Phone size={14} className="text-cyan-400" />
                          {orcamento.telefone}
                        </p>
                        <p className="text-white/70 text-sm flex items-center gap-2">
                          <Building2 size={14} className="text-cyan-400" />
                          {orcamento.empresa || 'Não informada'}
                        </p>
                        <p className="text-white/70 text-sm">
                          <span className="text-white/40">Urgência:</span> {orcamento.urgencia}
                        </p>
                      </div>
                      <div className="rounded-xl bg-black/40 border border-white/10 p-4">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-2">Descrição</p>
                        <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">{orcamento.descricao}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
}
