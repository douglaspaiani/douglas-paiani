import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { Check, Sparkles, Zap, Shield, Rocket, ArrowRight } from "lucide-react";
import { MouseEvent } from "react";
import { cn } from "@/src/lib/utils";
import { Link, useNavigate } from "react-router-dom";

interface Plan {
  name: string;
  price: string;
  description: string;
  features: string[];
  recommended?: boolean;
}

interface PricingTableProps {
  title: string;
  plans: Plan[];
  themeColor?: "cyan" | "emerald" | "blue" | "purple";
}

const PRICING_COLORS = {
  cyan: {
    border: "border-cyan-500/50",
    bg: "from-cyan-500/10",
    text: "text-cyan-400",
    btn: "bg-cyan-500",
    glow: "bg-cyan-500/5",
    shadow: "shadow-[0_0_40px_rgba(6,182,212,0.1)]",
    btnShadow: "hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]",
    iconBg: "bg-cyan-500/10",
    iconBorder: "border-cyan-500/20",
    checkBg: "bg-cyan-500/10"
  },
  emerald: {
    border: "border-emerald-500/50",
    bg: "from-emerald-500/10",
    text: "text-emerald-400",
    btn: "bg-emerald-400",
    glow: "bg-emerald-500/5",
    shadow: "shadow-[0_0_40px_rgba(16,185,129,0.1)]",
    btnShadow: "hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]",
    iconBg: "bg-emerald-500/10",
    iconBorder: "border-emerald-500/20",
    checkBg: "bg-emerald-500/10"
  },
  blue: {
    border: "border-blue-500/50",
    bg: "from-blue-500/10",
    text: "text-blue-400",
    btn: "bg-blue-500",
    glow: "bg-blue-500/5",
    shadow: "shadow-[0_0_40px_rgba(59,130,246,0.1)]",
    btnShadow: "hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]",
    iconBg: "bg-blue-500/10",
    iconBorder: "border-blue-500/20",
    checkBg: "bg-blue-500/10"
  },
  purple: {
    border: "border-purple-500/50",
    bg: "from-purple-500/10",
    text: "text-purple-400",
    btn: "bg-purple-500",
    glow: "bg-purple-500/5",
    shadow: "shadow-[0_0_40px_rgba(168,85,247,0.1)]",
    btnShadow: "hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]",
    iconBg: "bg-purple-500/10",
    iconBorder: "border-purple-500/20",
    checkBg: "bg-purple-500/10"
  }
};

interface PricingCardProps {
  plan: Plan;
  index: number;
  themeColor?: string;
  key?: any;
}

function PricingCard({ plan, index, themeColor = "cyan" }: PricingCardProps) {
  const navigate = useNavigate();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const colors = PRICING_COLORS[themeColor as keyof typeof PRICING_COLORS] || PRICING_COLORS.cyan;

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.8 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={cn(
        "relative p-8 rounded-[32px] border transition-all duration-500 group",
        plan.recommended 
          ? cn("bg-gradient-to-b to-transparent", colors.bg, colors.border, colors.shadow) 
          : "bg-white/5 border-white/10 hover:border-white/20"
      )}
    >
      {plan.recommended && (
        <>
          <div className={cn("absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 text-black text-[10px] font-black rounded-full tracking-[0.2em] z-20", colors.btn)}>
            MAIS POPULAR
          </div>
          <div className={cn("absolute inset-0 blur-3xl rounded-full -z-10 animate-pulse", colors.glow)} />
        </>
      )}

      <div style={{ transform: "translateZ(50px)" }} className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight mb-1">{plan.name}</h3>
            <p className="text-white/40 text-xs font-medium uppercase tracking-widest">Plano Profissional</p>
          </div>
          <motion.div 
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center border transition-colors",
              plan.recommended ? cn(colors.iconBg, colors.iconBorder, colors.text) : "bg-white/5 border-white/10 text-white/20 group-hover:text-white/40"
            )}
          >
            {index === 0 ? <Zap size={20} /> : index === 1 ? <Sparkles size={20} /> : <Rocket size={20} />}
          </motion.div>
        </div>

        <div className="mb-8">
          <div className="flex items-baseline gap-1 relative group/price">
            <span className={cn("text-4xl font-black tracking-tighter transition-colors", plan.recommended ? "text-white" : "text-white/90")}>
              {plan.price}
            </span>
            {plan.price !== "Sob Consulta" && <span className="text-white/30 text-sm font-medium">/projeto</span>}
            
            {/* Shimmer Effect on Price */}
            <motion.div 
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 pointer-events-none"
            />
          </div>
          <p className="text-white/50 text-sm mt-4 leading-relaxed font-light">{plan.description}</p>
        </div>

        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

        <ul className="space-y-4 mb-10">
          {plan.features.map((feature, j) => (
            <motion.li 
              key={j} 
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + j * 0.05 }}
              className="flex items-center gap-3 text-sm text-white/60 group-hover:text-white/80 transition-colors"
            >
              <div className={cn("w-5 h-5 rounded-full flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.1)]", colors.checkBg)}>
                <Check size={12} className={colors.text} />
              </div>
              {feature}
            </motion.li>
          ))}
        </ul>

        <button 
          onClick={() => {
            const element = document.getElementById('orcamento');
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            } else {
              navigate('/#orcamento');
            }
          }}
          className={cn(
            "w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-500 group/btn relative overflow-hidden",
            plan.recommended 
              ? cn(colors.btn, "text-black", colors.btnShadow) 
              : "bg-white/5 text-white border border-white/10 hover:bg-white/10"
          )}
        >
          <span className="relative z-10">Solicitar Orçamento</span>
          <ArrowRight size={18} className="relative z-10 group-hover/btn:translate-x-1 transition-transform" />
          
          {/* Button Shine Effect */}
          <motion.div 
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
          />
        </button>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden rounded-[32px]">
        <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
      </div>
    </motion.div>
  );
}

export default function PricingTable({ title, plans, themeColor = "cyan" }: PricingTableProps) {
  return (
    <section className="py-32 relative">
      <div className="text-center mb-20">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-6"
        >
          Investment Plans
        </motion.div>
        <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">{title}</h2>
        <p className="text-white/40 max-w-xl mx-auto font-light text-lg">Investimento transparente para projetos de alta performance e escala global.</p>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {plans.map((plan, i) => (
          <PricingCard key={i} plan={plan} index={i} themeColor={themeColor} />
        ))}
      </div>
    </section>
  );
}
