import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { 
  Laptop, 
  Shield, 
  Gamepad2, 
  User, 
  Menu, 
  X, 
  Sparkles, 
  Trophy, 
  Flame, 
  VolumeX, 
  Volume2,
  Users,
  Megaphone,
  Palette,
  Cloud
} from "lucide-react";
import { UserStats } from "@/src/types";
import { Logo } from "./Logo";

interface LayoutProps {
  children: React.ReactNode;
}

export const THEMES = [
  {
    id: "midnight",
    name: "Midnight Slate (Default)",
    classes: "bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950",
    header: "bg-slate-950/80 border-slate-800 text-slate-100",
    topBar: "bg-slate-900 border-slate-800 text-slate-400",
    cardClass: "bg-slate-900/60 border-slate-900",
    footer: "bg-slate-950 border-slate-900 text-slate-500",
    accent: "text-cyan-400",
  },
  {
    id: "light",
    name: "Kigwa Snow (Light)",
    classes: "bg-slate-50 text-slate-900 selection:bg-indigo-600 selection:text-white",
    header: "bg-white/85 border-slate-250 text-slate-900 shadow-sm",
    topBar: "bg-slate-100 border-slate-200 text-slate-600",
    cardClass: "bg-white border-slate-200/80 shadow-sm text-slate-900",
    footer: "bg-slate-100 border-slate-200 text-slate-500",
    accent: "text-indigo-650 font-bold",
  },
  {
    id: "sunrise",
    name: "Ugandan Sunrise",
    classes: "bg-[#16120e] text-[#fbf6f0] selection:bg-amber-500 selection:text-black",
    header: "bg-[#1c1813]/85 border-[#3d2e21] text-amber-100",
    topBar: "bg-[#2b1f15] border-[#3d2e21] text-amber-500",
    cardClass: "bg-[#211a11] border-[#3a2c1f]",
    footer: "bg-[#16120e] border-[#33251a]/60 text-amber-600/60",
    accent: "text-amber-400",
  },
  {
    id: "forest",
    name: "Victoria Forest",
    classes: "bg-[#04100b] text-emerald-50 selection:bg-emerald-500 selection:text-slate-950",
    header: "bg-[#061811]/90 border-emerald-950 text-emerald-100",
    topBar: "bg-[#082218] border-emerald-950 text-emerald-400",
    cardClass: "bg-[#09261a] border-[#0e3b28]/60",
    footer: "bg-[#04100b] border-emerald-950/60 text-emerald-700/60",
    accent: "text-emerald-400",
  },
  {
    id: "sunset",
    name: "Cyber Violet",
    classes: "bg-[#0a0512] text-[#fcf8ff] selection:bg-fuchsia-500 selection:text-white",
    header: "bg-[#11091b]/90 border-[#24133b] text-fuchsia-100",
    topBar: "bg-[#150a24] border-[#24133b] text-fuchsia-400",
    cardClass: "bg-[#140b20] border-[#291745]",
    footer: "bg-[#0a0512] border-[#221038] text-indigo-500/50",
    accent: "text-fuchsia-400",
  },
  {
    id: "academic",
    name: "Royal Academic",
    classes: "bg-[#02071a] text-[#ebf0ff] selection:bg-blue-600 selection:text-white",
    header: "bg-[#040e2d]/90 border-blue-950 text-blue-100",
    topBar: "bg-[#05133d] border-blue-950 text-sky-450",
    cardClass: "bg-[#06194b] border-blue-950/70",
    footer: "bg-[#02071a] border-blue-950/40 text-blue-800/50",
    accent: "text-sky-400",
  },
  {
    id: "matooke",
    name: "Matooke Gold",
    classes: "bg-[#0c0e05] text-[#fafbfa] selection:bg-yellow-400 selection:text-black",
    header: "bg-[#121407]/90 border-[#2d3010] text-yellow-105",
    topBar: "bg-[#1a1d0a] border-[#2d3010] text-yellow-450",
    cardClass: "bg-[#151809] border-[#2c300f]",
    footer: "bg-[#0c0e05] border-[#23270c] text-yellow-800/40",
    accent: "text-yellow-400",
  },
  {
    id: "nebula",
    name: "Cosmic Nebula 🌟",
    classes: "bg-[#03001e] text-[#f1f5f9] selection:bg-purple-500 selection:text-white",
    header: "bg-[#03001e]/90 border-purple-950/60 text-purple-100",
    topBar: "bg-[#12002e] border-purple-950/45 text-purple-400",
    cardClass: "bg-[#12002e]/60 border-[#2b0c54]/70 shadow-lg shadow-purple-950/20",
    footer: "bg-[#03001e] border-purple-950/30 text-purple-700/60",
    accent: "text-fuchsia-400",
  },
  {
    id: "terminal",
    name: "Matrix Terminal 📟",
    classes: "bg-[#050806] text-[#4af626] selection:bg-[#4af626] selection:text-black font-mono",
    header: "bg-[#050806]/95 border-[#1a3818] text-[#4af626]",
    topBar: "bg-[#0b130c] border-[#1a3818] text-[#3cb71f]",
    cardClass: "bg-[#070c08] border-[#1a3818]/65 shadow-md shadow-emerald-950/20",
    footer: "bg-[#050806] border-[#1a3818]/45 text-[#3cb71f]/50",
    accent: "text-[#4af626] font-bold drop-shadow-[0_0_6px_rgba(74,246,38,0.4)]",
  },
  {
    id: "sahara",
    name: "Sahara Sand 🏜️",
    classes: "bg-[#0d0a07] text-[#fcfbfa] selection:bg-amber-400 selection:text-black",
    header: "bg-[#17120c]/90 border-amber-950/60 text-amber-100",
    topBar: "bg-[#241a10] border-amber-950/40 text-amber-500",
    cardClass: "bg-[#1d150c] border-[#3a2815]/80 shadow-md",
    footer: "bg-[#0d0a07] border-amber-950/30 text-amber-700/50",
    accent: "text-amber-400",
  }
];

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [themeId, setThemeId] = useState("midnight");

  const [userStats, setUserStats] = useState<UserStats>({
    points: 120,
    streak: 3,
    unlockedLevel: "beginner",
    completedTopics: []
  });

  // Load stats and theme from localStorage if available
  useEffect(() => {
    const saved = localStorage.getItem("gombe_ss_stats");
    if (saved) {
      try {
        setUserStats(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse user stats", e);
      }
    }

    const savedTheme = localStorage.getItem("gombe_ss_theme_v2");
    if (savedTheme) {
      setThemeId(savedTheme);
    }
  }, [location]);

  // Sync state helpers
  const handleToggleSound = () => {
    setSoundEnabled(!soundEnabled);
    if (soundEnabled) {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } catch (e) {}
    }
  };

  const handleThemeChange = (newTheme: string) => {
    setThemeId(newTheme);
    localStorage.setItem("gombe_ss_theme_v2", newTheme);
  };

  const activeTheme = THEMES.find(t => t.id === themeId) || THEMES[0];

  const navItems = [
    { href: "/", label: "Home", icon: Laptop },
    { href: "/coding", label: "Coding Hub", icon: Laptop },
    { href: "/ai-dev", label: "AI Senior Dev", icon: Sparkles, highlight: true },
    { href: "/cyber", label: "Cyber Security", icon: Shield },
    { href: "/vibe", label: "Become a Developer", icon: Sparkles },
    { href: "/deploy", label: "Deploy Apps", icon: Cloud },
    { href: "/gaming", label: "Gaming Zone", icon: Gamepad2 },
    { href: "/members", label: "Members", icon: Users },
    { href: "/announcements", label: "Broadcasts", icon: Megaphone },
    { href: "/account", label: "My Profile", icon: User },
  ];

  return (
    <div className={`min-h-screen ${activeTheme.classes} flex flex-col font-sans transition-all duration-300`}>
      {/* Top micro status information bar */}
      <div className={`${activeTheme.topBar} border-b text-[11px] font-mono py-1 px-4 flex justify-between items-center transition-colors duration-300`}>
        <div className="flex items-center gap-3">
          {/* Gombe Portal Title instead of raw live banners */}
          <span className="text-xs font-bold tracking-wider text-cyan-500">GOMBE ICT CLUB HUB</span>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Theme custom picker */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-850 px-2 py-0.5 rounded-lg select-none">
            <Palette className={`w-3.5 h-3.5 ${activeTheme.accent}`} />
            <select
              value={themeId}
              onChange={(e) => handleThemeChange(e.target.value)}
              className="bg-transparent border-none text-[10px] text-slate-300 outline-none cursor-pointer font-sans"
            >
              {THEMES.map(th => (
                <option key={th.id} value={th.id} className="bg-slate-950 text-white text-xs font-sans">
                  🎨 {th.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
            <span className="text-orange-400 font-bold">{userStats.streak} Day Streak</span>
          </div>
          <div className="flex items-center gap-1 bg-yellow-950/40 px-2 py-0.5 rounded border border-yellow-800/30">
            <Trophy className="w-3.5 h-3.5 text-yellow-500" />
            <span className="text-yellow-400 font-bold">{userStats.points} PTS</span>
          </div>
          <button 
            onClick={handleToggleSound}
            className="text-slate-500 hover:text-slate-200 transition-colors"
            title="Toggle micro sounds"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main header block */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b ${activeTheme.header} transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-95 transition-all group/logo">
            <div className="p-0.5 rounded-xl bg-slate-900 border border-slate-800 shadow-xl group-hover/logo:scale-105 transition-all">
              <Logo className="w-11 h-11" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight block text-white group-hover/logo:text-cyan-400 transition-colors">GOMBE SS ICT</span>
              <span className="text-[9px] font-mono block tracking-wider uppercase opacity-75 font-bold text-slate-400">Tech-it-Easy Portal</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium tracking-wide transition-all ${
                    item.highlight 
                      ? "bg-gradient-to-r from-violet-600/20 to-indigo-600/20 border border-violet-500/60 text-violet-300 hover:border-violet-400/80"
                      : isActive
                        ? "bg-slate-900 border border-slate-700 text-white"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${item.highlight ? "text-violet-400" : ""}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile hamburger menu toggle */}
          <div className="xl:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-900 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-slate-950 border-b border-slate-800 py-3 px-4 flex flex-col gap-1 z-30 fixed top-24 left-0 right-0 max-h-[80vh] overflow-y-auto shadow-2xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                  item.highlight
                    ? "bg-gradient-to-r from-violet-950/40 to-indigo-950/40 border border-violet-500/40 text-violet-300 font-bold"
                    : isActive
                      ? "bg-slate-900 border border-slate-700 text-white"
                      : "text-slate-300 hover:bg-slate-900/60"
                }`}
              >
                <Icon className="w-4 h-4 text-violet-400" />
                {item.label}
              </Link>
            );
          })}
        </div>
      )}

      {/* Main content body canvas */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer copyright block */}
      <footer className={`${activeTheme.footer} border-t py-8 text-center text-xs font-mono transition-colors duration-300`}>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[11px] text-slate-400 font-sans font-bold max-w-2xl mx-auto border-b border-slate-900/60 pb-4 mb-4">
          <span className="text-slate-500 font-mono">Lead Dev:</span>
          <a href="mailto:hpro453176@gmail.com" className="hover:text-cyan-400 transition-colors">✉️ hpro453176@gmail.com</a>
          <a href="tel:+256752453176" className="hover:text-emerald-400 transition-colors">📞 +256 752 453176</a>
          <a href="https://wa.me/256752453176" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors">💬 WhatsApp: +256 752 453176</a>
        </div>
        <p className="mb-2">Gombe Senior Secondary School ICT Club • Uganda</p>
        <p className="text-[10px] opacity-75">
          Empowered by Gemini AI Teacher Studio • © {new Date().getFullYear()} Gombe SS. Build the future with tech!
        </p>
      </footer>
    </div>
  );
}
