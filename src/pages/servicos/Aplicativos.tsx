import { motion, AnimatePresence } from "motion/react";
import { Helmet } from "react-helmet-async";
import PricingTable from "@/src/components/PricingTable";
import AIServiceCard from "@/src/components/AIServiceCard";
import { useState } from "react";
import { cn } from "@/src/lib/utils";
import CodeWindow from "@/src/components/CodeWindow";
import MatrixRain from "@/src/components/MatrixRain";
import { Smartphone, Apple, Play, Cpu, Zap, Shield, ChevronDown, Code2, SmartphoneIcon, Bot, Eye, Network, Activity, Sparkles } from "lucide-react";

const faqs = [
  { q: "Vocês desenvolvem para iOS e Android?", a: "Sim, utilizamos tecnologias como Flutter e React Native para criar apps híbridos de alta performance, ou Swift/Kotlin para soluções 100% nativas." },
  { q: "O aplicativo terá integração com notificações push?", a: "Com certeza. Configuramos notificações push personalizadas para aumentar o engajamento dos seus usuários." },
  { q: "Vocês cuidam da publicação nas lojas?", a: "Sim, gerenciamos todo o processo de submissão e aprovação na Apple App Store e Google Play Store." },
  { q: "Como funciona a manutenção do app?", a: "Oferecemos planos de manutenção para garantir que o app continue funcionando perfeitamente com as novas atualizações dos sistemas operacionais." },
];

const plans = [
  {
    name: "MVP Mobile",
    price: "R$ 3.299",
    description: "Valide sua ideia com um aplicativo funcional e moderno.",
    features: ["iOS & Android (Flutter/React Native)", "Design UI/UX", "Autenticação Social", "Notificações Push", "Publicação nas Lojas"]
  },
  {
    name: "App Professional",
    price: "R$ 4.799",
    description: "Aplicativo completo com backend escalável e integrações.",
    features: ["Geolocalização", "Pagamentos In-app", "Painel de Admin Web", "Integração com IA", "Suporte Pós-Lançamento"],
    recommended: true
  },
  {
    name: "Custom Enterprise",
    price: "Sob Consulta",
    description: "Sistemas nativos de alta complexidade e segurança.",
    features: ["Desenvolvimento Nativo (Swift/Kotlin)", "Offline First", "Criptografia de Ponta", "Arquitetura Microserviços", "SLA de Manutenção"]
  }
];

export default function Aplicativos() {
  return (
    <main className="bg-black min-h-screen pt-32 pb-24 px-6 relative overflow-x-hidden">
      <Helmet>
        <title>Desenvolvimento de Aplicativos iOS & Android | Douglas Paiani</title>
        <meta name="description" content="Criação de aplicativos móveis nativos e híbridos de alta performance. Apps iOS e Android com design intuitivo e integração total com recursos do dispositivo." />
        <meta property="og:title" content="Desenvolvimento de Aplicativos iOS & Android | Douglas Paiani" />
        <meta property="og:description" content="Criação de aplicativos móveis nativos e híbridos de alta performance. Apps iOS e Android com design intuitivo e integração total com recursos do dispositivo." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://douglaspaiani.com.br/servicos/aplicativos" />
        <link rel="canonical" href="https://douglaspaiani.com.br/servicos/aplicativos" />
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
            Mobile Neural Engineering
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">
            APPS QUE <br /><span className="text-cyan-400">DOMINAM O MERCADO.</span>
          </h1>
          <p className="text-white/40 max-w-2xl text-lg font-light leading-relaxed">
            Desenvolvimento de aplicativos nativos e híbridos com foco em performance extrema, 
            design intuitivo e arquiteturas neurais de ponta.
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-8 mb-32">
          {[
            { 
              icon: Apple, 
              title: "iOS & Android", 
              desc: "Presença garantida nas duas maiores plataformas com performance nativa.",
              features: ["Flutter/React Native", "Swift/Kotlin", "Multi-plataforma"]
            },
            { 
              icon: Zap, 
              title: "Performance", 
              desc: "Fluidez e velocidade extrema com otimização de recursos e renderização.",
              features: ["60 FPS Constante", "Lazy Loading", "Otimização de Memória"]
            },
            { 
              icon: Shield, 
              title: "Segurança", 
              desc: "Proteção total dos dados com criptografia de ponta e biometria.",
              features: ["FaceID/TouchID", "SSL Pinning", "Criptografia AES"]
            },
            { 
              icon: Cpu, 
              title: "IA Mobile", 
              desc: "Funcionalidades inteligentes rodando direto no dispositivo (On-device).",
              features: ["TensorFlow Lite", "CoreML", "NLP Local"]
            },
            { 
              icon: Play, 
              title: "Lojas", 
              desc: "Cuidamos de todo o processo de publicação e aprovação nas lojas.",
              features: ["App Store", "Google Play", "CI/CD Automático"]
            },
            { 
              icon: Activity, 
              title: "UX/UI", 
              desc: "Design focado em retenção, usabilidade e experiências memoráveis.",
              features: ["Design System", "Prototipagem", "Testes A/B"]
            },
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
              Mobile <span className="text-cyan-400">Intelligence</span>
            </h2>
            <p className="text-white/60 mb-8 leading-relaxed font-light text-lg">
              Integramos modelos de IA diretamente no dispositivo (On-device AI) para 
              garantir privacidade e velocidade instantânea. De reconhecimento facial 
              a processamento de voz em tempo real.
            </p>
            <div className="space-y-6">
              {[
                { title: "Flutter & React Native", desc: "Desenvolvimento multiplataforma com performance nativa." },
                { title: "On-Device Machine Learning", desc: "IA rodando localmente sem dependência de internet." },
                { title: "Arquitetura Offline-First", desc: "Seu app funcionando perfeitamente mesmo sem conexão." },
              ].map((tech, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-cyan-500/30 transition-colors">
                    <SmartphoneIcon className="text-cyan-400" size={20} />
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
            <CodeWindow code={`// Exemplo de IA On-Device (TensorFlow Lite)
const processImage = async (image: Image) => {
  const model = await TFLite.loadModel('object_detection');
  const results = await model.run(image);
  
  return results.filter(r => r.confidence > 0.85);
};`} />
          </div>
        </section>

        <PricingTable title="Tabela de Preços: Aplicativos" plans={plans} themeColor="cyan" />

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
