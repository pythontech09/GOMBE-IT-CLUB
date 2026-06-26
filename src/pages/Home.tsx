import React from "react";
import { Link } from "wouter";
import { Laptop, Shield, Gamepad2, Sparkles, ArrowRight, BookOpen, Clock, Code } from "lucide-react";
import { Logo } from "../components/layout/Logo";

export default function Home() {
  const paths = [
    {
      href: "/coding",
      badge: "CORE DEPARTMENT",
      title: "CODING HUB",
      description: "Master HTML, CSS, Python, and React. Build real-world projects, dynamic web applications, and script computer behaviors from scratch.",
      tagline: "Build dynamic websites & algorithms",
      accent: "cyan",
      icon: Laptop,
      topics: ["HTML5", "CSS Grid", "Python 3", "React & Hooks", "APIs & SQL"]
    },
    {
      href: "/cyber",
      badge: "CORE DEPARTMENT",
      title: "CYBER SECURITY",
      description: "Learn ethical hacking, network defenses, systems security, and OSINT. Spot vulnerabilities and secure networks from external threats.",
      tagline: "Conduct security audits & pack analysis",
      accent: "emerald",
      icon: Shield,
      topics: ["Linux Terminals", "Nmap Ports", "AES Cryptography", "OWASP Defence"]
    },
    {
      href: "/vibe",
      badge: "NEW HIGH-TECH TRACK",
      title: "BECOME A DEVELOPER",
      description: "Got an idea for an app or game? Tell the Gemini AI tutor, receive a step-by-step program curriculum, get interactive developer guides, and earn rewards!",
      tagline: "Dynamic vibe-coding workspace",
      accent: "purple",
      icon: Sparkles,
      topics: ["Custom Curriculum", "Instant Sandboxes", "AI Feedback", "Vibe Projects"]
    },
    {
      href: "/gaming",
      badge: "SOCIAL CLUB",
      title: "GAMING ZONE",
      description: "Compete with peers in FIFA, COD, and Mortal Kombat. Keep track of tournament entries, schedules, and Gombe ICT Club leaderboards.",
      tagline: "Weekly multiplayer school tournaments",
      accent: "rose",
      icon: Gamepad2,
      topics: ["FIFA Clubs", "Call Of Duty", "Mortal Kombat", "Active Standings"]
    }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Welcome Unit */}
      <section className="text-center py-10 md:py-16 space-y-6 max-w-3xl mx-auto rounded-2xl relative overflow-hidden bg-gradient-to-b from-slate-900/60 to-transparent p-6 border border-slate-900">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-cyan-500/10 blur-3xl rounded-full"></div>
        <div className="inline-flex items-center gap-1.5 bg-cyan-950/50 border border-cyan-800/40 text-cyan-400 text-[11px] font-mono px-3 py-1 rounded-full uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          Building the future of tech in Gombe
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="p-1.5 rounded-full bg-slate-900 border border-slate-800 shadow-2xl hover:scale-105 hover:border-slate-700 transition-all duration-350">
            <Logo className="w-28 h-28" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-extrabold tracking-tight text-white leading-tight">
            GOMBE ICT CLUB
          </h1>
        </div>
        <p className="text-base md:text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
          Three departments. One community. Cultivating a beautiful generation of software developers and digital creators in Uganda.
        </p>
        <div className="flex justify-center gap-3 pt-4">
          <Link href="/coding" className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold tracking-wide px-5 py-2.5 rounded-lg transition-all shadow-lg shadow-cyan-950/50">
            Start Learning Now
          </Link>
          <Link href="/vibe" className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold tracking-wide px-5 py-2.5 rounded-lg transition-all">
            Try Vibe Coding
          </Link>
        </div>
      </section>

      {/* Main Track Grid options */}
      <section className="space-y-6">
        <div className="border-b border-slate-900 pb-4">
          <h2 className="text-xl font-bold tracking-tight text-white">CHOOSE YOUR PATH</h2>
          <p className="text-xs text-slate-500 mt-1">Select an ICT Club track below and explore immersive training, sandboxes, and quizzes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paths.map((path) => {
            const Icon = path.icon;
            const borderAccent = 
              path.accent === "cyan" ? "hover:border-cyan-500/40" :
              path.accent === "emerald" ? "hover:border-emerald-500/40" :
              path.accent === "purple" ? "hover:border-purple-500/40" : "hover:border-rose-500/40";
            
            const textAccent = 
              path.accent === "cyan" ? "text-cyan-400" :
              path.accent === "emerald" ? "text-emerald-400" :
              path.accent === "purple" ? "text-purple-400" : "text-rose-400";
            
            const badgeBg = 
              path.accent === "cyan" ? "bg-cyan-950/40 border-cyan-800/30 text-cyan-400" :
              path.accent === "emerald" ? "bg-emerald-950/40 border-emerald-800/30 text-emerald-400" :
              path.accent === "purple" ? "bg-purple-950/40 border-purple-800/30 text-purple-400" : "bg-rose-950/40 border-rose-800/30 text-rose-400";

            return (
              <div 
                key={path.title}
                className={`bg-slate-900/60 border border-slate-900 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 ${borderAccent} group`}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className={`text-[9px] font-mono border px-2 py-0.5 rounded tracking-wider uppercase ${badgeBg}`}>
                      {path.badge}
                    </span>
                    <div className={`p-2.5 bg-slate-950 rounded-xl ${textAccent}`}>
                      <Icon className="w-5 h-5 flex-shrink-0" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {path.title}
                    </h3>
                    <p className="text-xs text-slate-500 italic">
                      "{path.tagline}"
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed pt-1">
                      {path.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 space-y-4">
                  {/* Subject labels */}
                  <div className="flex flex-wrap gap-1.5">
                    {path.topics.map((t) => (
                      <span key={t} className="text-[10px] font-mono bg-slate-950 text-slate-400 py-0.5 px-2 rounded border border-slate-800">
                        {t}
                      </span>
                    ))}
                  </div>

                  <Link href={path.href} className="w-full flex items-center justify-between text-xs font-semibold px-4 py-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 rounded-xl transition-all">
                    <span>Enter department gate</span>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 group-hover:text-white transition-all" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Info card banner for parents */}
      <section className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center justify-between relative overflow-hidden">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-lg font-bold text-white">Need a dynamic, personalized learning adventure?</h3>
          <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
            Our AI-powered portals run entirely for free! Gemini instantly designs customized curricula, self-scoring micro quizzes, and executable sandbox examples for any topic you query.
          </p>
        </div>
        <Link href="/vibe" className="bg-gradient-to-r from-cyan-600 to-indigo-600 text-white text-xs font-bold tracking-wide px-5 py-3 rounded-lg flex items-center gap-2 hover:opacity-95 transition-opacity flex-shrink-0">
          <Sparkles className="w-4 h-4 text-cyan-200" />
          Launch Become a Dev Page
        </Link>
      </section>
    </div>
  );
}
