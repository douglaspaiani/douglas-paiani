import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface CustomSelectProps {
  options: string[] | { label: string; icon?: React.ReactNode }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export default function CustomSelect({ options, value, onChange, placeholder, label }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const getLabel = (val: string) => {
    if (!val) return placeholder;
    const option = options.find(o => typeof o === 'string' ? o === val : o.label === val);
    return typeof option === 'string' ? option : option?.label || val;
  };

  const getIcon = (val: string) => {
    const option = options.find(o => typeof o === 'string' ? o === val : o.label === val);
    return typeof option === 'string' ? null : option?.icon;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-2 relative" ref={containerRef}>
      {label && (
        <label className="text-xs uppercase tracking-widest font-bold text-white/40 ml-2">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full px-6 py-4 rounded-2xl bg-black border border-white/10 text-white text-left flex items-center justify-between transition-all duration-300",
          isOpen ? "border-cyan-500 ring-1 ring-cyan-500/20" : "hover:border-white/20"
        )}
      >
        <div className="flex items-center gap-3">
          {value && getIcon(value) && <div className="text-cyan-400">{getIcon(value)}</div>}
          <span className={cn(!value && "text-white/40")}>
            {getLabel(value)}
          </span>
        </div>
        <ChevronDown 
          className={cn("text-cyan-400 transition-transform duration-300", isOpen && "rotate-180")} 
          size={18} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 p-2 rounded-2xl bg-[#0a0a0a] border border-white/10 shadow-2xl backdrop-blur-xl"
          >
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {options.map((option) => {
                const optLabel = typeof option === 'string' ? option : option.label;
                const optIcon = typeof option === 'string' ? null : option.icon;
                
                return (
                  <button
                    key={optLabel}
                    type="button"
                    onClick={() => {
                      onChange(optLabel);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full px-4 py-3 rounded-xl text-left text-sm transition-all flex items-center justify-between group",
                      value === optLabel 
                        ? "bg-cyan-500/10 text-cyan-400" 
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {optIcon && <div className={cn("transition-colors", value === optLabel ? "text-cyan-400" : "text-white/20 group-hover:text-cyan-400/60")}>{optIcon}</div>}
                      {optLabel}
                    </div>
                    {value === optLabel && <Check size={14} className="text-cyan-400" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
