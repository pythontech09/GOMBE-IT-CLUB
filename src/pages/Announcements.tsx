import React, { useState, useEffect } from "react";
import { Megaphone, Calendar, Trash2 } from "lucide-react";
import { getAnnouncements, saveAnnouncements, getCurrentUser, ClubAnnouncement, PortalUser } from "../lib/user-store";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<ClubAnnouncement[]>([]);
  const [currentUser, setCurrentUser] = useState<PortalUser | null>(null);

  useEffect(() => {
    // Load announcements from dynamic centralized module
    setAnnouncements(getAnnouncements());
    setCurrentUser(getCurrentUser());

    // Sync state dynamically if something is posted
    const handleStorageChange = () => {
      setAnnouncements(getAnnouncements());
      setCurrentUser(getCurrentUser());
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleDelete = (id: number) => {
    const list = getAnnouncements();
    const updated = list.filter(ann => ann.id !== id);
    saveAnnouncements(updated);
    setAnnouncements(updated);
  };

  const isAdmin = currentUser && (currentUser.role === "Admin" || currentUser.role === "Super Admin");

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Banner */}
      <section className="bg-gradient-to-r from-cyan-950/20 to-slate-900/40 border border-slate-900 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 justify-between items-center">
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 bg-cyan-950/80 border border-cyan-800/40 text-cyan-400 text-[10px] font-mono px-2.5 py-0.5 rounded uppercase">
            <Megaphone className="w-3.5 h-3.5" />
            Club Announcements
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">BULLETINS & GENERAL UPDATES</h1>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            Read critical track releases, examination schedules, and multiplayer gaming announcements posted directly by the Gombe ICT Club administrators and mentors.
          </p>
        </div>
      </section>

      {/* Announcements Listings */}
      <div className="space-y-5">
        {announcements.length === 0 ? (
          <div className="bg-slate-900/30 border border-slate-900 p-8 rounded-2xl text-center text-slate-500 italic text-xs">
            No active announcements have been registered inside the school board directory.
          </div>
        ) : (
          announcements.map((ann) => {
            const catCol = 
              ann.category === "Coding" ? "bg-cyan-950/40 border-cyan-800/20 text-cyan-400" :
              ann.category === "Cyber" ? "bg-emerald-950/40 border-emerald-800/20 text-emerald-400" :
              ann.category === "Gaming" ? "bg-rose-950/40 border-rose-800/20 text-rose-400" :
              "bg-slate-950 border-slate-800 text-slate-400";

            return (
              <div key={ann.id} className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 hover:border-slate-800/80 hover:bg-slate-900/50 transition-all duration-300">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] text-slate-500 pb-2.5 border-b border-slate-950">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-bold uppercase border py-0.5 px-2.5 rounded-full ${catCol}`}>
                        {ann.category}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {ann.date}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 italic">Posted by: {ann.author}</span>
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(ann.id)}
                          className="flex items-center gap-1 bg-rose-950/10 text-rose-400 hover:text-white hover:bg-rose-600 px-2.5 py-1 rounded font-mono border border-rose-900/20 text-[9px] uppercase transition-colors duration-150 cursor-pointer"
                          title="Delete Bulletin"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-sm font-bold text-white leading-snug">{ann.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-wrap pt-1">{ann.body}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
