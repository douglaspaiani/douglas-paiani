import { motion } from "motion/react";
import { Helmet } from "react-helmet-async";
import { Code2, Brain, Rocket, Terminal, Database, Cloud, Calendar, Award, Briefcase } from "lucide-react";
import ServiceCard from "@/src/components/ServiceCard";

const skills = [
  { name: "IA & Machine Learning", level: 98, icon: Brain },
  { name: "Fullstack Development", level: 95, icon: Code2 },
  { name: "Arquitetura Cloud", level: 92, icon: Cloud },
  { name: "SaaS Scaling", level: 96, icon: Rocket },
  { name: "Database Engineering", level: 90, icon: Database },
  { name: "DevOps & CI/CD", level: 88, icon: Terminal },
];

const timeline = [
  { year: "2011", title: "Início da Jornada", desc: "Primeiros passos no desenvolvimento web e design." },
  { year: "2015", title: "Especialização FullStack", desc: "Domínio de stacks modernas e arquiteturas distribuídas." },
  { year: "2023", title: "Foco em IA & SaaS", desc: "Lançamento do primeiro SaaS e imersão total em Machine Learning." },
  { year: "2025", title: "Ogiva Digital", desc: "Liderando a revolução da IA com soluções de alto nível." },
  { year: "2026", title: "Top 50 Brasil", desc: "Reconhecimento como um dos principais desenvolvedores do país." },
];

export default function Sobre() {
  return (
    <main className="bg-black min-h-screen pt-32 pb-24 px-6">
      <Helmet>
        <title>Sobre Mim | Douglas Paiani - 15 Anos de Experiência em Software</title>
        <meta name="description" content="Conheça a trajetória de Douglas Paiani, um dos Top 50 programadores do Brasil, especialista em IA e arquitetura de sistemas escaláveis." />
        <meta property="og:title" content="Sobre Mim | Douglas Paiani - 15 Anos de Experiência em Software" />
        <meta property="og:description" content="Conheça a trajetória de Douglas Paiani, um dos Top 50 programadores do Brasil, especialista em IA e arquitetura de sistemas escaláveis." />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content="https://douglaspaiani.com.br/sobre" />
        <link rel="canonical" href="https://douglaspaiani.com.br/sobre" />
      </Helmet>
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-start mb-32">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter">
              15 ANOS DE <br />
              <span className="text-cyan-400">EXPERIÊNCIA.</span>
            </h1>
            <div className="space-y-6 text-white/60 text-lg leading-relaxed font-light">
              <p>
                Iniciei minha jornada no desenvolvimento de software quando a web ainda estava em sua infância moderna. 
                Ao longo de 15 anos, vi tecnologias nascerem e morrerem, mas a paixão por criar soluções que 
                realmente impactam vidas permaneceu constante.
              </p>
              <p>
                Hoje, sou reconhecido como um dos <b>Top 50 programadores do Brasil</b>, com especialização profunda em 
                Inteligência Artificial. Não apenas utilizo IA; eu construo sistemas que pensam, aprendem e escalam.
              </p>
              <p>
                Como dono de diversos SaaS de sucesso, entendo o produto de ponta a ponta: do código à estratégia de 
                mercado, da infraestrutura à experiência do usuário final.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-widest text-cyan-400">Skillset Técnico</h2>
            <div className="grid gap-6">
              {skills.map((skill, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <skill.icon className="text-cyan-400" size={20} />
                      <span className="text-white font-bold">{skill.name}</span>
                    </div>
                    <span className="text-white/40 text-sm">{skill.level}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                      className="h-full bg-cyan-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Timeline Section */}
        <section className="mb-32">
          <h2 className="text-3xl font-bold text-white mb-16 text-center tracking-tight">Minha Trajetória</h2>
          <div className="relative border-l border-white/10 ml-4 md:ml-0 md:flex md:border-l-0 md:border-t md:pt-12 gap-8">
            {timeline.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative pl-8 md:pl-0 mb-12 md:mb-0 md:flex-1"
              >
                <div className="absolute -left-[9px] md:left-0 md:-top-[53px] w-4 h-4 rounded-full bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
                <span className="text-cyan-400 font-black text-2xl mb-2 block">{item.year}</span>
                <h3 className="text-white font-bold mb-2">{item.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Awards/Recognition */}
        <section className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Award, title: "Top 50 Brasil", desc: "Reconhecido entre os melhores desenvolvedores do país." },
            { icon: Briefcase, title: "10+ SaaS", desc: "Produtos digitais criados e escalados com sucesso." },
            { icon: Calendar, title: "15 Anos", desc: "Uma década e meia de evolução constante no software." },
          ].map((item, i) => (
            <ServiceCard 
              key={i}
              index={i}
              icon={item.icon}
              title={item.title}
              desc={item.desc}
              colorClass="text-cyan-400"
            />
          ))}
        </section>
      </div>
    </main>
  );
}

