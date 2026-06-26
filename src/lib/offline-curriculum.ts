// Offline curriculum fallback content for Gombe SS ICT Club
// This guarantees that the learning portal and vibe-coding tools continue to function beautifully
// even when the Gemini API server is experiencing high demand (503) or is offline.

export function getOfflineLesson(topicId: string, title: string = "", desc: string = "") {
  const normId = (topicId || "").toLowerCase();
  const normTitle = (title || "").toLowerCase();
  const normDesc = (desc || "").toLowerCase();

  // 1. HTML TOPICS
  if (normId.includes("html") || normId.includes("beginner_2") || normTitle.includes("html") || normTitle.includes("layout")) {
    return {
      title: title || "Semantic HTML Web Layouts",
      overview: `# Master Web Layouts with HTML5 in Gombe\n\nHTML (HyperText Markup Language) is the backbone of all modern internet web applications. It tells web browsers how to render elements such as display texts, structural containers, and interactive inputs.\n\n### Essential Tags\n- \`<h1>\`-\`<h6>\`: Hierarchical headings for document structures.\n- \`<p>\`: Text paragraph blocks.\n- \`<a>\`: Hyperlink anchor tags used to navigate pages.\n- \`<div>\` & \`<section>\`: Division tags for visual grouping of content.\n- \`<button>\`: Native clickable action triggers.`,
      keyPoints: [
        "📋 HTML elements are opened and closed symmetrically (e.g., `<button>Click</button>`).",
        "🌐 Attributes provide additional details like source URLs (`src`) or target actions (`href`).",
        "📱 Modern layouts prioritize semantic elements like `<header>`, `<main>`, and `<footer>`."
      ],
      sandboxCode: `<!-- Gombe SS HTML Sandbox -->
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: system-ui, sans-serif; text-align: center; padding: 24px; background-color: #0f172a; color: white; }
    .card { background-color: #1e293b; border: 1px solid #334155; padding: 24px; border-radius: 12px; max-width: 400px; margin: 0 auto; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3); }
    .btn { background: #06b6d4; border: none; padding: 10px 20px; color: #0f172a; border-radius: 6px; font-weight: bold; cursor: pointer; transition: 0.2s; }
    .btn:hover { background: #22d3ee; }
  </style>
</head>
<body>
  <div class="card">
    <h2>Explore Web Design!</h2>
    <p>Practice writing HTML markup inside our school offline workspace.</p>
    <button class="btn" onclick="alert('Congratulations from Gombe SS!')">Launch Program</button>
  </div>
</body>
</html>`,
      sandboxLang: "html",
      expectedOutput: "A highly styled graphite card centered on the screen with an interactive Cyan button.",
      quiz: [
        {
          q: "What does HTML stand for?",
          options: [
            "HyperText Markup Language",
            "HighTech Memory Layout",
            "Hyperlink Top Module Log",
            "Home Tool Marker Line"
          ],
          correct: 0
        },
        {
          q: "Which tag is used to create a hyperlink?",
          options: [
            "<link>",
            "<a>",
            "<href>",
            "<anchor>"
          ],
          correct: 1
        },
        {
          q: "Which HTML5 semantic tag represents the primary page contents?",
          options: [
            "<body>",
            "<article>",
            "<main>",
            "<section>"
          ],
          correct: 2
        }
      ]
    };
  }

  // 2. CSS STYLING
  if (normId.includes("css") || normId.includes("beginner_3") || normTitle.includes("css") || normTitle.includes("style")) {
    return {
      title: title || "Styling with CSS Elements",
      overview: `# Creating Visual Rhythm with CSS\n\nCSS (Cascading Style Sheets) controls how HTML elements look. It manages text sizes, custom gradients, paddings, borders, flex arrays, and complex responsive grid systems.\n\n### The CSS Box Model\nEvery single HTML element is treated as a rectangular box. By configuring the Box Model, you format system boundaries:\n1. **Content**: The text/image itself.\n2. **Padding**: Clear space inside the border (clears background space).\n3. **Border**: The structural outline line itself.\n4. **Margin**: Clear transparent space outside the border.`,
      keyPoints: [
        "📋 Rule selectors target tags directly (e.g. `p`), classes (`.btn`), or custom identifiers (`#sub`).",
        "📦 Correctly configuring Paddings and Margins is key to establishing premium breathing space.",
        "⚡ Flexbox properties allow horizontal and vertical layout alignments on mobile screens."
      ],
      sandboxCode: `<!-- CSS Playground -->
<!DOCTYPE html>
<html>
<head>
  <style>
    .flex-container {
      display: flex;
      justify-content: space-around;
      align-items: center;
      background: #020617;
      padding: 20px;
      border-radius: 8px;
    }
    .badge {
      background: linear-gradient(135deg, #0e7490, #4338ca);
      border: 1px solid #22d3ee;
      padding: 12px 20px;
      color: white;
      font-family: sans-serif;
      font-size: 13px;
      border-radius: 20px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="flex-container">
    <div class="badge">Flex Item A</div>
    <div class="badge">Flex Item B</div>
  </div>
</body>
</html>`,
      sandboxLang: "html",
      expectedOutput: "Two glowing blue micro-pill elements neatly aligned horizontally inside a safe flex row.",
      quiz: [
        {
          q: "Which property controls space outside an element's border?",
          options: [
            "padding",
            "margin",
            "border-spacing",
            "gutter"
          ],
          correct: 1
        },
        {
          q: "How are style classes referenced inside CSS stylesheets?",
          options: [
            "Using a dot (e.g., .my-class)",
            "Using a hash (e.g., #my-class)",
            "Using brackets (e.g., [my-class])",
            "Using quotes (e.g., 'my-class')"
          ],
          correct: 0
        },
        {
          q: "Which flexbox property aligns row elements horizontally?",
          options: [
            "align-items",
            "flex-direction",
            "justify-content",
            "display: row"
          ],
          correct: 2
        }
      ]
    };
  }

  // 3. PYTHON BASICS & CONTEXTS
  if (normId.includes("python") || normId.includes("beginner_4") || normId.includes("intermediate_3") || normTitle.includes("python")) {
    return {
      title: title || "Python Variables and Statements",
      overview: `# Interactive Scripting with Python 3\n\nPython is a modern, clean, and highly human-readable language used for software web servers, artificial intelligence automation, data science scripts, and network analysis.\n\n### Primitive Types in Python\n- **String (\`str\`)**: Enclosed in quotes (e.g. \`"Hello Gombe"\`)\n- **Integer (\`int\`)**: Whole round numbers (e.g. \`42\`)\n- **Float (\`float\`)**: Mathematical decimals (e.g. \`3.14159\`)\n- **Boolean (\`bool\`)**: Conditional binaries: \`True\` or \`False\``,
      keyPoints: [
        "📋 Indentation (whitespace margin) defines blocks of code in Python instead of curly braces.",
        "🐍 Lists store multiple ordered values inside square brackets, e.g. \`[1, 2, 3]\`.",
        "🚀 The \`print()\` function outputs logging diagnostics straight to the screen terminal console."
      ],
      sandboxCode: `# Python Variables and Lists Exercise
# Calculate exam averages and detect passing marks

topic_title = "Intro to Python"
student_attendance = 12
scores = [78, 85, 92, 64, 89]

average = sum(scores) / len(scores)
is_class_passing = average >= 70

print(f"Course Completed: {topic_title}")
print(f"Total Student Submissions: {len(scores)}")
print(f"Average Gombe Score: {average:.1f}%")
print(f"Performance Passed: {is_class_passing}")
`,
      sandboxLang: "python",
      expectedOutput: "Course Completed: Intro to Python\nTotal Student Submissions: 5\nAverage Gombe Score: 81.6%\nPerformance Passed: True",
      quiz: [
        {
          q: "How is a variable declared in Python?",
          options: [
            "let x = 10",
            "var x = 10",
            "x = 10",
            "int x = 10"
          ],
          correct: 2
        },
        {
          q: "What does len([5, 10, 15, 20]) return in Python?",
          options: [
            "20",
            "4",
            "5",
            "0"
          ],
          correct: 1
        },
        {
          q: "Which value corresponds to a valid Python boolean declaration?",
          options: [
            "is_active = true",
            "is_active = True",
            "is_active = 'True'",
            "is_active = 1"
          ],
          correct: 1
        }
      ]
    };
  }

  // 4. JAVASCRIPT & DOM
  if (normId.includes("javascript") || normId.includes("beginner_5") || normId.includes("intermediate_1") || normId.includes("intermediate_2") || normTitle.includes("javascript") || normTitle.includes("dom") || normTitle.includes("logic")) {
    return {
      title: title || "JavaScript Operations & DOM API",
      overview: `# Making Webpages Alive with JavaScript\n\nJavaScript is the primary logic driver behind interactive web experiences. While HTML models raw data and CSS creates colors, JavaScript processes clicks, controls calculators, fetches data APIs, and edits layouts on-the-fly.\n\n### Document Object Model (DOM)\nWhen a page loads, browsers compose an addressable tree mapping of all elements. Using JavaScript, we hook into this tree:\n- Select an element: \`document.getElementById("my-id")\` or \`document.querySelector(".my-class")\`\n- Attach action hooks: \`element.addEventListener("click", callbackFunction)\`\n- Change content: \`element.innerText = "Updated Code!"\``,
      keyPoints: [
        "📋 Always store standard references using `const` and reassignable elements with `let`.",
        "🔍 Clicks represent interactive user actions caught by callback events.",
        "⚡ Adding and pulling CSS class indicators changes page style rules dynamically."
      ],
      sandboxCode: `<!-- Pure JavaScript and DOM Playground -->
<!DOCTYPE html>
<html>
<body>
  <div style="text-align: center; padding: 20px; font-family: sans-serif;">
    <h3 id="display-msg" style="color: #6366f1; transition: 0.3s;">Interactive Level Toggle</h3>
    <p id="score-val" style="font-size: 14px; color: #94a3b8;">Current Score: 0</p>
    <button id="click-btn" style="background-color: #6366f1; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: bold; font-family: inherit;">
      Gain Gombe Score
    </button>
  </div>

  <script>
    let tracker = 0;
    const msg = document.getElementById("display-msg");
    const score = document.getElementById("score-val");
    const btn = document.getElementById("click-btn");

    btn.addEventListener("click", () => {
      tracker += 10;
      score.innerText = "Current Score: " + tracker;
      
      if (tracker >= 50) {
        msg.innerText = "🎉 Gombe Pro Level Active!";
        msg.style.color = "#10b981";
        btn.style.backgroundColor = "#10b981";
      } else {
        msg.innerText = "Keep playing to rank up!";
        msg.style.color = "#f59e0b";
      }
    });
  </script>
</body>
</html>`,
      sandboxLang: "html",
      expectedOutput: "An interactive button tracking score clicks, glowing Green when 50 points are reached.",
      quiz: [
        {
          q: "Which keyword is utilized to declare block-scoped variables that cannot be reassigned?",
          options: [
            "var",
            "let",
            "const",
            "static"
          ],
          correct: 2
        },
        {
          q: "What does the DOM represent in modern web browsers?",
          options: [
            "Document Object Model",
            "Digital Object Marker",
            "Database Oriented Method",
            "Direction Over Machine"
          ],
          correct: 0
        },
        {
          q: "How do you correctly attach a mouse action event listener using JS?",
          options: [
            "box.click(function)",
            "box.addEventListener('click', function)",
            "box.on('push', function)",
            "box.listenTo('tap', function)"
          ],
          correct: 1
        }
      ]
    };
  }

  // 5. CYBER SECURITY (RECON, PORT RECON, BASH TERMINALS, OSINT)
  if (normId.includes("cyber") || normId.includes("recon") || normId.includes("defence") || normId.includes("attack") || normTitle.includes("cyber") || normTitle.includes("port") || normTitle.includes("dns") || normTitle.includes("nmap")) {
    return {
      title: title || "Security Protocols & Linux Terminal Recon",
      overview: `# Cybersecurity Reconnaissance & Network Defense\n\nWelcome to cyber warfare drills. In cybersecurity, professionals use specialized administrative tools to verify network integrity, protect data endpoints, scan firewall ports, and secure authentication keys.\n\n### Key Concepts\n- **Port Scanning**: Identifying active system doors (e.g. SSH on port 22, HTTP on port 80).\n- **Linux Terminal File searches**: Navigating directories and catching strings with commands like \`grep\` and \`find\`.\n- **Cryptography Security**: Utilizing encryption formulas to keep transactions protected.`,
      keyPoints: [
        "📋 Reconnaissance represents evaluating structural doors before designing active defense systems.",
        "📂 Linux core CLI is standard across secure servers and pen-test labs.",
        "🖥️ Nmap scans assist engineers to map server nodes and close dormant terminal ports."
      ],
      sandboxCode: `# Python Port Reconnaissance Scanner Emulator
# Simulate querying standard application ports to evaluate system architecture

def security_audit(node_host, network_ports):
    print(f"🔍 Initializing Security pen-test audit for host: {node_host}")
    print("=========================================================")
    for port, service in network_ports.items():
        # Represent checking offline simulated connections
        is_secured = port in [443, 22]
        status = "CLOSED / SHIELDED" if is_secured else "OPEN (UNPROTECTED)"
        indicator = "🟢 [OK]" if is_secured else "⚠️ [RISK]"
        print(f"Port {port:3d} ({service:8s}): {status:20s} - Status {indicator}")

ports_to_evaluate = {
    21: "FTP",
    22: "SSH",
    80: "HTTP",
    443: "HTTPS",
    8080: "Proxy"
}

security_audit("Gombe-SS-ICT-Cluster-1.local", ports_to_evaluate)
`,
      sandboxLang: "python",
      expectedOutput: "🔍 Initializing Security pen-test audit...\nPort 21 (FTP): OPEN (UNPROTECTED) - Status ⚠️ [RISK]\nPort 22 (SSH): CLOSED / SHIELDED - Status 🟢 [OK]...",
      quiz: [
        {
          q: "Which port is globally standard for insecure HTTP web traffic?",
          options: [
            "Port 443",
            "Port 80",
            "Port 22",
            "Port 21"
          ],
          correct: 1
        },
        {
          q: "What Linux command retrieves specific matching patterns inside flat log files?",
          options: [
            "find",
            "ls",
            "grep",
            "cat"
          ],
          correct: 2
        },
        {
          q: "What is the primary objective of a pen-test 'reconnaissance' phase?",
          options: [
            "Directly deleting target SQL table rows",
            "Gathering host information, active ports, and scope boundaries safely",
            "Encrypting file systems and demanding cash keys",
            "Rebooting cloud network servers"
          ],
          correct: 1
        }
      ]
    };
  }

  // 6. DEFAULT GENERAL FALLBACK LESSON (For any other topic ID)
  return {
    title: title || "General Computer Science Exploration",
    overview: `# Exploring Computer Science at Gombe SS\n\nWelcome to Computer Science course modules. Understanding algorithms, code operations, database relationships, and web interfaces is the ultimate key to developing the next wave of local technology innovations in Uganda.\n\n### Complete Sandbox Practice\nUse our interactive layout sandbox below. Re-write conditions, declare new variables, test output predictions, and run multiple compiler steps safely offline!`,
    keyPoints: [
      "📋 Computer programming is the process of setting instructions for hardware processors.",
      "🐍 Simple Python structures are highly legible and performant for automated servers.",
      "🌐 High-contrast layouts and responsive design models optimize learning on all screen styles."
    ],
    sandboxCode: `# General Programming Exercises
# Master operations, arrays, and lists

class_topic = "${title || "Software Engineering Guidelines"}"
student_count = 14
lessons_passed = True

print(f"Training Active: {class_topic}")
print(f"Local Sandbox System: Online Failover Connection")
print(f"Total Cohort Registrations: {student_count} Ugandan Developers")
`,
    sandboxLang: "python",
    expectedOutput: `Training Active: ${title || "Software Engineering Guidelines"}\nLocal Sandbox System: Online Failover Connection\nTotal Cohort Registrations: 14 Ugandan Developers`,
    quiz: [
      {
        q: "Which element executes logical choices inside software engineering applications?",
        options: [
          "Indention columns",
          "If/Else structures",
          "Variable definitions",
          "Logging outputs"
        ],
        correct: 1
      },
      {
        q: "What is the primary utility of compiler frameworks?",
        options: [
          "Converting high level languages into binary machine structures",
          "Streaming media content directly to mobile devices",
          "Connecting local computers in a wide range network",
          "Saving raw code notes inside spreadsheets"
        ],
        correct: 0
      },
      {
        q: "What design paradigm is standard for styling elements in modern light and dark modes?",
        options: [
          "Pre-rendered SVG layers",
          "Tailwind CSS utility selectors",
          "Manual inline margins",
          "Raw canvas paints"
        ],
        correct: 1
      }
    ]
  };
}

