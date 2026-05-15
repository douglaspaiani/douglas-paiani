import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Brain, Code, Rocket, Cpu, Zap, Activity, Terminal } from "lucide-react";
import MatrixRain from "@/src/components/MatrixRain";
import { useState, useEffect, useMemo } from "react";
import logoOgiva from "@/src/images/ogiva.png";
import logoObsidiano from "@/src/images/obsidiano.png";
import logoBarberon from "@/src/images/barberon.png";

const TypingText = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(timer);
    }, 30);
    return () => clearInterval(timer);
  }, [text]);

  return <span>{displayedText}</span>;
};

export default function Hero() {
  const nodes = useMemo(() => Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1 + Math.random() * 3
  })), []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 md:pt-40 bg-black">
      {/* AI Background Layers */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 mix-blend-screen">
          <MatrixRain colorClass="text-blue-400" opacity="opacity-[0.18]" columns={34} />
        </div>
        <div className="absolute inset-0 mix-blend-screen blur-[0.4px]">
          <MatrixRain colorClass="text-cyan-300" opacity="opacity-[0.12]" columns={22} />
        </div>
        <div className="absolute inset-0 mix-blend-screen">
          <MatrixRain colorClass="text-sky-300" opacity="opacity-[0.07]" columns={12} />
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_12%,rgba(59,130,246,0.24),transparent_52%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_24%,rgba(6,182,212,0.18),transparent_48%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,8,20,0.12),rgba(0,0,0,0.42))]" />

        <motion.div
          animate={{ opacity: [0.28, 0.6, 0.28], scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-[60rem] h-[60rem] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.22),transparent_60%)]"
        />
        <motion.div
          animate={{ x: ["-15%", "15%", "-15%"], opacity: [0.08, 0.18, 0.08] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-12 left-0 w-[56rem] h-[24rem] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.2),transparent_65%)]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/55" />
        
        {/* SVG Neural Network Background */}
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
          <defs>
            <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(6,182,212,0.2)" />
              <stop offset="100%" stopColor="rgba(59,130,246,0.2)" />
            </linearGradient>
          </defs>
          {nodes.map((node, i) => (
            <g key={i}>
              {nodes.slice(i + 1, i + 4).map((target, j) => (
                <motion.line
                  key={j}
                  x1={`${node.x}%`}
                  y1={`${node.y}%`}
                  x2={`${target.x}%`}
                  y2={`${target.y}%`}
                  stroke="url(#line-grad)"
                  strokeWidth="0.5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: [0, 0.5, 0] }}
                  transition={{ 
                    duration: 5 + Math.random() * 5, 
                    repeat: Infinity, 
                    delay: Math.random() * 5 
                  }}
                />
              ))}
              <motion.circle
                cx={`${node.x}%`}
                cy={`${node.y}%`}
                r={node.size}
                fill="rgba(6,182,212,0.3)"
                animate={{ 
                  r: [node.size, node.size * 1.5, node.size],
                  opacity: [0.2, 0.5, 0.2]
                }}
                transition={{ duration: 3 + Math.random() * 2, repeat: Infinity }}
              />
            </g>
          ))}
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="order-1 lg:order-1 relative"
          >
            <motion.img
              src="/douglas-paiani01.png"
              alt="Foto Douglas Paiani"
              className="w-auto h-auto max-w-full max-h-[820px] select-none"
              draggable={false}
            />
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              className="flex absolute top-2 left-2 lg:top-10 lg:-left-4 px-3 py-1.5 lg:px-5 lg:py-2.5 rounded-full border border-fuchsia-400/35 bg-fuchsia-500/15 backdrop-blur-md text-fuchsia-100 text-[9px] lg:text-[11px] font-black uppercase tracking-wider items-center gap-2 lg:gap-3 shadow-[0_0_22px_rgba(217,70,239,0.22)] z-20"
            >
              <img src={logoOgiva} alt="Logo Ogiva" className="w-5 h-5 object-contain" />
              <span>CEO da Ogiva Digital</span>
            </motion.div>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              className="flex absolute top-[56%] left-[58%] -translate-x-1/2 -translate-y-1/2 lg:left-[62%] px-3 py-1.5 lg:px-5 lg:py-2.5 rounded-full border border-emerald-400/35 bg-emerald-500/15 backdrop-blur-md text-emerald-100 text-[9px] lg:text-[11px] font-black uppercase tracking-wider items-center gap-2 lg:gap-3 shadow-[0_0_22px_rgba(16,185,129,0.2)] z-20"
            >
              <img src={logoObsidiano} alt="Logo Obsidiano" className="w-5 h-5 object-contain" />
              <span>Criador do Obsidiano</span>
            </motion.div>
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
              className="flex absolute bottom-2 left-1 lg:bottom-12 lg:-left-6 px-3 py-1.5 lg:px-5 lg:py-2.5 rounded-full border border-cyan-300/30 bg-cyan-500/12 backdrop-blur-md text-cyan-100 text-[9px] lg:text-[11px] font-black uppercase tracking-wider items-center gap-2 lg:gap-3 shadow-[0_0_22px_rgba(34,211,238,0.18)] z-20"
            >
              <img src={logoBarberon} alt="Logo Barberon" className="w-5 h-5 object-contain" />
              <span>Criador do Barberon</span>
            </motion.div>
          </motion.div>

          <div className="order-2 lg:order-2">
            {/* AI Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-cyan-500/5 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-3 backdrop-blur-sm"
            >
              <div className="relative flex items-center justify-center">
                <Brain size={14} className="relative z-10" />
                <motion.div 
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-cyan-500 rounded-full"
                />
              </div>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                Especialista em inteligência artificial
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="mb-16"
            >
              <p className="text-xl md:text-4xl text-white/70 font-light leading-tight tracking-tight mb-4">
                Vamos criar um projeto<br/><span className="text-white font-medium">incrível para o seu negócio?</span>
              </p>
              <p className="text-white/65 text-base md:text-lg leading-relaxed max-w-2xl mb-6">
                Desenvolvimento de sites e sistemas sob medida, integração com inteligência artificial e SEO otimizado para gerar tráfego, autoridade e conversão.
              </p>
              <p className="text-cyan-400/80 font-mono text-base md:text-xl max-w-2xl leading-relaxed">
                {"> "}
                <TypingText text="Construindo o futuro através de arquiteturas neurais e sistemas autônomos." />
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-6"
            >
              <a
                href="#orcamento"
                className="group relative px-12 py-5 bg-white text-black font-black rounded-full overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  INICIAR PROJETO <Zap size={20} className="fill-current" />
                </span>
                <div className="absolute inset-0 bg-cyan-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </a>
              
              <a
                href="#portfolio-saas"
                className="group px-12 py-5 bg-transparent text-white font-bold rounded-full border border-white/10 hover:border-cyan-500/50 transition-all duration-300 backdrop-blur-md flex items-center gap-2"
              >
                <Activity size={20} className="text-cyan-400 group-hover:animate-pulse" />
                VER SISTEMAS
              </a>
            </motion.div>
          </div>
        </div>

        {/* AI Stats Grid */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[
            { icon: Cpu, label: "Neural Processing", value: "99.9%", color: "text-cyan-400" },
            { icon: Brain, label: "AI Expertise", value: "Elite", color: "text-blue-400" },
            { icon: Zap, label: "System Latency", value: "< 5ms", color: "text-purple-400" },
            { icon: Activity, label: "Uptime", value: "24/7", color: "text-emerald-400" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + i * 0.1 }}
              className="group flex flex-col items-center gap-4 p-8 rounded-[40px] bg-white/[0.02] border border-white/[0.05] hover:border-cyan-500/20 hover:bg-white/[0.04] transition-all duration-500"
            >
              <div className={`p-4 rounded-2xl bg-white/5 ${item.color} group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                <item.icon size={28} />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-black text-4xl tracking-tighter">{item.value}</span>
                <span className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em]">{item.label}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black via-black/80 to-transparent z-20" />
    </section>
  );
}
