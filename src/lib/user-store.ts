export interface PortalUser {
  name: string;
  email: string;
  password?: string;
  role: "Student" | "Admin" | "Super Admin";
  track: string;
  level: string; // "Beginner" | "Intermediate" | "Pro"
  points: number;
  streak: number;
  desc?: string;
  lastCheckInDate?: string;
}

export interface GamingTournament {
  id: number;
  title: string;
  date: string;
  status: string;
  bracket: string;
}

export interface ClubAnnouncement {
  id: number;
  title: string;
  category: "General" | "Coding" | "Cyber" | "Gaming";
  date: string;
  author: string;
  body: string;
}

const DEFAULT_USERS: PortalUser[] = [
  {
    name: "Haruna Sani (Super Admin)",
    email: "hpro453176@gmail.com",
    password: "120Kigwa@#$",
    role: "Super Admin",
    track: "Coding & Cloud Architecture",
    level: "Pro",
    points: 9999,
    streak: 120,
    desc: "Supervised the Gombe ICT Club migration initiative. Overlooks classroom activities and schedules examinations."
  }
];

const DEFAULT_TOURNAMENTS: GamingTournament[] = [
  { title: "FIFA 26 School Clubs", date: "Every Friday, 3:00 PM", status: "Open for Registrations", bracket: "Single Elimination" },
  { title: "Call Of Duty Mobile Sprint", date: "Every Saturday, 4:30 PM", status: "Active matches", bracket: "Squad Deathmatch" },
  { title: "Mortal Kombat XL Battle", date: "Bi-Weekly Wednesdays", status: "Finished", bracket: "Double Elimination Bracket" }
].map((t, idx) => ({ ...t, id: idx + 1 }));

const DEFAULT_ANNOUNCEMENTS: ClubAnnouncement[] = [
  {
    id: 1,
    title: "Gombe SS ICT Club Migration Completed successfully!",
    category: "General",
    date: "June 19, 2026",
    author: "Haruna Sani (Principal Mentor)",
    body: "We have fully upgraded our technology curriculum website. Students can now trigger the Gemini AI educator to dynamically study over 1000 computer science topics in real-time, completely free of charge! Explore the 'Become a Developer' Vibe Coding page to create arbitrary coding dreams."
  },
  {
    id: 2,
    title: "Weekly FIFA 26 Club Qualifier Bracket Schedules Published",
    category: "Gaming",
    date: "June 18, 2026",
    author: "Khadijah Mohammed",
    body: "Registrations for Friday's tournament qualify matches are now open. Visit the Gaming Zone to register your team, review seedings, and log score streaks! Top 3 standings players get exclusive badges on their profile summaries."
  },
  {
    id: 3,
    title: "Ethical Hacking Lab Terminal Overhauled",
    category: "Cyber",
    date: "June 17, 2026",
    author: "Bassey Joshua",
    body: "Our virtual system terminal simulation has been upgraded with live Wireshark intercept loops. Try to capture cleartext post login hashes and verify target flags to score +100 XP points."
  }
];

// USER CONTROLLERS
export function getUsers(): PortalUser[] {
  const saved = localStorage.getItem("gombe_ss_users");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // Fallback
    }
  }
  localStorage.setItem("gombe_ss_users", JSON.stringify(DEFAULT_USERS));
  return DEFAULT_USERS;
}

export function saveUsers(users: PortalUser[]) {
  localStorage.setItem("gombe_ss_users", JSON.stringify(users));
}

export function getCurrentUser(): PortalUser | null {
  const email = localStorage.getItem("gombe_ss_current_user");
  if (!email) return null;

  const users = getUsers();
  const found = users.find(u => u.email.toLowerCase().trim() === email.toLowerCase().trim());
  return found || null;
}

export function registerUser(name: string, email: string, password: string, track: string): { success: boolean; message: string } {
  const users = getUsers();
  const cleanedEmail = email.toLowerCase().trim();
  if (users.some(u => u.email.toLowerCase().trim() === cleanedEmail)) {
    return { success: false, message: "An account with this email already exists." };
  }

  const role = cleanedEmail === "hpro453176@gmail.com" ? "Super Admin" : "Student";
  const newUser: PortalUser = {
    name: name.trim(),
    email: email.trim(),
    password: password,
    role: role,
    track: track || "General Track",
    level: "Beginner",
    points: 120,
    streak: 3,
    desc: `Enrolled student specializing in ${track || "General Track"}.`
  };

  const updatedUsers = [...users, newUser];
  saveUsers(updatedUsers);
  return { success: true, message: "Account created successfully! You can now log in." };
}

export function loginUser(email: string, password: string): { success: boolean; user?: PortalUser; message: string } {
  const users = getUsers();
  const cleanedEmail = email.toLowerCase().trim();
  const found = users.find(u => u.email.toLowerCase().trim() === cleanedEmail);

  if (!found) {
    return { success: false, message: "Email not registered. Please create an account." };
  }

  if (found.password && found.password !== password) {
    return { success: false, message: "Incorrect password. Please verify your credentials." };
  }

  // Set session email
  localStorage.setItem("gombe_ss_current_user", found.email);
  return { success: true, user: found, message: "Login successful!" };
}

export function promoteUserToAdmin(email: string): boolean {
  const users = getUsers();
  const index = users.findIndex(u => u.email.toLowerCase().trim() === email.toLowerCase().trim());
  if (index === -1) return false;

  // Don't downgrade Super Admin
  if (users[index].role === "Super Admin") return false;

  users[index].role = "Admin";
  saveUsers(users);
  return true;
}

export function makeUserStudent(email: string): boolean {
  const users = getUsers();
  const index = users.findIndex(u => u.email.toLowerCase().trim() === email.toLowerCase().trim());
  if (index === -1) return false;

  if (users[index].role === "Super Admin") return false;

  users[index].role = "Student";
  saveUsers(users);
  return true;
}

// TOURNAMENTS / GAMING CONTROLLERS
export function getTournaments(): GamingTournament[] {
  const saved = localStorage.getItem("gombe_gaming_sessions");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {}
  }
  localStorage.setItem("gombe_gaming_sessions", JSON.stringify(DEFAULT_TOURNAMENTS));
  return DEFAULT_TOURNAMENTS;
}

export function saveTournaments(sessions: GamingTournament[]) {
  localStorage.setItem("gombe_gaming_sessions", JSON.stringify(sessions));
}

// ANNOUNCEMENTS / BULLETINS CONTROLLERS
export function getAnnouncements(): ClubAnnouncement[] {
  const saved = localStorage.getItem("gombe_announcements");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {}
  }
  localStorage.setItem("gombe_announcements", JSON.stringify(DEFAULT_ANNOUNCEMENTS));
  return DEFAULT_ANNOUNCEMENTS;
}

export function saveAnnouncements(announcements: ClubAnnouncement[]) {
  localStorage.setItem("gombe_announcements", JSON.stringify(announcements));
}
