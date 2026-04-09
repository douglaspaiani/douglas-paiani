import { motion, AnimatePresence } from "motion/react";
import { Helmet } from "react-helmet-async";
import { Globe, Zap, Shield, Search, Layout, Cpu, ChevronDown, Code2, Terminal, Sparkles } from "lucide-react";
import PricingTable from "@/src/components/PricingTable";
import AIServiceCard from "@/src/components/AIServiceCard";
import { useState } from "react";
import { cn } from "@/src/lib/utils";
import CodeWindow from "@/src/components/CodeWindow";
import MatrixRain from "@/src/components/MatrixRain";

const plans = [
  // ...
];

const faqs = [
  { q: "Quanto tempo leva para criar um site?", a: "Depende da complexidade. Uma Landing Page Elite leva cerca de 7-10 dias, enquanto um site institucional completo pode levar de 15 a 25 dias." },
  { q: "O site será otimizado para o Google?", a: "Sim, todos os projetos incluem SEO técnico avançado, otimização de velocidade e estrutura amigável para indexação." },
  { q: "Eu mesmo poderei atualizar o conteúdo?", a: "Com certeza. Integramos painéis administrativos intuitivos (CMS) para que você tenha total autonomia sobre textos e imagens." },
  { q: "O site é seguro contra invasões?", a: "Implementamos certificados SSL, firewalls de aplicação e as melhores práticas de segurança para garantir a integridade dos seus dados." },
];

export default function Sites() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="bg-black min-h-screen pt-32 pb-24 px-6 relative overflow-x-hidden">
      <Helmet>
        <title>Criação de Sites Profissionais & Landing Pages | Douglas Paiani</title>
        <meta name="description" content="Desenvolvimento de sites institucionais e landing pages de alta conversão. Design exclusivo, performance extrema e SEO técnico avançado." />
        <meta property="og:title" content="Criação de Sites Profissionais & Landing Pages | Douglas Paiani" />
        <meta property="og:description" content="Desenvolvimento de sites institucionais e landing pages de alta conversão. Design exclusivo, performance extrema e SEO técnico avançado." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://douglaspaiani.com.br/servicos/sites" />
        <link rel="canonical" href="https://douglaspaiani.com.br/servicos/sites" />
      </Helmet>

      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <MatrixRain colorClass="text-cyan-500" opacity="opacity-[0.03]" columns={20} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.1),transparent_50%)]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6"
          >
            <Sparkles size={12} />
            Web Neural Design
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">
            SITES QUE <br /><span className="text-cyan-400">VENDEM E ENCANTAM.</span>
          </h1>
          <p className="text-white/40 max-w-2xl text-lg font-light leading-relaxed">
            Não crio apenas sites. Construo máquinas de conversão neurais otimizadas para os motores de busca, 
            com design que reflete a excelência da sua marca.
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-8 mb-32">
          {[
            { icon: Zap, title: "Velocidade", desc: "Carregamento instantâneo em menos de 1s.", features: ["Core Web Vitals", "Lighthouse 100", "Edge Delivery"] },
            { icon: Search, title: "SEO", desc: "Estrutura pronta para o topo do Google.", features: ["Schema Markup", "Semantic HTML", "Keyword Strategy"] },
            { icon: Shield, title: "Segurança", desc: "Certificados SSL e proteção contra ataques.", features: ["WAF Protection", "DDoS Mitigation", "SSL/TLS 1.3"] },
            { icon: Layout, title: "Responsivo", desc: "Experiência perfeita em qualquer tela.", features: ["Mobile First", "Fluid Layouts", "Retina Ready"] },
            { icon: Cpu, title: "IA Integrada", desc: "Chatbots e automações inteligentes.", features: ["Neural Chat", "Smart Forms", "Auto-personalization"] },
            { icon: Globe, title: "Global", desc: "Pronto para múltiplos idiomas e mercados.", features: ["i18n Ready", "CDN Global", "Multi-region"] },
          ].map((item, i) => (
            <AIServiceCard 
              key={i}
              index={i}
              icon={item.icon}
              title={item.title}
              desc={item.desc}
              colorClass="text-cyan-400"
              features={item.features}
            />
          ))}
        </div>

        {/* AI & Tech Section */}
        <section className="py-32 grid md:grid-cols-2 gap-16 items-center border-y border-white/5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-4xl font-black text-white mb-8 tracking-tighter uppercase">
              Engenharia de <span className="text-cyan-400">Próxima Geração</span>
            </h2>
            <p className="text-white/60 mb-8 leading-relaxed font-light text-lg">
              Não usamos templates prontos. Cada linha de código é escrita pensando em 
              performance, acessibilidade e escalabilidade. Nossos sites são construídos 
              com as mesmas tecnologias neurais usadas por gigantes globais.
            </p>
            <div className="space-y-6">
              {[
                { title: "React & Next.js 15", desc: "O estado da arte em frameworks web para velocidade extrema." },
                { title: "Tailwind CSS 4", desc: "Estilização moderna e ultra-leve para carregamento instantâneo." },
                { title: "Edge Computing", desc: "Seu site servido de servidores globais mais próximos do usuário." },
              ].map((tech, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-cyan-500/30 transition-colors">
                    <Code2 className="text-cyan-400" size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm uppercase tracking-widest">{tech.title}</h4>
                    <p className="text-white/40 text-xs font-light">{tech.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          <div className="relative">
            <div className="absolute -inset-4 bg-cyan-500/10 blur-3xl rounded-full animate-pulse" />
            <CodeWindow code={`// Exemplo de Otimização de SEO & Performance
export default async function Page() {
  const data = await getOptimizedContent();
  
  return (
    <main className="animate-fade-in">
      <SEO 
        title={data.title} 
        description={data.description} 
        ogImage={data.image}
      />
      <Content data={data} />
    </main>
  );
}`} />
          </div>
        </section>

        {/* Pricing Section */}
        <PricingTable title="Tabela de Preços: Sites" plans={[
          {
            name: "Landing Page Elite",
            price: "R$ 599",
            description: "Focada em conversão máxima e performance extrema.",
            features: ["Design Exclusivo", "SEO Otimizado", "Desenvolvido em Next.js", "Hospedagem Premium", "Suporte 30 dias"]
          },
          {
            name: "Site Institucional",
            price: "R$ 1.899",
            description: "Presença digital sólida para empresas que buscam autoridade.",
            features: ["Até 10 Páginas", "Blog Integrado", "Painel Administrativo", "Desenvolvido em Next.js", "Segurança Avançada"],
            recommended: true
          },
          {
            name: "Site Avançado",
            price: "Sob Consulta",
            description: "Sistemas complexos com funcionalidades sob medida.",
            features: ["Funcionalidades Custom", "Integrações via API", "Escalabilidade Cloud", "Consultoria de UX", "SLA de Manutenção"]
          }
        ]} themeColor="cyan" />

        {/* FAQ Section */}
        <section className="py-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-white mb-12 text-center tracking-tighter uppercase">Perguntas Frequentes</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-white/5 rounded-2xl overflow-hidden bg-[#0a0a0a]">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-6 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                >
                  <span className="text-white font-medium text-sm tracking-tight">{faq.q}</span>
                  <ChevronDown className={cn("text-cyan-400 transition-transform", openFaq === i && "rotate-180")} size={20} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 text-white/40 text-sm leading-relaxed border-t border-white/5 font-light">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

