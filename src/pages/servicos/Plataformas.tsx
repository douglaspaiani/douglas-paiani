import { motion, AnimatePresence } from "motion/react";
import { Helmet } from "react-helmet-async";
import { Layers, Rocket, Database, Shield, Zap, Cpu, ChevronDown, Code2, Server, Sparkles } from "lucide-react";
import PricingTable from "@/src/components/PricingTable";
import AIServiceCard from "@/src/components/AIServiceCard";
import { useState } from "react";
import { cn } from "@/src/lib/utils";
import CodeWindow from "@/src/components/CodeWindow";
import MatrixRain from "@/src/components/MatrixRain";

const faqs = [
  { q: "Como vocês garantem a escalabilidade da plataforma?", a: "Utilizamos arquiteturas de microserviços e infraestrutura em nuvem (AWS/GCP) com auto-scaling, garantindo que o sistema suporte de 100 a 1 milhão de usuários." },
  { q: "A plataforma terá integração com sistemas de pagamento?", a: "Sim, integramos com Stripe, Pagar.me e outros gateways para gestão de assinaturas recorrentes e pagamentos únicos." },
  { q: "Vocês oferecem consultoria de arquitetura?", a: "Sim, todo projeto de plataforma começa com uma fase de design de arquitetura para garantir que a fundação técnica seja sólida." },
  { q: "Como é feita a segurança dos dados?", a: "Seguimos padrões rigorosos como LGPD e OWASP, implementando criptografia em repouso e em trânsito, além de auditorias constantes." },
];

const plans = [
  {
    name: "SaaS MVP",
    price: "R$ 3.299",
    description: "Lance seu produto digital com as funcionalidades essenciais.",
    features: ["Arquitetura Escalável", "Gestão de Assinaturas", "Painel de Admin", "Integração de Pagamentos", "Hospedagem Cloud"]
  },
  {
    name: "Plataforma Enterprise",
    price: "R$ 4.999",
    description: "Sistemas complexos para grandes operações e milhares de usuários.",
    features: ["Microserviços", "IA Generativa Integrada", "Segurança Bancária", "Multi-tenancy", "Monitoramento 24/7"],
    recommended: true
  },
  {
    name: "Custom Solution",
    price: "Sob Consulta",
    description: "Engenharia de software sob medida para desafios únicos.",
    features: ["Consultoria Estratégica", "Migração de Sistemas", "Big Data / Analytics", "Agentes de IA Autônomos", "SLA Personalizado"]
  }
];

export default function Plataformas() {
  return (
    <main className="bg-black min-h-screen pt-32 pb-24 px-6 relative overflow-x-hidden">
      <Helmet>
        <title>Desenvolvimento de Plataformas Web & SaaS Escaláveis | Douglas Paiani</title>
        <meta name="description" content="Engenharia de software para plataformas web complexas e SaaS. Arquitetura escalável, multi-tenancy e integração nativa com Inteligência Artificial." />
        <meta property="og:title" content="Desenvolvimento de Plataformas Web & SaaS Escaláveis | Douglas Paiani" />
        <meta property="og:description" content="Engenharia de software para plataformas web complexas e SaaS. Arquitetura escalável, multi-tenancy e integração nativa com Inteligência Artificial." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://douglaspaiani.com.br/servicos/plataformas" />
        <link rel="canonical" href="https://douglaspaiani.com.br/servicos/plataformas" />
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
            SaaS & Cloud Neural Engineering
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">
            PLATAFORMAS QUE <br /><span className="text-cyan-400">ESCALAM O SEU NEGÓCIO.</span>
          </h1>
          <p className="text-white/40 max-w-2xl text-lg font-light leading-relaxed">
            Engenharia de software de alto nível para criar produtos digitais robustos, 
            seguros e preparados para o crescimento global através de arquiteturas neurais.
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-8 mb-32">
          {[
            { icon: Database, title: "Escalabilidade", desc: "Infraestrutura que cresce junto com sua base de usuários.", features: ["Auto-scaling", "Load Balancing", "Multi-region"] },
            { icon: Shield, title: "Segurança", desc: "Padrões internacionais de proteção de dados e privacidade.", features: ["LGPD Ready", "OWASP Top 10", "SOC2 Compliance"] },
            { icon: Zap, title: "Alta Disponibilidade", desc: "Sistemas resilientes com uptime garantido de 99.9%.", features: ["Disaster Recovery", "Zero Downtime", "Failover"] },
            { icon: Cpu, title: "IA Nativa", desc: "Inteligência artificial integrada no core do seu produto.", features: ["LLM Integration", "Predictive Models", "Auto-ML"] },
            { icon: Rocket, title: "Time to Market", desc: "Desenvolvimento ágil focado em entregas de valor.", features: ["Agile/Scrum", "CI/CD Pipelines", "MVP Focus"] },
            { icon: Layers, title: "Arquitetura", desc: "Código limpo e modular para fácil manutenção futura.", features: ["Microservices", "Clean Code", "Domain Driven Design"] },
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
          <div className="order-2 md:order-1 relative">
            <div className="absolute -inset-4 bg-cyan-500/10 blur-3xl rounded-full animate-pulse" />
            <CodeWindow code={`// Exemplo de Arquitetura SaaS Escalável
const system = new SaaSPlatform({
  database: new DistributedDB('PostgreSQL'),
  cache: new RedisCluster(),
  ai: new LLMService({
    provider: 'Gemini-3-Pro',
    streaming: true
  }),
  scaling: {
    minNodes: 3,
    maxNodes: 100
  }
});`} />
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="order-1 md:order-2"
          >
            <h2 className="text-4xl font-black text-white mb-8 tracking-tighter uppercase">
              SaaS <span className="text-cyan-400">Architecture</span>
            </h2>
            <p className="text-white/60 mb-8 leading-relaxed font-light text-lg">
              Construímos plataformas que são verdadeiros ativos digitais. 
              Focamos em multi-tenancy seguro, gestão de assinaturas robusta 
              e integração nativa com ferramentas de IA para dar vantagem competitiva ao seu produto.
            </p>
            <div className="space-y-6">
              {[
                { title: "Microserviços & Serverless", desc: "Arquitetura moderna para manutenção simplificada e baixo custo." },
                { title: "Multi-tenant Database", desc: "Isolamento total de dados entre seus clientes corporativos." },
                { title: "AI Agents Integration", desc: "Automação de processos complexos dentro da sua plataforma." },
              ].map((tech, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-cyan-500/30 transition-colors">
                    <Server className="text-cyan-400" size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm uppercase tracking-widest">{tech.title}</h4>
                    <p className="text-white/40 text-xs font-light">{tech.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        <PricingTable title="Tabela de Preços: Plataformas & SaaS" plans={plans} themeColor="cyan" />

        {/* FAQ Section */}
        <section className="py-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-white mb-12 text-center tracking-tighter uppercase">Perguntas Frequentes</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => {
              const [isOpen, setIsOpen] = useState(false);
              return (
                <div key={i} className="border border-white/5 rounded-2xl overflow-hidden bg-[#0a0a0a]">
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full p-6 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                  >
                    <span className="text-white font-medium text-sm tracking-tight">{faq.q}</span>
                    <ChevronDown className={cn("text-cyan-400 transition-transform", isOpen && "rotate-180")} size={20} />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
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
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
