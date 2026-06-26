import React, { useState, useEffect, useRef } from "react";
import { 
  Cloud, 
  Terminal, 
  CheckCircle, 
  Play, 
  Github, 
  ExternalLink, 
  Mail, 
  Phone, 
  MessageSquare, 
  Settings, 
  Code, 
  Clock, 
  ArrowRight, 
  Lock, 
  Cpu, 
  Globe, 
  Sparkles,
  RefreshCw
} from "lucide-react";

interface DeploymentHistory {
  id: string;
  projectName: string;
  framework: string;
  url: string;
  timestamp: string;
  status: "Success" | "Building" | "Failed";
  commitMessage: string;
}

export default function Deploy() {
  // Simulator state
  const [projectName, setProjectName] = useState("gombe-portfolio");
  const [framework, setFramework] = useState("Vite (React)");
  const [buildDir, setBuildDir] = useState("dist");
  const [buildCommand, setBuildCommand] = useState("npm run build");
  const [customHtml, setCustomHtml] = useState(`<!DOCTYPE html>
<html>
<head>
  <title>My Gombe ICT Project</title>
</head>
<body>
  <h1>Hello Gombe Senior Secondary School!</h1>
  <p>This app was deployed to Cloudflare Pages edge servers.</p>
</body>
</html>`);

  // Deployment process state
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStep, setDeploymentStep] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [deployedUrl, setDeployedUrl] = useState<string | null>(null);
  
  // History
  const [history, setHistory] = useState<DeploymentHistory[]>([
    {
      id: "dep-1",
      projectName: "gombe-ict-portal",
      framework: "Vite (React)",
      url: "https://gombe-ict-portal.pages.dev",
      timestamp: "2026-06-25 10:14",
      status: "Success",
      commitMessage: "feat: add secure high-tech custom logo & theme selection framework"
    },
    {
      id: "dep-2",
      projectName: "uganda-ed-tech",
      framework: "Static HTML",
      url: "https://uganda-ed-tech.pages.dev",
      timestamp: "2026-06-23 15:44",
      status: "Success",
      commitMessage: "docs: update terminal lesson guides and local cache offline backup indexes"
    }
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalLogs]);

  // Handle Simulated Deployment
  const startSimulation = () => {
    if (!projectName.trim()) {
      alert("Please specify a project name.");
      return;
    }
    setIsDeploying(true);
    setDeployedUrl(null);
    setDeploymentStep(0);
    setTerminalLogs([`[SYSTEM] Initializing Cloudflare Pages pipeline for project: ${projectName}`]);

    const stepMsgs = [
      { text: "⚡ Authenticating with Gombe ICT central student credentials...", wait: 600 },
      { text: "📡 Resolving Cloudflare edge endpoint server in Kampala, Uganda...", wait: 1200 },
      { text: "📦 Fetching project source files and environment presets...", wait: 1800 },
      { text: `⚙️ executing build command: "${buildCommand}" inside workspace`, wait: 2400 },
      { text: "✨ Bundling production JavaScript modules with esbuild minifier...", wait: 3200 },
      { text: `📂 Analyzing output directory "/${buildDir}": 18 static files identified`, wait: 4000 },
      { text: "☁️ Uploading pre-built blocks to Cloudflare edge nodes worldwide...", wait: 4800 },
      { text: "🔒 Setting up free TLS security certificate encryption (Let's Encrypt)...", wait: 5400 },
      { text: "🌍 Custom routing applied to edge pages framework...", wait: 6000 },
      { text: "🎉 Cloudflare Pages Deployment succeeded! Status: ACTIVE", wait: 6600 }
    ];

    stepMsgs.forEach((step, idx) => {
      setTimeout(() => {
        setTerminalLogs(prev => [...prev, `[BUILD] ${step.text}`]);
        setDeploymentStep(idx + 1);

        if (idx === stepMsgs.length - 1) {
          const finalUrl = `https://${projectName.toLowerCase().replace(/\s+/g, "-")}.pages.dev`;
          setDeployedUrl(finalUrl);
          setIsDeploying(false);

          // Add to history
          setHistory(prev => [
            {
              id: `dep-${Date.now()}`,
              projectName,
              framework,
              url: finalUrl,
              timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
              status: "Success",
              commitMessage: `chore: deploy ${projectName} with edge optimization preset`
            },
            ...prev
          ]);
        }
      }, step.wait);
    });
  };

  return (
    <div className="space-y-10 animate-fade-in font-sans">
      {/* Page Header */}
      <section className="bg-gradient-to-r from-cyan-950/20 to-slate-900/40 border border-slate-900 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 justify-between items-center">
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 bg-cyan-950/80 border border-cyan-800/40 text-cyan-400 text-[10px] font-mono px-2.5 py-0.5 rounded uppercase font-bold">
            <Cloud className="w-3.5 h-3.5" />
            Cloud Edge Deployment Center
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white uppercase">Deploy Your Creations</h1>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            Ready to show your apps to the world? Learn how to deploy your HTML, CSS, JavaScript, and React applications directly to Cloudflare Pages for free, and test your configuration in our real-time deployment pipeline simulator.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Simulator & Terminal (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-slate-900/60 border border-slate-900 rounded-2xl p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">Pipeline Configurator</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-500 font-bold bg-slate-950 border border-slate-850 px-2 py-0.5 rounded">
                SIMULATOR v1.4
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Project URL Name:</label>
                <div className="relative">
                  <input
                    type="text"
                    disabled={isDeploying}
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value.replace(/[^a-zA-Z0-9-]/g, ""))}
                    placeholder="my-cool-app"
                    className="w-full bg-slate-950 text-xs text-white px-3 py-2.5 rounded-lg border border-slate-850 focus:outline-none focus:border-cyan-500 transition-colors font-mono disabled:opacity-50"
                  />
                  <span className="absolute right-3 top-2.5 text-[10px] font-mono text-slate-500 select-none">
                    .pages.dev
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Framework Preset:</label>
                <select
                  disabled={isDeploying}
                  value={framework}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFramework(val);
                    if (val === "Vite (React)") {
                      setBuildDir("dist");
                      setBuildCommand("npm run build");
                    } else if (val === "Static HTML") {
                      setBuildDir(".");
                      setBuildCommand("echo 'Static App Direct Deployment'");
                    } else if (val === "Next.js (Static)") {
                      setBuildDir("out");
                      setBuildCommand("next build");
                    }
                  }}
                  className="w-full bg-slate-950 text-xs text-slate-300 p-2.5 rounded-lg border border-slate-850 focus:outline-none focus:border-cyan-500 cursor-pointer disabled:opacity-50"
                >
                  <option value="Vite (React)">Vite (React)</option>
                  <option value="Static HTML">Static HTML/CSS/JS</option>
                  <option value="Next.js (Static)">Next.js (Static Export)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Build Command:</label>
                <input
                  type="text"
                  disabled={isDeploying}
                  value={buildCommand}
                  onChange={(e) => setBuildCommand(e.target.value)}
                  placeholder="e.g. npm run build"
                  className="w-full bg-slate-950 text-xs text-white px-3 py-2.5 rounded-lg border border-slate-850 focus:outline-none focus:border-cyan-500 transition-colors font-mono disabled:opacity-50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Output Directory:</label>
                <input
                  type="text"
                  disabled={isDeploying}
                  value={buildDir}
                  onChange={(e) => setBuildDir(e.target.value)}
                  placeholder="e.g. dist"
                  className="w-full bg-slate-950 text-xs text-white px-3 py-2.5 rounded-lg border border-slate-850 focus:outline-none focus:border-cyan-500 transition-colors font-mono disabled:opacity-50"
                />
              </div>
            </div>

            {framework === "Static HTML" && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase text-slate-400 block font-bold">HTML File Contents:</label>
                <textarea
                  rows={4}
                  disabled={isDeploying}
                  value={customHtml}
                  onChange={(e) => setCustomHtml(e.target.value)}
                  className="w-full bg-slate-950 text-xs text-emerald-400 p-3 rounded-lg border border-slate-850 focus:outline-none focus:border-cyan-500 transition-colors font-mono disabled:opacity-50"
                />
              </div>
            )}

            <button
              type="button"
              disabled={isDeploying}
              onClick={startSimulation}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-slate-800 disabled:to-slate-800 text-white text-xs font-mono font-bold uppercase py-3 rounded-xl tracking-wider shadow-lg shadow-cyan-950 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isDeploying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Building Edge Container... ({Math.min(100, Math.round((deploymentStep / 10) * 100))}%)
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  Trigger Cloudflare Production Build
                </>
              )}
            </button>
          </div>

          {/* Terminal Logs Outputs */}
          {(isDeploying || terminalLogs.length > 1) && (
            <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 space-y-4 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
              <div className="flex items-center justify-between font-mono text-xs text-slate-400 border-b border-slate-900 pb-2.5">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span>Cloudflare Pages Deploy Logs</span>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              </div>

              <div className="font-mono text-[11px] space-y-2 h-48 overflow-y-auto pr-2 custom-scrollbar bg-[#05080f] p-4 rounded-lg border border-slate-900/60 leading-relaxed">
                {terminalLogs.map((log, index) => (
                  <div key={index} className={log.includes("[SYSTEM]") ? "text-cyan-400 font-bold" : log.includes("Success") || log.includes("succeeded") ? "text-emerald-400 font-bold" : "text-slate-350"}>
                    {log}
                  </div>
                ))}
                <div ref={terminalEndRef} />
              </div>

              {/* Success Result Container */}
              {deployedUrl && (
                <div className="bg-emerald-950/20 border border-emerald-800/40 p-4 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4 animate-slide-up">
                  <div className="space-y-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider font-mono">
                      <CheckCircle className="w-4 h-4" />
                      LIVE ON CLOUDFLARE PAGES
                    </div>
                    <p className="text-xs text-slate-300 font-mono tracking-tight break-all">
                      {deployedUrl}
                    </p>
                  </div>
                  <a
                    href={deployedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-[10px] font-bold uppercase tracking-widest py-2 px-4 rounded-lg flex items-center gap-1.5 shrink-0 transition-all shadow-md shadow-emerald-950"
                  >
                    Visit Site <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Cloudflare pages deployment guide */}
          <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 space-y-5">
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-300 flex items-center gap-2 font-mono">
              <Globe className="w-4.5 h-4.5 text-cyan-400" />
              Manual Deployment Handout
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cloudflare Pages hosts fast Jamstack static sites globally. Follow this real guide to publish your club projects directly from Gombe Senior Secondary School.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950/60 border border-slate-900 rounded-xl p-4 space-y-3 hover:border-slate-800 transition-colors">
                <div className="flex items-center gap-2 font-bold text-xs text-white uppercase font-mono">
                  <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 flex items-center justify-center text-[10px]">
                    1
                  </span>
                  Git Push (Recommended)
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  Connect your personal <strong>GitHub</strong> account directly on the Cloudflare dashboard. Every time you push changes to your main branch, Cloudflare automatically builds and deploys your site at zero-latency.
                </p>
              </div>

              <div className="bg-slate-950/60 border border-slate-900 rounded-xl p-4 space-y-3 hover:border-slate-800 transition-colors">
                <div className="flex items-center gap-2 font-bold text-xs text-white uppercase font-mono">
                  <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 flex items-center justify-center text-[10px]">
                    2
                  </span>
                  Wrangler CLI Method
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  Deploy projects in 3 seconds flat directly from your local system terminal. Install wrangler with npm, log in to your account, and push build directories immediately.
                </p>
              </div>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-xl space-y-2 border border-slate-900">
              <span className="text-[9px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">Terminal Command Sequence (CLI):</span>
              <div className="font-mono text-xs text-slate-300 space-y-1.5 select-all">
                <div><span className="text-slate-600"># Install wrangler tools globally</span></div>
                <div><span className="text-cyan-500">$</span> npm install -g wrangler</div>
                <div className="pt-2"><span className="text-slate-600"># Authenticate your account</span></div>
                <div><span className="text-cyan-500">$</span> wrangler login</div>
                <div className="pt-2"><span className="text-slate-600"># Deploy pre-built files (e.g., dist)</span></div>
                <div><span className="text-cyan-500">$</span> wrangler pages deploy dist</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Developer Contacts & History (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Developer Contacts Widget */}
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-950 border border-cyan-900/30 rounded-2xl p-6 space-y-5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-2xl rounded-full"></div>
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">Developer Support</h3>
            </div>
            
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Encountering errors with custom deployment, authentication integrations, or site setups? Contact the official Gombe ICT Club Lead Developer:
            </p>

            <div className="space-y-3 font-mono text-xs pt-1">
              {/* Email */}
              <div className="bg-slate-950 border border-slate-900 p-3 rounded-xl flex items-center gap-3 hover:border-cyan-850/40 transition-colors">
                <div className="p-2 bg-cyan-950/50 border border-cyan-800/20 text-cyan-400 rounded-lg shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[9px] text-slate-500 uppercase block">Developer E-mail</span>
                  <a href="mailto:hpro453176@gmail.com" className="text-cyan-400 hover:underline block truncate text-[11px] font-bold">
                    hpro453176@gmail.com
                  </a>
                </div>
              </div>

              {/* Telephone */}
              <div className="bg-slate-950 border border-slate-900 p-3 rounded-xl flex items-center gap-3 hover:border-cyan-850/40 transition-colors">
                <div className="p-2 bg-emerald-950/50 border border-emerald-800/20 text-emerald-400 rounded-lg shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[9px] text-slate-500 uppercase block">Telephone Line</span>
                  <a href="tel:+256752453176" className="text-emerald-400 hover:underline block text-[11px] font-bold">
                    +256 752 453176
                  </a>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="bg-slate-950 border border-slate-900 p-3 rounded-xl flex items-center gap-3 hover:border-cyan-850/40 transition-colors">
                <div className="p-2 bg-green-950/50 border border-green-800/20 text-green-400 rounded-lg shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[9px] text-slate-500 uppercase block">WhatsApp Chat</span>
                  <a href="https://wa.me/256752453176" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline block text-[11px] font-bold">
                    +256 752 453176
                  </a>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 text-center leading-normal pt-2 italic font-mono">
              ⚡ Response target timeframe: Within 2 hours of Kampala active office hours.
            </div>
          </div>

          {/* Past deployments logs */}
          <div className="bg-slate-900/60 border border-slate-900 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">Deployment Log</h3>
            </div>

            <div className="space-y-3.5">
              {history.map((dep) => (
                <div key={dep.id} className="bg-slate-950 border border-slate-900 p-3 rounded-xl space-y-1.5 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold tracking-wide truncate pr-2" title={dep.projectName}>
                      {dep.projectName}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-900 font-bold uppercase">
                      {dep.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-500">
                    <span>{dep.framework}</span>
                    <span>{dep.timestamp}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal italic line-clamp-2 pt-1 border-t border-slate-900">
                    {dep.commitMessage}
                  </p>
                  <a 
                    href={dep.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[10px] text-cyan-400 hover:underline inline-flex items-center gap-1 pt-1 font-bold"
                  >
                    View build <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
