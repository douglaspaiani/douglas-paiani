import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Brain, Code, Rocket, Cpu, Zap, Activity, Terminal } from "lucide-react";
import MatrixRain from "@/src/components/MatrixRain";
import { useState, useEffect, useMemo } from "react";
import logoPrincipal from "@/src/images/logo.png";

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
        <MatrixRain colorClass="text-cyan-500" opacity="opacity-[0.04]" columns={25} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.15),transparent_70%)]" />
        
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

      <div className="max-w-7xl mx-auto px-6 text-center relative z-10 flex flex-col items-center">
        {/* AI Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-cyan-500/5 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-12 backdrop-blur-sm mx-auto"
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
            Neural Engine Active: v3.1-Elite
          </span>
        </motion.div>

        {/* Main Title with Scanning Effect */}
        <div className="relative inline-block mb-12 w-full max-w-5xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative mx-auto w-full px-4"
          >
            <motion.img
              src={logoPrincipal}
              alt="Logo Douglas Paiani"
              className="h-[220px] md:h-[300px] w-auto max-w-full mx-auto select-none drop-shadow-[0_0_28px_rgba(6,182,212,0.35)]"
              animate={{
                filter: [
                  "drop-shadow(0 0 16px rgba(6,182,212,0.25))",
                  "drop-shadow(0 0 34px rgba(59,130,246,0.45))",
                  "drop-shadow(0 0 16px rgba(6,182,212,0.25))",
                ],
              }}
              transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
              draggable={false}
            />

            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-400/25 to-blue-500/0 rounded-[2rem] pointer-events-none"
              animate={{ opacity: [0.25, 0.65, 0.25] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

          {/* Scanning Line */}
          <motion.div
            animate={{ 
              top: ["0%", "100%", "0%"],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent z-20 pointer-events-none shadow-[0_0_20px_rgba(6,182,212,1)]"
          />
          
          {/* AI Processing Text Overlay */}
          <div className="absolute -right-12 top-0 hidden lg:block">
            <motion.div
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-start gap-1 font-mono text-[8px] text-cyan-500/40 uppercase tracking-widest"
            >
              <span>[Processing_Core_01]</span>
              <span>[Status: Optimal]</span>
              <span>[Load: 14.2%]</span>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <p className="text-xl md:text-3xl text-white/70 font-light leading-tight tracking-tight mb-4">
            Engenheiro de Software & <span className="text-white font-medium">Especialista em IA</span>.
          </p>
          <p className="text-cyan-400/80 font-mono text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            {"> "}
            <TypingText text="Construindo o futuro através de arquiteturas neurais e sistemas autônomos." />
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-8"
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

        {/* AI Stats Grid */}
        <div className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[
            { icon: Cpu, label: "Neural Processing", value: "99.9%", color: "text-cyan-400" },
            { icon: Brain, label: "AI Expertise", value: "Elite", color: "text-blue-400" },
            { icon: Zap, label: "System Latency", value: "< 5ms", color: "text-purple-400" },
            { icon: Activity, label: "Uptime", value: "24/7", color: "text-emerald-400" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
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
