import React, { useState, useEffect } from "react";
import { UserStats } from "@/src/types";
import { 
  User, 
  Flame, 
  Trophy, 
  CheckCircle, 
  Trash2, 
  Lock, 
  Megaphone,
  Mail,
  Shield,
  Key,
  UserCheck,
  UserMinus,
  AlertCircle
} from "lucide-react";
import { 
  getUsers, 
  saveUsers, 
  getCurrentUser, 
  promoteUserToAdmin, 
  makeUserStudent, 
  getAnnouncements, 
  saveAnnouncements, 
  registerUser,
  loginUser,
  PortalUser 
} from "../lib/user-store";

export default function Account() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authTab, setAuthTab] = useState<"signin" | "register">("signin");
  const [regName, setRegName] = useState("");
  const [regTrack, setRegTrack] = useState("React & Python Core");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [currentUser, setCurrentUser] = useState<PortalUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [allUsers, setAllUsers] = useState<PortalUser[]>([]);

  // Announcement states
  const [bulletinTitle, setBulletinTitle] = useState("");
  const [bulletinCategory, setBulletinCategory] = useState<"General" | "Coding" | "Cyber" | "Gaming">("General");
  const [bulletinBody, setBulletinBody] = useState("");
  const [publishSuccess, setPublishSuccess] = useState(false);

  // User stats state
  const [userStats, setUserStats] = useState<UserStats>({
    points: 120,
    streak: 3,
    unlockedLevel: "beginner",
    completedTopics: []
  });

  // Daily attendance checks
  const [checkInMsg, setCheckInMsg] = useState<string | null>(null);
  const [checkInError, setCheckInError] = useState<string | null>(null);

  // Super Admin: Add Member form states
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [addName, setAddName] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addPassword, setAddPassword] = useState("");
  const [addRole, setAddRole] = useState<"Student" | "Admin" | "Super Admin">("Student");
  const [addTrack, setAddTrack] = useState("React & Python Core");
  const [addLevel, setAddLevel] = useState("Beginner");
  const [addPoints, setAddPoints] = useState(120);
  const [addStreak, setAddStreak] = useState(3);
  const [addDesc, setAddDesc] = useState("");

  // Super Admin: Edit Member form states
  const [isEditingMember, setIsEditingMember] = useState(false);
  const [editingEmail, setEditingEmail] = useState("");
  const [editName, setEditName] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editRole, setEditRole] = useState<"Student" | "Admin" | "Super Admin">("Student");
  const [editTrack, setEditTrack] = useState("React & Python Core");
  const [editLevel, setEditLevel] = useState("Beginner");
  const [editPoints, setEditPoints] = useState(120);
  const [editStreak, setEditStreak] = useState(3);
  const [editDesc, setEditDesc] = useState("");

  // Load everything on mount
  useEffect(() => {
    // 1. Sync User Stats
    const savedStats = localStorage.getItem("gombe_ss_stats");
    let localCompleted: string[] = [];
    if (savedStats) {
      try {
        const parsed = JSON.parse(savedStats);
        localCompleted = parsed.completedTopics || [];
        setUserStats(parsed);
      } catch (e) {}
    }

    // 2. Fetch Active Session
    const active = getCurrentUser();
    if (active) {
      setCurrentUser(active);
      setEmail(active.email);
      setIsLoggedIn(true);

      // Harmonize points/streaks
      setUserStats(prev => {
        const updated = {
          ...prev,
          points: active.points,
          streak: active.streak,
          unlockedLevel: active.level.toLowerCase() === "intermediate" ? "intermediate" : active.level.toLowerCase() === "pro" ? "pro" : "beginner",
          completedTopics: localCompleted
        };
        localStorage.setItem("gombe_ss_stats", JSON.stringify(updated));
        return updated;
      });
    }

    // 3. Load user list
    setAllUsers(getUsers());
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Please enter a valid school email address.");
      return;
    }

    if (!password.trim()) {
      setErrorMsg("Please enter your password key.");
      return;
    }

    const res = loginUser(email, password);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      setIsLoggedIn(true);
      setSuccessMsg("Logged in successfully!");

      const loadedStats = localStorage.getItem("gombe_ss_stats");
      let completedTopics: string[] = [];
      if (loadedStats) {
        try {
          completedTopics = JSON.parse(loadedStats).completedTopics || [];
        } catch {}
      }

      const updatedStats = {
        points: res.user.points,
        streak: res.user.streak,
        unlockedLevel: res.user.level.toLowerCase() === "intermediate" ? "intermediate" : res.user.level.toLowerCase() === "pro" ? "pro" : "beginner",
        completedTopics
      };
      setUserStats(updatedStats);
      localStorage.setItem("gombe_ss_stats", JSON.stringify(updatedStats));
    } else {
      setErrorMsg(res.message);
    }
    setAllUsers(getUsers());
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!regName.trim()) {
      setErrorMsg("Please provide your full scholar name.");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Please enter a valid school email address.");
      return;
    }

    if (!password.trim() || password.length < 4) {
      setErrorMsg("Password must be at least 4 characters long.");
      return;
    }

    const res = registerUser(regName, email, password, regTrack);
    if (res.success) {
      setSuccessMsg(res.message);
      setAuthTab("signin");
      setPassword("");
    } else {
      setErrorMsg(res.message);
    }
    setAllUsers(getUsers());
  };

  const handleLogout = () => {
    setEmail("");
    setPassword("");
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem("gombe_ss_current_user");
  };

  const handleResetProgress = () => {
    const cleared: UserStats = {
      points: 120,
      streak: 3,
      unlockedLevel: "beginner",
      completedTopics: []
    };
    setUserStats(cleared);
    localStorage.setItem("gombe_ss_stats", JSON.stringify(cleared));

    if (currentUser) {
      const usersList = getUsers();
      const updated = usersList.map(u => {
        if (u.email.toLowerCase().trim() === currentUser.email.toLowerCase().trim()) {
          return { ...u, points: 120, streak: 3, level: "Beginner" };
        }
        return u;
      });
      saveUsers(updated);
      setAllUsers(updated);
      const reloaded = updated.find(u => u.email.toLowerCase().trim() === currentUser.email.toLowerCase().trim());
      if (reloaded) setCurrentUser(reloaded);
    }
  };

  const handlePublishAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulletinTitle.trim() || !bulletinBody.trim()) return;

    const currentAnnouncements = getAnnouncements();
    const newBulletin = {
      id: Date.now(),
      title: bulletinTitle.trim(),
      category: bulletinCategory,
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      author: currentUser ? currentUser.name : "Gombe SS Instructor",
      body: bulletinBody.trim()
    };

    const updated = [newBulletin, ...currentAnnouncements];
    saveAnnouncements(updated);

    setBulletinTitle("");
    setBulletinBody("");
    setPublishSuccess(true);
    setTimeout(() => setPublishSuccess(false), 3500);
  };

  const handlePromote = (targetEmail: string) => {
    promoteUserToAdmin(targetEmail);
    const updatedUsers = getUsers();
    setAllUsers(updatedUsers);
    if (currentUser && currentUser.email.toLowerCase().trim() === targetEmail.toLowerCase().trim()) {
      setCurrentUser(updatedUsers.find(u => u.email.toLowerCase().trim() === targetEmail.toLowerCase().trim()) || null);
    }
  };

  const handleDemote = (targetEmail: string) => {
    makeUserStudent(targetEmail);
    const updatedUsers = getUsers();
    setAllUsers(updatedUsers);
    if (currentUser && currentUser.email.toLowerCase().trim() === targetEmail.toLowerCase().trim()) {
      setCurrentUser(updatedUsers.find(u => u.email.toLowerCase().trim() === targetEmail.toLowerCase().trim()) || null);
    }
  };

  // Real-time Attendance Check-In Action
  const handleCheckIn = () => {
    setCheckInMsg(null);
    setCheckInError(null);
    if (!currentUser) return;

    const todayStr = new Date().toLocaleDateString("en-US");
    
    const users = getUsers();
    const userIndex = users.findIndex(u => u.email.toLowerCase().trim() === currentUser.email.toLowerCase().trim());
    if (userIndex === -1) return;

    const matchedUser = users[userIndex];
    if (matchedUser.lastCheckInDate === todayStr) {
      setCheckInError("You have already checked in today! Attendance streak is secured.");
      return;
    }

    const newStreak = (matchedUser.streak || 0) + 1;
    const newPoints = (matchedUser.points || 0) + 15;
    
    matchedUser.streak = newStreak;
    matchedUser.points = newPoints;
    matchedUser.lastCheckInDate = todayStr;

    users[userIndex] = matchedUser;
    saveUsers(users);
    setAllUsers(users);
    setCurrentUser({ ...matchedUser });

    // Sync stats in userStats
    setUserStats(prev => {
      const stats = {
        ...prev,
        points: newPoints,
        streak: newStreak
      };
      localStorage.setItem("gombe_ss_stats", JSON.stringify(stats));
      return stats;
    });

    setCheckInMsg(`✨ Success! Daily check-in registered! Gained +15 PTS. Today's attendance logged.`);
  };

  // Super Admin: Add Member
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName.trim() || !addEmail.trim() || !addPassword.trim()) {
      alert("Name, email and password are required.");
      return;
    }

    const users = getUsers();
    const emailLower = addEmail.toLowerCase().trim();
    if (users.some(u => u.email.toLowerCase().trim() === emailLower)) {
      alert("A member with this email already exists!");
      return;
    }

    const newMember: PortalUser = {
      name: addName.trim(),
      email: emailLower,
      password: addPassword,
      role: addRole,
      track: addTrack,
      level: addLevel,
      points: addPoints,
      streak: addStreak,
      desc: addDesc.trim() || `Gombe ICT Club member specializing in ${addTrack}.`
    };

    const updated = [...users, newMember];
    saveUsers(updated);
    setAllUsers(updated);

    // Reset fields
    setAddName("");
    setAddEmail("");
    setAddPassword("");
    setAddRole("Student");
    setAddTrack("React & Python Core");
    setAddLevel("Beginner");
    setAddPoints(120);
    setAddStreak(3);
    setAddDesc("");
    setIsAddingMember(false);
  };

  // Super Admin: Edit Member Trigger
  const startEditing = (member: PortalUser) => {
    setEditingEmail(member.email);
    setEditName(member.name);
    setEditPassword(member.password || "");
    setEditRole(member.role);
    setEditTrack(member.track);
    setEditLevel(member.level);
    setEditPoints(member.points);
    setEditStreak(member.streak);
    setEditDesc(member.desc || "");
    setIsEditingMember(true);
    setIsAddingMember(false); // close add form
  };

  // Super Admin: Save Edit Member
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      alert("Name is required");
      return;
    }

    const users = getUsers();
    const updated = users.map(u => {
      if (u.email.toLowerCase().trim() === editingEmail.toLowerCase().trim()) {
        const revised: PortalUser = {
          ...u,
          name: editName.trim(),
          password: editPassword,
          role: editRole,
          track: editTrack,
          level: editLevel,
          points: editPoints,
          streak: editStreak,
          desc: editDesc.trim()
        };
        return revised;
      }
      return u;
    });

    saveUsers(updated);
    setAllUsers(updated);

    // If edited self, sync it too!
    if (currentUser && currentUser.email.toLowerCase().trim() === editingEmail.toLowerCase().trim()) {
      const self = updated.find(u => u.email.toLowerCase().trim() === editingEmail.toLowerCase().trim()) || null;
      setCurrentUser(self);
      if (self) {
        setUserStats(prev => {
          const stats = {
            ...prev,
            points: self.points,
            streak: self.streak,
            unlockedLevel: self.level.toLowerCase() === "intermediate" ? "intermediate" : self.level.toLowerCase() === "pro" ? "pro" : "beginner"
          };
          localStorage.setItem("gombe_ss_stats", JSON.stringify(stats));
          return stats;
        });
      }
    }

    setIsEditingMember(false);
    setEditingEmail("");
  };

  // Super Admin: Delete Member
  const handleDeleteMember = (emailToDelete: string) => {
    if (!window.confirm("Are you sure you want to permanently remove this Gombe ICT member?")) {
      return;
    }

    const users = getUsers();
    const updated = users.filter(u => u.email.toLowerCase().trim() !== emailToDelete.toLowerCase().trim());
    saveUsers(updated);
    setAllUsers(updated);
  };

  const isSuperAdmin = currentUser && currentUser.role === "Super Admin";
  const isAdmin = currentUser && (currentUser.role === "Admin" || currentUser.role === "Super Admin");

  return (
    <div className="space-y-10 animate-fade-in font-sans">
      <section className="bg-gradient-to-r from-indigo-950/40 to-slate-900/40 border border-slate-900 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 justify-between items-center">
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 bg-indigo-950/80 border border-indigo-800/40 text-indigo-400 text-[10px] font-mono px-2.5 py-0.5 rounded uppercase font-bold">
            <User className="w-3.5 h-3.5" />
            Portal Logins
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white uppercase">STUDENT & MENTOR CONSOLE</h1>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            Validate course clearances, review scoreboard indices, and register custom accounts instantly. Secure password storage permits personalized directory enrollment.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Register / Sign In, or user status */}
        <div className="lg:col-span-4 space-y-6">
          {!isLoggedIn ? (
            <div className="bg-slate-900/60 border border-slate-900 rounded-2xl p-6 space-y-5 shadow-xl">
              <div className="flex border-b border-slate-800 font-mono text-xs select-none">
                <button
                  type="button"
                  onClick={() => {
                    setAuthTab("signin");
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className={`flex-1 pb-2.5 text-center font-bold tracking-wider uppercase transition-colors ${
                    authTab === "signin" ? "border-b-2 border-cyan-400 text-cyan-400" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthTab("register");
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className={`flex-1 pb-2.5 text-center font-bold tracking-wider uppercase transition-colors ${
                    authTab === "register" ? "border-b-2 border-cyan-400 text-cyan-400" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  Create Account
                </button>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-950/30 border border-rose-900/40 rounded-lg text-[11px] text-rose-450 font-mono flex items-start gap-1.5 leading-relaxed">
                  <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 bg-emerald-950/30 border border-emerald-900/40 rounded-lg text-[11px] text-emerald-450 font-mono leading-relaxed">
                  {successMsg}
                </div>
              )}

              {authTab === "signin" ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">Sign In with Password</h4>
                    <p className="text-[11px] text-slate-500 font-sans">Provide your credentials to retrieve progress tracks and stats.</p>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1 font-sans">
                      <label className="text-[9px] font-mono uppercase text-slate-500 block font-bold">Email Address:</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-600" />
                        <input
                          type="email"
                          required
                          placeholder="scholar@gombe-ict.edu.ng"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-slate-950 text-xs text-white pl-10 pr-4 py-2.5 rounded-lg border border-slate-850 focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-slate-700 font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1 font-sans">
                      <label className="text-[9px] font-mono uppercase text-slate-500 block font-bold">Password Key:</label>
                      <div className="relative">
                        <Key className="absolute left-3 top-2.5 w-4 h-4 text-slate-600" />
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-slate-950 text-xs text-white pl-10 pr-4 py-2.5 rounded-lg border border-slate-850 focus:outline-none focus:border-cyan-500 transition-colors font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold uppercase py-2.5 rounded-xl block tracking-wider shadow-md shadow-cyan-950 transition-all font-mono select-none"
                  >
                    Authenticate Account
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">Create Scholar Profile</h4>
                    <p className="text-[11px] text-slate-500 font-sans">Register yourself to clear standard quiz levels and join our active user scoreboard indices.</p>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1 font-sans">
                      <label className="text-[9px] font-mono uppercase text-slate-500 block font-bold">Scholar Full Name:</label>
                      <input
                        type="text"
                        required
                        placeholder="E.g., Fatima Bello"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full bg-slate-950 text-xs text-white px-3 py-2.5 border border-slate-850 rounded-lg focus:outline-none focus:border-cyan-500 font-sans placeholder:text-slate-700"
                      />
                    </div>

                    <div className="space-y-1 font-sans">
                      <label className="text-[9px] font-mono uppercase text-slate-500 block font-bold">School Email Address:</label>
                      <input
                        type="email"
                        required
                        placeholder="student@gombe-ict.edu.ng"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-950 text-xs text-white px-3 py-2.5 border border-slate-850 rounded-lg focus:outline-none focus:border-cyan-500 font-mono placeholder:text-slate-700"
                      />
                    </div>

                    <div className="space-y-1 font-sans">
                      <label className="text-[9px] font-mono uppercase text-slate-500 block font-bold">Set Password Key:</label>
                      <input
                        type="password"
                        required
                        placeholder="At least 4 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-950 text-xs text-white px-3 py-2.5 border border-slate-850 rounded-lg focus:outline-none focus:border-cyan-500 font-mono placeholder:text-slate-700"
                      />
                    </div>

                    <div className="space-y-1 font-sans">
                      <label className="text-[9px] font-mono uppercase text-slate-500 block font-bold">Primary Track Focus:</label>
                      <select
                        value={regTrack}
                        onChange={(e) => setRegTrack(e.target.value)}
                        className="w-full bg-slate-950 text-xs text-slate-300 p-2.5 rounded-lg border border-slate-850 focus:outline-none focus:border-cyan-500 cursor-pointer"
                      >
                        <option value="React & Python Core">React & Python Core</option>
                        <option value="Pen-testing & Wireshark Labs">Pen-testing & Wireshark Labs</option>
                        <option value="Multiplayer Brackets & Tournaments">Multiplayer Brackets & Tournaments</option>
                        <option value="Web Styling & Design">Web Styling & Design</option>
                        <option value="Linux commands & Security">Linux commands & Security</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold uppercase py-2.5 rounded-xl block tracking-wider shadow-md shadow-cyan-950 transition-all font-mono select-none"
                  >
                    Create Registered Account
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="bg-slate-900/60 border border-slate-900 rounded-2xl p-6 space-y-6">
              <div className="flex justify-between items-start pb-4 border-b border-slate-850">
                <div className="space-y-1">
                  <span className={`text-[9px] font-mono border py-0.5 px-2.5 rounded-full inline-block uppercase font-extrabold tracking-wider ${
                    isSuperAdmin 
                      ? "bg-amber-950/40 border-amber-800/40 text-amber-400" 
                      : isAdmin 
                        ? "bg-cyan-950/40 border-cyan-800/40 text-cyan-400" 
                        : "bg-slate-950 border-slate-800 text-slate-400"
                  }`}>
                    {currentUser?.role}
                  </span>
                  <h4 className="text-xs font-bold text-white font-mono mt-1">{currentUser?.name}</h4>
                  <p className="text-[10px] text-slate-500 font-mono truncate max-w-[190px]">{currentUser?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-[9px] text-slate-400 hover:text-rose-400 font-bold transition-colors font-mono uppercase bg-slate-950 border border-slate-850 px-2.5 py-1 rounded cursor-pointer"
                >
                  Sign Out
                </button>
              </div>

               {/* Stats overview boxes */}
              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-1">
                  <span className="text-[9px] text-slate-500 uppercase block">Total Points</span>
                  <div className="flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-extrabold text-amber-400">{userStats.points}</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-1">
                  <span className="text-[9px] text-slate-500 uppercase block">Attendance Streak</span>
                  <div className="flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-orange-500 fill-orange-500/10" />
                    <span className="text-sm font-extrabold text-orange-400">{userStats.streak} Days</span>
                  </div>
                </div>
              </div>

              {/* Daily dynamic real-time check-in section */}
              <div className="bg-slate-950 p-4 border border-slate-800/40 rounded-xl space-y-2.5 text-center">
                <span className="text-[9px] text-slate-400 uppercase font-mono block tracking-wider">Dynamic Attendance Terminal</span>
                
                {checkInMsg && (
                  <div className="text-[10px] leading-relaxed text-emerald-400 bg-emerald-950/20 p-2.5 rounded border border-emerald-900/30 font-mono animate-pulse">
                    {checkInMsg}
                  </div>
                )}
                
                {checkInError && (
                  <div className="text-[10px] leading-relaxed text-slate-400 bg-slate-900/50 p-2.5 rounded border border-slate-800 font-mono">
                    {checkInError}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleCheckIn}
                  className="w-full bg-gradient-to-r from-orange-655 to-red-600 hover:from-orange-500 hover:to-red-500 text-white py-2 rounded-lg text-xs font-mono font-bold tracking-wide uppercase transition-all select-none cursor-pointer flex justify-center items-center gap-1.5 shadow-md shadow-orange-950/50"
                  style={{ backgroundColor: "#ea580c" }}
                >
                  <Flame className="w-4 h-4 text-white fill-current animate-bounce" />
                  Clock-In Today (+15 PTS)
                </button>
                <div className="text-[9px] text-slate-500 font-mono">
                  {currentUser?.lastCheckInDate ? `Logged: ${currentUser.lastCheckInDate}` : "Standby: Click above to record attendance."}
                </div>
              </div>

              {/* Progress list completed */}
              <div className="space-y-2.5 font-sans">
                <span className="text-[10px] text-slate-500 font-mono tracking-wider uppercase block">Unlocked Track Courses:</span>
                {userStats.completedTopics.length === 0 ? (
                  <p className="text-[11px] text-slate-500 italic font-sans leading-normal">
                    No modules completed in this session yet. Explore lessons in CODING or CYBER to earn certificates and level clears!
                  </p>
                ) : (
                  <div className="space-y-1.5 font-mono text-[10px] text-slate-300">
                    {userStats.completedTopics.map((topic) => (
                      <div key={topic} className="flex gap-2 items-center bg-slate-950 p-2 border border-slate-900 rounded-lg">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        <span>Completed Track ID: <strong className="text-cyan-400 uppercase">{topic}</strong></span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Reset profiles helper */}
              <div className="border-t border-slate-800/80 pt-5">
                <button
                  type="button"
                  onClick={handleResetProgress}
                  className="flex items-center gap-1.5 text-[9px] font-mono font-medium text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Reset academic progress
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Administrative Tools */}
        <div className="lg:col-span-8 space-y-8">
          {isLoggedIn ? (
            <>
              {/* SUPER ADMIN: ACCESS USER LISTS & MAKE USER ADMIN */}
              {isSuperAdmin && (
                <div className="bg-slate-900/60 border border-slate-900 rounded-2xl p-6 space-y-5 shadow-xl">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-850/80">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-amber-400" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
                          Master Super Admin User Control
                        </h3>
                      </div>
                      <p className="text-[11px] text-slate-500 font-sans">
                        Principal Mentor workspace. Review members, promote roles, edit details, or remove records.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingMember(!isAddingMember);
                        setIsEditingMember(false);
                      }}
                      className="bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-mono px-3 py-1.5 rounded-lg border border-cyan-700/30 font-bold uppercase tracking-wider transition-colors"
                    >
                      {isAddingMember ? "✕ Hide Add Form" : "➕ Create Member"}
                    </button>
                  </div>

                  {/* Collapsible Add Member Form */}
                  {isAddingMember && (
                    <form onSubmit={handleAddMember} className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4 font-sans text-xs">
                      <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                        <h4 className="font-bold text-white uppercase font-mono">➕ Add New Member Profile</h4>
                        <button type="button" onClick={() => setIsAddingMember(false)} className="text-slate-500 hover:text-white uppercase font-mono text-[10px]">✕ Cancel</button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-slate-400 uppercase font-mono text-[9px] block">Full Name:</label>
                          <input type="text" required value={addName} onChange={e => setAddName(e.target.value)} className="w-full bg-slate-900 border border-slate-800 p-2.5 text-xs text-white rounded focus:outline-none focus:border-cyan-500" placeholder="E.g., Faulat Ssentuuwa" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-400 uppercase font-mono text-[9px] block">School Email:</label>
                          <input type="email" required value={addEmail} onChange={e => setAddEmail(e.target.value)} className="w-full bg-slate-900 border border-slate-800 p-2.5 text-xs text-white font-mono rounded focus:outline-none focus:border-cyan-500" placeholder="E.g., faulat@gombe-ict.edu.ng" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-400 uppercase font-mono text-[9px] block">Password Key:</label>
                          <input type="text" required value={addPassword} onChange={e => setAddPassword(e.target.value)} className="w-full bg-slate-900 border border-slate-800 p-2.5 text-xs text-white font-mono rounded focus:outline-none focus:border-cyan-500" placeholder="E.g., 120Kigwa@#$" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="space-y-1">
                          <label className="text-slate-400 uppercase font-mono text-[9px] block">System Role:</label>
                          <select value={addRole} onChange={e => setAddRole(e.target.value as any)} className="w-full bg-slate-900 border border-slate-800 p-2 text-xs text-slate-300 rounded cursor-pointer">
                            <option value="Student">Student</option>
                            <option value="Admin">Admin</option>
                            <option value="Super Admin">Super Admin</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-400 uppercase font-mono text-[9px] block">Active Level:</label>
                          <select value={addLevel} onChange={e => setAddLevel(e.target.value)} className="w-full bg-slate-900 border border-slate-800 p-2 text-xs text-slate-300 rounded cursor-pointer">
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Pro">Pro</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-400 uppercase font-mono text-[9px] block">Score XP Points:</label>
                          <input type="number" value={addPoints} onChange={e => setAddPoints(Number(e.target.value) || 0)} className="w-full bg-slate-900 border border-slate-800 p-2 text-xs text-white rounded font-mono" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-400 uppercase font-mono text-[9px] block">Streak count:</label>
                          <input type="number" value={addStreak} onChange={e => setAddStreak(Number(e.target.value) || 0)} className="w-full bg-slate-900 border border-slate-800 p-2 text-xs text-white rounded font-mono" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-slate-400 uppercase font-mono text-[9px] block">Default Track Focus:</label>
                          <select value={addTrack} onChange={e => setAddTrack(e.target.value)} className="w-full bg-slate-900 border border-slate-800 p-2.5 text-xs text-slate-300 rounded cursor-pointer">
                            <option value="React & Python Core">React & Python Core</option>
                            <option value="Pen-testing & Wireshark Labs">Pen-testing & Wireshark Labs</option>
                            <option value="Multiplayer Brackets & Tournaments">Multiplayer Brackets & Tournaments</option>
                            <option value="Web Styling & Design">Web Styling & Design</option>
                            <option value="Linux commands & Security">Linux commands & Security</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-400 uppercase font-mono text-[9px] block">Bio Description:</label>
                          <input type="text" value={addDesc} onChange={e => setAddDesc(e.target.value)} className="w-full bg-slate-900 border border-slate-800 p-2.5 text-xs text-white rounded" placeholder="Scholar status profile description..." />
                        </div>
                      </div>

                      <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-mono py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide cursor-pointer transition-colors">
                        Save New Gombe Scholar Profile
                      </button>
                    </form>
                  )}

                  {/* Collapsible Edit Member Form */}
                  {isEditingMember && (
                    <form onSubmit={handleSaveEdit} className="bg-slate-950 p-5 rounded-xl border border-rose-950/40 space-y-4 font-sans text-xs">
                      <div className="flex justify-between items-center border-b border-rose-950/40 pb-2">
                        <h4 className="font-bold text-white uppercase font-mono">✏️ Edit Member Profile: <span className="text-cyan-400 font-mono italic">{editingEmail}</span></h4>
                        <button type="button" onClick={() => setIsEditingMember(false)} className="text-slate-500 hover:text-white uppercase font-mono text-[10px]">✕ Cancel</button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-slate-400 uppercase font-mono text-[9px] block">Full Name:</label>
                          <input type="text" required value={editName} onChange={e => setEditName(e.target.value)} className="w-full bg-slate-900 border border-slate-800 p-2.5 text-xs text-white rounded focus:outline-none focus:border-cyan-500" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-400 uppercase font-mono text-[9px] block">Password Key (Visible to Super Admin):</label>
                          <input type="text" required value={editPassword} onChange={e => setEditPassword(e.target.value)} className="w-full bg-slate-900 border border-slate-800 p-2.5 text-xs text-white font-mono rounded focus:outline-none focus:border-cyan-500" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="space-y-1">
                          <label className="text-slate-400 uppercase font-mono text-[9px] block">System Role:</label>
                          <select 
                            value={editRole} 
                            onChange={e => setEditRole(e.target.value as any)} 
                            className="w-full bg-slate-900 border border-slate-800 p-2 text-xs text-slate-300 rounded cursor-pointer"
                            disabled={editingEmail.toLowerCase().trim() === currentUser?.email.toLowerCase().trim()}
                          >
                            <option value="Student">Student</option>
                            <option value="Admin">Admin</option>
                            <option value="Super Admin">Super Admin</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-400 uppercase font-mono text-[9px] block">Active Level:</label>
                          <select value={editLevel} onChange={e => setEditLevel(e.target.value)} className="w-full bg-slate-900 border border-slate-800 p-2 text-xs text-slate-300 rounded cursor-pointer">
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Pro">Pro</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-400 uppercase font-mono text-[9px] block">Score XP Points:</label>
                          <input type="number" value={editPoints} onChange={e => setEditPoints(Number(e.target.value) || 0)} className="w-full bg-slate-900 border border-slate-800 p-2 text-xs text-white rounded font-mono" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-400 uppercase font-mono text-[9px] block">Streak count:</label>
                          <input type="number" value={editStreak} onChange={e => setEditStreak(Number(e.target.value) || 0)} className="w-full bg-slate-900 border border-slate-800 p-2 text-xs text-white rounded font-mono" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-slate-400 uppercase font-mono text-[9px] block">Current Track focus:</label>
                          <select value={editTrack} onChange={e => setEditTrack(e.target.value)} className="w-full bg-slate-900 border border-slate-800 p-2.5 text-xs text-slate-300 rounded cursor-pointer">
                            <option value="React & Python Core">React & Python Core</option>
                            <option value="Pen-testing & Wireshark Labs">Pen-testing & Wireshark Labs</option>
                            <option value="Multiplayer Brackets & Tournaments">Multiplayer Brackets & Tournaments</option>
                            <option value="Web Styling & Design">Web Styling & Design</option>
                            <option value="Linux commands & Security">Linux commands & Security</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-400 uppercase font-mono text-[9px] block">Bio Description:</label>
                          <input type="text" value={editDesc} onChange={e => setEditDesc(e.target.value)} className="w-full bg-slate-900 border border-slate-800 p-2.5 text-xs text-white rounded focus:outline-none focus:border-cyan-500" />
                        </div>
                      </div>

                      <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-mono py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide cursor-pointer transition-colors">
                        Save Member Profile Modifications
                      </button>
                    </form>
                  )}

                  <div className="overflow-x-auto border border-slate-950 rounded-xl bg-slate-950">
                    <table className="w-full text-left font-mono text-[11px] border-collapse">
                      <thead>
                        <tr className="border-b border-slate-850 bg-slate-900/40 text-slate-500 text-[10px] font-mono">
                          <th className="py-2.5 px-4 font-bold uppercase">Name</th>
                          <th className="py-2.5 px-3 font-bold uppercase">Email</th>
                          <th className="py-2.5 px-3 font-bold uppercase">Role</th>
                          <th className="py-2.5 px-3 font-bold uppercase">Track</th>
                          <th className="py-2.5 px-4 font-bold uppercase text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allUsers.map((user) => {
                          const isSelf = user.email.toLowerCase().trim() === currentUser?.email.toLowerCase().trim();
                          
                          return (
                            <tr key={user.email} className="border-b border-slate-900 hover:bg-slate-900/20 text-slate-300">
                              <td className="py-2.5 px-4 font-bold max-w-[120px] truncate">{user.name}</td>
                              <td className="py-2.5 px-3 max-w-[150px] truncate font-mono text-[10px]">{user.email}</td>
                              <td className="py-2.5 px-3">
                                <span className={`text-[9px] font-bold border py-0.2 px-2 rounded ${
                                  user.role === "Super Admin"
                                    ? "bg-amber-950/20 border-amber-800/10 text-amber-400"
                                    : user.role === "Admin"
                                      ? "bg-cyan-950/20 border-cyan-800/10 text-cyan-400"
                                      : "bg-slate-900 border-slate-800 text-slate-400"
                                  }`}>
                                  {user.role}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 max-w-[130px] truncate text-[10px] text-slate-400">{user.track}</td>
                              <td className="py-2.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => startEditing(user)}
                                  className="text-cyan-400 hover:text-cyan-300 font-bold bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-[9px] uppercase cursor-pointer"
                                >
                                  Edit
                                </button>
                                
                                {!isSelf && (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteMember(user.email)}
                                    className="text-rose-400 hover:text-rose-350 font-bold bg-rose-950/10 px-1.5 py-0.5 rounded border border-rose-950/20 text-[9px] uppercase cursor-pointer"
                                  >
                                    Delete
                                  </button>
                                )}

                                {isSelf && (
                                  <span className="text-[10px] text-slate-600 italic font-sans px-1">You</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                        {allUsers.length === 0 && (
                          <tr>
                            <td colSpan={5} className="py-4 px-4 text-center text-slate-500 italic">
                              No registered members found. Use 'Create Member' to set up Gombe profiles.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ADMIN & SUPER ADMIN: ADD NEWS AND ANNOUNCEMENTS FORM */}
              {isAdmin && (
                <form onSubmit={handlePublishAnnouncement} className="bg-slate-900/60 border border-slate-900 rounded-2xl p-6 space-y-5 shadow-xl animate-fade-in-up">
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2 font-mono">
                      <Megaphone className="w-4 h-4 text-cyan-400" />
                      Official Broadcast Publisher
                    </h3>
                    <p className="text-[11px] text-slate-500 font-sans">
                      Publish announcements, updates, track results, and general club updates for the Gombe Senior Secondary School.
                    </p>
                  </div>

                  {publishSuccess && (
                    <div className="p-3 bg-emerald-950/35 border border-emerald-905 rounded-lg text-xs leading-normal text-emerald-400 font-mono">
                      🎉 News announcement successfully registered and dispatched to Gombe Bulletins feed!
                    </div>
                  )}

                  <div className="space-y-4 font-sans">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5 font-sans">
                        <label className="text-[9px] font-mono uppercase text-slate-500">Announcement Title:</label>
                        <input
                          type="text"
                          required
                          placeholder="E.g., Virtual Coding Fair Scheduled"
                          value={bulletinTitle}
                          onChange={(e) => setBulletinTitle(e.target.value)}
                          className="w-full bg-slate-950 text-xs text-white p-2.5 rounded-lg border border-slate-850 focus:outline-none focus:border-cyan-500 placeholder:text-slate-700 font-sans"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] font-mono uppercase text-slate-500 block">Bulletin Category:</label>
                        <select
                          value={bulletinCategory}
                          onChange={(e) => setBulletinCategory(e.target.value as any)}
                          className="w-full bg-slate-950 text-xs text-slate-300 p-2.5 rounded-lg border border-slate-850 focus:outline-none cursor-pointer"
                        >
                          <option value="General">General Updates</option>
                          <option value="Coding">Coding Department</option>
                          <option value="Cyber">Cyber Security</option>
                          <option value="Gaming">Gaming Zone</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5 font-sans">
                      <label className="text-[9px] font-mono uppercase text-slate-500 block">Announcement Content Details:</label>
                      <textarea
                        required
                        placeholder="Type specific announcements to school members here..."
                        value={bulletinBody}
                        onChange={(e) => setBulletinBody(e.target.value)}
                        className="w-full bg-slate-950 text-xs text-slate-200 p-3 h-28 rounded-lg border border-slate-850 focus:outline-none placeholder:text-slate-700 font-sans"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold uppercase py-2.5 rounded-xl block tracking-wider shadow-md shadow-cyan-950 transition-all font-mono select-none cursor-pointer"
                    >
                      Broadcast to Gombe Members
                    </button>
                  </div>
                </form>
              )}

              {/* STANDARD STUDENT LOCK MSG */}
              {!isAdmin && (
                <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-8 text-center space-y-4 font-sans text-slate-400">
                  <Lock className="w-7 h-7 text-slate-600 mx-auto" />
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-bold text-white uppercase font-mono">Administrative Parameters Locked</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                      Only Gombe Senior Secondary ICT Mentors with verified Admin or Super Admin profiles hold access keys to release announcements or modify scholar levels.
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-slate-900/20 border border-slate-900/60 rounded-2xl p-8 text-center space-y-3 font-sans text-slate-400">
              <AlertCircle className="w-8 h-8 text-indigo-400/50 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-white uppercase font-mono">Authorize Authentication</h3>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Sign in or create an account on the verification side panel to initialize active learning trails and load administrative options.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
