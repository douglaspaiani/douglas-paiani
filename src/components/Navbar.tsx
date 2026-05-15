import { motion, AnimatePresence, useMotionValue, useSpring } from "motion/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/src/lib/utils";
import {
  Cpu,
  Code2,
  Briefcase,
  Home,
  ChevronDown,
  Globe,
  ShoppingCart,
  Smartphone,
  Layers,
  Sparkles,
  Menu,
  X,
  GraduationCap,
} from "lucide-react";
import { useState, useEffect, MouseEvent } from "react";
import logoPrincipal from "@/src/images/logo.png";

const itensNavegacao = [
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
    ],
  },
  { name: "Cursos", path: "/cursos", icon: GraduationCap },
  { name: "Projetos", path: "/projetos", icon: Briefcase },
  { name: "Blog", path: "/blog", icon: Sparkles },
];

interface PropriedadesItemNavegacao {
  item: typeof itensNavegacao[0];
  ativo: boolean;
  pathnameAtual: string;
  dropdownAberto?: boolean;
  definirDropdownAberto?: (aberto: boolean) => void;
}

function ItemNavegacaoDesktop({
  item,
  ativo,
  pathnameAtual,
  dropdownAberto,
  definirDropdownAberto,
}: PropriedadesItemNavegacao) {
  const valorMouseX = useMotionValue(0);
  const valorMouseY = useMotionValue(0);
  const configuracaoMola = { damping: 15, stiffness: 150 };
  const posicaoX = useSpring(valorMouseX, configuracaoMola);
  const posicaoY = useSpring(valorMouseY, configuracaoMola);

  function aoMoverMouse(e: MouseEvent<HTMLElement>) {
    const retangulo = e.currentTarget.getBoundingClientRect();
    const centroX = retangulo.left + retangulo.width / 2;
    const centroY = retangulo.top + retangulo.height / 2;
    valorMouseX.set((e.clientX - centroX) * 0.4);
    valorMouseY.set((e.clientY - centroY) * 0.4);
  }

  function aoSairMouse() {
    valorMouseX.set(0);
    valorMouseY.set(0);
  }

  const conteudoItem = (
    <motion.div
      style={{ x: posicaoX, y: posicaoY }}
      onMouseMove={aoMoverMouse}
      onMouseLeave={aoSairMouse}
      className={cn(
        "relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 flex items-center gap-2 cursor-pointer group",
        ativo ? "text-white" : "text-white/50 hover:text-white",
      )}
    >
      {ativo && (
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
          ativo ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" : "text-inherit",
        )}
      />

      <span className="hidden md:inline tracking-tight">{item.name}</span>

      {item.dropdown && (
        <ChevronDown
          size={14}
          className={cn(
            "transition-transform duration-500 ease-out opacity-50 group-hover:opacity-100",
            dropdownAberto && "rotate-180",
          )}
        />
      )}

      <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-20 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 blur-md" />
    </motion.div>
  );

  if (item.dropdown) {
    return (
      <li
        className="relative"
        onMouseEnter={() => definirDropdownAberto?.(true)}
        onMouseLeave={() => definirDropdownAberto?.(false)}
      >
        {conteudoItem}
        <AnimatePresence>
          {dropdownAberto && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.9, rotateX: -15 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, y: 10, scale: 0.9, rotateX: -10 }}
              transition={{ type: "spring", damping: 20, stiffness: 200 }}
              className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[280px] z-50"
              style={{ perspective: "1000px" }}
            >
              <div className="absolute top-0 left-0 w-full h-4" />

              <div className="p-3 rounded-2xl bg-black/80 backdrop-blur-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative">
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
                      onClick={() => {
                        definirDropdownAberto?.(false);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
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
        {conteudoItem}
      </Link>
    </li>
  );
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownAbertoDesktop, setDropdownAbertoDesktop] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);
  const [submenuServicosMobileAberto, setSubmenuServicosMobileAberto] = useState(false);

  useEffect(() => {
    const lidarScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", lidarScroll);
    return () => window.removeEventListener("scroll", lidarScroll);
  }, []);

  useEffect(() => {
    if (menuMobileAberto) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuMobileAberto]);

  useEffect(() => {
    setMenuMobileAberto(false);
    setSubmenuServicosMobileAberto(false);
  }, [location.pathname, location.hash]);

  const irParaOrcamento = () => {
    const elemento = document.getElementById("orcamento");
    if (elemento) {
      elemento.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/#orcamento");
    }
  };

  const verificarItemAtivo = (item: typeof itensNavegacao[number], caminhoAtual: string) => {
    if (item.dropdown) {
      return item.dropdown.some(
        (subItem) =>
          caminhoAtual === subItem.path || caminhoAtual.startsWith(`${subItem.path}/`),
      );
    }

    if (item.path === "/") return caminhoAtual === "/";
    return caminhoAtual === item.path || caminhoAtual.startsWith(`${item.path}/`);
  };

  return (
    <>
      <nav
        className={cn(
          "hidden md:flex fixed top-8 left-1/2 -translate-x-1/2 z-50 px-3 py-2 rounded-full transition-all duration-500 items-center",
          scrolled
            ? "bg-black/60 backdrop-blur-2xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
            : "bg-white/5 backdrop-blur-md border border-white/5",
        )}
      >
        <ul className="flex items-center gap-2">
          {itensNavegacao.map((item) => {
            const ativo = verificarItemAtivo(item, location.pathname);
            return (
              <ItemNavegacaoDesktop
                key={item.name}
                item={item}
                ativo={Boolean(ativo)}
                pathnameAtual={location.pathname}
                dropdownAberto={item.name === "Serviços" ? dropdownAbertoDesktop : undefined}
                definirDropdownAberto={item.name === "Serviços" ? setDropdownAbertoDesktop : undefined}
              />
            );
          })}
        </ul>

        <div className="ml-6 pl-6 border-l border-white/10 relative">
          <motion.button
            onClick={irParaOrcamento}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative px-6 py-2 bg-cyan-500 text-black text-xs font-black uppercase tracking-widest rounded-full transition-all duration-300 whitespace-nowrap overflow-hidden group/btn"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 bg-cyan-400 rounded-full -z-10 blur-md"
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "200%" }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
                repeatDelay: 1,
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

      <nav className="md:hidden fixed top-4 left-4 right-4 z-50">
        <div className="bg-black/70 backdrop-blur-2xl border border-white/10 rounded-2xl px-4 py-3 flex items-center justify-between shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
          <Link
            to="/"
            onClick={() => {
              setMenuMobileAberto(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center"
          >
            <img src={logoPrincipal} alt="Logo" className="h-9 w-auto" />
          </Link>

          <button
            type="button"
            onClick={() => setMenuMobileAberto((estado) => !estado)}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80"
            aria-label={menuMobileAberto ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuMobileAberto}
            aria-controls="menu-mobile-principal"
          >
            {menuMobileAberto ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuMobileAberto && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuMobileAberto(false)}
              className="md:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            />

            <motion.aside
              id="menu-mobile-principal"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              className="md:hidden fixed top-0 right-0 bottom-0 z-50 w-[86%] max-w-[360px] bg-[#050505] border-l border-white/10 p-6 pt-24 overflow-y-auto"
            >
              <button
                type="button"
                onClick={() => setMenuMobileAberto(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/80 z-10"
                aria-label="Fechar menu"
              >
                <X size={20} />
              </button>

              <div className="flex items-center justify-between mb-6">
                <img src={logoPrincipal} alt="Logo" className="h-8 w-auto" />
              </div>

              <div className="space-y-2">
                {itensNavegacao.map((item) => {
                  const ativo = verificarItemAtivo(item, location.pathname);

                  if (item.dropdown) {
                    return (
                      <div key={item.name} className="rounded-2xl border border-white/10 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setSubmenuServicosMobileAberto((estado) => !estado)}
                          className="w-full px-4 py-4 flex items-center justify-between text-white/80"
                        >
                          <span className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest">
                            <item.icon size={18} />
                            {item.name}
                          </span>
                          <ChevronDown
                            size={16}
                            className={cn(
                              "transition-transform duration-300",
                              submenuServicosMobileAberto && "rotate-180",
                            )}
                          />
                        </button>

                        <AnimatePresence>
                          {submenuServicosMobileAberto && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="px-2 pb-3 space-y-1">
                                {item.dropdown.map((subItem) => (
                                  <Link
                                    key={subItem.path}
                                    to={subItem.path}
                                    onClick={() => {
                                      setMenuMobileAberto(false);
                                      setSubmenuServicosMobileAberto(false);
                                      window.scrollTo({ top: 0, behavior: "smooth" });
                                    }}
                                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/5"
                                  >
                                    <subItem.icon size={16} />
                                    {subItem.name}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={(e) => {
                        if (item.path === "/") {
                          if (location.pathname === "/") {
                            e.preventDefault();
                          }
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        } else {
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                        setMenuMobileAberto(false);
                      }}
                      className={cn(
                        "flex items-center gap-3 px-4 py-4 rounded-2xl border text-sm font-bold uppercase tracking-widest",
                        ativo
                          ? "bg-cyan-500 text-black border-cyan-500"
                          : "bg-white/5 text-white/70 border-white/10 hover:text-white",
                      )}
                    >
                      <item.icon size={18} />
                      {item.name}
                    </Link>
                  );
                })}
              </div>

              <button
                onClick={() => {
                  setMenuMobileAberto(false);
                  irParaOrcamento();
                }}
                className="w-full mt-6 py-4 bg-cyan-500 text-black rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2"
              >
                Iniciar meu projeto
                <Sparkles size={14} />
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
