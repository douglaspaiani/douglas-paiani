import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/src/lib/utils";
import MatrixRain from "./MatrixRain";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  desc: string;
  colorClass?: string;
  index: number;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ icon: Icon, title, desc, colorClass = "text-cyan-400", index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative p-8 rounded-[32px] bg-[#0a0a0a] border border-white/10 overflow-hidden transition-all duration-500 hover:border-white/20 hover:shadow-[0_0_40px_rgba(255,255,255,0.03)]"
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
            <MatrixRain colorClass={colorClass} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10">
        <div className={cn(
          "w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:bg-white/10",
          isHovered && "border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
        )}>
          <Icon className={cn("transition-all duration-500 group-hover:scale-110", colorClass)} size={28} />
        </div>
        
        <h3 className="text-2xl font-black text-white mb-3 tracking-tight group-hover:text-cyan-400 transition-colors duration-300">
          {title}
        </h3>
        
        <p className="text-white/40 text-sm leading-relaxed font-light group-hover:text-white/60 transition-colors duration-300">
          {desc}
        </p>

        {/* Bottom Line Decoration */}
        <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Corner Accent */}
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className={cn("w-1 h-1 rounded-full animate-ping", colorClass.replace('text-', 'bg-'))} />
      </div>
    </motion.div>
  );
};

export default ServiceCard;
