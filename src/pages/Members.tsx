import React, { useState, useEffect } from "react";
import { 
  Users, 
  Mail, 
  Compass, 
  Star, 
  Shield, 
  Award, 
  Sparkles, 
  Edit, 
  Trash2, 
  Plus, 
  Undo2, 
  X, 
  UserCheck
} from "lucide-react";
import { getUsers, saveUsers, getCurrentUser, PortalUser } from "../lib/user-store";

export default function Members() {
  const [allUsers, setAllUsers] = useState<PortalUser[]>([]);
  const [currentUser, setCurrentUser] = useState<PortalUser | null>(null);

  // Undo delete history management
  const [lastDeletedUser, setLastDeletedUser] = useState<PortalUser | null>(null);
  const [showUndoBanner, setShowUndoBanner] = useState(false);

  // Editing state management
  const [editingUser, setEditingUser] = useState<PortalUser | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Field states for editing/creation
  const [nameField, setNameField] = useState("");
  const [emailField, setEmailField] = useState("");
  const [passwordField, setPasswordField] = useState("");
  const [roleField, setRoleField] = useState<"Student" | "Admin" | "Super Admin">("Student");
  const [trackField, setTrackField] = useState("");
  const [levelField, setLevelField] = useState("Beginner");
  const [pointsField, setPointsField] = useState(120);
  const [streakField, setStreakField] = useState(3);
  const [descField, setDescField] = useState("");

  useEffect(() => {
    // Load dynamic users list
    setAllUsers(getUsers());
    setCurrentUser(getCurrentUser());
    
    // Listen for changes from other tabs/panels
    const handleStorageChange = () => {
      setAllUsers(getUsers());
      setCurrentUser(getCurrentUser());
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const isAdmin = currentUser && (currentUser.role === "Admin" || currentUser.role === "Super Admin");

  const handleDelete = (email: string) => {
    const userToDelete = allUsers.find(u => u.email === email);
    if (!userToDelete) return;

    if (!window.confirm(`⚠️ CONFIRMATION OF DELETION:\n\nAre you sure you want to permanently delete user "${userToDelete.name}" (${userToDelete.email}) from Gombe SS track records?\n\nThis will revoke their active portal configurations.`)) {
      return;
    }

    const updated = allUsers.filter(u => u.email !== email);
    saveUsers(updated);
    setAllUsers(updated);

    // Track for Undo/Restore control
    setLastDeletedUser(userToDelete);
    setShowUndoBanner(true);
    
    // Auto collapse notification banner after 12 seconds
    setTimeout(() => {
      setShowUndoBanner(false);
    }, 12000);
  };

  const handleUndoDelete = () => {
    if (!lastDeletedUser) return;
    const restored = [...allUsers, lastDeletedUser];
    saveUsers(restored);
    setAllUsers(restored);
    setLastDeletedUser(null);
    setShowUndoBanner(false);
  };

  const handleOpenEdit = (user: PortalUser) => {
    setEditingUser(user);
    setIsCreating(false);
    setNameField(user.name);
    setEmailField(user.email);
    setPasswordField(user.password || "123456");
    setRoleField(user.role);
    setTrackField(user.track);
    setLevelField(user.level);
    setPointsField(user.points);
    setStreakField(user.streak);
    setDescField(user.desc || "");
  };

  const handleOpenAdd = () => {
    setEditingUser(null);
    setIsCreating(true);
    setNameField("");
    setEmailField("");
    setPasswordField("Gombe123!");
    setRoleField("Student");
    setTrackField("Coding & Web Engineering");
    setLevelField("Beginner");
    setPointsField(120);
    setStreakField(3);
    setDescField("");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameField.trim() || !emailField.trim()) return;

    let updatedList: PortalUser[] = [];
    if (isCreating) {
      if (allUsers.some(u => u.email.toLowerCase().trim() === emailField.toLowerCase().trim())) {
        alert("A scholar account with this email address already exists.");
        return;
      }
      const newUser: PortalUser = {
        name: nameField.trim(),
        email: emailField.trim(),
        password: passwordField || "123456",
        role: roleField,
        track: trackField || "General Track",
        level: levelField,
        points: Number(pointsField) || 120,
        streak: Number(streakField) || 3,
        desc: descField.trim() || `Active member of Gombe SS ICT Club studying ${trackField}`
      };
      updatedList = [...allUsers, newUser];
    } else if (editingUser) {
      updatedList = allUsers.map(u => {
        if (u.email === editingUser.email) {
          return {
            ...u,
            name: nameField.trim(),
            role: roleField,
            track: trackField,
            level: levelField,
            points: Number(pointsField) || 0,
            streak: Number(streakField) || 0,
            desc: descField.trim()
          };
        }
        return u;
      });
    }

    saveUsers(updatedList);
    setAllUsers(updatedList);
    setEditingUser(null);
    setIsCreating(false);
  };

  // Compute administrative officials (Super Admin and Admins)
  const management = allUsers.filter(u => u.role === "Super Admin" || u.role === "Admin");
  
  // Compute active scholars (Students)
  const students = allUsers.filter(u => u.role === "Student");

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Banner */}
      <section className="bg-gradient-to-r from-cyan-950/20 to-slate-900/40 border border-slate-900 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 justify-between items-center">
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 bg-cyan-950/85 border border-cyan-800/45 text-cyan-400 text-[10px] font-mono px-2.5 py-0.5 rounded uppercase">
            <Users className="w-3.5 h-3.5" />
            Club Directory
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">ICT CLUB DIRECTORY</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            Meet the administrators, educators, and curriculum guides that drive digital education forward at Gombe Senior Secondary School.
          </p>
        </div>
      </section>

      {/* Admin Undo Alert Banner */}
      {showUndoBanner && lastDeletedUser && (
        <div className="bg-emerald-950/80 border border-emerald-800 text-emerald-400 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono animate-slide-up shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Scholar <strong>{lastDeletedUser.name}</strong> deleted successfully. Click Undo if this was an accident!</span>
          </div>
          <button 
            type="button"
            onClick={handleUndoDelete}
            className="bg-emerald-800/80 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider px-3 py-1.5 rounded inline-flex items-center gap-1.5 transition-all text-[10px] cursor-pointer"
          >
            <Undo2 className="w-3.5 h-3.5" /> Undo / Restore
          </button>
        </div>
      )}

      {/* Admin Quick Action Button */}
      {isAdmin && !editingUser && !isCreating && (
        <div className="flex justify-between items-center bg-slate-900/40 border border-slate-900 p-4 rounded-xl">
          <span className="text-xs font-mono text-slate-400">
            🛡️ Authorized Administrator Panel
          </span>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="bg-cyan-955/60 hover:bg-cyan-900/50 text-cyan-400 text-xs font-mono border border-cyan-800/40 px-4 py-2 rounded-xl font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add New Scholar / Admin
          </button>
        </div>
      )}

      {/* Admin Create / Edit Member Block Form */}
      {(isCreating || editingUser) && (
        <form onSubmit={handleFormSubmit} className="bg-slate-950 border border-indigo-950/80 rounded-2xl p-6 space-y-4 animate-slide-up shadow-xl">
          <div className="flex justify-between items-center border-b border-indigo-950/40 pb-2.5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300 flex items-center gap-1.5 font-mono">
              <Shield className="w-4 h-4 text-cyan-400" />
              {isCreating ? "Register New Scholar / Official" : `Revising Profile: ${editingUser?.name}`}
            </h3>
            <button
              type="button"
              onClick={() => {
                setEditingUser(null);
                setIsCreating(false);
              }}
              className="text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-mono uppercase">Full Name</label>
              <input
                required
                type="text"
                value={nameField}
                onChange={(e) => setNameField(e.target.value)}
                placeholder="e.g. Alon Kayiira"
                className="w-full bg-slate-900 border border-slate-800 text-xs text-white p-2.5 rounded-lg focus:outline-none focus:border-cyan-500 font-sans"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-mono uppercase">Email Address</label>
              <input
                required
                disabled={!isCreating}
                type="email"
                value={emailField}
                onChange={(e) => setEmailField(e.target.value)}
                placeholder="e.g. alon@gmail.com"
                className="w-full bg-slate-900 border border-slate-800 text-xs text-white p-2.5 rounded-lg focus:outline-none focus:border-cyan-500 font-sans disabled:opacity-50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-mono uppercase">Track Category</label>
              <input
                required
                type="text"
                value={trackField}
                onChange={(e) => setTrackField(e.target.value)}
                placeholder="e.g. Coding with Python"
                className="w-full bg-slate-900 border border-slate-800 text-xs text-white p-2.5 rounded-lg focus:outline-none focus:border-cyan-500 font-sans"
              />
            </div>
          </div>

          {isCreating && (
            <div className="grid grid-cols-1 gap-1">
              <label className="text-[10px] text-slate-400 font-mono uppercase">Portal Password</label>
              <input
                type="text"
                value={passwordField}
                onChange={(e) => setPasswordField(e.target.value)}
                placeholder="Password"
                className="w-full bg-slate-900 border border-slate-800 text-xs text-white p-2.5 rounded-lg focus:outline-none focus:border-cyan-500 font-sans"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-mono uppercase">Authorized Role</label>
              <select
                value={roleField}
                onChange={(e) => setRoleField(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 text-xs text-white p-2.5 rounded-lg focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="Student">Student (Scholar)</option>
                <option value="Admin">Admin (Tech Assistant)</option>
                <option value="Super Admin">Super Admin (Principal Mentor)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-mono uppercase">Academy Difficulty Level</label>
              <select
                value={levelField}
                onChange={(e) => setLevelField(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-xs text-white p-2.5 rounded-lg focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Pro">Pro</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-mono uppercase">Points Score (numeric)</label>
              <input
                required
                type="number"
                value={pointsField}
                onChange={(e) => setPointsField(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 text-xs text-white p-2.5 rounded-lg focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-mono uppercase">Streak Counts (days)</label>
              <input
                required
                type="number"
                value={streakField}
                onChange={(e) => setStreakField(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 text-xs text-white p-2.5 rounded-lg focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-mono uppercase">Short Biography / Description</label>
            <textarea
              value={descField}
              onChange={(e) => setDescField(e.target.value)}
              placeholder="Provide a bio about track progress, achievements, or club oversight duties..."
              rows={2}
              className="w-full bg-slate-900 border border-slate-800 text-xs text-white p-2.5 rounded-lg focus:outline-none focus:border-cyan-500 font-sans"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => {
                setEditingUser(null);
                setIsCreating(false);
              }}
              className="bg-slate-900 hover:bg-slate-800 text-slate-400 text-xs font-mono px-4 py-2 rounded-lg cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-cyan-600 hover:bg-cyan-550 text-white text-xs font-mono font-bold uppercase tracking-wider px-5 py-2 rounded-lg cursor-pointer transition-colors"
            >
              {isCreating ? "Register Scholar" : "Apply Revision"}
            </button>
          </div>
        </form>
      )}

      {/* Leadership structure blocks */}
      <section className="space-y-5 animate-fade-in-up">
        <div className="border-b border-indigo-950 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">ADMINISTRATIVE OFFICIALS</h3>
          </div>
          <div className="text-[10px] text-slate-500 font-mono select-none font-bold">
            {management.length} ACTIVE {management.length === 1 ? 'LEADER' : 'LEADERS'} 
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {management.map((admin) => (
            <div key={admin.email} className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 flex flex-col justify-between group hover:border-slate-850 hover:bg-slate-900/60 transition-all duration-300">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-350 transition-colors flex items-center gap-2">
                      {admin.name}
                      {admin.role === "Super Admin" && (
                        <span className="bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[9px] font-mono px-1.5 py-0.2 rounded font-normal">
                          Super
                        </span>
                      )}
                    </h4>
                    <span className="text-[10px] font-mono font-medium text-cyan-400 block tracking-wider uppercase mt-0.5">
                      {admin.role === "Super Admin" ? "Principal Mentor & Master Admin" : "Club Co-Administrator / Tech Assistant"}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {isAdmin && (
                      <div className="flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(admin)}
                          className="p-1 hover:bg-slate-950 text-sky-400 rounded transition-colors"
                          title="Edit stats"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(admin.email)}
                          className="p-1 hover:bg-slate-950 text-rose-400 rounded transition-colors"
                          title="Delete administrative official"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                    <Shield className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {admin.desc || "Assists Gombe ICT Club. Overlooks classroom activities, manages track schedules, and leads technical workshops."}
                </p>
              </div>

              <div className="pt-6 border-t border-slate-950 mt-6 space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <Compass className="w-3.5 h-3.5 text-slate-600" />
                  <span>Track Area: <strong className="text-slate-350 font-normal">{admin.track}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <Mail className="w-3.5 h-3.5 text-slate-600" />
                  <span>Email: <a href={`mailto:${admin.email}`} className="text-cyan-500 hover:underline">{admin.email}</a></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Students logs grids */}
      <section className="space-y-5">
        <div className="border-b border-slate-950 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">ACTIVE SCHOLAR DIRECTORY</h3>
          </div>
          <div className="text-[10px] text-slate-500 font-mono font-bold select-none">
            {students.length} REGISTERED {students.length === 1 ? 'STUDENT' : 'STUDENTS'}
          </div>
        </div>

        {students.length === 0 ? (
          <div className="bg-slate-900/20 border border-slate-900/60 p-8 rounded-xl text-center text-slate-500 italic text-xs">
            No scholars registered as students right now. All have been recruited to active admin roles!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {students.map((st) => (
              <div key={st.email} className="bg-slate-900/40 border border-slate-900 rounded-xl p-4 flex justify-between items-center hover:bg-slate-900/60 transition-colors duration-250 group">
                <div className="space-y-1 min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-white leading-normal truncate" title={st.name}>{st.name}</h4>
                  <p className="text-[9px] text-slate-500 font-mono truncate" title={st.email}>
                    {st.email}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono">Focus: <span className="text-slate-400 truncate block">{st.track}</span></p>
                  <span className="text-[9px] font-mono tracking-wider bg-slate-950 text-slate-400 py-0.5 px-2 rounded-full inline-block mt-1">
                    {st.level}
                  </span>
                </div>
                
                <div className="text-right flex-shrink-0 flex items-center gap-1.5 pl-2">
                  <div className="space-y-1">
                    <Award className="w-4 h-4 text-cyan-400 ml-auto" />
                    <span className="text-xs font-mono font-bold text-cyan-400 block">{st.points} PTS</span>
                  </div>

                  {isAdmin && (
                    <div className="hidden group-hover:flex flex-col gap-1.5 border-l border-slate-850 pl-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(st)}
                        className="text-sky-400 hover:text-sky-305 transition-colors p-0.5 cursor-pointer"
                        title="Edit profile"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(st.email)}
                        className="text-rose-455 hover:text-rose-400 transition-colors p-0.5 cursor-pointer"
                        title="Delete scholar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
