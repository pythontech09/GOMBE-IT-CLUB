import React from "react";
import { Link } from "wouter";
import { HelpCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="text-center py-20 space-y-4 max-w-sm mx-auto">
      <HelpCircle className="w-10 h-10 text-cyan-400 mx-auto animate-pulse" />
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-white uppercase font-mono">Route Not Standard</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          The requested system pathway does not exist inside our school database index. Re-route to the portal lobby.
        </p>
      </div>
      <Link href="/" className="inline-block bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold py-2 px-4 rounded-lg transition-all">
        Return to Hub Lobby
      </Link>
    </div>
  );
}
