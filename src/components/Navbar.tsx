import { motion, AnimatePresence, useMotionValue, useSpring } from "motion/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/src/lib/utils";
import { Cpu, Code2, Briefcase, Mail, Home, ChevronDown, Globe, ShoppingCart, Smartphone, Layers, Sparkles } from "lucide-react";
import { useState, useEffect, MouseEvent } from "react";

const navItems = [
  { name: "Início", path: "/", icon: Home },
  { name: "Sobre", path: "/sobre", icon: Cpu },
  { 
    name: "Serviços", 
    path: "#", 
    icon: Code2,
    dropdown: [
      { name: "Sites", path: "/servicos/sites", icon: Globe, desc: "Experiências web de alta performance" },
      { name: "Lojas Virtuais", path: "/servicos/lojas-virtuais", icon: ShoppingCart, desc: "E-commerce focado em conversão" },
      { name: "Aplicativos", path: "/servicos/aplicativos", icon: Smartphone, desc: "Apps nativos e híbridos inteligentes" },
      { name: "Plataformas Web", path: "/servicos/plataformas", icon: Layers, desc: "Sistemas complexos e escaláveis" },
    ]
  },
  { name: "Projetos", path: "/projetos", icon: Briefcase },
  { name: "Blog", path: "/blog", icon: Sparkles },
];

interface NavItemProps {
  key?: string | number;
  item: typeof navItems[0];
  isActive: boolean;
  pathnameAtual: string;
  isDropdownOpen?: boolean;
  setIsDropdownOpen?: (open: boolean) => void;
}

function NavItem({ item, isActive, pathnameAtual, isDropdownOpen, setIsDropdownOpen }: NavItemProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 15, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  function handleMouseMove(e: MouseEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set((e.clientX - centerX) * 0.4);
    mouseY.set((e.clientY - centerY) * 0.4);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  const Content = (
    <motion.div
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 flex items-center gap-2 cursor-pointer group",
        isActive ? "text-white" : "text-white/50 hover:text-white"
      )}
    >
      {isActive && (
        <motion.div
          layoutId="nav-active-pill"
          className="absolute inset-0 bg-white/10 border border-white/10 rounded-full -z-10 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      
      <item.icon 
        size={18} 
        className={cn(
          "transition-all duration-300 group-hover:scale-110 group-hover:rotate-3",
          isActive ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" : "text-inherit"
        )} 
      />
      
      <span className="hidden md:inline tracking-tight">{item.name}</span>
      
      {item.dropdown && (
        <ChevronDown 
          size={14} 
          className={cn(
            "transition-transform duration-500 ease-out opacity-50 group-hover:opacity-100", 
            isDropdownOpen && "rotate-180"
          )} 
        />
      )}

      {/* Hover Glow */}
      <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-20 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 blur-md" />
    </motion.div>
  );

  if (item.dropdown) {
    return (
      <li 
        className="relative"
        onMouseEnter={() => setIsDropdownOpen?.(true)}
        onMouseLeave={() => setIsDropdownOpen?.(false)}
      >
        {Content}
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.9, rotateX: -15 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, y: 10, scale: 0.9, rotateX: -10 }}
              transition={{ type: "spring", damping: 20, stiffness: 200 }}
              className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[280px] z-50"
              style={{ perspective: "1000px" }}
            >
              {/* Invisible Bridge to prevent mouse leave during transition to dropdown */}
              <div className="absolute top-0 left-0 w-full h-4" />
              
              <div className="p-3 rounded-2xl bg-black/80 backdrop-blur-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative">
                {/* Holographic Line */}
                <motion.div 
                  animate={{ y: [0, 240, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent z-10 opacity-30"
                />

                <div className="relative z-20 space-y-1">
                  <div className="px-3 py-2 mb-2">
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Sparkles size={10} /> Especialidades
                    </p>
                  </div>
                  {item.dropdown.map((subItem) => (
                    <Link
                      key={subItem.path}
                      to={subItem.path}
                      onClick={() => setIsDropdownOpen?.(false)}
                      className="flex items-start gap-4 px-4 py-3 rounded-xl hover:bg-white/5 transition-all group/sub"
                    >
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0 group-hover/sub:bg-cyan-500/10 transition-colors">
                        <subItem.icon size={18} className="text-white/40 group-hover/sub:text-cyan-400 transition-colors" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white/80 group-hover/sub:text-white transition-colors">{subItem.name}</h4>
                        <p className="text-[11px] text-white/30 leading-tight mt-0.5">{subItem.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </li>
    );
  }

  return (
    <li>
      <Link
        to={item.path}
        onClick={(e) => {
          // Garante topo ao clicar nos itens do menu.
          if (item.path === "/") {
            if (pathnameAtual === "/") {
              e.preventDefault();
            }
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
          }

          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        {Content}
      </Link>
    </li>
  );
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav 
      className={cn(
        "fixed top-8 left-1/2 -translate-x-1/2 z-50 px-3 py-2 rounded-full transition-all duration-500 flex items-center",
        scrolled 
          ? "bg-black/60 backdrop-blur-2xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.3)]" 
          : "bg-white/5 backdrop-blur-md border border-white/5"
      )}
    >
      <ul className="flex items-center gap-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.dropdown?.some(d => location.pathname === d.path));
          return (
            <NavItem 
              key={item.name} 
              item={item} 
              isActive={isActive} 
              pathnameAtual={location.pathname}
              isDropdownOpen={item.name === "Serviços" ? isDropdownOpen : undefined}
              setIsDropdownOpen={item.name === "Serviços" ? setIsDropdownOpen : undefined}
            />
          );
        })}
      </ul>

      <div className="ml-4 md:ml-6 pl-4 md:pl-6 border-l border-white/10 relative">
        <motion.button 
          onClick={() => {
            const element = document.getElementById('orcamento');
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            } else {
              navigate('/#orcamento');
            }
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative px-3 md:px-6 py-2 bg-cyan-500 text-black text-[10px] md:text-xs font-black uppercase tracking-widest rounded-full transition-all duration-300 whitespace-nowrap overflow-hidden group/btn"
        >
          {/* Pulse Effect */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5] 
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute inset-0 bg-cyan-400 rounded-full -z-10 blur-md"
          />

          {/* Shimmer/Shine */}
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: "200%" }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "linear",
              repeatDelay: 1
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 z-10"
          />

          <span className="relative z-20 flex items-center gap-2">
            Iniciar meu projeto
            <Sparkles size={14} className="animate-pulse" />
          </span>
        </motion.button>
      </div>
    </nav>
  );
}
