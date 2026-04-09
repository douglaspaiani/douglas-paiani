import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Loader2, CheckCircle2, Sparkles, MessageSquare, ArrowRight, Globe, ShoppingCart, Smartphone, Layers, Brain, Wallet, Clock, Phone, Building2, User, ShieldCheck } from "lucide-react";
import CustomSelect from "./CustomSelect";
import { cn } from "@/src/lib/utils";

export default function QuoteForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    projectType: "",
    urgency: "",
    description: ""
  });

  const formatPhone = (value: string) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, "");
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 3) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2)}`;
    }
    if (phoneNumberLength < 11) {
      return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 6)}-${phoneNumber.slice(6, 10)}`;
    }
    return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 7)}-${phoneNumber.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhone(e.target.value);
    setFormData({ ...formData, phone: formattedValue });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const resposta = await fetch("/api/orcamentos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!resposta.ok) {
        throw new Error("Erro ao enviar orçamento");
      }

      setLoading(false);
      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        projectType: "",
        urgency: "",
        description: ""
      });
      setTimeout(() => setSuccess(false), 8000);
    } catch (erro) {
      console.error(erro);
      setLoading(false);
      alert("Não foi possível enviar sua solicitação agora. Tente novamente em instantes.");
    }
  };

  const projectTypes = [
    { label: "Site Institucional", icon: <Globe size={16} /> },
    { label: "Loja Virtual (E-commerce)", icon: <ShoppingCart size={16} /> },
    { label: "Aplicativo iOS/Android", icon: <Smartphone size={16} /> },
    { label: "Plataforma Web / SaaS", icon: <Layers size={16} /> },
    { label: "Consultoria em IA", icon: <Brain size={16} /> },
    { label: "Outro", icon: <Sparkles size={16} /> }
  ];

  const urgencies = [
    { label: "Para ontem", icon: <Clock size={16} /> },
    { label: "Em até 1 mês", icon: <Clock size={16} /> },
    { label: "Em até 3 meses", icon: <Clock size={16} /> },
    { label: "Apenas pesquisando", icon: <Clock size={16} /> }
  ];

  return (
    <div id="orcamento" className="w-full max-w-6xl mx-auto relative group scroll-mt-32">
      {/* Background Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-[44px] blur-2xl opacity-50 group-hover:opacity-70 transition duration-1000" />
      
      <div className="relative w-full p-6 md:p-12 lg:p-16 rounded-[40px] bg-[#050505] border border-white/10 backdrop-blur-3xl overflow-hidden">
        {/* Success State */}
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="flex flex-col items-center justify-center text-center py-20"
            >
              <div className="w-24 h-24 rounded-full bg-cyan-500/20 flex items-center justify-center mb-8 border border-cyan-500/30 relative">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <CheckCircle2 className="text-cyan-400" size={48} />
                </motion.div>
                <div className="absolute inset-0 rounded-full border-2 border-cyan-500/50 animate-ping opacity-20" />
              </div>
              <h2 className="text-4xl font-black text-white mb-4 tracking-tight">Solicitação Enviada!</h2>
              <p className="text-white/40 max-w-md mx-auto text-lg leading-relaxed">
                Obrigado pelo contato, <span className="text-white font-bold">{formData.name.split(' ')[0]}</span>. 
                Douglas analisará seu projeto pessoalmente e entrará em contato em até 24 horas.
              </p>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex flex-col lg:flex-row gap-16">
                {/* Left Side: Info */}
                <div className="lg:w-1/3 space-y-8">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                      <Sparkles size={12} />
                      Start Your Journey
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter leading-tight">
                      VAMOS <br />
                      CONSTRUIR <br />
                      <span className="text-cyan-400">O FUTURO.</span>
                    </h2>
                    <p className="text-white/40 text-lg font-light leading-relaxed">
                      Transforme sua visão em realidade com engenharia de software de elite e inteligência artificial de ponta.
                    </p>
                  </div>

                  <div className="space-y-6 pt-8 border-t border-white/5">
                    <div className="flex items-center gap-4 group/item">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover/item:border-cyan-500/50 transition-colors">
                        <CheckCircle2 className="text-cyan-400" size={20} />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-sm">Análise Técnica</h4>
                        <p className="text-white/30 text-xs">Douglas revisa cada projeto.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 group/item">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover/item:border-cyan-500/50 transition-colors">
                        <Clock className="text-cyan-400" size={20} />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-sm">Resposta Rápida</h4>
                        <p className="text-white/30 text-xs">Feedback em menos de 24h.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 group/item">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover/item:border-cyan-500/50 transition-colors">
                        <ShieldCheck className="text-cyan-400" size={20} />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-sm">Confidencialidade</h4>
                        <p className="text-white/30 text-xs">Seus dados estão seguros.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Form */}
                <div className="lg:w-2/3">
                  <form className="space-y-8" onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-2 group/input">
                        <label className="text-xs uppercase tracking-widest font-bold text-white/40 ml-2 group-focus-within/input:text-cyan-400 transition-colors">Nome Completo</label>
                        <div className="relative">
                          <User className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-cyan-400 transition-colors" size={18} />
                          <input 
                            required
                            type="text" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="Ex: João Silva"
                            className="w-full pl-14 pr-6 py-4 rounded-2xl bg-black border border-white/10 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 focus:outline-none transition-all duration-300 hover:border-white/20"
                          />
                        </div>
                      </div>
                      <div className="space-y-2 group/input">
                        <label className="text-xs uppercase tracking-widest font-bold text-white/40 ml-2 group-focus-within/input:text-cyan-400 transition-colors">Email Corporativo</label>
                        <div className="relative">
                          <MessageSquare className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-cyan-400 transition-colors" size={18} />
                          <input 
                            required
                            type="email" 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            placeholder="joao@empresa.com"
                            className="w-full pl-14 pr-6 py-4 rounded-2xl bg-black border border-white/10 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 focus:outline-none transition-all duration-300 hover:border-white/20"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-2 group/input">
                        <label className="text-xs uppercase tracking-widest font-bold text-white/40 ml-2 group-focus-within/input:text-cyan-400 transition-colors">WhatsApp / Telefone</label>
                        <div className="relative">
                          <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-cyan-400 transition-colors" size={18} />
                          <input 
                            required
                            type="tel" 
                            value={formData.phone}
                            onChange={handlePhoneChange}
                            maxLength={15}
                            placeholder="(11) 99999-9999"
                            className="w-full pl-14 pr-6 py-4 rounded-2xl bg-black border border-white/10 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 focus:outline-none transition-all duration-300 hover:border-white/20"
                          />
                        </div>
                      </div>
                      <div className="space-y-2 group/input">
                        <label className="text-xs uppercase tracking-widest font-bold text-white/40 ml-2 group-focus-within/input:text-cyan-400 transition-colors">Empresa</label>
                        <div className="relative">
                          <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-cyan-400 transition-colors" size={18} />
                          <input 
                            type="text" 
                            value={formData.company}
                            onChange={(e) => setFormData({...formData, company: e.target.value})}
                            placeholder="Nome da sua empresa"
                            className="w-full pl-14 pr-6 py-4 rounded-2xl bg-black border border-white/10 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 focus:outline-none transition-all duration-300 hover:border-white/20"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      <CustomSelect 
                        label="Tipo de Projeto"
                        placeholder="Selecione..."
                        options={projectTypes}
                        value={formData.projectType}
                        onChange={(val) => setFormData({...formData, projectType: val})}
                      />
                      <CustomSelect 
                        label="Urgência"
                        placeholder="Selecione..."
                        options={urgencies}
                        value={formData.urgency}
                        onChange={(val) => setFormData({...formData, urgency: val})}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest font-bold text-white/40 ml-2">Descrição do Projeto</label>
                      <textarea 
                        required
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Conte-me sobre seus objetivos, funcionalidades principais e prazos..."
                        className="w-full px-6 py-4 rounded-2xl bg-black border border-white/10 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 focus:outline-none transition-all duration-300 hover:border-white/20 resize-none"
                      />
                    </div>

                    <div className="pt-4">
                      <button 
                        disabled={loading}
                        className={cn(
                          "w-full py-6 bg-cyan-500 text-black font-black rounded-2xl transition-all duration-500 flex items-center justify-center gap-4 group relative overflow-hidden",
                          "hover:bg-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]",
                          "disabled:opacity-50 disabled:cursor-not-allowed"
                        )}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-shimmer" />
                        {loading ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          <>
                            <span className="relative z-10">SOLICITAR PROPOSTA AGORA</span>
                            <Send size={20} className="relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                          </>
                        )}
                      </button>
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 opacity-40">
                        <p className="text-[10px] uppercase tracking-[0.3em] font-bold">Garantia de Resposta em 24h</p>
                        <div className="hidden sm:block w-1 h-1 rounded-full bg-white/20" />
                        <p className="text-[10px] uppercase tracking-[0.3em] font-bold">100% Confidencial</p>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
