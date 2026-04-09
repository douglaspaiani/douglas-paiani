import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";
import MatrixRain from "./MatrixRain";

interface ProcessCardProps {
  step: string;
  title: string;
  desc: string;
  index: number;
}

const ProcessCard: React.FC<ProcessCardProps> = ({ step, title, desc, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative p-8 rounded-[32px] bg-[#0a0a0a] border border-white/10 overflow-hidden transition-all duration-500 hover:border-cyan-500/30 hover:shadow-[0_0_40px_rgba(6,182,212,0.05)]"
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
            <MatrixRain colorClass="text-cyan-400" opacity="opacity-[0.12]" columns={8} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-8">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-black text-xl group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-black transition-all duration-500">
            {step}
          </div>
          <span className="text-6xl font-black text-white/[0.03] group-hover:text-cyan-500/10 transition-colors duration-500 leading-none">
            {step}
          </span>
        </div>

        <h3 className="text-2xl font-black text-white mb-4 tracking-tight group-hover:text-cyan-400 transition-colors duration-300">
          {title}
        </h3>
        
        <p className="text-white/40 text-sm leading-relaxed font-light group-hover:text-white/70 transition-colors duration-300">
          {desc}
        </p>

        {/* Animated Progress Line */}
        <div className="mt-8 h-px w-full bg-white/5 relative overflow-hidden">
          <motion.div 
            initial={{ x: "-100%" }}
            whileInView={{ x: "100%" }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: index * 0.5 }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent w-1/2"
          />
        </div>
      </div>

      {/* Corner Accent */}
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)] animate-pulse" />
      </div>
    </motion.div>
  );
};

export default ProcessCard;
