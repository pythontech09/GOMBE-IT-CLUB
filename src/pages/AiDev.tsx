import React, { useState } from "react";
import { 
  Terminal, 
  Sparkles, 
  CornerDownRight, 
  Copy, 
  Check, 
  HelpCircle, 
  Code2, 
  Flame, 
  ChevronRight, 
  Lock, 
  Blocks,
  Network
} from "lucide-react";

interface AiDevResponse {
  explanation: string;
  milestones: string[];
  fixedCode: string;
  seniorAdvice: string;
}

const PRESETS = [
  { 
    title: "React State Bug", 
    question: "My counter button stays at 0 and doesn't increase when I click it.",
    code: `import React from 'react';\n\nexport function BuggyCounter() {\n  let count = 0;\n  const handleClick = () => {\n    count += 1;\n    console.log("Count is now", count);\n  };\n  return (\n    <button onClick={handleClick}>Points: {count}</button>\n  );\n}`
  },
  { 
    title: "Python List Loop", 
    question: "How do I take a list of student names and print them out with their scores in a loop?",
    code: `students = ["Amina", "Kalyango", "Nsubuga"]\n# Write nested loop here to match them with scores...`
  },
  { 
    title: "Centering Web Card", 
    question: "How do I center my Gombe ICT banner both vertically and horizontally using CSS Flexbox?",
    code: `<div class="container">\n  <div class="banner">Gombe SS ICT Club</div>\n</div>\n\n<style>\n/* How do I style .container and .banner here? */\n</style>`
  },
  { 
    title: "Infinity Loop Crash", 
    question: "My browser page hangs and freezes immediately when I open my script. Why does this happen?",
    code: `let x = 1;\nwhile (x < 10) {\n  console.log("Processing student scores...");\n  // Did I forget something here?\n}`
  }
];

