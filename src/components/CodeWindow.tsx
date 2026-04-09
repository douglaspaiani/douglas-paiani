import { motion } from "motion/react";
import { Terminal } from "lucide-react";

interface CodeWindowProps {
  code: string;
  language?: string;
  title?: string;
}

export default function CodeWindow({ code, language = "typescript", title = "ai-agent.ts" }: CodeWindowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="w-full rounded-2xl bg-[#0d1117] border border-white/10 overflow-hidden shadow-2xl font-mono text-sm"
    >
      <div className="bg-white/5 px-4 py-3 border-bottom border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50" />
          </div>
          <span className="text-white/40 text-xs ml-4 flex items-center gap-2">
            <Terminal size={12} />
            {title}
          </span>
        </div>
        <span className="text-white/20 text-[10px] uppercase tracking-widest">{language}</span>
      </div>
      <div className="p-6 overflow-x-auto">
        <pre className="text-white/80 leading-relaxed">
          <code>
            {code.split('\n').map((line, i) => (
              <div key={i} className="flex gap-4">
                <span className="text-white/20 w-4 text-right select-none">{i + 1}</span>
                <span dangerouslySetInnerHTML={{ 
                  __html: line
                    .replace(/(const|let|var|function|export|default|import|from|async|await|return|if|else|for|while|class|interface|type|enum)/g, '<span class="text-purple-400">$1</span>')
                    .replace(/(['"].*?['"])/g, '<span class="text-emerald-400">$1</span>')
                    .replace(/(\d+)/g, '<span class="text-orange-400">$1</span>')
                    .replace(/(\/\/.*)/g, '<span class="text-white/30">$1</span>')
                    .replace(/([{}()\[\]])/g, '<span class="text-yellow-400">$1</span>')
                }} />
              </div>
            ))}
          </code>
        </pre>
      </div>
    </motion.div>
  );
}
