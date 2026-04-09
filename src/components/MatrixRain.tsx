import React from "react";
import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";

interface MatrixRainProps {
  colorClass?: string;
  opacity?: string;
  columns?: number;
}

const MatrixRain: React.FC<MatrixRainProps> = ({ 
  colorClass = "text-cyan-400", 
  opacity = "opacity-[0.15]",
  columns = 15 
}) => {
  return (
    <div className={cn("absolute inset-0 z-0 pointer-events-none select-none overflow-hidden flex justify-around", opacity)}>
      {Array.from({ length: columns }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: -1000 }}
          animate={{ y: 0 }}
          transition={{
            duration: 8 + Math.random() * 15,
            repeat: Infinity,
            ease: "linear",
            delay: -Math.random() * 20,
          }}
          className={cn("font-mono text-[10px] flex flex-col gap-1 leading-none", colorClass)}
          style={{
            textShadow: "0 0 8px currentColor",
          }}
        >
          {Array.from({ length: 60 }).map((_, j) => (
            <span key={j} className={cn(j === 0 ? "text-white brightness-150" : "")}>
              {Math.random() > 0.5 ? (Math.random() * 1000).toString(16).slice(0, 2) : String.fromCharCode(33 + Math.floor(Math.random() * 94))}
            </span>
          ))}
        </motion.div>
      ))}
    </div>
  );
};

export default MatrixRain;
