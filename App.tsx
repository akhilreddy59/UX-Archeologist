import React, { useState, useRef } from 'react';
import { analyzeVideo, generateSolution } from './services/geminiService';
import { ArcheologyReport, AppState, Solution } from './types';
import Timeline from './components/Timeline';
import CodeDisplay from './components/CodeDisplay';
import LandingPage from './components/LandingPage';

const App: React.FC = () => {
  // Navigation State
  const [showLanding, setShowLanding] = useState(true);

  // App Logic State
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [report, setReport] = useState<ArcheologyReport | null>(null);
  const [solution, setSolution] = useState<Solution | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // 1. Validate File Type (Strict)
      if (!file.type.startsWith('video/')) {
        setVideoFile(null);
        setVideoUrl(null);
        setErrorMsg("Artifact rejected: Invalid file format. Please upload a supported video file (MP4, WebM).");
        return;
      }

      // 2. Clear previous errors and set file
      setErrorMsg(null);
      setVideoFile(file);
      setVideoUrl(URL.createObjectURL(file));
      
      // Reset App State for new dig
      setAppState(AppState.IDLE);
      setReport(null);
      setSolution(null);
    }
  };

  const startAnalysis = async () => {
    if (!videoFile) return;

    // Pre-flight check for file size (approx 20MB limit for inline base64 safety)
    if (videoFile.size > 20 * 1024 * 1024) {
      setErrorMsg("Video file is too large (>20MB). Please compress it or use a shorter clip.");
      setAppState(AppState.ERROR);
      return;
    }

    setAppState(AppState.ANALYZING);
    setErrorMsg(null);

    try {
      // Phase 1: Archeology (Gemini Flash)
      let archReport;
      try {
        archReport = await analyzeVideo(videoFile);
      } catch (analysisErr: any) {
        console.error("Gemini Flash Analysis Error:", analysisErr);
        
        let userMessage = "Visual Analysis Failed.";
        const rawMessage = analysisErr.message || "";

        // Map common errors to user-friendly messages
        if (rawMessage.includes("400")) {
           userMessage = "Video analysis rejected. The video may be too long, corrupt, or in an unsupported format. Try a clip under 1 minute.";
        } else if (rawMessage.includes("401") || rawMessage.includes("403")) {
           userMessage = "Authentication failed. Please check your API key permissions.";
        } else if (rawMessage.includes("Candidate was blocked due to safety")) {
           userMessage = "Analysis blocked by safety filters. Ensure the video content is safe.";
        } else {
           userMessage = `Visual Analysis Failed: ${rawMessage}`;
        }
        throw new Error(userMessage);
      }
      
      setReport(archReport);
      setAppState(AppState.SOLVING);

      // Phase 2: Solution (Gemini Pro)
      let sol;
      try {
        sol = await generateSolution(archReport);
      } catch (solutionErr: any) {
        console.error("Gemini Pro Reasoning Error:", solutionErr);
        
        let userMessage = "Reasoning Engine Failed.";
        const rawMessage = solutionErr.message || "";

        if (rawMessage.includes("503")) {
             userMessage = "Service overloaded. Please try again momentarily.";
        } else if (rawMessage.includes("Candidate was blocked")) {
             userMessage = "Solution generation blocked by safety filters.";
        } else {
             userMessage = `Reasoning Engine Failed: ${rawMessage}`;
        }
        throw new Error(userMessage);
      }

      setSolution(sol);
      setAppState(AppState.COMPLETE);

    } catch (err: any) {
      console.error("Dig Workflow Halted:", err);
      setErrorMsg(err.message || "An unexpected error occurred during the archaeological dig.");
      setAppState(AppState.ERROR);
    }
  };

  // Render Landing Page if active
  if (showLanding) {
    return <LandingPage onEnter={() => setShowLanding(false)} />;
  }

  // Render Main App
  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setShowLanding(true)}>
            <div className="w-8 h-8 bg-arch-accent rounded flex items-center justify-center text-black font-bold text-xl">
              UX
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">Archeologist <span className="text-xs text-gray-500 font-normal border border-gray-700 px-1 rounded ml-2">GEMINI 3 POWERED</span></h1>
          </div>
          <div className="flex items-center space-x-4 text-xs font-mono text-gray-500">
             <span>VIBE: ENGINEERING</span>
             <span className={appState === AppState.ANALYZING || appState === AppState.SOLVING ? "text-arch-accent animate-pulse" : "text-gray-600"}>
               {appState === AppState.IDLE ? "READY" : appState}
             </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Input & Visuals (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Upload Zone */}
          <div className="bg-arch-panel rounded-lg p-6 border border-gray-700 shadow-xl">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">1. Evidence Input</h2>
            
            {!videoUrl ? (
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer hover:bg-gray-800 hover:border-arch-accent transition-all group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-10 h-10 mb-3 text-gray-400 group-hover:text-arch-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                  <p className="mb-2 text-sm text-gray-500 group-hover:text-gray-300"><span className="font-semibold">Click to upload</span> bug recording</p>
                  <p className="text-xs text-gray-500">MP4, WebM (Max 1 min)</p>
                </div>
                <input type="file" className="hidden" accept="video/mp4,video/webm" onChange={handleFileUpload} />
              </label>
            ) : (
              <div className="relative rounded-lg overflow-hidden border border-gray-600">
                <video 
                  ref={videoRef}
                  src={videoUrl} 
                  controls 
                  className="w-full h-auto max-h-64 object-contain bg-black"
                />
                <button 
                  onClick={() => { setVideoUrl(null); setVideoFile(null); setReport(null); }}
                  className="absolute top-2 right-2 bg-black/70 hover:bg-red-900 text-white p-1 rounded-full text-xs"
                >
                  ✕
                </button>
              </div>
            )}

            <button
              disabled={!videoFile || appState === AppState.ANALYZING || appState === AppState.SOLVING}
              onClick={startAnalysis}
              className={`w-full mt-4 py-3 px-4 rounded font-bold uppercase tracking-widest text-sm transition-all
                ${!videoFile ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 
                  (appState === AppState.ANALYZING || appState === AppState.SOLVING) ? 'bg-arch-accent/20 text-arch-accent cursor-wait' : 'bg-arch-accent hover:bg-yellow-500 text-black shadow-lg shadow-yellow-900/20' }
              `}
            >
              {appState === AppState.ANALYZING ? 'Scanning Video...' : appState === AppState.SOLVING ? 'Reasoning...' : 'Start Dig'}
            </button>
            
            {errorMsg && (
              <div className="mt-4 p-3 bg-red-900/30 border border-red-800 rounded text-red-200 text-xs flex items-start">
                <svg className="w-4 h-4 mr-2 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Thought Signature Visualization */}
          {report && (
            <div className="bg-arch-panel rounded-lg p-6 border border-gray-700 flex-1 min-h-[200px]">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">2. Thought Signature</h2>
              <div className="text-xs font-mono text-gray-300 leading-relaxed opacity-80 h-48 overflow-y-auto custom-scrollbar">
                {appState === AppState.SOLVING ? (
                   <span className="animate-pulse text-arch-accent">Transferring state to logic engine...</span>
                ) : (
                   report.thoughtSignature
                )}
              </div>
            </div>
          )}
        </div>

        {/* Center Column: Archeology Report (3 cols) */}
        <div className="lg:col-span-3 bg-arch-panel rounded-lg p-0 border border-gray-700 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-700 bg-black/20">
             <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">3. Archeology Report</h2>
          </div>
          <div className="p-4 overflow-y-auto flex-1 custom-scrollbar min-h-[400px]">
             {appState === AppState.ANALYZING ? (
               <div className="flex flex-col items-center justify-center h-full space-y-4">
                 <div className="w-12 h-12 border-4 border-arch-accent border-t-transparent rounded-full animate-spin"></div>
                 <p className="text-xs text-arch-accent font-mono animate-pulse">Gemini 3 Flash: 10 FPS Scan...</p>
               </div>
             ) : report ? (
               <div className="animate-fade-in-up">
                 <div className="mb-6 p-3 bg-blue-900/20 border border-blue-800 rounded">
                   <h4 className="text-blue-300 text-xs font-bold uppercase mb-1">Issue Summary</h4>
                   <p className="text-gray-300 text-sm">{report.summary}</p>
                 </div>
                 <Timeline events={report.events} />
               </div>
             ) : (
               <div className="flex items-center justify-center h-full text-gray-600 text-sm italic">
                 Awaiting video evidence...
               </div>
             )}
          </div>
        </div>

        {/* Right Column: Code Generation (5 cols) */}
        <div className="lg:col-span-5 flex flex-col bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
          <div className="flex border-b border-gray-800">
             <button className="flex-1 py-3 text-xs font-bold uppercase tracking-wider text-arch-accent border-b-2 border-arch-accent bg-arch-panel/50">
               Auto-Generated Assets
             </button>
          </div>
          
          <div className="flex-1 p-4 bg-black/40 overflow-hidden relative">
            {appState === AppState.SOLVING ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/80 backdrop-blur-sm">
                <div className="text-arch-accent font-mono text-sm mb-2">Gemini 3 Pro Thinking...</div>
                <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-arch-accent animate-pulse w-2/3"></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Writing Playwright reproduction...</p>
              </div>
            ) : null}

            {solution ? (
              <div className="flex flex-col h-full gap-4 overflow-y-auto custom-scrollbar">
                <div className="shrink-0">
                  <CodeDisplay title="reproduce_bug.spec.ts (Playwright)" code={solution.playwrightScript} />
                </div>
                <div className="shrink-0">
                  <CodeDisplay title="FixedComponent.tsx (React)" code={solution.suggestedFix} />
                </div>
                <div className="bg-green-900/10 border border-green-900 p-4 rounded text-sm text-gray-300 shrink-0">
                  <strong className="text-green-500 block mb-2 uppercase text-xs tracking-wider">Root Cause Analysis</strong>
                  {solution.explanation}
                </div>
              </div>
            ) : (
               <div className="h-full flex flex-col items-center justify-center text-gray-600 space-y-4 opacity-50">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                 </svg>
                 <p className="text-sm">Code generation requires analysis first.</p>
               </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
};

export default App;