export function getOfflineVibe(title: string = "", desc: string = "") {
  return {
    title: title || "Developer Solution Blueprint",
    difficulty: "Beginner-Intermediate",
    estimatedTime: "2 hours",
    developerPlan: [
      "Prepare UI container layout with standard responsive boxes on-screen",
      "Draft data arrays and key variables to manage inputs cleanly",
      "Attach JS query triggers to catch physical button tap triggers",
      "Code the logic parameters representing passing and failing test thresholds",
      "Introduce elegant Tailwind styles to guarantee visual polish"
    ],
    sandboxCode: `<!-- Pure responsive development blueprint -->
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; background-color: #030712; color: #f3f4f6; padding: 20px; text-align: center; }
    .canvas-card { border: 1px solid #1f2937; padding: 32px; border-radius: 16px; background-color: #0b1329; max-width: 440px; margin: 40px auto; }
    .glow-header { text-transform: uppercase; font-size: 14px; letter-spacing: 0.1em; color: #06b6d4; font-family: monospace; }
    .badge { display: inline-block; background-color: #1e1b4b; border: 1px solid #4f46e5; color: #c084fc; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-family: monospace; }
    .text-input { background: #111827; border: 1px solid #374151; padding: 8px 12px; border-radius: 6px; color: white; margin-top: 15px; width: 80%; }
  </style>
</head>
<body>
  <div class="canvas-card">
    <div class="glow-header">Gombe Vibe Coder System</div>
    <h3 style="margin: 10px 0;">${title || "Personal Portfolio Builder"}</h3>
    <div class="badge">Offline Assistant Blueprint</div>
    <p style="font-size: 13px; color: #9ca3af; line-height: 1.5; margin-top: 15px;">
      Study the custom layout structures. Edit names or text arrays to test HTML DOM bindings!
    </p>
    <input type="text" class="text-input" value="Student Project: ${title || "App Creator"}" readonly>
  </div>
</body>
</html>`,
    sandboxLang: "html",
    conceptHighlights: [
      "Declarative Layout: Creating styled bounding compartments using responsive nested dividers.",
      "Structured Logic Arrays: Storing active elements in standard records to loop with JavaScript map arrays."
    ],
    suggestions: [
      "Customize the gradients inside the CSS tags to yield a luxurious sunset gold appearance.",
      "Introduce window.localStorage keys to keep the student's typed content buffered between tabs."
    ]
  };
}
