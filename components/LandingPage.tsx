import React, { useEffect, useState } from 'react';

interface LandingPageProps {
  onEnter: () => void;
}

const TerminalSimulation = () => {
  const [lines, setLines] = useState<string[]>([
    "> Initializing Gemini 3 Flash connection...",
  ]);

  useEffect(() => {
    const script = [
      { text: "> Uploading artifact: bug_report_v1.mp4", delay: 800 },
      { text: "> Scanning frames at 10fps...", delay: 1600 },
      { text: "> ANOMALY DETECTED: Frame 142", delay: 2400, highlight: true },
      { text: "> Reasoning: Submit button logic divergence", delay: 3200 },
      { text: "> Generating Playwright reproduction script...", delay: 4000 },
      { text: "> Generating React fix...", delay: 4800 },
      { text: "> SOLUTION READY.", delay: 5600, success: true },
    ];

    let timeouts: ReturnType<typeof setTimeout>[] = [];

    script.forEach(({ text, delay, highlight, success }) => {
      const timeout = setTimeout(() => {
        setLines(prev => {
          const newLine = success ? <span className="text-arch-success font-bold">{text}</span> :
                          highlight ? <span className="text-arch-accent font-bold">{text}</span> : 
                          text;
          return [...prev.slice(-5), newLine as any]; // Keep last 6 lines
        });
      }, delay);
      timeouts.push(timeout);
    });

    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div className="w-full max-w-lg bg-black/80 rounded border border-gray-700 p-4 font-mono text-xs sm:text-sm text-gray-400 shadow-2xl backdrop-blur-sm relative overflow-hidden">
        {/* Glossy overlay */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent opacity-50"></div>
        <div className="flex items-center space-x-2 mb-4 border-b border-gray-800 pb-2">
            <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
            <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
            <span className="text-xs text-gray-600 uppercase tracking-widest ml-2">Agent_Console</span>
        </div>
        <div className="space-y-2 h-40 flex flex-col justify-end">
            {lines.map((line, i) => (
                <div key={i} className="animate-fade-in-up">{line}</div>
            ))}
            <div className="typing-cursor"></div>
        </div>
    </div>
  );
};

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="min-h-screen bg-arch-bg text-arch-text font-sans selection:bg-arch-accent selection:text-white flex flex-col relative overflow-hidden">
      
      {/* Background FX */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-arch-bg via-transparent to-transparent"></div>
        {/* Scanning Beam */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-arch-accent/20 blur-sm animate-scan shadow-[0_0_20px_rgba(245,158,11,0.2)]"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-gray-800/50 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-arch-accent rounded flex items-center justify-center text-black font-bold text-xl shadow-[0_0_15px_rgba(245,158,11,0.4)]">
              UX
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Archeologist</span>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-xs font-mono text-gray-500 uppercase tracking-widest">
            <span className="text-arch-accent">● System Online</span>
            <span>V_1.0.4</span>
          </div>
        </div>
      </nav>

      <main className="relative z-10 flex-1 flex flex-col items-center">
        
        {/* Hero Section */}
        <section className="w-full max-w-7xl mx-auto px-6 py-12 lg:py-20 grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: Text Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="inline-flex items-center px-3 py-1 rounded-full border border-arch-accent/30 bg-arch-accent/5 text-arch-accent font-mono text-xs uppercase tracking-widest animate-pulse-slow">
              <span className="w-1.5 h-1.5 rounded-full bg-arch-accent mr-2"></span>
              Gemini 3 Native Agent
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-white tracking-tight leading-none">
              The End of <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-arch-accent via-yellow-200 to-arch-accent animate-gradient-x">Manual Debugging</span>
            </h1>
            
            <p className="text-lg text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Don't just watch the recording. <strong className="text-gray-200">Solve it.</strong>
              <br/>The UX Archeologist uses computer vision to find the exact moment your app breaks, then writes the Playwright test to prove it.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <button
                onClick={onEnter}
                className="group relative inline-flex items-center justify-center px-8 py-4 w-full sm:w-auto font-bold text-black transition-all duration-200 bg-arch-accent font-mono uppercase tracking-widest hover:bg-white hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] focus:outline-none rounded-sm overflow-hidden"
                >
                <span className="relative z-10 flex items-center">
                    Initialize Dig
                    <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </button>
                <a href="https://ai.google.dev" target="_blank" rel="noreferrer" className="text-xs text-gray-500 font-mono hover:text-white transition-colors uppercase tracking-widest border-b border-transparent hover:border-gray-500 pb-0.5">
                    Powered by Google Gemini
                </a>
            </div>
          </div>

          {/* Right: Simulation */}
          <div className="flex justify-center lg:justify-end animate-float">
            <TerminalSimulation />
          </div>

        </section>

        {/* Features / Workflow */}
        <section className="w-full bg-black/40 border-t border-gray-800 backdrop-blur-sm py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
              
              {/* Card 1 */}
              <div className="group p-6 bg-arch-panel/50 rounded-lg border border-gray-800 hover:border-arch-accent/50 hover:bg-arch-panel transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-gray-800 rounded flex items-center justify-center mb-4 group-hover:bg-arch-accent group-hover:text-black transition-colors text-gray-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                </div>
                <h3 className="text-white font-bold mb-2">1. Visual Analysis</h3>
                <p className="text-gray-500 text-sm">Gemini 3 Flash scans video artifacts at 10 FPS to detect UI regressions invisible to standard log parsers.</p>
              </div>

              {/* Card 2 */}
              <div className="group p-6 bg-arch-panel/50 rounded-lg border border-gray-800 hover:border-arch-accent/50 hover:bg-arch-panel transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-gray-800 rounded flex items-center justify-center mb-4 group-hover:bg-arch-accent group-hover:text-black transition-colors text-gray-400">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                </div>
                <h3 className="text-white font-bold mb-2">2. Causal Reasoning</h3>
                <p className="text-gray-500 text-sm">Gemini 3 Pro connects the visual failure to the likely code path using "Thought Signatures".</p>
              </div>

              {/* Card 3 */}
              <div className="group p-6 bg-arch-panel/50 rounded-lg border border-gray-800 hover:border-arch-accent/50 hover:bg-arch-panel transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-gray-800 rounded flex items-center justify-center mb-4 group-hover:bg-arch-accent group-hover:text-black transition-colors text-gray-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
                <h3 className="text-white font-bold mb-2">3. Auto-fix Generation</h3>
                <p className="text-gray-500 text-sm">Receive a ready-to-run Playwright test script and a React patch. Copy, paste, commit.</p>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center border-t border-gray-800 text-gray-600 text-[10px] font-mono uppercase tracking-widest">
        <p>System Status: Optimal • Built for Google AI Studio Challenge</p>
      </footer>
    </div>
  );
};

export default LandingPage;