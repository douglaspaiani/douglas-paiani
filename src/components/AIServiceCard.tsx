import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LucideIcon, Cpu, Brain, Zap, Activity } from "lucide-react";
import { cn } from "@/src/lib/utils";
import MatrixRain from "./MatrixRain";

interface AIServiceCardProps {
  icon: LucideIcon;
  title: string;
  desc: string;
  colorClass?: string;
  index: number;
  features?: string[];
}

export const AIServiceCard: React.FC<AIServiceCardProps> = ({ 
  icon: Icon, 
  title, 
  desc, 
  colorClass = "text-cyan-400", 
  index,
  features = []
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [load, setLoad] = useState(0);

  useEffect(() => {
    if (isHovered) {
      const interval = setInterval(() => {
        setLoad(Math.floor(Math.random() * 100));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isHovered]);

  const nodes = useMemo(() => Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
  })), []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative p-8 rounded-[40px] bg-[#050505] border border-white/5 overflow-hidden transition-all duration-700 hover:border-cyan-500/30 hover:shadow-[0_0_50px_rgba(6,182,212,0.05)]"
    >
      {/* AI Background Layers */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-0"
          >
            <MatrixRain colorClass={colorClass} opacity="opacity-[0.05]" columns={10} />
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-10" />
            
            {/* Neural Connections */}
            <svg className="absolute inset-0 w-full h-full opacity-10">
              {nodes.map((node, i) => (
                <g key={i}>
                  {nodes.slice(i + 1, i + 3).map((target, j) => (
                    <motion.line
                      key={j}
                      x1={`${node.x}%`}
                      y1={`${node.y}%`}
                      x2={`${target.x}%`}
                      y2={`${target.y}%`}
                      stroke="currentColor"
                      className={colorClass}
                      strokeWidth="0.5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  ))}
                </g>
              ))}
            </svg>

            {/* Scanning Line */}
            <motion.div
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className={cn("absolute left-0 right-0 h-px z-20 shadow-[0_0_15px_rgba(6,182,212,0.5)]", colorClass.replace('text-', 'bg-'))}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-8">
          <div className={cn(
            "w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:bg-white/10 group-hover:border-cyan-500/20",
            isHovered && "shadow-[0_0_30px_rgba(6,182,212,0.1)]"
          )}>
            <Icon className={cn("transition-all duration-500 group-hover:scale-110", colorClass)} size={32} />
          </div>
          
          {/* AI Status Indicator */}
          <div className="flex flex-col items-end font-mono text-[8px] text-white/20 uppercase tracking-widest">
            <span className="flex items-center gap-1">
              <div className={cn("w-1 h-1 rounded-full animate-pulse", isHovered ? "bg-cyan-500" : "bg-white/20")} />
              {isHovered ? "Processing" : "Standby"}
            </span>
            {isHovered && <span>Load: {load}%</span>}
          </div>
        </div>
        
        <h3 className="text-2xl font-black text-white mb-4 tracking-tighter group-hover:text-cyan-400 transition-colors duration-300">
          {title}
        </h3>
        
        <p className="text-white/40 text-sm leading-relaxed font-light mb-8 group-hover:text-white/70 transition-colors duration-500">
          {desc}
        </p>

        {/* Features List */}
        {features.length > 0 && (
          <div className="space-y-3 mb-8">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-white/30 group-hover:text-white/50 transition-colors">
                <div className={cn("w-1 h-1 rounded-full", colorClass.replace('text-', 'bg-'))} />
                {feature}
              </div>
            ))}
          </div>
        )}

        {/* Action Indicator */}
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-500 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-[-10px] group-hover:translate-x-0">
          Neural Link Active <Zap size={10} className="fill-current" />
        </div>
      </div>

      {/* Background Glow */}
      <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-cyan-500/10 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </motion.div>
  );
};

export default AIServiceCard;
