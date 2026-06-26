import React, { useState, useEffect } from "react";
import { VIBE_CATEGORIES_IDEAS } from "@/src/lib/bootcamp-data";
import { UserStats } from "@/src/types";
import { Compiler } from "@/src/components/Compiler";
import { 
  Sparkles, 
  Terminal, 
  Code, 
  CheckCircle, 
  HelpCircle, 
  Compass, 
  Workflow, 
  Lightbulb, 
  BookOpen, 
  Flame, 
  ArrowRight,
  RefreshCw,
  Clock,
  Briefcase
} from "lucide-react";

export default function VibeCoding() {
  const [ideas] = useState(VIBE_CATEGORIES_IDEAS);
  const [selectedIdea, setSelectedIdea] = useState<string | null>(null);
  const [customIdeaInput, setCustomIdeaInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [workspaceData, setWorkspaceData] = useState<any | null>(null);

  // Load stats
  const [userStats, setUserStats] = useState<UserStats>({
    points: 120,
    streak: 3,
    unlockedLevel: "beginner",
    completedTopics: []
  });

  useEffect(() => {
    const saved = localStorage.getItem("gombe_ss_stats");
    if (saved) {
      try {
        setUserStats(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const saveStats = (newStats: UserStats) => {
    setUserStats(newStats);
    localStorage.setItem("gombe_ss_stats", JSON.stringify(newStats));
  };

  const handleSelectPreset = (idea: typeof VIBE_CATEGORIES_IDEAS[0]) => {
    setSelectedIdea(idea.id);
    setCustomIdeaInput(`Build a website for "${idea.title}": ${idea.description}`);
  };

  const handleGenerateWorkspace = async () => {
    if (!customIdeaInput.trim()) return;
    setLoading(true);
    setErrorText(null);
    setWorkspaceData(null);

    try {
      const res = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promptType: "vibe-coder",
          title: "Vibe Code: Student Developer Workspace",
          customQuery: customIdeaInput
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setWorkspaceData(data.data);
        
        // Reward student for starting a workspace!
        const updatedStats = {
          ...userStats,
          points: userStats.points + 25,
          streak: userStats.streak + 1
        };
        saveStats(updatedStats);

        // Sound trigger
        try {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.type = "sine";
          osc.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
          osc.frequency.setValueAtTime(554.37, audioCtx.currentTime + 0.1); // C#5
          osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.2); // E5
          gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.4);
        } catch (e) {}
      } else {
        setErrorText(data.error || "Dynamic model request failed. Ensure credentials are set.");
      }
    } catch (err: any) {
      setErrorText(err.message || "Connecting to backend dev client failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Informative Header Banner */}
      <section className="bg-gradient-to-r from-purple-950/40 to-slate-900/40 border border-slate-900 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 justify-between items-center">
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 bg-purple-950/80 border border-purple-800/40 text-purple-400 text-[10px] font-mono px-2.5 py-0.5 rounded uppercase font-bold">
            <Sparkles className="w-3.5 h-3.5 animate-bounce" />
            Become a Developer • Vibe Coding
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">THE CREATIVE WORKSPACE</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            Welcome to Vibe-Coding! No rigid schedules—just express an app dream, choose from Ugandan technology models, and let Gemini compile customized interactive developer pathways and ready playgrounds for you.
          </p>
        </div>
        <div className="hidden lg:block bg-slate-950 border border-slate-800 p-4 rounded-xl text-center">
          <Briefcase className="w-6 h-6 text-purple-400 mx-auto mb-1.5" />
          <div className="text-xs text-slate-400 font-bold font-mono">WORKSPACE LIVE</div>
          <div className="text-[9px] text-slate-500 font-mono tracking-wider uppercase">Infinite Ideas</div>
        </div>
      </section>

      {/* Main Form Entry */}
      <section className="bg-slate-900/60 border border-slate-900 rounded-2xl p-6 space-y-5">
        <div className="space-y-1">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">What do you want to build today?</h2>
          <p className="text-[11px] text-slate-500">Enter your own custom programming dream, or pick an illustrative preset block below.</p>
        </div>

        <div className="space-y-3">
          <textarea
            value={customIdeaInput}
            onChange={(e) => setCustomIdeaInput(e.target.value)}
            placeholder="E.g., Build a beautiful weather tracker that changes backgrounds depending on climate, or craft a landing page bio card in HTML and CSS..."
            className="w-full bg-slate-950 text-xs text-slate-200 p-4 rounded-xl border border-slate-850 focus:outline-none focus:border-purple-500 transition-colors h-24 placeholder:text-slate-600 leading-relaxed"
          />

          <div className="flex justify-between items-center gap-4">
            <span className="text-[10px] text-slate-500 font-mono italic">
              * AI generates working blueprint, milestones, and loads sample workspace!
            </span>
            <button
              onClick={handleGenerateWorkspace}
              disabled={loading || !customIdeaInput.trim()}
              className="bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-xs font-bold uppercase tracking-wider text-white px-5 py-3 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-purple-950"
            >
              <Workflow className="w-4 h-4 text-purple-200" />
              Generate Developer Workspace
            </button>
          </div>
        </div>

        {/* Dynamic loading educators */}
        {loading && (
          <div className="p-8 text-center space-y-4 max-w-sm mx-auto bg-slate-950 border border-slate-900 rounded-xl">
            <RefreshCw className="w-8 h-8 text-purple-400 animate-spin mx-auto" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Compiling Dev Sandbox...</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
              Analyzing layout designs, compiling standard milestones, and writing ready-to-use sample frameworks...
            </p>
          </div>
        )}

        {/* Fallback errors */}
        {errorText && (
          <div className="p-4 bg-rose-950/20 border border-rose-900/50 rounded-xl text-xs font-mono text-rose-300 text-center max-w-sm mx-auto">
            {errorText}
          </div>
        )}
      </section>

      {/* Preset Catalog cards */}
      {!workspaceData && !loading && (
        <section className="space-y-4">
          <div className="border-b border-slate-950 pb-2 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-purple-400 animate-pulse" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Suggestions Catalog</h3>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">6 IDEAS READY</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ideas.map((idea) => {
              const borderCol = selectedIdea === idea.id ? "border-purple-500 bg-purple-950/10" : "border-slate-900 hover:border-slate-800";
              const dotCol = 
                idea.difficulty === "Beginner" ? "bg-cyan-500" :
                idea.difficulty === "Intermediate" ? "bg-amber-500" : "bg-rose-500";

              return (
                <div
                  key={idea.id}
                  onClick={() => handleSelectPreset(idea)}
                  className={`bg-slate-900/40 border rounded-xl p-5 cursor-pointer transition-all flex flex-col justify-between ${borderCol}`}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-mono uppercase bg-slate-950 border border-slate-800 text-slate-400 py-0.5 px-2 rounded-full">
                        {idea.category}
                      </span>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                        <span className={`h-1.5 w-1.5 rounded-full ${dotCol}`} />
                        <span>{idea.difficulty}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="text-xs font-bold text-white tracking-wide">{idea.title}</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-3">{idea.description}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-950 flex justify-between items-center mt-4">
                    <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {idea.estimatedTime}
                    </span>
                    <span className="text-[10px] font-bold text-purple-400 flex items-center gap-0.5 hover:text-white">
                      Select
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Compiled Sandbox Workspace */}
      {workspaceData && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Milestones & Core Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 space-y-4">
              <div className="inline-flex items-center gap-1.5 bg-purple-950/80 border border-purple-800/40 text-purple-400 text-[10px] font-mono px-2.5 py-0.5 rounded uppercase">
                <Workflow className="w-3.5 h-3.5" />
                Development Roadmap Blueprint
              </div>
              <h3 className="text-lg font-extrabold text-white leading-snug">
                {workspaceData.title}
              </h3>
              <div className="flex gap-4 border-b border-slate-900 pb-3 text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  Difficulty: <span className="text-purple-400 font-bold">{workspaceData.difficulty}</span>
                </span>
                <span>|</span>
                <span className="flex items-center gap-1">
                  Estimated Build: <span className="text-purple-400 font-bold">{workspaceData.estimatedTime}</span>
                </span>
              </div>

              {/* Developer Plan checklist */}
              <div className="space-y-2.5">
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">Developer Coding Milestones:</span>
                <div className="grid grid-cols-1 gap-2">
                  {workspaceData.developerPlan.map((step: string, idx: number) => (
                    <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-slate-900 flex gap-2.5 items-start">
                      <span className="bg-purple-950 border border-purple-800/40 text-purple-400 font-mono text-[9px] w-5 h-5 flex items-center justify-center rounded-full flex-shrink-0 mt-0.5 font-bold">
                        {idx + 1}
                      </span>
                      <p className="text-xs text-slate-300 leading-normal">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Concept Highlighting Cards */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">Computer Science Core Highlights:</span>
                <div className="grid grid-cols-1 gap-2">
                  {workspaceData.conceptHighlights.map((concept: string, idx: number) => (
                    <div key={idx} className="flex gap-2 text-xs text-slate-400 leading-relaxed font-mono">
                      <span className="text-purple-500 font-bold flex-shrink-0">◆</span>
                      <span>{concept}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggestions */}
              <div className="bg-purple-950/20 border border-purple-900/30 p-4 rounded-xl space-y-2">
                <span className="text-[10px] text-purple-400 font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                  <Lightbulb className="w-3.5 h-3.5" />
                  Upgrade Pro Prompts:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300 font-mono list-disc pl-4 leading-relaxed">
                  {workspaceData.suggestions.map((s: string, idx: number) => (
                    <li key={idx}>"{s}"</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column: Code Playgrounds compiler */}
          <div className="lg:col-span-7 space-y-4 font-sans">
            <div className="bg-slate-900 border border-slate-950 px-4 py-3 rounded-xl flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs font-bold tracking-wide uppercase text-slate-300">Become a Dev Compiler</h3>
              </div>
              <span className="text-[10px] font-mono text-purple-300 bg-purple-950/40 border border-purple-900/40 py-0.5 px-2.5 rounded font-bold uppercase">
                {workspaceData.sandboxLang} active
              </span>
            </div>

            <Compiler
              initialCode={workspaceData.sandboxCode || ""}
              language={workspaceData.sandboxLang as "javascript" | "html" | "python"}
            />
          </div>
        </section>
      )}
    </div>
  );
}
