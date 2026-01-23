import React from 'react';

interface CodeDisplayProps {
  title: string;
  code: string;
  language?: string;
}

const CodeDisplay: React.FC<CodeDisplayProps> = ({ title, code, language = 'typescript' }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-arch-panel rounded-lg overflow-hidden border border-gray-700">
      <div className="flex items-center justify-between px-4 py-2 bg-black/40 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
          <span className="ml-2 text-xs text-gray-400 font-mono uppercase">{title}</span>
        </div>
        <button 
          onClick={handleCopy}
          className="text-xs text-arch-accent hover:text-white transition-colors uppercase font-bold tracking-wider"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4 custom-scrollbar">
        <pre className="font-mono text-xs sm:text-sm text-gray-300 whitespace-pre-wrap">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeDisplay;
