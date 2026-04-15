import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '@/src/components/admin/DashboardLayout';
import { useAuth } from '@/src/hooks/useAuth';
import { motion } from 'motion/react';
import { User, Lock, Save, Sparkles, CheckCircle2, Image as IconeImagem, Briefcase, FileText, Instagram, Linkedin, Github } from 'lucide-react';

export default function Profile() {
  const { user, token } = useAuth();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState('');
  const [cargo, setCargo] = useState('');
  const [bio, setBio] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [enviandoFotoPerfil, setEnviandoFotoPerfil] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const referenciaInputArquivo = useRef<HTMLInputElement | null>(null);

  async function lerJsonDeFormaSegura(resposta: Response) {
    const textoResposta = await resposta.text();
    if (!textoResposta) return {};

    try {
      return JSON.parse(textoResposta);
    } catch {
      return {};
    }
  }

  async function salvarFotoPerfilNoServidor(urlFotoPerfil: string) {
    if (!token) {
      throw new Error('Sessão expirada. Faça login novamente.');
    }

    const resposta = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ fotoPerfil: urlFotoPerfil }),
    });

    const dadosResposta = await lerJsonDeFormaSegura(resposta);
    if (!resposta.ok) {
      throw new Error(dadosResposta.error || 'Erro ao salvar foto de perfil');
    }
  }

  useEffect(() => {
    if (user) {
      setName(user.name);
      setUsername(user.username || '');
      setFotoPerfil(user.fotoPerfil || '');
      setCargo(user.cargo || '');
      setBio(user.bio || '');
      setInstagramUrl(user.instagramUrl || 'https://instagram.com/douglaspaiani');
      setLinkedinUrl(user.linkedinUrl || 'https://www.linkedin.com/in/douglaspaiani/');
      setGithubUrl(user.githubUrl || 'https://github.com/douglaspaiani');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const senhaLimpa = password.trim();

    if (password && password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (senhaLimpa && senhaLimpa.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      const dadosAtualizacao: Record<string, string> = {
        name,
        username,
        fotoPerfil,
        cargo,
        bio,
        instagramUrl,
        linkedinUrl,
        githubUrl,
      };

      // Só envia senha quando realmente preenchida.
      if (senhaLimpa) {
        dadosAtualizacao.password = senhaLimpa;
      }

      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dadosAtualizacao),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao atualizar perfil');

      setUsername(data.user?.username || username);
      setSuccess(true);
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const abrirSeletorFotoPerfil = () => {
    referenciaInputArquivo.current?.click();
  };

  const enviarFotoPerfil = async (evento: React.ChangeEvent<HTMLInputElement>) => {
    const arquivoImagem = evento.target.files?.[0];
    evento.target.value = '';
    if (!arquivoImagem) return;
    if (!token) {
      setError('Sessão expirada. Faça login novamente.');
      return;
    }

    const formulario = new FormData();
    formulario.append('imagem', arquivoImagem);

    setEnviandoFotoPerfil(true);
    setError('');
    setSuccess(false);

    try {
      const resposta = await fetch('/api/admin/upload-imagem', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formulario,
      });
      const dadosResposta = await lerJsonDeFormaSegura(resposta);
      if (!resposta.ok) throw new Error(dadosResposta.error || 'Erro ao enviar foto de perfil');
      if (!dadosResposta.url) throw new Error('Upload concluído sem URL de retorno');

      await salvarFotoPerfilNoServidor(dadosResposta.url);
      setFotoPerfil(dadosResposta.url);
      setSuccess(true);
    } catch (erro) {
      setError(erro instanceof Error ? erro.message : 'Erro ao enviar foto de perfil');
    } finally {
      setEnviandoFotoPerfil(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
          <Sparkles size={12} />
          Account Settings
        </div>
        <h1 className="text-5xl font-black text-white tracking-tighter leading-tight">
          GERENCIE SEU <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">PERFIL DE ADMIN.</span>
        </h1>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-[#0a0a0a] border border-white/5 rounded-[32px] p-10 space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-4 flex items-center gap-2">
                <User size={12} /> Nome de Exibição
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-cyan-500 focus:outline-none transition-all"
                placeholder="Seu nome"
                required
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-4 flex items-center gap-2">
                <User size={12} /> Usuário de Acesso
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-cyan-500 focus:outline-none transition-all"
                placeholder="admin"
                minLength={3}
                required
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-4 flex items-center gap-2">
                <IconeImagem size={12} /> Foto de Perfil
              </label>
              <input
                ref={referenciaInputArquivo}
                type="file"
                accept="image/*"
                onChange={enviarFotoPerfil}
                className="hidden"
              />
              {fotoPerfil ? (
                <div className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                  <img
                    src={fotoPerfil}
                    alt="Pré-visualização da foto de perfil"
                    className="w-14 h-14 rounded-full object-cover border border-white/10"
                  />
                  <p className="text-sm text-white/70">Foto atual carregada.</p>
                </div>
              ) : (
                <div className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white/50 text-sm">
                  Nenhuma foto enviada ainda.
                </div>
              )}
              <button
                type="button"
                onClick={abrirSeletorFotoPerfil}
                disabled={enviandoFotoPerfil}
                className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-widest hover:bg-cyan-500 hover:text-black transition-all disabled:opacity-50"
              >
                {enviandoFotoPerfil ? 'Enviando foto...' : 'Enviar foto'}
              </button>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-4 flex items-center gap-2">
                <Briefcase size={12} /> Cargo
              </label>
              <input
                type="text"
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-cyan-500 focus:outline-none transition-all"
                placeholder="Autor & Engenheiro"
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-4 flex items-center gap-2">
                <FileText size={12} /> Bio (Sobre mim)
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-cyan-500 focus:outline-none transition-all min-h-[120px]"
                placeholder="Escreva uma breve descrição para aparecer no fim dos posts."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-4 flex items-center gap-2">
                  <Instagram size={12} /> Instagram
                </label>
                <input
                  type="url"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-cyan-500 focus:outline-none transition-all"
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-4 flex items-center gap-2">
                  <Linkedin size={12} /> LinkedIn
                </label>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-cyan-500 focus:outline-none transition-all"
                  placeholder="https://www.linkedin.com/in/..."
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-4 flex items-center gap-2">
                  <Github size={12} /> GitHub
                </label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-cyan-500 focus:outline-none transition-all"
                  placeholder="https://github.com/..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-4 flex items-center gap-2">
                  <Lock size={12} /> Nova Senha
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-cyan-500 focus:outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-4 flex items-center gap-2">
                  <Lock size={12} /> Confirmar Senha
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-cyan-500 focus:outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-xs font-bold uppercase tracking-widest text-center">{error}</p>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-2 text-emerald-500 font-bold uppercase tracking-widest text-xs"
              >
                <CheckCircle2 size={16} /> Perfil atualizado com sucesso!
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-cyan-500 text-black font-black text-sm rounded-2xl hover:bg-cyan-400 transition-all uppercase tracking-widest flex items-center justify-center gap-3 group disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar Alterações'}
              <Save size={18} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
