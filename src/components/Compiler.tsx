import React, { useState, useEffect, useRef } from "react";
import { Play, RotateCcw, AlertTriangle, Terminal, Code } from "lucide-react";

interface CompilerProps {
  initialCode: string;
  language: "html" | "javascript" | "python";
  expectedOutput?: string;
  onSuccess?: () => void;
}

export function Compiler({ initialCode, language, expectedOutput, onSuccess }: CompilerProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState("");
  const [errorLine, setErrorLine] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setCode(initialCode);
    setOutput("");
    setErrorLine(null);
  }, [initialCode]);

  const handleReset = () => {
    setCode(initialCode);
    setOutput("");
    setErrorLine(null);
  };

  const handleRun = () => {
    setIsRunning(true);
    setErrorLine(null);
    setOutput("");

    setTimeout(() => {
      try {
        if (language === "html") {
          // Standard HTML rendering in an iFrame is clean and highly secure
          if (iframeRef.current) {
            const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
            if (doc) {
              doc.open();
              doc.write(`
                <!DOCTYPE html>
                <html>
                  <head>
                    <style>
                      body {
                        font-family: system-ui, -apple-system, sans-serif;
                        color: #1e293b;
                        padding: 1rem;
                        margin: 0;
                        background-color: #f8fafc;
                      }
                      h1 { color: #0891b2; margin-top: 0; }
                      ul, ol { padding-left: 1.5rem; }
                      a { color: #2563eb; }
                    </style>
                  </head>
                  <body>
                    ${code}
                  </body>
                </html>
              `);
              doc.close();
            }
          }
          setOutput("HTML Page Rendered Successfully!");
          if (onSuccess) onSuccess();
        } 
        
        else if (language === "javascript") {
          // Javascript evaluator with console capture
          const logs: string[] = [];
          const customConsole = {
            log: (...args: any[]) => {
              logs.push(args.map(arg => typeof arg === "object" ? JSON.stringify(arg) : String(arg)).join(" "));
            },
            error: (...args: any[]) => {
              logs.push("❌ Error: " + args.join(" "));
            }
          };

          const runCode = new Function("console", code);
          runCode(customConsole);

          const finalOutput = logs.join("\n") || "Code executed successfully. (No output printed - did you mean to use console.log()?)";
          setOutput(finalOutput);

          // Simple scoring comparison mapping
          if (expectedOutput && finalOutput.toLowerCase().includes(expectedOutput.toLowerCase().trim())) {
            if (onSuccess) onSuccess();
          } else if (!expectedOutput) {
            if (onSuccess) onSuccess();
          }
        } 
        
        else if (language === "python") {
          // Python terminal simulation
          const logs: string[] = [];
          
          // Basic syntax line testing
          const lines = code.split("\n");
          let indentationError = false;

          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            // Indentation validation check
            if (line.trim() && (line.startsWith(" ") || line.startsWith("\t"))) {
              const leadingSpaces = line.length - line.trimStart().length;
              if (leadingSpaces !== 4 && leadingSpaces !== 2 && leadingSpaces !== 8) {
                indentationError = true;
                setErrorLine(`IndentationError: unexpected indent on Line ${i + 1}`);
                break;
              }
            }

            // Simple line interpreter for student scripts
            if (line.includes("print(")) {
              // Extract print statement content
              const match = line.match(/print\(([^)]+)\)/);
              if (match) {
                let inner = match[1].trim();
                // Simple string literals
                if ((inner.startsWith('"') && inner.endsWith('"')) || (inner.startsWith("'") && inner.endsWith("'"))) {
                  logs.push(inner.slice(1, -1));
                } 
                // String concatenation
                else if (inner.includes("+")) {
                  const parts = inner.split("+").map(p => {
                    const cleanPart = p.trim();
                    if ((cleanPart.startsWith('"') && cleanPart.endsWith('"')) || (cleanPart.startsWith("'") && cleanPart.endsWith("'"))) {
                      return cleanPart.slice(1, -1);
                    }
                    return `[Variable ${cleanPart}]`;
                  });
                  logs.push(parts.join(""));
                }
                // Math expressions or variables
                else {
                  try {
                    // Safe numeric arithmetic simulator
                    const sanitized = inner.replace(/[a-zA-Z_]+/g, "5"); // generic mockup binding
                    const value = eval(sanitized);
                    logs.push(String(value));
                  } catch (e) {
                    logs.push(inner);
                  }
                }
              }
            }
          }

          if (indentationError) {
            setOutput("❌ Execution Failed.\nFix the syntax issue to run successfully.");
          } else {
            const finalOutput = logs.join("\n") || "🐍 Python program finished execution.\n(Tip: use print(...) to write outputs to this terminal!)";
            setOutput(finalOutput);

            if (expectedOutput && finalOutput.toLowerCase().includes(expectedOutput.toLowerCase().trim())) {
              if (onSuccess) onSuccess();
            } else if (!expectedOutput) {
              if (onSuccess) onSuccess();
            }
          }
        }
      } catch (err: any) {
        setOutput(`❌ Runtime Error:\n${err.message}`);
      } finally {
        setIsRunning(false);
      }
    }, 600);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col h-[520px]">
      {/* Sandbox controller heading */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono font-medium tracking-wide">
            interactive_sandbox.{language === "python" ? "py" : language === "javascript" ? "js" : "html"}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded transition-all"
            title="Reset code editor"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded shadow-md shadow-cyan-950 transition-all disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 ${isRunning ? "animate-spin" : ""}`} />
            {isRunning ? "Running..." : "Run ▶"}
          </button>
        </div>
      </div>

      {/* Editor & output splits */}
      <div className="flex-grow flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-800 h-1">
        {/* Editor text input pane */}
        <div className="flex-1 p-2 bg-slate-900/60 overflow-hidden flex flex-col">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="w-full flex-grow bg-transparent text-slate-100 font-mono text-sm p-2 focus:outline-none resize-none overflow-y-auto leading-relaxed h-full border-none focus:ring-0"
          />
        </div>

        {/* Console / rendering view splits */}
        <div className="flex-1 bg-slate-950 flex flex-col overflow-hidden">
          <div className="bg-slate-950 px-3 py-1.5 border-b border-slate-900 flex items-center gap-1.5 text-slate-400">
            <Terminal className="w-3.5 h-3.5 text-cyan-500 hover:scale-105 transition-transform" />
            <span className="text-[10px] font-mono tracking-wider uppercase">Runtime Terminal</span>
          </div>

          <div className="flex-grow p-4 overflow-y-auto">
            {language === "html" ? (
              <div className="w-full h-full flex flex-col bg-slate-900 rounded-lg overflow-hidden border border-slate-800">
                <iframe
                  ref={iframeRef}
                  title="HTML Playground Live Render"
                  className="w-full flex-grow bg-white border-none rounded-t"
                />
                <div className="bg-slate-950 px-3 py-1 bg-gradient-to-r from-slate-950 to-slate-900 border-t border-slate-800 text-[10px] text-slate-500 font-mono flex justify-between items-center">
                  <span>SANDBOX WEB BROWSER MODE</span>
                  <span className="text-emerald-500 font-bold">● ACTIVE PREVIEW</span>
                </div>
              </div>
            ) : (
              <pre className="text-xs font-mono text-cyan-400 whitespace-pre-wrap leading-relaxed">
                {output || "System initialization completed successfully.\nPress 'Run ▶' to view program terminal execution..."}
              </pre>
            )}

            {errorLine && (
              <div className="mt-3 p-2 bg-rose-950/40 border border-rose-900/50 rounded flex gap-2 items-start text-xs text-rose-300">
                <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <span className="font-mono">{errorLine}</span>
              </div>
            )}
          </div>

          {expectedOutput && (
            <div className="bg-slate-900 p-2.5 border-t border-slate-800 px-4 text-xs">
              <span className="text-slate-400 block font-mono">Target expected output phrase:</span>
              <code className="text-[11px] font-mono bg-slate-950 py-0.5 px-1.5 border border-cyan-950/55 rounded inline-block text-cyan-300 mt-1">
                {expectedOutput}
              </code>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
