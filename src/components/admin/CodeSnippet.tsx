import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeSnippetProps {
  code: string;
  language: string;
}

export default function CodeSnippet({ code, language }: CodeSnippetProps) {
  return (
    <div className="rounded-xl overflow-hidden border border-white/10 my-6 shadow-2xl">
      <div className="bg-[#1e1e1e] px-4 py-2 flex items-center justify-between border-b border-white/5">
        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{language}</span>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
        </div>
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: '1.5rem',
          fontSize: '0.875rem',
          backgroundColor: '#0d0d0d',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
