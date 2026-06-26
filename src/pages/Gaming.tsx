import React, { useState, useEffect } from "react";
import { Gamepad2, Award, Users, Trophy, ChevronRight, Activity, Calendar, Play, Tag, PlusCircle, CheckCircle } from "lucide-react";
import { UserStats } from "@/src/types";
import { getCurrentUser, getTournaments, saveTournaments, GamingTournament, PortalUser, getUsers, saveUsers } from "../lib/user-store";

export default function Gaming() {
  const [currentUser, setCurrentUser] = useState<PortalUser | null>(null);
  const [tournaments, setTournaments] = useState<GamingTournament[]>([]);
  const [registrations, setRegistrations] = useState<{ id: number; game: string; teamName: string; size: number }[]>([]);
  
  // Dynamic leaderboard state variables
  const [leaderboardList, setLeaderboardList] = useState<{ id: number; name: string; points: number; game: string; wins: number }[]>([]);
  const [editingLeadId, setEditingLeadId] = useState<number | null>(null);
  const [leadName, setLeadName] = useState("");
  const [leadPoints, setLeadPoints] = useState(100);
  const [leadGame, setLeadGame] = useState("");
  const [leadWins, setLeadWins] = useState(5);
  const [showAdminLeadForm, setShowAdminLeadForm] = useState(false);

  // Registration form inputs
  const [gameSelection, setGameSelection] = useState("");
  const [teamInput, setTeamInput] = useState("");
  const [teamSize, setTeamSize] = useState(1);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Admin section: Add game session inputs
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newBracket, setNewBracket] = useState("Single Elimination");
  const [newStatus, setNewStatus] = useState("Open for Registrations");
  const [adminSuccessMsg, setAdminSuccessMsg] = useState<string | null>(null);

  const [userStats, setUserStats] = useState<UserStats>({
    points: 120,
    streak: 3,
    unlockedLevel: "beginner",
    completedTopics: []
  });

  useEffect(() => {
    // Load local auth user stats
    const saved = localStorage.getItem("gombe_ss_stats");
    if (saved) {
      try {
        setUserStats(JSON.parse(saved));
      } catch (e) {}
    }

    // Load static or local store values
    const activeUser = getCurrentUser();
    setCurrentUser(activeUser);

    const activeTourneys = getTournaments();
    setTournaments(activeTourneys);
    if (activeTourneys.length > 0) {
      setGameSelection(activeTourneys[0].title);
    }

    // Load squad registrations from local persistence
    const savedRegs = localStorage.getItem("gombe_gaming_registrations");
    if (savedRegs) {
      try {
        setRegistrations(JSON.parse(savedRegs));
      } catch (e) {}
    } else {
      // Create initial seed registrations for visual realism
      const seedRegs = [
        { id: 101, game: "FIFA 26 School Clubs", teamName: "Kigwa_Strikers", size: 2 },
        { id: 102, game: "Call Of Duty Mobile Sprint", teamName: "Gombe_Snipers", size: 4 }
      ];
      setRegistrations(seedRegs);
      localStorage.setItem("gombe_gaming_registrations", JSON.stringify(seedRegs));
    }

    // Load dynamic gaming leaderboard
    const savedLeads = localStorage.getItem("gombe_gaming_leaderboard_custom_v1");
    if (savedLeads) {
      try {
        setLeaderboardList(JSON.parse(savedLeads));
      } catch (e) {}
    } else {
      const defaultLeads = [
        { id: 1, name: "Derrick Nsubuga", points: 450, game: "FIFA 26", wins: 15 },
        { id: 2, name: "Faulat Ssentuuwa", points: 380, game: "COD Mobile", wins: 12 },
        { id: 3, name: "Alon Kayiira", points: 310, game: "Mortal Kombat XL", wins: 9 },
        { id: 4, name: "Kassim Musooko", points: 260, game: "FIFA 26", wins: 7 }
      ];
      setLeaderboardList(defaultLeads);
      localStorage.setItem("gombe_gaming_leaderboard_custom_v1", JSON.stringify(defaultLeads));
    }
  }, []);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamInput.trim()) return;

    const newReg = {
      id: Date.now(),
      game: gameSelection || (tournaments[0] ? tournaments[0].title : "General Match"),
      teamName: teamInput.trim(),
      size: teamSize
    };

    const updatedRegs = [...registrations, newReg];
    setRegistrations(updatedRegs);
    localStorage.setItem("gombe_gaming_registrations", JSON.stringify(updatedRegs));
    setTeamInput("");
    setSuccessMsg(`Team "${newReg.teamName}" successfully registered for ${newReg.game}!`);

    // Reward active user
    const newStats = {
      ...userStats,
      points: userStats.points + 15
    };
    setUserStats(newStats);
    localStorage.setItem("gombe_ss_stats", JSON.stringify(newStats));

    // Update current user points inside master list
    if (currentUser) {
      const users = getUsers();
      const updatedUsers = users.map(u => {
        if (u.email.toLowerCase().trim() === currentUser.email.toLowerCase().trim()) {
          return { ...u, points: u.points + 15 };
        }
        return u;
      });
      saveUsers(updatedUsers);
    }

    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleAddGameSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDate.trim()) return;

    const newSession: GamingTournament = {
      id: Date.now(),
      title: newTitle.trim(),
      date: newDate.trim(),
      bracket: newBracket,
      status: newStatus
    };

    const updatedTourneys = [...tournaments, newSession];
    setTournaments(updatedTourneys);
    saveTournaments(updatedTourneys);

    setNewTitle("");
    setNewDate("");
    setAdminSuccessMsg("🎮 New Gombe gaming session successfully registered and published!");

    // Set first selection if it was blank
    if (!gameSelection && updatedTourneys.length > 0) {
      setGameSelection(updatedTourneys[0].title);
    }

    setTimeout(() => setAdminSuccessMsg(null), 4000);
  };

  const handleRemoveSession = (id: number) => {
    const updated = tournaments.filter(t => t.id !== id);
    setTournaments(updated);
    saveTournaments(updated);
  };

  const handleRemoveRegistration = (id: number) => {
    const updated = registrations.filter(r => r.id !== id);
    setRegistrations(updated);
    localStorage.setItem("gombe_gaming_registrations", JSON.stringify(updated));
  };

  const handleAddOrUpdateLeader = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim() || !leadGame.trim()) return;

    let updatedList;
    if (editingLeadId !== null) {
      updatedList = leaderboardList.map(item => {
        if (item.id === editingLeadId) {
          return {
            ...item,
            name: leadName.trim(),
            points: Number(leadPoints),
            game: leadGame.trim(),
            wins: Number(leadWins)
          };
        }
        return item;
      });
      setAdminSuccessMsg("🏆 Leaderboard contender updated successfully!");
    } else {
      const newItem = {
        id: Date.now(),
        name: leadName.trim(),
        points: Number(leadPoints),
        game: leadGame.trim(),
        wins: Number(leadWins)
      };
      updatedList = [...leaderboardList, newItem];
      setAdminSuccessMsg("🏆 New contender added to Gombe SS Leaderboard!");
    }

    setLeaderboardList(updatedList);
    localStorage.setItem("gombe_gaming_leaderboard_custom_v1", JSON.stringify(updatedList));

    // Reset Form
    setEditingLeadId(null);
    setLeadName("");
    setLeadPoints(100);
    setLeadGame("");
    setLeadWins(5);
    setShowAdminLeadForm(false);
    setTimeout(() => setAdminSuccessMsg(null), 4000);
  };

  const handleDeleteLeader = (id: number) => {
    if (!window.confirm("Are you sure you want to delete this contender from the leaderboard?")) return;
    const updated = leaderboardList.filter(item => item.id !== id);
    setLeaderboardList(updated);
    localStorage.setItem("gombe_gaming_leaderboard_custom_v1", JSON.stringify(updated));
    setAdminSuccessMsg("Contender removed from leaderboard rankings.");
    setTimeout(() => setAdminSuccessMsg(null), 4000);
  };

  const startEditLeader = (item: any) => {
    setEditingLeadId(item.id);
    setLeadName(item.name);
    setLeadPoints(item.points);
    setLeadGame(item.game);
    setLeadWins(item.wins);
    setShowAdminLeadForm(true);
  };

  // Check role authorization
  const canManageGames = currentUser && (currentUser.role === "Admin" || currentUser.role === "Super Admin");

  const sortedLeaders = [...leaderboardList].sort((a, b) => b.points - a.points);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Banner */}
      <section className="bg-gradient-to-r from-rose-950/40 to-slate-900/40 border border-slate-900 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 justify-between items-center">
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 bg-rose-950/80 border border-rose-800/40 text-rose-400 text-[10px] font-mono px-2.5 py-0.5 rounded uppercase font-bold">
            <Gamepad2 className="w-3.5 h-3.5" />
            Gaming Zone
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">TOURNAMENTS & RANKINGS</h1>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            FIFA, COD Mobile, Mortal Kombat and more. Play weekly lobbies, register squad tags, and view standings. Administrators hold permissions to spin up new physical gaming session brackets below.
          </p>
        </div>
        <div className="hidden lg:block bg-slate-950 border border-slate-800 p-4 rounded-xl text-center select-none">
          <Activity className="w-6 h-6 text-rose-400 mx-auto mb-1.5" />
          <div className="text-xs text-slate-400 font-bold font-mono">STANDINGS LIVE</div>
          <div className="text-[9px] text-slate-500 font-mono tracking-wider uppercase">Updated Today</div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Leaderboards and Active Tournies */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/60 border border-slate-900 rounded-2xl p-6 space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300 flex items-center gap-1.5 font-mono">
                <Trophy className="w-4 h-4 text-rose-400" />
                Gombe SS ICT Leaderboard
              </h3>
              
              {canManageGames && (
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminLeadForm(!showAdminLeadForm);
                    setEditingLeadId(null);
                    setLeadName("");
                    setLeadGame("");
                    setLeadPoints(100);
                    setLeadWins(5);
                  }}
                  className="bg-rose-950/40 hover:bg-rose-900/40 text-rose-400 text-[10px] font-mono border border-rose-800/30 px-3 py-1 rounded-lg font-bold uppercase transition-all flex items-center gap-1 cursor-pointer"
                >
                  {showAdminLeadForm ? "✕ Hide Admin Panel" : "⚙️ Manage Standings"}
                </button>
              )}
            </div>

            {/* Admin Add/Edit Panel */}
            {canManageGames && showAdminLeadForm && (
              <form onSubmit={handleAddOrUpdateLeader} className="bg-slate-950 border border-rose-950/40 p-4 rounded-xl space-y-3.5 animate-slide-up">
                <div className="flex items-center gap-1.5 border-b border-rose-955/30 pb-1.5">
                  <PlusCircle className="w-3.5 h-3.5 text-rose-400" />
                  <span className="text-[10px] text-slate-300 font-bold uppercase font-mono">
                    {editingLeadId !== null ? "Edit Contender Stats" : "Add New Contender"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-400 font-mono uppercase">Contender Name</label>
                    <input
                      required
                      type="text"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      placeholder="e.g. Faulat Ssentuuwa"
                      className="w-full bg-slate-900 border border-slate-800 text-xs text-white p-2 rounded focus:outline-none focus:border-rose-500 font-sans"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-400 font-mono uppercase">Primary Game</label>
                    <input
                      required
                      type="text"
                      value={leadGame}
                      onChange={(e) => setLeadGame(e.target.value)}
                      placeholder="e.g. FIFA 26"
                      className="w-full bg-slate-900 border border-slate-800 text-xs text-white p-2 rounded focus:outline-none focus:border-rose-500 font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-400 font-mono uppercase">Points Score (numeric)</label>
                    <input
                      required
                      type="number"
                      value={leadPoints}
                      onChange={(e) => setLeadPoints(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 text-xs text-white p-2 rounded focus:outline-none focus:border-rose-500 font-sans"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-400 font-mono uppercase">Wins Count (numeric)</label>
                    <input
                      required
                      type="number"
                      value={leadWins}
                      onChange={(e) => setLeadWins(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 text-xs text-white p-2 rounded focus:outline-none focus:border-rose-500 font-sans"
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-1">
                  {editingLeadId !== null && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingLeadId(null);
                        setLeadName("");
                        setLeadGame("");
                        setLeadPoints(100);
                        setLeadWins(5);
                      }}
                      className="bg-slate-900 hover:bg-slate-850 text-slate-400 text-[10px] font-mono px-3 py-1.5 rounded cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className="bg-rose-650 hover:bg-rose-550 text-white text-[10px] font-mono font-bold uppercase tracking-wider px-4 py-1.5 rounded bg-rose-600 transition-colors cursor-pointer"
                  >
                    {editingLeadId !== null ? "Save Revision" : "Promote Contender"}
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2.5">
              {sortedLeaders.map((lead, idx) => (
                <div key={lead.id || idx} className="bg-slate-950 p-4 border border-slate-900 rounded-xl flex items-center justify-between hover:border-slate-850 transition-colors group">
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-xs text-slate-500 font-bold font-mono">{idx + 1}#</span>
                    <div>
                      <h4 className="text-xs font-semibold text-white leading-normal flex items-center gap-2">
                        {lead.name}
                        {idx === 0 && <span className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[8px] px-1 rounded uppercase font-mono tracking-wide">Champion</span>}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-mono italic">Primary Game: {lead.game}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs font-bold text-rose-400 font-mono">{lead.points} PTS</div>
                      <div className="text-[10px] text-slate-500 font-mono">{lead.wins} Wins</div>
                    </div>

                    {canManageGames && (
                      <div className="hidden group-hover:flex items-center gap-1.5 border-l border-slate-850 pl-3">
                        <button
                          type="button"
                          onClick={() => startEditLeader(lead)}
                          className="text-[10px] text-blue-400 hover:text-blue-305 hover:underline font-mono cursor-pointer"
                          title="Edit stats"
                        >
                          Edit
                        </button>
                        <span className="text-slate-700 font-sans">•</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteLeader(lead.id)}
                          className="text-[10px] text-rose-455 hover:text-rose-400 hover:underline font-mono cursor-pointer"
                          title="Delete player"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-900 rounded-2xl p-6 space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300 flex items-center gap-1.5 font-mono">
              <Calendar className="w-4 h-4 text-rose-400" />
              Active Tournament Brackets
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tournaments.map((tour) => (
                <div key={tour.id} className="bg-slate-950 border border-slate-900/60 p-4 rounded-xl flex flex-col justify-between group hover:border-rose-950 transition-all">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-xs font-bold text-white leading-snug">{tour.title}</h4>
                      {canManageGames && (
                        <button
                          onClick={() => handleRemoveSession(tour.id)}
                          className="text-[9px] text-slate-600 hover:text-rose-450 uppercase font-mono cursor-pointer"
                          title="Remove Session"
                        >
                          ✕ Delete
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono">{tour.date}</p>
                    <p className="text-[10px] font-semibold text-slate-400 font-mono">{tour.bracket}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-900/60 flex justify-between items-center">
                    <span className="text-[9px] font-mono tracking-wider bg-rose-950/20 text-rose-400 py-0.5 px-2 rounded-full uppercase">
                      {tour.status}
                    </span>
                    <button className="text-[10px] text-slate-400 hover:text-white font-mono flex items-center gap-0.5">
                      Brackets
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Registrations or Admin Block */}
        <div className="lg:col-span-5 space-y-6">
          {/* Admin Block for Adding Gaming Sessions */}
          {canManageGames && (
            <form onSubmit={handleAddGameSession} className="bg-gradient-to-b from-slate-900 to-indigo-950/40 border border-rose-900/35 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="space-y-1 border-b border-indigo-950 pb-2">
                <span className="text-[9px] font-mono tracking-wider bg-rose-500/10 border border-rose-500/20 text-rose-400 py-0.5 px-2 rounded uppercase font-bold inline-block">
                  Admin Tool
                </span>
                <h3 className="text-xs font-bold uppercase tracking-widest text-white font-mono mt-1 flex items-center gap-1.5">
                  <PlusCircle className="w-4 h-4 text-rose-400" />
                  Spin Up Gaming Session
                </h3>
              </div>

              {adminSuccessMsg && (
                <div className="p-3 bg-emerald-950/30 border border-emerald-900/40 rounded-lg text-[11px] text-emerald-400 font-mono leading-relaxed">
                  {adminSuccessMsg}
                </div>
              )}

              <div className="space-y-3 font-sans">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase text-slate-400 block">Session / Tournament Name:</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., FIFA 26 Ultimate Derby"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-slate-950 text-xs text-white p-2 border border-slate-850 rounded focus:outline-none focus:border-rose-550"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase text-slate-400 block">Schedule Date or Frequency:</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., July 12, 4:00 PM"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-slate-950 text-xs text-white p-2 border border-slate-850 rounded focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono uppercase text-slate-400 block">Match Format:</label>
                    <select
                      value={newBracket}
                      onChange={(e) => setNewBracket(e.target.value)}
                      className="w-full bg-slate-950 text-xs text-slate-300 p-2 border border-slate-850 rounded focus:outline-none"
                    >
                      <option value="Single Elimination">Single Elim</option>
                      <option value="Double Elimination">Double Elim</option>
                      <option value="Round Robin Arena">Round Robin</option>
                      <option value="Squad Deathmatch">Deathmatch</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-mono uppercase text-slate-400 block">Status Level:</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full bg-slate-950 text-xs text-slate-300 p-2 border border-slate-850 rounded focus:outline-none"
                    >
                      <option value="Open for Registrations">Open Regs</option>
                      <option value="Active matches">Active Live</option>
                      <option value="Finished">Finished</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase py-2 rounded font-mono block tracking-wide select-none transition-all cursor-pointer"
                >
                  Publish Tournament Session
                </button>
              </div>
            </form>
          )}

          {/* Squad Registration Form */}
          <form onSubmit={handleRegister} className="bg-slate-900/60 border border-slate-900 rounded-2xl p-6 space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300 flex items-center gap-1.5 font-mono">
              <Users className="w-4 h-4 text-rose-400" />
              Register Tournament Squad
            </h3>

            {successMsg && (
              <div className="p-3 bg-emerald-950/50 border border-emerald-900 rounded-lg text-xs leading-relaxed text-emerald-300 font-mono">
                {successMsg}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase text-slate-500 block">Choose Tournament Event:</label>
                <select
                  value={gameSelection}
                  onChange={(e) => setGameSelection(e.target.value)}
                  className="w-full bg-slate-950 text-xs text-slate-300 p-2.5 rounded-lg border border-slate-850 focus:outline-none"
                >
                  {tournaments.map((t) => (
                    <option key={t.id} value={t.title}>
                      {t.title} ({t.bracket})
                    </option>
                  ))}
                  {tournaments.length === 0 && (
                    <option value="">No events available</option>
                  )}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase text-slate-500 block">Your Gamer Tag / Team Name:</label>
                <input
                  type="text"
                  placeholder="E.g., Gombe_Sniper_Squad"
                  value={teamInput}
                  required
                  onChange={(e) => setTeamInput(e.target.value)}
                  className="w-full bg-slate-950 text-xs text-white p-2.5 rounded-lg border border-slate-850 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase text-slate-500 block">Team Size (Members count):</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={teamSize}
                  onChange={(e) => setTeamSize(parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-950 text-xs text-white p-2.5 rounded-lg border border-slate-850 focus:outline-none focus:border-rose-500 font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={tournaments.length === 0}
                className="w-full bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:hover:bg-rose-600 text-white text-xs font-bold uppercase py-2.5 rounded-xl block tracking-wider shadow-md shadow-rose-950 transition-all font-mono select-none"
              >
                Submit Tournament Entry
              </button>
            </div>
          </form>

          {/* Registered teams lists visual logs */}
          {registrations.length > 0 && (
            <div className="bg-slate-900/60 border border-slate-900 rounded-2xl p-6 space-y-4 font-mono">
              <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider block">Registrations Feed:</span>
              <div className="space-y-2 text-xs">
                {registrations.map((reg) => (
                  <div key={reg.id} className="p-2.5 bg-slate-950 rounded-lg border border-slate-900 flex justify-between items-center text-slate-300">
                    <div>
                      <h5 className="font-bold text-[11px] text-white">[{reg.teamName}]</h5>
                      <span className="text-[10px] text-slate-500">{reg.game}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-[11px] text-rose-450 font-bold font-mono">size: {reg.size}</span>
                      {canManageGames && (
                        <button
                          onClick={() => handleRemoveRegistration(reg.id)}
                          className="bg-rose-950/20 text-rose-400 hover:text-white hover:bg-rose-600 px-1.5 py-0.5 rounded text-[9px] uppercase font-mono tracking-wide transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