export default function AiDev() {
  const [question, setQuestion] = useState("");
  const [codeSnippet, setCodeSnippet] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorOnRequest, setErrorOnRequest] = useState<string | null>(null);
  const [result, setResult] = useState<AiDevResponse | null>(null);
  const [copied, setCopied] = useState(false);

  // Active Output Tab
  const [activeTab, setActiveTab] = useState<"explain" | "milestones" | "code">("explain");

  const handleSelectPreset = (preset: typeof PRESETS[0]) => {
    setQuestion(preset.question);
    setCodeSnippet(preset.code);
    setErrorOnRequest(null);
  };

  const handleAskSeniorDev = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setErrorOnRequest(null);
    setResult(null);

    try {
      const response = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promptType: "ask-dev",
          question: question.trim(),
          currentCode: codeSnippet.trim()
        })
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        setResult(resData.data);
        setActiveTab("explain");
      } else {
        throw new Error(resData.error || "Failed to communicate with Senior Developer.");
      }
    } catch (err: any) {
      setErrorOnRequest(err.message || "An unexpected error occurred. Please test connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (!result?.fixedCode) return;
    navigator.clipboard.writeText(result.fixedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Banner */}
      <section className="bg-gradient-to-r from-violet-950/30 to-indigo-950/20 border border-slate-900 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 justify-between items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 h-40 w-40 bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="space-y-2 max-w-2xl text-center md:text-left z-10">
          <div className="inline-flex items-center gap-1.5 bg-violet-950/80 border border-violet-800/40 text-violet-400 text-[10px] font-mono px-2.5 py-0.5 rounded uppercase font-bold tracking-wider">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-violet-400" />
            Core Mentor Intelligence
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white uppercase font-sans">
            AI SENIOR DEVELOPER
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            Stuck on a pesky bug? Confused about a logic loop? Your AI Senior Developer is on standby 24/7 to read your broken Gombe SS labs, diagnose errors, explain core computer science concepts, and provide fully revised code blocks instantly.
          </p>
        </div>
        <div className="hidden md:flex bg-slate-950 border border-slate-850 p-4 rounded-xl text-center flex-col shrink-0">
          <Terminal className="w-7 h-7 text-violet-400 mx-auto mb-1" />
          <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">Senior Mentor</span>
          <span className="text-[9px] text-slate-500 font-mono">Always Active</span>
        </div>
      </section>

      {/* Grid workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/60 border border-slate-900 rounded-2xl p-5 md:p-6 space-y-5">
            <div className="space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300 font-mono flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-violet-400" />
                Submit Your Blocked Lab
              </h3>
              <p className="text-[11px] text-slate-500">
                Type your question or choose an interactive preset scenario below to see how our Senior Mentor guides you.
              </p>
            </div>

            {/* Presets */}
            <div className="space-y-1.5">
              <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider block">Quick Presets:</span>
              <div className="grid grid-cols-2 gap-2">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.title}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className="bg-slate-950 hover:bg-slate-900 p-2 text-[10px] text-slate-350 hover:text-white border border-slate-850 hover:border-violet-900/40 rounded-lg text-left truncate font-mono tracking-wide transition-all cursor-pointer"
                  >
                    🚀 {preset.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleAskSeniorDev} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] text-slate-400 font-mono uppercase">1. What are you trying to do / What error did you hit?</label>
                <textarea
                  required
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="E.g., In my React component, how do I pass an index to a click function?"
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 font-sans leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[9px] text-slate-400 font-mono uppercase">2. Paste Broken Code (Optional):</label>
                  {codeSnippet && (
                    <button
                      type="button"
                      onClick={() => setCodeSnippet("")}
                      className="text-[9px] text-rose-450 hover:underline font-mono uppercase cursor-pointer"
                    >
                      Clear Code
                    </button>
                  )}
                </div>
                <textarea
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                  placeholder="Paste buggy index.html, App.tsx, or python.py code here..."
                  rows={8}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl p-3 text-[11px] text-slate-300 placeholder-slate-600 focus:outline-none focus:border-violet-500 font-mono leading-relaxed"
                />
              </div>

              {errorOnRequest && (
                <div className="bg-red-950/20 border border-red-900/30 p-3 rounded-lg text-red-400 text-xs font-mono leading-normal">
                  ⚠️ Error: {errorOnRequest}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !question.trim()}
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-mono py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex justify-center items-center gap-2 shadow-lg shadow-violet-950/50 disabled:opacity-50 disabled:cursor-not-allowed select-none"
              >
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Senior Developer is reviewing...
                  </>
                ) : (
                  <>
                    <Terminal className="w-4 h-4 text-violet-200" />
                    Consult Senior Developer Mentor
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Output Panel */}
        <div className="lg:col-span-7">
          {!loading && !result && !errorOnRequest && (
            <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-12 text-center space-y-4">
              <div className="h-12 w-12 bg-slate-950/80 rounded-full flex items-center justify-center mx-auto border border-slate-850">
                <HelpCircle className="w-5 h-5 text-slate-600" />
              </div>
              <div className="space-y-1.5 max-w-sm mx-auto">
                <h4 className="text-xs font-bold text-slate-350 uppercase font-mono tracking-wider">Tutor Output Standby</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                  Submit your query on the left. The Senior Developer will review it, structure a customized curriculum response, write pristine code, and guide you step-by-step.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3 pt-2 text-[10px] text-slate-500 font-mono">
                <div className="flex items-center gap-1"><Blocks className="w-3.5 h-3.5" /> HTML/CSS</div>
                <div>•</div>
                <div className="flex items-center gap-1"><Network className="w-3.5 h-3.5" /> Javascript/React</div>
                <div>•</div>
                <div className="flex items-center gap-1"><Flame className="w-3.5 h-3.5" /> Python Core</div>
              </div>
            </div>
          )}

          {loading && (
            <div className="bg-slate-900/50 border border-slate-850 rounded-2xl p-12 text-center space-y-6">
              <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 border-4 border-violet-950 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-transparent border-t-violet-400 rounded-full animate-spin"></div>
                <Terminal className="w-6 h-6 text-violet-400" />
              </div>
              
              <div className="space-y-2 max-w-md mx-auto">
                <h4 className="text-xs font-bold text-white uppercase font-mono tracking-widest animate-pulse">
                  Analyzing Code Architecture...
                </h4>
                <div className="space-y-1.5 text-[11px] text-slate-500 font-mono">
                  <p>1. Compiling syntax profile and testing imports...</p>
                  <p className="text-xs text-violet-400">2. Drafting custom, student-safe solution milestones...</p>
                  <p>3. Isolating logical blocks and verifying sandbox code...</p>
                </div>
              </div>
            </div>
          )}

          {result && (
            <div className="bg-slate-900/60 border border-slate-900 rounded-2xl overflow-hidden shadow-xl space-y-6 p-5 md:p-6 animate-slide-up">
              {/* Tabs header */}
              <div className="flex border-b border-slate-850 pb-2 justify-between items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[10px] text-slate-400 font-semibold font-mono uppercase">Guidance Ready</span>
                </div>
                
                <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-850">
                  <button
                    type="button"
                    onClick={() => setActiveTab("explain")}
                    className={`px-3 py-1 text-[10px] font-mono rounded font-bold uppercase transition-colors cursor-pointer select-none ${
                      activeTab === "explain" ? "bg-violet-600 text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Explanation
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("milestones")}
                    className={`px-3 py-1 text-[10px] font-mono rounded font-bold uppercase transition-colors cursor-pointer select-none ${
                      activeTab === "milestones" ? "bg-violet-600 text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    3 Steps
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("code")}
                    className={`px-3 py-1 text-[10px] font-mono rounded font-bold uppercase transition-colors cursor-pointer select-none ${
                      activeTab === "code" ? "bg-violet-600 text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Revised Code
                  </button>
                </div>
              </div>

              {/* Tab: Explanation */}
              {activeTab === "explain" && (
                <div className="space-y-4 font-sans animate-fade-in">
                  <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-2.5">
                    <span className="text-[9px] text-violet-400 uppercase font-mono block tracking-wider font-bold">Diagnostics Review</span>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-line">
                      {result.explanation}
                    </p>
                  </div>

                  <div className="bg-violet-950/10 border border-violet-900/20 p-4 rounded-xl flex items-start gap-3">
                    <Sparkles className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="text-[9px] text-violet-400 uppercase font-mono block tracking-wide font-bold">Principal Mentor Advice</span>
                      <p className="text-xs text-slate-400 leading-relaxed italic">
                        "{result.seniorAdvice}"
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Milestones */}
              {activeTab === "milestones" && (
                <div className="space-y-3.5 animate-fade-in font-sans">
                  <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">Sequence Resolution Plan:</span>
                  <div className="space-y-3">
                    {result.milestones.map((step, idx) => (
                      <div key={idx} className="bg-slate-950 p-4 border border-slate-850 rounded-xl flex items-start gap-3 group hover:border-violet-900/30 transition-colors">
                        <span className="h-5 w-5 bg-violet-950/80 text-violet-400 border border-violet-850 text-[10px] font-mono font-bold rounded-full flex items-center justify-center shrink-0">
                          0{idx + 1}
                        </span>
                        <div className="space-y-0.5">
                          <span className="text-[9px] text-slate-500 uppercase font-mono block">Milestone 0{idx + 1}</span>
                          <span className="text-xs text-slate-300 leading-relaxed font-sans">{step}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab: Code Output */}
              {activeTab === "code" && (
                <div className="space-y-3 animate-fade-in">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[10px] text-slate-500 font-mono uppercase">Optimized Bug Fix Snippet:</span>
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono rounded bg-slate-950 hover:bg-slate-900 border border-slate-850 transition-colors text-slate-300 hover:text-white cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copy Code
                        </>
                      )}
                    </button>
                  </div>

                  <div className="bg-slate-955 p-4 border border-slate-850 rounded-xl bg-slate-950 overflow-x-auto select-all max-h-[400px]">
                    <pre className="text-[11px] text-slate-300 font-mono leading-relaxed whitespace-pre font-medium">
                      {result.fixedCode}
                    </pre>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 text-center">
                    💡 Click "Copy Code" to store the revision buffer. Paste it back into your main Gombe Coding workspace block.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
