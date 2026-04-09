import { motion, AnimatePresence } from "motion/react";
import { Helmet } from "react-helmet-async";
import { ShoppingCart, CreditCard, Box, BarChart, Users, Zap, ChevronDown, Code2, Database, Sparkles } from "lucide-react";
import PricingTable from "@/src/components/PricingTable";
import AIServiceCard from "@/src/components/AIServiceCard";
import { useState } from "react";
import { cn } from "@/src/lib/utils";
import CodeWindow from "@/src/components/CodeWindow";
import MatrixRain from "@/src/components/MatrixRain";

const faqs = [
  { q: "Quais plataformas vocês utilizam?", a: "Trabalhamos com Shopify, WooCommerce e soluções Headless personalizadas, dependendo da necessidade de escala do seu negócio." },
  { q: "A loja já vem com meios de pagamento configurados?", a: "Sim, integramos com os principais gateways do mercado como Mercado Pago, Stripe e Pagar.me." },
  { q: "Como funciona o suporte pós-lançamento?", a: "Oferecemos suporte técnico contínuo e treinamento para que sua equipe saiba gerenciar pedidos e produtos com facilidade." },
  { q: "É possível migrar minha loja atual?", a: "Sim, realizamos a migração completa de dados de produtos, clientes e histórico de pedidos de outras plataformas." },
];

const plans = [
  {
    name: "Loja Start",
    price: "R$ 1.699",
    description: "Ideal para novos empreendedores digitais.",
    features: ["Shopify ou WooCommerce", "Design Customizado", "Gateways de Pagamento", "Cálculo de Frete", "Treinamento"]
  },
  {
    name: "E-commerce Pro",
    price: "R$ 2.599",
    description: "Para marcas que buscam escala e automação.",
    features: ["Headless Commerce", "Filtros Avançados", "Recuperação de Carrinho", "Integração ERP", "SEO para Produtos"],
    recommended: true
  },
  {
    name: "Marketplace / Enterprise",
    price: "Sob Consulta",
    description: "Soluções robustas para grandes volumes.",
    features: ["Multi-vendor", "App Mobile Integrado", "Infraestrutura Dedicada", "Consultoria de CRO", "Suporte 24/7"]
  }
];

export default function LojasVirtuais() {
  return (
    <main className="bg-black min-h-screen pt-32 pb-24 px-6 relative overflow-x-hidden">
      <Helmet>
        <title>Criação de Lojas Virtuais & E-commerce de Alta Performance | Douglas Paiani</title>
        <meta name="description" content="Desenvolvimento de e-commerce escalável com foco em conversão. Lojas virtuais inteligentes, integração de pagamentos e performance extrema." />
        <meta property="og:title" content="Criação de Lojas Virtuais & E-commerce de Alta Performance | Douglas Paiani" />
        <meta property="og:description" content="Desenvolvimento de e-commerce escalável com foco em conversão. Lojas virtuais inteligentes, integração de pagamentos e performance extrema." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://douglaspaiani.com.br/servicos/lojas-virtuais" />
        <link rel="canonical" href="https://douglaspaiani.com.br/servicos/lojas-virtuais" />
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
            E-commerce Neural Engineering
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">
            VENDA MAIS COM <br /><span className="text-cyan-400">TECNOLOGIA DE PONTA.</span>
          </h1>
          <p className="text-white/40 max-w-2xl text-lg font-light leading-relaxed">
            Lojas virtuais que combinam design persuasivo com infraestrutura neural robusta para processar 
            milhares de pedidos sem interrupções.
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-8 mb-32">
          {[
            { icon: CreditCard, title: "Checkout Rápido", desc: "Otimizado para reduzir o abandono de carrinho.", features: ["One-click Buy", "Apple/Google Pay", "Anti-fraude IA"] },
            { icon: Box, title: "Gestão de Estoque", desc: "Sincronização automática com seus fornecedores.", features: ["Real-time Sync", "Multi-warehouse", "Auto-restock"] },
            { icon: BarChart, title: "Analytics", desc: "Métricas detalhadas de vendas e comportamento.", features: ["Predictive Sales", "LTV Analysis", "Heatmaps"] },
            { icon: Users, title: "Fidelização", desc: "Sistemas de cupons e programas de pontos.", features: ["Gamificação", "VIP Tiers", "Smart Coupons"] },
            { icon: Zap, title: "Performance", desc: "A loja mais rápida do seu nicho, garantido.", features: ["Sub-second Load", "Edge Caching", "Image Optimization"] },
            { icon: ShoppingCart, title: "Omnichannel", desc: "Venda no site, Instagram e WhatsApp.", features: ["Social Selling", "POS Sync", "Chat Commerce"] },
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
            <CodeWindow code={`// Exemplo de Integração de Pagamento & IA
const checkout = async (cart: Cart) => {
  // Analisa comportamento do usuário com IA
  const fraudScore = await AI.analyzeRisk(cart.user);
  
  if (fraudScore < 0.1) {
    return await PaymentGateway.process({
      amount: cart.total,
      currency: 'BRL',
      items: cart.items
    });
  }
}`} />
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="order-1 md:order-2"
          >
            <h2 className="text-4xl font-black text-white mb-8 tracking-tighter uppercase">
              E-commerce <span className="text-cyan-400">Inteligente</span>
            </h2>
            <p className="text-white/60 mb-8 leading-relaxed font-light text-lg">
              Utilizamos Inteligência Artificial para prever tendências de compra, 
              personalizar recomendações de produtos e automatizar o atendimento ao cliente, 
              garantindo que sua loja venda 24 horas por dia, 7 dias por semana.
            </p>
            <div className="space-y-6">
              {[
                { title: "Headless Commerce", desc: "Separação entre frontend e backend para velocidade máxima." },
                { title: "IA de Recomendação", desc: "Aumente o ticket médio com sugestões inteligentes." },
                { title: "Escalabilidade Infinita", desc: "Sua loja pronta para Black Friday e picos de tráfego." },
              ].map((tech, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-cyan-500/30 transition-colors">
                    <Database className="text-cyan-400" size={20} />
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

        <PricingTable title="Tabela de Preços: E-commerce" plans={plans} themeColor="cyan" />

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
