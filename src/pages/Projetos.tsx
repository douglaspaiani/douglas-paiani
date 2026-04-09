import { motion, AnimatePresence } from "motion/react";
import { Helmet } from "react-helmet-async";
import { ExternalLink, Github, Layers, Zap, Users, BarChart } from "lucide-react";
import { useState } from "react";
import MatrixRain from "@/src/components/MatrixRain";

const projects = [
  {
    title: "Barberon",
    category: "SaaS / Inteligência Artificial",
    desc: "Plataforma completa para barbearias, com IA para otimização de agendamento e gestão de clientes.",
    tags: ["Node.js", "React", "Next.js", "AWS"],
    stats: { users: "50k+", growth: "+120%" },
    image: "https://picsum.photos/seed/ai/800/600"
  },
  {
    title: "Teuauto",
    category: "Saas / Classificados",
    desc: "Plataforma de classificados para revendedores de veículos com dados de IA.",
    tags: ["Next.js", "Node.js", "PostgreSQL", "Redis"],
    stats: { users: "100k+", growth: "+45%" },
    image: "https://picsum.photos/seed/shop/800/600"
  },
  {
    title: "Lojista Apple",
    category: "Saas / E-commerce",
    desc: "Plataforma para revendedores de produtos Apple, com gestão de estoque e vendas integrada.",
    tags: ["TypeScript", "React", "Next.js", "AWS"],
    stats: { users: "10k+", growth: "+80%" },
    image: "https://picsum.photos/seed/data/800/600"
  }
];

export default function Projetos() {
  return (
    <main className="bg-black min-h-screen pt-32 pb-24 px-6">
      <Helmet>
        <title>Portfólio de Projetos & SaaS | Douglas Paiani</title>
        <meta name="description" content="Explore o portfólio de Douglas Paiani: SaaS, plataformas web, e-commerce e soluções de IA desenvolvidas com tecnologia de ponta." />
        <meta property="og:title" content="Portfólio de Projetos & SaaS | Douglas Paiani" />
        <meta property="og:description" content="Explore o portfólio de Douglas Paiani: SaaS, plataformas web, e-commerce e soluções de IA desenvolvidas com tecnologia de ponta." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://douglaspaiani.com.br/projetos" />
        <link rel="canonical" href="https://douglaspaiani.com.br/projetos" />
      </Helmet>
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">PROJETOS & <br /><span className="text-cyan-400">SAAS.</span></h1>
          <p className="text-white/40 max-w-2xl text-lg font-light">Uma seleção de plataformas e produtos digitais que construí e gerencio, focados em escala e inovação tecnológica.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, i) => {
            const [isHovered, setIsHovered] = useState(false);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="group relative rounded-3xl bg-[#0a0a0a] border border-white/10 overflow-hidden hover:border-cyan-500/50 transition-all duration-500"
              >
                {/* Matrix Rain Effect */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-0"
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-10" />
                      <MatrixRain colorClass="text-cyan-400" />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative z-10">
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  
                  <div className="p-8">
                    <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-2 block">{project.category}</span>
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors duration-300">{project.title}</h3>
                    <p className="text-white/50 text-sm mb-6 leading-relaxed">{project.desc}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-8">
                      {project.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 rounded-full bg-white/5 text-white/40 text-[10px] font-bold uppercase border border-white/5">{tag}</span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                      <div className="flex gap-4">
                        <div className="flex items-center gap-1 text-white/40 text-xs">
                          <Users size={14} /> {project.stats.users}
                        </div>
                        <div className="flex items-center gap-1 text-cyan-400 text-xs">
                          <BarChart size={14} /> {project.stats.growth}
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <a href="#" className="p-2 rounded-full bg-white/5 text-white/60 hover:text-white transition-colors"><Github size={18} /></a>
                        <a href="#" className="p-2 rounded-full bg-cyan-500 text-black hover:bg-cyan-400 transition-colors"><ExternalLink size={18} /></a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
