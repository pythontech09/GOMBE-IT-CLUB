import React, { useState, useRef } from "react";
import JSZip from "jszip";
import {
  Github,
  Lock,
  UploadCloud,
  FileCode,
  CheckCircle,
  AlertTriangle,
  Play,
  Key,
  FolderOpen,
  Eye,
  EyeOff,
  CornerDownRight,
  RefreshCw,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Sparkles,
  HelpCircle,
  Check,
  X
} from "lucide-react";

interface ZipFileItem {
  name: string;
  size: number;
  isFolder: boolean;
  contentPromise: () => Promise<string | ArrayBuffer>;
}

export default function GitPush() {
  // Credentials & Config State
  const [token, setToken] = useState(() => localStorage.getItem("gombe_ss_github_token") || "");
  const [showToken, setShowToken] = useState(false);
  const [repoOwner, setRepoOwner] = useState(() => localStorage.getItem("gombe_ss_github_owner") || "");
  const [repoName, setRepoName] = useState(() => localStorage.getItem("gombe_ss_github_repo") || "");
  const [branch, setBranch] = useState("main");
  const [commitMessage, setCommitMessage] = useState("feat: deploy project files via Gombe SS ICT portal");

  // Local storage toggle
  const [rememberToken, setRememberToken] = useState(true);

  // File Upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [unzippedFiles, setUnzippedFiles] = useState<ZipFileItem[]>([]);
  const [zipLoading, setZipLoading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  // Pusher Engine state
  const [pushLoading, setPushLoading] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [pushLogs, setPushLogs] = useState<string[]>([]);
  const [deployedCommitUrl, setDeployedCommitUrl] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Guide Helper Accordion
  const [showTokenGuide, setShowTokenGuide] = useState(false);

  // Read ZIP file contents using JSZip
  const handleZipSelection = async (file: File) => {
    if (!file.name.endsWith(".zip")) {
      setFileError("Please upload a valid .zip compressed project folder.");
      return;
    }
    setFileError(null);
    setSelectedFile(file);
    setZipLoading(true);
    setUnzippedFiles([]);

    try {
      const zip = new JSZip();
      const loadedZip = await zip.loadAsync(file);
      const parsedItems: ZipFileItem[] = [];

      loadedZip.forEach((relativePath, zipEntry) => {
        // Skip system directories like __MACOSX or .DS_Store
        if (relativePath.includes("__MACOSX") || relativePath.includes(".DS_Store") || relativePath.includes(".git/")) {
          return;
        }

        parsedItems.push({
          name: relativePath,
          size: zipEntry.dir ? 0 : (zipEntry as any)._data.uncompressedSize || 0,
          isFolder: zipEntry.dir,
          contentPromise: () => {
            if (zipEntry.dir) return Promise.resolve("");
            // Return base64 or string depending on file type (binary vs text)
            const isBinary = /\.(png|jpe?g|gif|webp|ico|pdf|zip|tar|gz|mp3|mp4|woff2?|ttf)$/i.test(relativePath);
            return isBinary ? zipEntry.async("arraybuffer") : zipEntry.async("string");
          }
        });
      });

      setUnzippedFiles(parsedItems);
    } catch (err: any) {
      setFileError(`Failed to extract ZIP metadata: ${err.message || err}`);
    } finally {
      setZipLoading(false);
    }
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleZipSelection(e.dataTransfer.files[0]);
    }
  };

  const handleSaveCredentials = (savedToken: string, owner: string, repo: string) => {
    if (rememberToken) {
      localStorage.setItem("gombe_ss_github_token", savedToken);
      localStorage.setItem("gombe_ss_github_owner", owner);
      localStorage.setItem("gombe_ss_github_repo", repo);
    } else {
      localStorage.removeItem("gombe_ss_github_token");
      localStorage.removeItem("gombe_ss_github_owner");
      localStorage.removeItem("gombe_ss_github_repo");
    }
  };

  // The 6-step professional multi-file GitHub push workflow
  const triggerGitHubPush = async () => {
    if (!token.trim()) {
      setErrorMessage("GitHub Personal Access Token (PAT) is required.");
      return;
    }
    if (!repoOwner.trim() || !repoName.trim()) {
      setErrorMessage("Repository Owner and Name are required.");
      return;
    }
    if (unzippedFiles.length === 0) {
      setErrorMessage("No files loaded from ZIP to commit.");
      return;
    }

    setPushLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setDeployedCommitUrl(null);
    setPushLogs([]);

    // Save tokens if checked
    handleSaveCredentials(token, repoOwner, repoName);

    const log = (msg: string) => {
      setPushLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    try {
      const headers: HeadersInit = {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json"
      };

      // Helper for clean API response handling
      const handleResponse = async (res: Response, stageName: string) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(`${stageName} failed (${res.status}): ${body.message || res.statusText}`);
        }
        return res.json();
      };

      // ==========================================
      // STEP 1: Verify Repo & Get Latest Branch Commit Reference
      // ==========================================
      setActiveStep(1);
      log(`Connecting to GitHub. Fetching branch reference for "refs/heads/${branch}"...`);
      
      const refUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/git/refs/heads/${branch}`;
      const refRes = await fetch(refUrl, { headers });
      
      if (refRes.status === 404) {
        log(`Branch "${branch}" not found. Attempting to target repository directly...`);
        throw new Error(`Repository or Branch "${branch}" not found. Verify your Owner/Repo names and ensure the token has proper "repo" permissions.`);
      }

      const refData = await handleResponse(refRes, "Fetch Branch Ref");
      const baseCommitSha = refData.object.sha;
      log(`Success! Latest branch commit SHA: ${baseCommitSha.substring(0, 8)}`);

      // ==========================================
      // STEP 2: Retrieve Base Commit Tree SHA
      // ==========================================
      setActiveStep(2);
      log(`Fetching commit detail for parent tree resolution...`);
      const commitUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/git/commits/${baseCommitSha}`;
      const commitRes = await fetch(commitUrl, { headers });
      const commitData = await handleResponse(commitRes, "Fetch Commit Details");
      const baseTreeSha = commitData.tree.sha;
      log(`Resolved base tree SHA: ${baseTreeSha.substring(0, 8)}`);

      // ==========================================
      // STEP 3: Create Blobs for each file
      // ==========================================
      setActiveStep(3);
      log(`Creating discrete GitHub blobs for ${unzippedFiles.filter(f => !f.isFolder).length} files. Please wait...`);
      
      const treeEntries: Array<{ path: string; mode: string; type: "blob" | "tree"; sha: string }> = [];

      for (const fileItem of unzippedFiles) {
        if (fileItem.isFolder) continue; // folders are structural in git, only track blobs

        log(`Creating blob for file: "${fileItem.name}"...`);
        const content = await fileItem.contentPromise();
        
        let reqBody: any = {};
        if (content instanceof ArrayBuffer) {
          // Binary content
          const base64Content = btoa(
            new Uint8Array(content).reduce((data, byte) => data + String.fromCharCode(byte), "")
          );
          reqBody = {
            content: base64Content,
            encoding: "base64"
          };
        } else {
          // Text content
          reqBody = {
            content: content,
            encoding: "utf-8"
          };
        }

        const blobUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/git/blobs`;
        const blobRes = await fetch(blobUrl, {
          method: "POST",
          headers,
          body: JSON.stringify(reqBody)
        });
        const blobData = await handleResponse(blobRes, `Create blob for ${fileItem.name}`);
        
        treeEntries.push({
          path: fileItem.name,
          mode: "100644", // standard file permission
          type: "blob",
          sha: blobData.sha
        });
      }
      log(`Created all ${treeEntries.length} file blobs on GitHub cloud servers.`);

      // ==========================================
      // STEP 4: Create a New File Tree Layer
      // ==========================================
      setActiveStep(4);
      log(`Creating intermediate folder structure tree linking blobs...`);
      const createTreeUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/git/trees`;
      const createTreeRes = await fetch(createTreeUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({
          base_tree: baseTreeSha,
          tree: treeEntries
        })
      });
      const newTreeData = await handleResponse(createTreeRes, "Create New Tree");
      const newTreeSha = newTreeData.sha;
      log(`New git file tree registered. Tree SHA: ${newTreeSha.substring(0, 8)}`);

      // ==========================================
      // STEP 5: Draft the Commit Metadata
      // ==========================================
      setActiveStep(5);
      log(`Drafting commit message metadata & signing authors...`);
      const createCommitUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/git/commits`;
      const createCommitRes = await fetch(createCommitUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({
          message: commitMessage,
          tree: newTreeSha,
          parents: [baseCommitSha]
        })
      });
      const newCommitData = await handleResponse(createCommitRes, "Create Commit");
      const newCommitSha = newCommitData.sha;
      log(`Commit successfully sealed on edge nodes. Commit SHA: ${newCommitSha.substring(0, 8)}`);

      // ==========================================
      // STEP 6: Push Reference to Branch Heads (Push Live)
      // ==========================================
      setActiveStep(6);
      log(`Pushing finalized head references to remote master repository...`);
      const updateRefUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/git/refs/heads/${branch}`;
      const updateRefRes = await fetch(updateRefUrl, {
        method: "PATCH",
        headers,
        body: JSON.stringify({
          sha: newCommitSha,
          force: false
        })
      });
      await handleResponse(updateRefRes, "Update Branch Reference");
      
      const commitHttpUrl = `https://github.com/${repoOwner}/${repoName}/commit/${newCommitSha}`;
      setDeployedCommitUrl(commitHttpUrl);
      setSuccessMessage(`Congratulations! Successfully pushed ${treeEntries.length} files to ${repoOwner}/${repoName} [${branch}].`);
      setActiveStep(7);
      log(`Deployment completed successfully! Live Commit Link: ${commitHttpUrl}`);

    } catch (err: any) {
      log(`[ERROR] Deployment failed during process structure.`);
      setErrorMessage(err.message || "An unexpected network block occurred during pushing.");
    } finally {
      setPushLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-fade-in font-sans">
      
      {/* Top Banner */}
      <section className="bg-gradient-to-r from-slate-900/60 to-slate-950/80 border border-slate-900 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 justify-between items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-3xl rounded-full"></div>
        <div className="space-y-2 max-w-xl text-center md:text-left z-10">
          <div className="inline-flex items-center gap-1.5 bg-slate-900 border border-slate-800 text-cyan-400 text-[10px] font-mono px-2.5 py-0.5 rounded uppercase font-bold">
            <Github className="w-3.5 h-3.5" />
            GitHub Automation Pipeline
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white uppercase">Automated Git Push</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            Upload your compiled web applications or custom lessons as a simple `.zip` bundle, insert your personal GitHub secret key, and our automated serverless Git system will push the entire project directly onto your specified GitHub repository repository in real-time.
          </p>
        </div>
      </section>

      {/* Main Form Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Parameters & Uploader (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* GitHub Credentials Card */}
          <div className="bg-slate-900/60 border border-slate-900 rounded-2xl p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">Authentication Secrets</h3>
              </div>
              <button 
                type="button"
                onClick={() => setShowTokenGuide(!showTokenGuide)}
                className="text-[10px] font-mono text-cyan-400 hover:underline flex items-center gap-1"
              >
                <HelpCircle className="w-3 h-3" />
                How to get a Token?
              </button>
            </div>

            {showTokenGuide && (
              <div className="bg-slate-950/80 border border-cyan-950/60 p-4 rounded-xl text-xs space-y-2 text-slate-400 leading-normal animate-slide-up">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block font-mono">Steps to generate GitHub Token:</span>
                <ol className="list-decimal pl-4 space-y-1 text-[11px]">
                  <li>Log in to your account at <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline inline-flex items-center gap-0.5">GitHub <ExternalLink className="w-2.5 h-2.5" /></a></li>
                  <li>Navigate to <strong>Settings</strong> &gt; <strong>Developer Settings</strong> &gt; <strong>Personal Access Tokens</strong> &gt; <strong>Tokens (classic)</strong>.</li>
                  <li>Click <strong>Generate new token (classic)</strong>.</li>
                  <li>Set the scope checkboxes to allow <strong>"repo"</strong> (grants full push/pull file access).</li>
                  <li>Copy the secure code (starts with <code className="text-slate-200">ghp_</code>) and paste it below. Keep this secret safe!</li>
                </ol>
              </div>
            )}

            {/* Token inputs */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase text-slate-400 block font-bold">GitHub Personal Access Token (PAT):</label>
                <div className="relative">
                  <input
                    type={showToken ? "text" : "password"}
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    className="w-full bg-slate-950 text-xs text-white pl-3 pr-10 py-2.5 rounded-lg border border-slate-850 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowToken(!showToken)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                  >
                    {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Repository Owner:</label>
                  <input
                    type="text"
                    value={repoOwner}
                    onChange={(e) => setRepoOwner(e.target.value)}
                    placeholder="e.g. Gombe-SS-ICT"
                    className="w-full bg-slate-950 text-xs text-white px-3 py-2.5 rounded-lg border border-slate-850 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Repository Name:</label>
                  <input
                    type="text"
                    value={repoName}
                    onChange={(e) => setRepoName(e.target.value)}
                    placeholder="e.g. smart-portal"
                    className="w-full bg-slate-950 text-xs text-white px-3 py-2.5 rounded-lg border border-slate-850 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5 md:col-span-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Target Branch:</label>
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    placeholder="main"
                    className="w-full bg-slate-950 text-xs text-white px-3 py-2.5 rounded-lg border border-slate-850 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Commit Message:</label>
                  <input
                    type="text"
                    value={commitMessage}
                    onChange={(e) => setCommitMessage(e.target.value)}
                    className="w-full bg-slate-950 text-xs text-white px-3 py-2.5 rounded-lg border border-slate-850 focus:outline-none focus:border-cyan-500 font-sans"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="rememberCreds"
                  checked={rememberToken}
                  onChange={(e) => setRememberToken(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-950 text-cyan-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <label htmlFor="rememberCreds" className="text-[10px] font-mono text-slate-450 uppercase tracking-wide cursor-pointer font-bold">
                  Remember GitHub credential parameters on this device
                </label>
              </div>
            </div>
          </div>

          {/* Interactive ZIP Drag & Drop uploader */}
          <div className="bg-slate-900/60 border border-slate-900 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">ZIP Source Archive</h3>
              </div>
              {selectedFile && (
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 border border-emerald-900 px-2 py-0.5 rounded font-bold">
                  ZIP Ready
                </span>
              )}
            </div>

            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                selectedFile 
                  ? "border-cyan-500/40 bg-cyan-950/5 hover:bg-cyan-950/10" 
                  : "border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-950/80"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".zip"
                onChange={(e) => e.target.files && handleZipSelection(e.target.files[0])}
                className="hidden"
              />

              <div className="space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-400 group-hover:text-cyan-400 transition-colors">
                  {zipLoading ? (
                    <RefreshCw className="w-5 h-5 animate-spin text-cyan-400" />
                  ) : (
                    <UploadCloud className="w-5 h-5" />
                  )}
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-200">
                    {selectedFile ? selectedFile.name : "Drag & Drop project ZIP file here"}
                  </h4>
                  <p className="text-[10px] text-slate-500 max-w-xs mx-auto leading-relaxed">
                    {selectedFile 
                      ? `Size: ${(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Click to select a different bundle`
                      : "Supports compressed web structures, static blogs, React builds, or raw node scripts."}
                  </p>
                </div>
              </div>
            </div>

            {fileError && (
              <div className="bg-red-950/15 border border-red-900/40 p-3 rounded-lg text-[11px] text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{fileError}</span>
              </div>
            )}

            {/* List of files parsed from JSZIP */}
            {unzippedFiles.length > 0 && (
              <div className="bg-slate-950/80 rounded-xl border border-slate-900 p-4 space-y-3">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">
                  <div className="flex items-center gap-1.5">
                    <FolderOpen className="w-3.5 h-3.5 text-cyan-500" />
                    <span>Contents Identified inside ZIP:</span>
                  </div>
                  <span>{unzippedFiles.filter(f => !f.isFolder).length} files</span>
                </div>
                <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1 text-[11px] font-mono text-slate-350 bg-[#05080f] p-3 rounded-lg border border-slate-900 custom-scrollbar">
                  {unzippedFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between py-0.5 border-b border-slate-950">
                      <span className="flex items-center gap-1.5 truncate">
                        <CornerDownRight className="w-3 h-3 text-slate-600 shrink-0" />
                        <FileCode className={`w-3.5 h-3.5 shrink-0 ${file.isFolder ? "text-slate-500" : "text-cyan-400"}`} />
                        <span className="truncate">{file.name}</span>
                      </span>
                      {!file.isFolder && (
                        <span className="text-[9px] text-slate-500 shrink-0 select-none">
                          {(file.size / 1024).toFixed(1)} KB
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              disabled={pushLoading || zipLoading || !selectedFile}
              onClick={triggerGitHubPush}
              className="w-full bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 disabled:from-slate-800 disabled:to-slate-800 disabled:opacity-50 text-white text-xs font-mono font-bold uppercase py-3 rounded-xl tracking-wider shadow-lg shadow-cyan-950 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {pushLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Pushing to GitHub repo...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  Commit & Push Files
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right column: Progress Engine Logger (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Real-time GitHub Handshake Pipeline */}
          <div className="bg-slate-900/60 border border-slate-900 rounded-2xl p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">Push Pipeline Monitor</h3>
              </div>
              <span className={`w-2.5 h-2.5 rounded-full ${pushLoading ? "bg-cyan-500 animate-pulse" : "bg-slate-700"}`}></span>
            </div>

            {/* Pipeline progress points */}
            <div className="space-y-4 pt-1 text-xs font-mono">
              {[
                { step: 1, label: "Fetch head commit pointer", desc: "Resolved latest parent commit reference." },
                { step: 2, label: "Resolve commit tree nodes", desc: "Base SHA references synchronized." },
                { step: 3, label: "Seal secure asset blobs", desc: "Individual files packaged & uploaded." },
                { step: 4, label: "Construct new Git tree", desc: "File path node structure formed." },
                { step: 5, label: "Draft signed metadata commit", desc: "Authenticated author hash generated." },
                { step: 6, label: "Fast-forward remote head", desc: "Remote repositories reference pointer swapped." }
              ].map((item) => {
                const isCompleted = activeStep > item.step;
                const isActive = activeStep === item.step;
                return (
                  <div key={item.step} className="flex gap-3 relative">
                    {item.step < 6 && (
                      <div className={`absolute left-3.5 top-6 bottom-[-16px] w-0.5 ${isCompleted ? "bg-cyan-500" : "bg-slate-800"}`} />
                    )}
                    <div className={`w-7.5 h-7.5 rounded-full border flex items-center justify-center shrink-0 z-10 transition-all font-bold ${
                      isCompleted ? "bg-cyan-950/80 border-cyan-500 text-cyan-400" :
                      isActive ? "bg-slate-900 border-yellow-500 text-yellow-400 animate-pulse" :
                      "bg-slate-950 border-slate-850 text-slate-500"
                    }`}>
                      {isCompleted ? <Check className="w-3.5 h-3.5" /> : item.step}
                    </div>
                    <div className="space-y-0.5">
                      <span className={`font-bold uppercase tracking-wide block text-[10px] ${
                        isCompleted ? "text-cyan-400" :
                        isActive ? "text-yellow-400" : "text-slate-450"
                      }`}>
                        {item.label}
                      </span>
                      <p className="text-[10px] text-slate-500 leading-normal">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Terminal logger */}
          {(pushLogs.length > 0 || errorMessage || successMessage) && (
            <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 space-y-4 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-indigo-500"></div>
              
              <div className="flex items-center justify-between font-mono text-[10px] text-slate-500 border-b border-slate-900 pb-2.5">
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Secure Git Shell Console</span>
                </div>
                {pushLoading && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>}
              </div>

              {pushLogs.length > 0 && (
                <div className="font-mono text-[11px] leading-relaxed space-y-1.5 h-40 overflow-y-auto bg-[#04070e] p-3 rounded-lg border border-slate-900 custom-scrollbar select-all">
                  {pushLogs.map((log, index) => (
                    <div key={index} className={log.includes("[ERROR]") ? "text-red-400 font-bold" : log.includes("Success") || log.includes("completed") ? "text-emerald-400 font-bold" : "text-slate-350"}>
                      {log}
                    </div>
                  ))}
                </div>
              )}

              {/* Status Callouts */}
              {errorMessage && (
                <div className="bg-red-950/20 border border-red-900/40 p-4 rounded-xl space-y-2 animate-slide-up">
                  <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-wider font-mono">
                    <AlertTriangle className="w-4 h-4" />
                    PUSH FAILED
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-sans">{errorMessage}</p>
                </div>
              )}

              {successMessage && (
                <div className="bg-emerald-950/20 border border-emerald-900/40 p-4 rounded-xl space-y-3 animate-slide-up">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider font-mono">
                    <CheckCircle className="w-4 h-4" />
                    PUSH COMPLETED
                  </div>
                  <p className="text-[11px] text-slate-300 leading-normal font-sans">{successMessage}</p>
                  
                  {deployedCommitUrl && (
                    <a
                      href={deployedCommitUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-[9px] font-bold uppercase tracking-widest py-1.5 px-3 rounded-md flex items-center justify-center gap-1 shrink-0 transition-all shadow-md shadow-emerald-950 w-full"
                    >
                      Inspect Sealed Commit <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
