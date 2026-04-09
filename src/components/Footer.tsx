import { motion } from "motion/react";
import { Github, Linkedin, Instagram, Mail, MapPin, ArrowRight } from "lucide-react";
import QuoteForm from "./QuoteForm";
import { Link } from "react-router-dom";
import logoPrincipal from "@/src/images/logo.png";

function IconeWhatsapp() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" className="text-cyan-400">
      <path
        fill="currentColor"
        d="M20.52 3.48A11.78 11.78 0 0 0 12.06 0C5.46 0 .06 5.4.06 12c0 2.1.54 4.14 1.56 5.94L0 24l6.24-1.62A11.97 11.97 0 0 0 12.06 24c6.6 0 12-5.4 12-12 0-3.18-1.26-6.18-3.54-8.52Zm-8.46 18.48c-1.8 0-3.54-.48-5.1-1.38l-.36-.18-3.72.96.96-3.66-.24-.36A9.84 9.84 0 0 1 2.1 12c0-5.46 4.5-9.9 9.96-9.9 2.64 0 5.16 1.02 7.02 2.88A9.85 9.85 0 0 1 21.96 12c0 5.46-4.44 9.96-9.9 9.96Zm5.46-7.44c-.3-.18-1.74-.84-2.04-.96-.24-.12-.42-.18-.6.18-.18.3-.72.96-.9 1.14-.18.18-.3.24-.6.06-.3-.18-1.2-.42-2.28-1.38-.84-.72-1.44-1.68-1.62-1.98-.18-.3 0-.42.12-.6.12-.12.3-.3.42-.48.12-.18.18-.3.3-.48.06-.18 0-.36 0-.54-.06-.12-.6-1.5-.84-2.1-.24-.54-.48-.48-.66-.48h-.54c-.18 0-.48.06-.72.3s-.96.9-.96 2.16.96 2.46 1.08 2.64c.12.18 1.86 2.88 4.5 4.02 2.64 1.14 2.64.78 3.12.72.48-.06 1.74-.72 1.98-1.38.24-.72.24-1.26.18-1.38-.06-.12-.24-.18-.54-.36Z"
      />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-black pt-24 pb-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-5 gap-12 mb-16">
          <div className="col-span-2">
            <img
              src={logoPrincipal}
              alt="Logo Douglas Paiani"
              className="h-9 md:h-10 w-auto mb-6 drop-shadow-[0_0_12px_rgba(6,182,212,0.25)]"
            />
            <p className="text-white/40 max-w-sm mb-8 leading-relaxed">
              Engenheiro de Software com 15 anos de experiência, especialista em IA e criador de SaaS de alto nível. 
              Transformando visões complexas em realidade digital escalável.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://github.com/douglaspaiani" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-cyan-400 hover:bg-white/10 transition-all"><Github size={18} /></a>
              <a href="https://www.linkedin.com/in/douglaspaiani/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-cyan-400 hover:bg-white/10 transition-all"><Linkedin size={18} /></a>
              <a href="https://instagram.com/douglaspaiani" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-cyan-400 hover:bg-white/10 transition-all"><Instagram size={18} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Serviços</h4>
            <ul className="space-y-4">
              <li><Link to="/servicos/sites" className="text-white/40 hover:text-cyan-400 transition-colors text-sm flex items-center gap-2 group"><ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" /> Sites</Link></li>
              <li><Link to="/servicos/lojas-virtuais" className="text-white/40 hover:text-cyan-400 transition-colors text-sm flex items-center gap-2 group"><ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" /> E-commerce</Link></li>
              <li><Link to="/servicos/aplicativos" className="text-white/40 hover:text-cyan-400 transition-colors text-sm flex items-center gap-2 group"><ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" /> Apps</Link></li>
              <li><Link to="/servicos/plataformas" className="text-white/40 hover:text-cyan-400 transition-colors text-sm flex items-center gap-2 group"><ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" /> SaaS</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Empresa</h4>
            <ul className="space-y-4">
              <li><Link to="/sobre" className="text-white/40 hover:text-cyan-400 transition-colors text-sm flex items-center gap-2 group"><ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" /> Sobre</Link></li>
              <li><Link to="/projetos" className="text-white/40 hover:text-cyan-400 transition-colors text-sm flex items-center gap-2 group"><ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" /> Projetos</Link></li>
              <li><Link to="/blog" className="text-white/40 hover:text-cyan-400 transition-colors text-sm flex items-center gap-2 group"><ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" /> Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Contato</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-white/40 text-sm">
                <Mail size={16} className="text-cyan-400" />
                contato@douglaspaiani.com.br
              </li>
              <li className="flex items-center gap-3 text-white/40 text-sm">
                <MapPin size={16} className="text-cyan-400" />
                Estância Velha / RS
              </li>
              <li className="flex items-center gap-3 text-white/40 text-sm">
                <IconeWhatsapp />
                <a
                  href="https://wa.me/5551994727036"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors"
                >
                  +55 (51) 99472-7036
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/20 text-xs uppercase tracking-widest font-bold">
            © 2026 Douglas Paiani. Todos os direitos reservados.
          </p>
          <div className="flex gap-8">
            <Link to="/privacidade" className="text-white/20 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">Privacidade</Link>
            <Link to="/termos" className="text-white/20 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">Termos</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
