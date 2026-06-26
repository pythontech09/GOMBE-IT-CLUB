import React, { useState, useEffect } from "react";
import { CYBER_TRACKS } from "@/src/lib/bootcamp-data";
import { UserStats } from "@/src/types";
import { 
  Shield, 
  Terminal, 
  HelpCircle, 
  Award, 
  CheckCircle, 
  Play, 
  Eye, 
  Lock, 
  Database,
  ArrowRight,
  TrendingUp,
  Flame,
  Globe
} from "lucide-react";

export default function Cyber() {
  const [selectedTrackCategory, setSelectedTrackCategory] = useState<"recon" | "defence" | "attack">("recon");
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);
  const [terminalTask, setTerminalTask] = useState<string>("nmap");
  const [terminalOutput, setTerminalOutput] = useState("");
  const [terminalRunning, setTerminalRunning] = useState(false);
  const [flagInput, setFlagInput] = useState("");
  const [flagFeedback, setFlagFeedback] = useState<string | null>(null);

  // Quiz evaluation
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);
  const [quizPassed, setQuizPassed] = useState<boolean | null>(null);

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

  const activeTrackLessons = CYBER_TRACKS[selectedTrackCategory];
  const activeLesson = activeTrackLessons[activeLessonIdx];

  const handleRunTerminalTask = (task: string) => {
    setTerminalTask(task);
    setTerminalRunning(true);
    setTerminalOutput("");

    setTimeout(() => {
      if (task === "nmap") {
        setTerminalOutput(`
$ nmap -sV -p 1-1000 192.168.4.25
Starting Nmap 7.92 ( https://nmap.org ) at 2026-06-19 09:12 UTC
Nmap scan report for gombe-ss-intranet (192.168.4.25)
Host is up (0.004s latency).
Not shown: 996 closed tcp ports

PORT    STATE SERVICE     VERSION
21/tcp  open  ftp         vsftpd 3.0.3 (Anonymous Access Allowed ⚠️)
22/tcp  open  ssh         OpenSSH 8.2p1 Ubuntu (Strict Authentication)
80/tcp  open  http        Apache httpd 2.4.41 (Unsupported Vibe)
443/tcp open  ssl/http    Apache httpd (Secure site)

Nmap done: 1 IP address scanned in 2.12 seconds
        `);
      } else if (task === "wireshark") {
        setTerminalOutput(`
$ wireshark-packet-capture --interface eth0 --count 1
Capturing packet header on loop interface...
[Frame 1]: HTTP Cleartext Leak Found ⚠️
Length: 456 bytes
Source: 192.168.4.10 -> Destination: 192.168.4.25

=== APPLICATION LAYER PACKET OVERVIEW ===
POST /api/login HTTP/1.1
Host: gombe-ss-intranet
Content-Type: application/x-www-form-urlencoded
Referer: http://gombe-ss-intranet/login.html

username=admin&pass=GombeICTSecureSalt453!

========================================
Plaintext authentication parameters caught. Trace successfully.
        `);
      } else if (task === "md5") {
        setTerminalOutput(`
$ python3 calculate_hashes.py --algorithm sha256 --input "GombeSSICT"
🔑 Calculating secure asymmetric digests...

Raw plain text: "GombeSSICT"
SHA-256 Digest: d8b2734b07cf64b88ddadbc4869acbd963660bf548af0defab75429acb7e09ef
Strength verification: EXTREMELY HIGH (Rainbow-table proof)

Note: SHA-256 hashes are immutable. You cannot decrypt this back to text!
        `);
      }
      setTerminalRunning(false);
    }, 800);
  };

  const handleVerifyFlag = () => {
    const isMatched = flagInput.trim().toLowerCase() === "gombeictsecuresalt453!";
    if (isMatched) {
      setFlagFeedback("correct");
      const isFirst = !userStats.completedTopics.includes("cyber_lab");
      const updatedTopics = isFirst ? [...userStats.completedTopics, "cyber_lab"] : userStats.completedTopics;
      const pointValue = isFirst ? 100 : 20;
      saveStats({
        ...userStats,
        points: userStats.points + pointValue,
        completedTopics: updatedTopics,
        streak: userStats.streak + 1
      });

      // Simple micro sound trigger
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); 
        osc.frequency.setValueAtTime(698.46, audioCtx.currentTime + 0.15); 
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.45);
      } catch (e) {}

    } else {
      setFlagFeedback("incorrect");
    }
  };

  return (
    <div className="space-y-8">
      {/* Dynamic BANNER headers */}
      <section className="bg-gradient-to-r from-emerald-950/40 to-slate-900/40 border border-slate-900 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 justify-between items-center">
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-800/40 text-emerald-400 text-[10px] font-mono px-2.5 py-0.5 rounded uppercase">
            <Shield className="w-3 h-3" />
            Cyber Security Tracks
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">ETHICAL HACKING & DEFENCE</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            From recon sweeps to defending live servers from threats. Select standard cyber security domains to view tactical handbook reports, slide notes, and inspect code packets inside our virtual sandbox lab terminal!
          </p>
        </div>
        <div className="hidden lg:block bg-slate-950 border border-slate-800 p-4 rounded-xl text-center">
          <Globe className="w-6 h-6 text-emerald-400 mx-auto mb-1.5" />
          <div className="text-xs text-slate-400 font-bold font-mono">LAB ACTIVE</div>
          <div className="text-[10px] text-slate-500 font-mono tracking-wider uppercase">Terminal Sandbox Ready</div>
        </div>
      </section>

      {/* Domain selectors */}
      <div className="flex gap-2 border-b border-slate-900 pb-2">
        {[
          { key: "recon", label: "01. RECON & NETWORK MAP" },
          { key: "defence", label: "02. SYSTEM HARDENING" },
          { key: "attack", label: "03. PENETRATION LABS" },
        ].map((track) => (
          <button
            key={track.key}
            onClick={() => {
              setSelectedTrackCategory(track.key as any);
              setActiveLessonIdx(0);
            }}
            className={`px-4 py-2.5 text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-lg border transition-all ${
              selectedTrackCategory === track.key
                ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
                : "text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-900/40"
            }`}
          >
            {track.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Lesson Handbooks Slide layout */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/60 border border-slate-900 rounded-2xl p-6 space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800/60">
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">
                Lesson Note Slide
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                {activeLessonIdx + 1} of {activeTrackLessons.length}
              </span>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-bold text-white">
                {activeLesson.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {activeLesson.desc}
              </p>
            </div>

            <div className="bg-slate-950 p-4 border border-slate-900 rounded-xl space-y-3">
              <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider block">Theoretical Bullet Points:</span>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex gap-2 leading-relaxed">
                  <span className="text-emerald-500">🛡️</span>
                  <span>Review these highlights carefully before scanning the dynamic live terminals.</span>
                </li>
                <li className="flex gap-2 leading-relaxed">
                  <span className="text-emerald-500">🛡️</span>
                  <span>Practice the commands in our laboratory window on the right column to test exploits.</span>
                </li>
              </ul>
            </div>

            {/* Previous / Next slides controllers */}
            <div className="flex gap-2 pt-2">
              <button
                disabled={activeLessonIdx === 0}
                onClick={() => setActiveLessonIdx(activeLessonIdx - 1)}
                className="flex-1 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-white border border-slate-800 disabled:opacity-30 rounded-lg py-2 text-xs font-semibold font-mono"
              >
                ◀ Previous Note
              </button>
              <button
                disabled={activeLessonIdx === activeTrackLessons.length - 1}
                onClick={() => setActiveLessonIdx(activeLessonIdx + 1)}
                className="flex-1 bg-emerald-950/40 border border-emerald-800/40 hover:border-emerald-700/80 text-emerald-300 disabled:opacity-30 rounded-lg py-2 text-xs font-semibold font-mono"
              >
                Next Lesson Note ▶
              </button>
            </div>
          </div>

          {/* Quick MCQ challenge for XP */}
          <div className="bg-slate-900/60 border border-slate-900 rounded-2xl p-6 space-y-5">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-300 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-400 animate-pulse" />
              Dynamic Verification Challenge
            </h3>
            <div className="bg-slate-950 p-4 border border-slate-900 rounded-xl space-y-3.5">
              <p className="text-xs font-semibold text-slate-200">
                Which tool captures and inspects plaintext protocol packets live?
              </p>
              <div className="space-y-1.5">
                {[
                  "Nmap scan engine",
                  "Wireshark network packet analyzer",
                  "MD5 crypt hash builder",
                  "Apache static fileserver"
                ].map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (quizSubmitted) return;
                      setQuizSelectedOption(idx);
                    }}
                    disabled={quizSubmitted}
                    className={`w-full text-left text-xs p-3 rounded-lg border leading-tight ${
                      quizSubmitted && idx === 1
                        ? "bg-emerald-950/60 border-emerald-500 text-emerald-300"
                        : quizSubmitted && quizSelectedOption === idx && idx !== 1
                          ? "bg-rose-950/60 border-rose-500 text-rose-300"
                          : quizSelectedOption === idx
                            ? "bg-emerald-950/30 border-emerald-500/60 text-emerald-300"
                            : "bg-slate-900/40 border-slate-900 hover:border-slate-800"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {!quizSubmitted ? (
              <button
                onClick={() => {
                  if (quizSelectedOption === null) return;
                  const passed = quizSelectedOption === 1;
                  setQuizPassed(passed);
                  setQuizSubmitted(true);
                  if (passed) {
                    saveStats({
                      ...userStats,
                      points: userStats.points + 20,
                      streak: userStats.streak + 1
                    });
                  }
                }}
                disabled={quizSelectedOption === null}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium uppercase py-2.5 rounded-xl block tracking-wider"
              >
                Evaluate Certification Answer
              </button>
            ) : (
              <div className="space-y-3">
                <div className={`p-3 rounded-lg border text-xs font-mono text-center ${
                  quizPassed ? "bg-emerald-950/40 border-emerald-800 text-emerald-300" : "bg-rose-950/40 border-rose-900 text-rose-300"
                }`}>
                  {quizPassed ? "🎉 CORRECT! +20 XP awarded to profile streak tracker!" : "❌ Try again! Correct payload analyzer is Wireshark."}
                </div>
                <button
                  onClick={() => {
                    setQuizSelectedOption(null);
                    setQuizSubmitted(false);
                    setQuizPassed(null);
                  }}
                  className="w-full text-center py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Reset question parameters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Virtual Cyber Security Terminal Sandbox */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-2xl flex flex-col h-[520px] justify-between">
            <div className="space-y-3 flex-grow overflow-hidden flex flex-col">
              <div className="flex justify-between items-center pb-2.5 border-b border-slate-950">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">Gombe Virtual Hacking Lab</span>
                </div>
                <div className="flex gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                  <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                </div>
              </div>

              {/* Console logs output */}
              <div className="flex-grow bg-slate-950 p-4 rounded-xl border border-slate-900 font-mono text-[11px] text-emerald-400 overflow-y-auto min-h-24">
                {terminalRunning ? (
                  <p className="animate-pulse">Connecting node... executing cryptographic packet trace...</p>
                ) : (
                  <pre className="whitespace-pre-wrap leading-relaxed">
                    {terminalOutput || "Gombe cyber intelligence terminal online.\nSelect an active execution tool below to run scan diagnostics..."}
                  </pre>
                )}
              </div>
            </div>

            {/* Launch scripts triggers */}
            <div className="space-y-4 border-t border-slate-950 pt-4">
              <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider block">1. Run Sandbox Commands:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => handleRunTerminalTask("nmap")}
                  className={`bg-slate-950 hover:bg-slate-900 text-xs font-mono py-2.5 px-3 rounded-lg border text-left transition-all flex items-center justify-between ${
                    terminalTask === "nmap" ? "border-emerald-500/50 text-white" : "border-slate-800/70 text-slate-400"
                  }`}
                >
                  <span>nmap -sV target_server</span>
                  <Play className="w-3 h-3 text-slate-500" />
                </button>
                <button
                  onClick={() => handleRunTerminalTask("wireshark")}
                  className={`bg-slate-950 hover:bg-slate-900 text-xs font-mono py-2.5 px-3 rounded-lg border text-left transition-all flex items-center justify-between ${
                    terminalTask === "wireshark" ? "border-emerald-500/50 text-white" : "border-slate-800/70 text-slate-400"
                  }`}
                >
                  <span>wireshark intercept tcp</span>
                  <Play className="w-3 h-3 text-slate-500" />
                </button>
                <button
                  onClick={() => handleRunTerminalTask("md5")}
                  className={`bg-slate-950 hover:bg-slate-900 text-xs font-mono py-2.5 px-3 rounded-lg border text-left transition-all flex items-center justify-between ${
                    terminalTask === "md5" ? "border-emerald-500/50 text-white" : "border-slate-800/70 text-slate-400"
                  }`}
                >
                  <span>python3 encrypt_hash</span>
                  <Play className="w-3 h-3 text-slate-500" />
                </button>
              </div>

              {/* Spot the cleartext password game */}
              <div className="bg-slate-950 p-4 border border-slate-900 rounded-xl space-y-3">
                <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wide block">2. FLAG CHALLENGE: Intercepted Password?</span>
                <p className="text-[11px] text-slate-400">
                  Run the cleartext packet trace, parse the plaintext parameters, enter the hidden password value below, and click verify:
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter intercepted password..."
                    value={flagInput}
                    onChange={(e) => setFlagInput(e.target.value)}
                    className="flex-grow bg-slate-900 text-xs text-white p-2.5 rounded-lg border border-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={handleVerifyFlag}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-4 rounded-lg font-bold"
                  >
                    Claim Flag
                  </button>
                </div>

                {flagFeedback === "correct" && (
                  <p className="text-emerald-400 text-[11px] font-mono">🎉 Correct! You captured the correct flag password and earned points!</p>
                )}
                {flagFeedback === "incorrect" && (
                  <p className="text-rose-400 text-[11px] font-mono">❌ Incorrect password. Try tracing the wireshark HTTP POST payload to find the parameters!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
