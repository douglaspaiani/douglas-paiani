import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";
import { ArrowUpRight, Sparkles } from "lucide-react";

import barberonLogo from "@/src/images/barberon.png";
import lojistaAppleLogo from "@/src/images/lojistaapple.png";
import teuautoLogo from "@/src/images/teuauto.png";
import proclubLogo from "@/src/images/proclub.png";
import inferninhoLogo from "@/src/images/inferninho.png";

const saasCompanies = [
  {
    name: "Barberon",
    desc: "Plataforma robusta e inteligente para barbearias premium.",
    logo: barberonLogo,
    link: "https://barberon.app",
    color: "from-cyan-500 to-blue-500",
    stats: "+100 barbearias",
    tag: "Gestão & Negócios"
  },
  {
    name: "LojistaApple",
    desc: "Plataforma de gestão e vendas para revendedores de produtos Apple.",
    logo: lojistaAppleLogo,
    link: "https://lojistaapple.com.br",
    color: "from-blue-500 to-indigo-600",
    stats: "+500 clientes",
    tag: "Vendas inteligentes"
  },
  {
    name: "Teuauto",
    desc: "Classificado de veículos para lojas alimentada com dados de IA.",
    logo: teuautoLogo,
    link: "https://teuauto.com.br",
    color: "from-purple-500 to-pink-500",
    stats: "100k acessos/dia",
    tag: "IA Integrada"
  },
  {
    name: "ProClub",
    desc: "Sistema on-Demand de gestão para federações esportivas.",
    logo: proclubLogo,
    link: "https://proclub.com.br",
    color: "from-emerald-500 to-teal-500",
    stats: "Grandes parceiros",
    tag: "On-Demand"
  },
  {
    name: "Inferninho",
    desc: "Plataforma de monetização de conteúdo pessoal com uso de IA.",
    logo: inferninhoLogo,
    link: "https://inferninho.com.br",
    color: "from-orange-500 to-red-500",
    stats: "500k acessos/dia",
    tag: "Big tech"
  }
];

export default function SaaSPortfolio() {
  return (
    <section id="portfolio-saas" className="py-24 relative overflow-hidden scroll-mt-32">
      {/* Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[120px] -z-10" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6"
            >
              <Sparkles size={12} />
              Proprietary SaaS Ecosystem
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight">
              MEU PORTFÓLIO DE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">PRODUTOS SAAS.</span>
            </h2>
          </div>
          <p className="text-white/40 text-lg font-light max-w-md md:text-right">
            Empresas fundadas e escaladas sob minha liderança técnica, focadas em resolver problemas complexos com tecnologia de ponta.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {saasCompanies.map((company, i) => (
            <motion.a
              key={company.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              href={company.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Abrir site da empresa ${company.name}`}
              className="group relative"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-b from-white/10 to-transparent rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity blur-sm" />
              
              <div className="relative h-full bg-[#0a0a0a] border border-white/5 rounded-[32px] p-8 flex flex-col transition-all duration-500 group-hover:border-white/20 group-hover:bg-[#0f0f0f]">
                {/* Logo */}
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 relative overflow-hidden group-hover:scale-110 transition-transform duration-500 bg-white/5 border border-white/10">
                  <img 
                    src={company.logo} 
                    alt={company.name} 
                    className="w-10 h-10 object-contain relative z-10"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Content */}
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{company.tag}</span>
                    <ArrowUpRight size={14} className="text-white/20 group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors">{company.name}</h3>
                  <p className="text-white/40 text-sm leading-relaxed mb-6 font-light">
                    {company.desc}
                  </p>
                </div>

                {/* Stats Footer */}
                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] font-black text-white/60 uppercase tracking-tighter">{company.stats}</span>
                  <div className="flex gap-1">
                    {[1, 2, 3].map(dot => (
                      <div key={dot} className="w-1 h-1 rounded-full bg-cyan-500/30 group-hover:bg-cyan-500 transition-colors" />
                    ))}
                  </div>
                </div>

                {/* Hover Glow */}
                <div className={cn(
                  "absolute -bottom-12 -left-12 w-24 h-24 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity rounded-full",
                  "bg-gradient-to-br", company.color
                )} />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
