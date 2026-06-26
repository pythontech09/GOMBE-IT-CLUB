import { VibeIdea } from "@/src/types";

export const CODING_TRACKS = {
  beginner: [
    { id: "beginner_1", title: "General Computing & Architecture", desc: "Understanding IPO (Input, Process, Output), CPU core mechanics, binary counting, and RAM vs ROM." },
    { id: "beginner_2", title: "Web Layout (HTML)", desc: "Building structured responsive webpages with tags, lists, anchors, and semantic elements." },
    { id: "beginner_3", title: "Styling with CSS", desc: "Crafting beautiful colors, margins, gutters, the Box Model, and flexbox configurations." },
    { id: "beginner_4", title: "Python Basics", desc: "Mastering variables, primitive data types (str, int, float, bool), basic operations, and lists." },
    { id: "beginner_5", title: "Logic & Conditionals", desc: "Making program decisions with complex if/else trees, logic gates, and while/for loops." },
  ],
  intermediate: [
    { id: "intermediate_1", title: "JavaScript Fundamentals", desc: "Understanding client execution, let vs const, functions, JSON arrays, and simple object literals." },
    { id: "intermediate_2", title: "DOM Manipulation", desc: "Selecting page elements, attaching triggers, editing layout styles on-the-fly, and event capture." },
    { id: "intermediate_3", title: "Python Functions & Lists", desc: "Creating parameterized functions, list comprehensions, dictionary indexing, and defaults." },
    { id: "intermediate_4", title: "APIs & Web Requests", desc: "Using HTTP clients, promises, async/await streams, and error handling with try/catch." },
    { id: "intermediate_5", title: "Git & Version Control", desc: "Understanding repos, commit logs, branch checking, remote pushes, and checkout commands." },
  ],
  pro: [
    { id: "pro_1", title: "React & Components", desc: "Creating declarative state managers, passing properties, and lifecycle triggers using useEffect." },
    { id: "pro_2", title: "Databases & Structured SQL", desc: "Executing relational CREATE, SELECT queries, row filtering, foreign keys, and transactions." },
    { id: "pro_3", title: "Algorithms & Big O Complexity", desc: "Analyzing scale speed, sorted binary search matrices, sorting arrays, and time/space constraints." },
    { id: "pro_4", title: "Authentication & Cryptography", desc: "Creating secure password hashes (bcrypt), active session tokens (JWT), and OAuth." },
    { id: "pro_5", title: "Continuous CI/CD & Deploy", desc: "Automating branch testing, pointing nameserver records, and cloud deployment pipelines." },
  ]
};

export const CYBER_TRACKS = {
  recon: [
    { id: "recon_1", title: "How the Internet Works", desc: "Discovering network handshakes, packets, DNS routing names, and TCP vs UDP protocol mechanisms." },
    { id: "recon_2", title: "Linux Terminal Mechanics", desc: "Mastering path navigation (pwd, folder listing), administrative rights (sudo, permissions), and grep searches." },
    { id: "recon_3", title: "Networking & Firewall Rules", desc: "Studying the 7 OSI layers, secure secure ports (SSH, FTP), and capturing packet headers with Wireshark." },
    { id: "recon_4", title: "Open Source Intelligence (OSINT)", desc: "Using advanced browser search syntax (Dorks), checking online breaches (Pwned), and doing whois lookup queries." },
    { id: "recon_5", title: "Attacks & Phishing Concepts", desc: "Learning about trojans, malicious tracking, spoof emails, and basic network MITM (Man-in-the-Middle) concepts." },
  ],
  defence: [
    { id: "defence_1", title: "Modern Cryptography Basics", desc: "Exploring AES block encryption, public/private keys, and calculating high-integrity checksum hashes." },
    { id: "defence_2", title: "OWASP Top-10 Web Defence", desc: "Mitigating browser vulnerabilities like Cross-Site Scripting (XSS) and validation filtering." },
    { id: "defence_3", title: "Password Hardening & MFA", desc: "Preventing brute-force attacks via random salts, password key vaults, and multi-factor auth." },
    { id: "defence_4", title: "Active Network Defences", desc: "Deploying intrusion warning sensors (IDS/IPS), isolating virtual servers, and configuring firewalls." },
    { id: "defence_5", title: "Log Analysis & Incidents", desc: "Reviewing error events, tracing unauthorized system entries, and isolating infected terminal nodes." },
  ],
  attack: [
    { id: "attack_1", title: "Ethical Pen-Testing Core", desc: "Applying standard scanning, discovering system entries safely, and documenting scope boundaries." },
    { id: "attack_2", title: "Active Port Recon (Nmap)", desc: "Sending ping packets, scanning port states, directory hunting, and grabbing service banners." },
    { id: "attack_3", title: "Exploitation & Payloads", desc: "Analyzing known CVE records, executing safe exploits in environments, and generating shell connections." },
    { id: "attack_4", title: "Capture The Flag (CTF) Drills", desc: "Deciphering ciphers, reverse compiling files, intercepting proxy endpoints, and claiming flags." },
    { id: "attack_5", title: "Stakeholder Pen-Test Reports", desc: "Scoring vulnerabilities (CVSS scale), writing incident summaries, and proposing secure remediation steps." },
  ]
};

export const VIBE_CATEGORIES_IDEAS: VibeIdea[] = [
  {
    id: "vibe_1",
    title: "Personal Portfolio Card",
    description: "Build a responsive profile card showcasing your developer name, social handles, custom links, and interactive contact form with sleek CSS layout animations.",
    difficulty: "Beginner",
    category: "Web App",
    estimatedTime: "45 mins",
    tags: ["HTML", "Flexbox", "Buttons", "Transitions"]
  },
  {
    id: "vibe_2",
    title: "Retro Arcade Tic-Tac-Toe",
    description: "Construct a pixel-styled board with smart round score trackers, full reset capabilities, and sound effects using simple grid properties.",
    difficulty: "Beginner",
    category: "Game",
    estimatedTime: "1 hour",
    tags: ["JavaScript", "CSS Grid", "Event Listeners"]
  },
  {
    id: "vibe_3",
    title: "Interactive Weather Watcher",
    description: "Write an API client that queries weather conditions of major world cities and dynamically recolors the UI depending on the local climate.",
    difficulty: "Intermediate",
    category: "Web App",
    estimatedTime: "1.5 hours",
    tags: ["Fetch API", "Promises", "Async/Await", "JSON"]
  },
  {
    id: "vibe_4",
    title: "Crypto Dashboard & Tracker",
    description: "Assemble a live tracker that visualizes Bitcoin price history trends inside a clean layout table with dynamic search filters.",
    difficulty: "Intermediate",
    category: "Utility",
    estimatedTime: "2 hours",
    tags: ["Array Map", "Object Destructuring", "Live Feed"]
  },
  {
    id: "vibe_5",
    title: "Secure Terminal Credentials Vault",
    description: "Design a terminal script using Python that encrypts simple account passwords with custom key rules, validating correct user authorization on startup.",
    difficulty: "Advanced",
    category: "Utility",
    estimatedTime: "3 hours",
    tags: ["Python Syntax", "Cryptography", "File Write"]
  },
  {
    id: "vibe_6",
    title: "AI Study Buddy & Note Generator",
    description: "Design an app that lets students write general learning headings (e.g., 'Thermodynamics') and calls a simulated server endpoint to assemble complete summary points.",
    difficulty: "Advanced",
    category: "Automation",
    estimatedTime: "4 hours",
    tags: ["Fullstack API", "AI Integration", "React Custom State"]
  }
];
