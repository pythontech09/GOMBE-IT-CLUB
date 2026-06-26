import React, { useState, useEffect } from "react";
import { CODING_TRACKS } from "@/src/lib/bootcamp-data";
import { DynamicLesson, UserStats } from "@/src/types";
import { Compiler } from "@/src/components/Compiler";
import { getOfflineLesson } from "../lib/offline-curriculum";
import { 
  Laptop, 
  Sparkles, 
  ChevronRight, 
  Award, 
  Code, 
  CheckCircle, 
  ArrowLeft,
  XCircle,
  HelpCircle,
  TrendingUp,
  Brain
} from "lucide-react";

export default function Coding() {
  const [selectedTopic, setSelectedTopic] = useState<{ id: string; title: string; desc: string } | null>(null);
  const [activeLevel, setActiveLevel] = useState<"beginner" | "intermediate" | "pro">("beginner");
  const [loading, setLoading] = useState(false);
  const [lessonData, setLessonData] = useState<DynamicLesson | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loadedVia, setLoadedVia] = useState<"ai" | "cache" | "offline" | null>(null);
  
  // Custom Quiz states
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Load stats to track completed status triggers
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

  const loadAILesson = async (topicId: string, title: string, desc: string) => {
    setLoading(true);
    setApiError(null);
    setLessonData(null);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setLoadedVia(null);

    // 1. Check zero-latency Local Cache first
    const cacheKey = `gombe_lesson_cache_${topicId}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.title && parsed.overview) {
          setLessonData(parsed);
          setLoadedVia("cache");
          setLoading(false);
          return;
        }
      } catch (e) {
        // Stale cache, clear it
        localStorage.removeItem(cacheKey);
      }
    }

    // 2. Fetch using Gemini API with AbortController for strict 2.5-second latency protection
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 2500);

    try {
      const res = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          promptType: "lesson",
          topicId,
          title,
          desc
        })
      });
      clearTimeout(timeoutId);

      const resData = await res.json();
      if (resData.success && resData.data) {
        const loaded = {
          id: topicId,
          title: resData.data.title,
          category: "coding",
          difficulty: activeLevel,
          overview: resData.data.overview,
          keyPoints: resData.data.keyPoints,
          sandboxCode: resData.data.sandboxCode,
          sandboxLang: resData.data.sandboxLang,
          expectedOutput: resData.data.expectedOutput,
          quiz: resData.data.quiz
        };
        setLessonData(loaded);
        setLoadedVia("ai");
        // Save to cache for instant sub-turn zero latency loads!
        localStorage.setItem(cacheKey, JSON.stringify(loaded));
      } else {
        throw new Error(resData.error || "Failed loading");
      }
    } catch (err: any) {
      console.warn("Gemini loaded slowly or offline. Triggering instant Gombe local backup failover.", err);
      // 3. Fallback to instant offline curriculum
      const offline = getOfflineLesson(topicId, title, desc);
      const loaded = {
        id: topicId,
        title: offline.title,
        category: "coding",
        difficulty: activeLevel,
        overview: offline.overview,
        keyPoints: offline.keyPoints,
        sandboxCode: offline.sandboxCode,
        sandboxLang: offline.sandboxLang,
        expectedOutput: offline.expectedOutput,
        quiz: offline.quiz
      };
      setLessonData(loaded);
      setLoadedVia("offline");
      // Cache the offline lesson too so it loads in 0ms next time!
      localStorage.setItem(cacheKey, JSON.stringify(loaded));
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTopic = (topic: { id: string; title: string; desc: string }) => {
    setSelectedTopic(topic);
    setLessonData(null);
    setApiError(null);
    // Auto-generate deep tutorial immediately for a premium student experience!
    loadAILesson(topic.id, topic.title, topic.desc);
  };

  const handleOptionSelect = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [qIdx]: optIdx
    });
  };

  const handleSubmitQuiz = () => {
    if (!lessonData?.quiz) return;
    let score = 0;
    lessonData.quiz.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) {
        score++;
      }
    });

    setQuizScore(score);
    setQuizSubmitted(true);

    if (score === lessonData.quiz.length) {
      // Perfect score payout!
      const isFirstTime = !userStats.completedTopics.includes(lessonData.id);
      const updatedTopics = isFirstTime 
        ? [...userStats.completedTopics, lessonData.id] 
        : userStats.completedTopics;

      const increment = isFirstTime ? 50 : 10;
      const updatedStats: UserStats = {
        ...userStats,
        points: userStats.points + increment,
        completedTopics: updatedTopics,
        streak: userStats.streak + 1
      };
      saveStats(updatedStats);

      // Play success synth sound! (completely standalone browser Web Audio API, gratis)
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.15); // E5
        osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.3); // G5
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
      } catch (e) {}
    }
  };

  const handleBack = () => {
    setSelectedTopic(null);
    setLessonData(null);
    setApiError(null);
  };

  return (
    <div className="space-y-8">
      {/* Visual Navigation Header Banner */}
      {!selectedTopic ? (
        <>
          <section className="bg-gradient-to-r from-cyan-950/40 to-indigo-950/40 border border-slate-900 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 justify-between items-center">
            <div className="space-y-2 max-w-xl text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 bg-cyan-950/80 border border-cyan-800/40 text-cyan-400 text-[10px] font-mono px-2.5 py-0.5 rounded uppercase">
                <Laptop className="w-3 h-3" />
                Coding Department
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">GOMBE PROGRAMMING TRACKS</h1>
              <p className="text-xs text-slate-400 leading-relaxed">
                Build structural logic, automate calculations, and construct rich interfaces. Learn Python, HTML/CSS, React, and databases. Pick a track structure to load dynamic workshops powered by Gemini AI!
              </p>
            </div>
            <div className="hidden lg:block bg-slate-950 border border-slate-800 p-4 rounded-xl text-center">
              <TrendingUp className="w-6 h-6 text-cyan-400 mx-auto mb-1.5" />
              <div className="text-lg font-bold font-mono text-cyan-400">{userStats.completedTopics.length} / 15</div>
              <div className="text-[10px] text-slate-500 font-mono tracking-wider uppercase">Tracks Completed</div>
            </div>
          </section>

          {/* Level tabs selectors */}
          <div className="flex gap-2 border-b border-slate-900 pb-2">
            {(["beginner", "intermediate", "pro"] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setActiveLevel(lvl)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                  activeLevel === lvl
                    ? "bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 shadow shadow-cyan-950"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* List of subtracks */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CODING_TRACKS[activeLevel].map((track) => {
              const isDone = userStats.completedTopics.includes(track.id);
              return (
                <div
                  key={track.id}
                  onClick={() => handleSelectTopic(track)}
                  className="bg-slate-900/40 border border-slate-900 hover:border-slate-800 rounded-xl p-5 cursor-pointer hover:bg-slate-900/70 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">{activeLevel} track</span>
                      {isDone ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-slate-700" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                        {track.title}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                        {track.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-slate-950 mt-4 text-[11px] font-semibold text-slate-400 group-hover:text-white transition-colors">
                    <span>Unlock training</span>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:translate-x-1 group-hover:text-white transition-all" />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* Selected Topic workspace layout */
        <div className="space-y-8">
          {/* Top Return Panel */}
          <button 
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white group bg-slate-900/60 border border-slate-900 hover:border-slate-800 transition-all px-3 py-1.5 rounded-lg"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to Gombe Coding Tracks
          </button>

          {/* Loading educator widget */}
          {loading && (
            <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-12 text-center space-y-4 max-w-lg mx-auto">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 rounded-full border-2 border-cyan-500/10 border-t-cyan-500 animate-spin"></div>
                <div className="absolute inset-3 rounded-full border-2 border-indigo-500/10 border-t-indigo-500 animate-spin" style={{ animationDirection: "reverse" }}></div>
                <Brain className="w-6 h-6 text-cyan-400 absolute inset-0 m-auto" />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white tracking-wide uppercase">AI Classroom Connection</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Gombe SS AI Teacher is assembling interactive outlines, formatting writing guides, and deploying playground sandbox exercises...
                </p>
              </div>
            </div>
          )}

          {/* Error fallback wrapper */}
          {apiError && (
            <div className="bg-rose-950/20 border border-rose-900/50 p-6 rounded-2xl max-w-lg mx-auto text-center space-y-4">
              <XCircle className="w-10 h-10 text-rose-500 mx-auto" />
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-white uppercase text-rose-300">Classroom Setup Error</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-mono">
                  {apiError}
                </p>
              </div>
              <button
                onClick={() => loadAILesson(selectedTopic.id, selectedTopic.title, selectedTopic.desc)}
                className="px-4 py-2 bg-rose-900/40 hover:bg-rose-900/60 text-xs font-bold tracking-wide uppercase rounded-lg border border-rose-800/40 text-rose-200"
              >
                Retry generative request
              </button>
            </div>
          )}

          {/* Complete Lesson content view */}
          {lessonData && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Lesson Instructions / Info */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 space-y-5">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 bg-cyan-950/80 border border-cyan-800/30 text-cyan-400 text-[10px] font-mono px-2.5 py-0.5 rounded uppercase">
                      <Sparkles className="w-3 h-3" />
                      Dynamic Curriculum Outline
                    </div>
                    <h2 className="text-xl font-extrabold text-white leading-snug flex flex-wrap items-center gap-2">
                      <span>{lessonData.title}</span>
                      {loadedVia && (
                        <span className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold border ${
                          loadedVia === "cache" 
                            ? "bg-emerald-950/85 text-emerald-400 border-emerald-800/40" 
                            : loadedVia === "offline"
                            ? "bg-amber-950/80 text-amber-400 border-amber-800/30"
                            : "bg-cyan-950/80 text-cyan-400 border-cyan-800/30"
                        }`}>
                          {loadedVia === "cache" && "⚡ FastCache"}
                          {loadedVia === "offline" && "📦 Local Failover"}
                          {loadedVia === "ai" && "🤖 Live Gemini"}
                        </span>
                      )}
                    </h2>
                  </div>

                  {/* Core checklist items format */}
                  <div className="space-y-2 bg-slate-950 p-3.5 border border-slate-900 rounded-xl">
                    <span className="text-[10px] text-slate-500 font-mono tracking-wider uppercase block mb-1.5">Lesson Core Highlights:</span>
                    <ul className="space-y-2 text-xs">
                      {lessonData.keyPoints.map((pt, idx) => (
                        <li key={idx} className="flex gap-2 text-slate-300 leading-relaxed font-mono">
                          <span className="flex-shrink-0">{pt.split(" ")[0] || "📋"}</span>
                          <span>{pt.substring(pt.indexOf(" ") + 1)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Body instructions in markdown */}
                  <div className="text-xs text-slate-400 leading-relaxed whitespace-pre-line border-t border-slate-800 pt-4 font-sans">
                    {lessonData.overview}
                  </div>
                </div>

                {/* dynamic grading quiz widget */}
                {lessonData.quiz && lessonData.quiz.length > 0 && (
                  <div className="bg-slate-900/40 border border-slate-950 rounded-2xl p-6 space-y-6">
                    <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-cyan-400" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Interactive Track Quiz</h3>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">3 QUESTIONS</span>
                    </div>

                    <div className="space-y-6">
                      {lessonData.quiz.map((q, qIdx) => {
                        const isCorrectAnswerSelected = selectedAnswers[qIdx] === q.correct;
                        return (
                          <div key={qIdx} className="space-y-2.5 bg-slate-950 p-4 border border-slate-900 rounded-xl">
                            <h4 className="text-xs font-semibold text-white leading-normal flex gap-1.5">
                              <span className="text-slate-500 font-mono">{qIdx + 1}.</span>
                              <span>{q.q}</span>
                            </h4>
                            <div className="grid grid-cols-1 gap-1.5">
                              {q.options.map((opt, optIdx) => {
                                const isSelected = selectedAnswers[qIdx] === optIdx;
                                const showSuccess = quizSubmitted && optIdx === q.correct;
                                const showFailure = quizSubmitted && isSelected && optIdx !== q.correct;

                                return (
                                  <button
                                    key={optIdx}
                                    onClick={() => handleOptionSelect(qIdx, optIdx)}
                                    disabled={quizSubmitted}
                                    className={`text-left text-xs p-3 rounded-lg border transition-all text-slate-300 leading-relaxed ${
                                      showSuccess
                                        ? "bg-emerald-950/60 border-emerald-500 text-emerald-300 font-medium"
                                        : showFailure
                                          ? "bg-rose-950/60 border-rose-500 text-rose-300"
                                          : isSelected
                                            ? "bg-cyan-950/40 border-cyan-500/60 text-cyan-300 font-medium"
                                            : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
                                    }`}
                                  >
                                    <span className="font-mono text-slate-500 mr-1.5">[{optIdx}]</span>
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Submit layout parameters */}
                    <div className="space-y-3 pt-2">
                      {!quizSubmitted ? (
                        <button
                          onClick={handleSubmitQuiz}
                          disabled={Object.keys(selectedAnswers).length < lessonData.quiz.length}
                          className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-xs font-bold uppercase tracking-wider text-white px-4 py-3 rounded-xl shadow-lg shadow-cyan-950 transition-all"
                        >
                          Submit Quiz Answers
                        </button>
                      ) : (
                        <div className="space-y-4">
                          <div className={`p-4 rounded-xl border text-center font-mono text-sm ${
                            quizScore === lessonData.quiz.length
                              ? "bg-emerald-950/40 border-emerald-800 text-emerald-300"
                              : "bg-orange-950/40 border-orange-900 text-orange-300"
                          }`}>
                            {quizScore === lessonData.quiz.length ? (
                              <p className="font-bold">🎉 EXCELLENT WORK! Pasport cleared. +50 PTS payouts awarded!</p>
                            ) : (
                              <p className="font-medium">⚠️ Score: {quizScore}/3. We recommend reviewing instructions and retrying!</p>
                            )}
                          </div>

                          {quizScore < lessonData.quiz.length && (
                            <button
                              onClick={() => {
                                setSelectedAnswers({});
                                setQuizSubmitted(false);
                              }}
                              className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs font-bold uppercase py-2.5 rounded-xl hover:text-white transition-all text-slate-400 font-mono"
                            >
                              Restart quiz challenge
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Code Compiler Sandbox Playground */}
              <div className="lg:col-span-7">
                <div className="space-y-4">
                  <div className="bg-slate-900/40 border border-slate-900 px-4 py-3 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Code className="w-4 h-4 text-cyan-400" />
                      <h3 className="text-xs font-bold tracking-wide uppercase text-slate-300">Executable Code Playground</h3>
                    </div>
                    <span className="text-[10px] text-cyan-400 font-mono font-semibold uppercase tracking-widest bg-cyan-950/50 border border-cyan-800/30 px-2 py-0.5 rounded">
                      {lessonData.sandboxLang} environment
                    </span>
                  </div>

                  <Compiler
                    initialCode={lessonData.sandboxCode || "print('Hello World')"}
                    language={lessonData.sandboxLang as "javascript" | "html" | "python"}
                    expectedOutput={lessonData.expectedOutput}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
