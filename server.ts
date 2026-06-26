import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { getOfflineLesson, getOfflineVibe } from "./src/lib/offline-curriculum";

dotenv.config();

const app = express();
const PORT = 3000;

// Setup JSON body parsing with reasonable size limit
app.use(express.json({ limit: "5mb" }));

// Lazy initiation holder to prevent startup crash if API key is not yet set
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required. Please set it via Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// --------------------------------------------------------
// API Core: Handle Dynamic AI Lesson and Vibe-Coding Prompts
// --------------------------------------------------------

app.post("/api/gemini/generate", async (req, res): Promise<any> => {
  const { promptType, topicId, title, desc, customQuery } = req.body;

  if (promptType === "lesson") {
    const contents = `
      You are an elite, patient CS Instructor at Gombe Senior Secondary School ICT Club.
      The student selected Gombe ICT Track topic: [ID: ${topicId}, Title: ${title}, Reference Description: ${desc || "General Course Outline"}].
      
      Generate a highly targeted CS lesson. Since we want an interactive and rich workspace, return a structured training.
      Make sure the sandbox example and code snippets match the topic perfectly:
      - If Python topic: Write runnable, clean school-level Python 3 script.
      - If Web/CSS/HTML topic: Write complete markup with style.
      - If Javascript/React topic: Write useful, standard JavaScript code demonstrating variables/events.
      
      Provide a 3-question Multiple Choice Quiz testing the exact knowledge taught.
    `;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: "A beautifully polished lesson title" },
        overview: { type: Type.STRING, description: "Extensive student instructions, guide, and core rules in markdown format." },
        keyPoints: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "3 key concepts with an illustrative emoji starting each point (e.g. '📋 ...')"
        },
        sandboxCode: { type: Type.STRING, description: "Ready-to-run template code block containing clean comments." },
        sandboxLang: { type: Type.STRING, description: "Language shorthand string: 'html' | 'javascript' | 'python'" },
        expectedOutput: { type: Type.STRING, description: "What the code should yield, print, or show when clicked Run (for terminal or DOM log)." },
        quiz: {
          type: Type.ARRAY,
          description: "Exactly 3 distinct multi-choice questions assessing the generated contents.",
          items: {
            type: Type.OBJECT,
            properties: {
              q: { type: Type.STRING, description: "Question prompt" },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Exactly 4 options to choose from."
              },
              correct: { type: Type.INTEGER, description: "The 0-based index (0, 1, 2, or 3) of the correct answer." }
            },
            required: ["q", "options", "correct"]
          }
        }
      },
      required: ["title", "overview", "keyPoints", "sandboxCode", "sandboxLang", "expectedOutput", "quiz"]
    };

    // Try model chain: gemini-3.5-flash -> gemini-3.1-flash-lite
    const modelsToTry = ["gemini-3.5-flash", "gemini-3.1-flash-lite"];
    let aiClientInstance: GoogleGenAI | null = null;
    try {
      aiClientInstance = getGenAI();
    } catch (e: any) {
      console.warn("Could not load GenAI client (likely missing API key). serving offline fallback.");
    }

    if (aiClientInstance) {
      for (const modelName of modelsToTry) {
        try {
          console.log(`Connecting to Gemini using model: ${modelName}...`);
          const aiResponse = await aiClientInstance.models.generateContent({
            model: modelName,
            contents,
            config: {
              responseMimeType: "application/json",
              responseSchema,
              systemInstruction: "You are a master teacher. Tailor lessons beautifully, explaining technology step-by-step with clear real-world examples.",
            }
          });

          if (aiResponse && aiResponse.text) {
            const parsedData = JSON.parse(aiResponse.text);
            console.log(`Successfully generated lesson using ${modelName}!`);
            return res.json({ success: true, data: parsedData });
          }
        } catch (modelErr: any) {
          console.warn(`Model ${modelName} failed or unavailable:`, modelErr.message || modelErr);
        }
      }
    }

    // Reachable if both models fail, or if API Key is not set yet
    console.info("Using Gombe SS Offline Curriculum Failover Service...");
    const offlineData = getOfflineLesson(topicId, title, desc);
    return res.json({ success: true, data: offlineData, offline: true });
  }

  if (promptType === "vibe-coder") {
    const contents = `
      You are the 'Become a Developer' senior mentor at Gombe SS ICT Club.
      The user wants to code, build, or study a project matching:
      - Title: ${title || "Custom Developer Workspace"}
      - Context/Idea: ${desc || customQuery || "General programming project ideas for absolute beginners."}
      
      Acknowledge the Gombe vibe-coding initiative. Suggest key implementation plans, write a complete sandbox code example (ready-to-run or copyable template files in HTML, CSS/JS, or Python 3), highlight the fundamental computer science concepts behind it, and propose 2 additional ideas or feature expansions.
    `;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: "The refined descriptive title representing the developer idea." },
        difficulty: { type: Type.STRING, description: "Beginner, Intermediate, or Advanced level recommended" },
        estimatedTime: { type: Type.STRING, description: "Rough timeline, e.g. '1 hour', '3 hours'" },
        developerPlan: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "4-5 clear milestone items describing how a programmer would design and write this app."
        },
        sandboxCode: { type: Type.STRING, description: "Complete, copy-pasteable, nicely commented single-file layout or script containing standard practices." },
        sandboxLang: { type: Type.STRING, description: "Shorthand for layout playground rendering ('javascript' | 'html' | 'python')" },
        conceptHighlights: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "2 CS concepts used in this project, e.g., 'Array Iteration' or 'DOM triggers'."
        },
        suggestions: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "2 clever feature prompts the student can introduce to customize this project further."
        }
      },
      required: ["title", "difficulty", "estimatedTime", "developerPlan", "sandboxCode", "sandboxLang", "conceptHighlights", "suggestions"]
    };

    // Try model chain: gemini-3.5-flash -> gemini-3.1-flash-lite
    const modelsToTry = ["gemini-3.5-flash", "gemini-3.1-flash-lite"];
    let aiClientInstance: GoogleGenAI | null = null;
    try {
      aiClientInstance = getGenAI();
    } catch (e: any) {
      console.warn("Could not load GenAI client (likely missing API key). serving offline fallback.");
    }

    if (aiClientInstance) {
      for (const modelName of modelsToTry) {
        try {
          console.log(`Connecting to Gemini using model: ${modelName} for Vibe Coder...`);
          const aiResponse = await aiClientInstance.models.generateContent({
            model: modelName,
            contents,
            config: {
              responseMimeType: "application/json",
              responseSchema,
              systemInstruction: "You inspire kids in Gombe to become world-class developers. Keep code layouts beautifully formatted, extremely clean, highly legible, and properly documented.",
            }
          });

          if (aiResponse && aiResponse.text) {
            const parsedData = JSON.parse(aiResponse.text);
            console.log(`Successfully generated code helper using ${modelName}!`);
            return res.json({ success: true, data: parsedData });
          }
        } catch (modelErr: any) {
          console.warn(`Model ${modelName} failed or unavailable for Vibe Coder:`, modelErr.message || modelErr);
        }
      }
    }

    // Reachable if both models fail, or if API Key is not set yet
    console.info("Using Gombe SS Offline Vibe Failover Service...");
    const offlineData = getOfflineVibe(title || customQuery, desc);
    return res.json({ success: true, data: offlineData, offline: true });
  }

  if (promptType === "ask-dev") {
    const { question, currentCode } = req.body;
    const contents = `
      You are an elite, practical Senior Software Architect and empathetic coder acting as the 'AI Senior Developer' at Gombe Senior Secondary School ICT Club in Uganda.
      A student is working on a project or task and has gotten stuck. They are asking you for clear, helpful advice.
      
      Student's question: "${question}"
      Current file code (if provided):
      \`\`\`
      ${currentCode || "(No code editor snippet attached)"}
      \`\`\`

      Provide a response with:
      - A detailed but student-friendly explanation of why they are facing the issue, or how the technology works.
      - 3 clear, consecutive milestones/steps the student should follow to build or fix it.
      - An optimized, fully-commented code snippet solving the issue.
      - A warm, motivating supportive signoff advice from the Senior Dev Mentor.
    `;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        explanation: { type: Type.STRING, description: "Detailed, friendly walkthrough explaining the concept or fix." },
        milestones: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "3 simple steps the student should follow."
        },
        fixedCode: { type: Type.STRING, description: "A beautifully formatted, fully commented code segment resolving the block." },
        seniorAdvice: { type: Type.STRING, description: "A warm, motivating signoff advice from the Senior Dev Mentor." }
      },
      required: ["explanation", "milestones", "fixedCode", "seniorAdvice"]
    };

    const modelsToTry = ["gemini-3.5-flash", "gemini-3.1-flash-lite"];
    let aiClientInstance: GoogleGenAI | null = null;
    try {
      aiClientInstance = getGenAI();
    } catch (e: any) {
      console.warn("Could not load GenAI client (likely missing API key). serving offline fallback.");
    }

    if (aiClientInstance) {
      for (const modelName of modelsToTry) {
        try {
          console.log(`Connecting to Gemini using model: ${modelName} for AI Senior Dev...`);
          const aiResponse = await aiClientInstance.models.generateContent({
            model: modelName,
            contents,
            config: {
              responseMimeType: "application/json",
              responseSchema,
              systemInstruction: "You are the Senior Developer Mentor for the Gombe SS ICT Club. Inspire kids to write brilliant code, solve compile blocks, and love software building.",
            }
          });

          if (aiResponse && aiResponse.text) {
            const parsedData = JSON.parse(aiResponse.text);
            console.log(`Successfully generated AI Senior Dev response using ${modelName}!`);
            return res.json({ success: true, data: parsedData });
          }
        } catch (modelErr: any) {
          console.warn(`Model ${modelName} failed/unavailable for AI Senior Dev:`, modelErr.message || modelErr);
        }
      }
    }

    // Dynamic, interactive Offline Fallback if Gemini key is unset or network error
    console.info("Using Gombe SS Offline AI Senior Developer Failover response...");
    const sampleText = question.toLowerCase();
    let computedExplanation = "A dynamic offline response from Gombe ICT local servers. You asked about coding; our system detects high network grid demand, but we can still suggest the best path!";
    let computedCode = `// Gombe Offline Compiler Fallback
function solveProblem() {
    console.log("Analyzing: ${question.replace(/"/g, "'")}");
    const advice = "Check for missing semicolons, correct brackets, and match tag definitions!";
    return advice;
}`;
    let computedSteps = [
      "Review your declarations, ensure all HTML tag pairs are properly closed.",
      "Check your variables or state bindings in React to avoid infinite render loops.",
      "Run the compiler using localhost offline emulator sandbox."
    ];

    if (sampleText.includes("loop") || sampleText.includes("for") || sampleText.includes("while")) {
      computedExplanation = "Loops repeat instructions while a state evaluates to true. Ensure you increment or dynamically update the counter so you do not freeze the web canvas!";
      computedSteps = [
        "Declare a control variable such as 'i' or 'counter'.",
        "Set an escape/falsity condition (e.g. i < 10).",
        "Increment the controller (i++) at the end of the block."
      ];
      computedCode = `// Python loop example
count = 1
while count <= 5:
    print(f"Kigwa code iteration: {count}")
    count += 1`;
    } else if (sampleText.includes("react") || sampleText.includes("usestate") || sampleText.includes("hook")) {
      computedExplanation = "React uses standard 'useState' Hooks to handle reactive browser memory. Updates to state schedule a redraw of your components.";
      computedSteps = [
        "Import { useState } from 'react' at the top of your module.",
        "Declare the read-only variable and the dispatch setter: [state, setState].",
        "Always invoke the setter with a primitive value or reference."
      ];
      computedCode = `import React, { useState } from 'react';

export function Counter() {
  const [points, setPoints] = useState(120);
  return (
    <button onClick={() => setPoints(prev => prev + 15)}>
      Gain Gombe Points: {points}
    </button>
  );
}`;
    }

    return res.json({
      success: true,
      data: {
        explanation: computedExplanation,
        milestones: computedSteps,
        fixedCode: computedCode,
        seniorAdvice: "✨ Keep striving! Even offline, Gombe SS Uganda developers build outstanding solutions. Re-run your tests to confirm!"
      },
      offline: true
    });
  }

  // Default error trigger if promptType is wrong
  return res.status(400).json({ success: false, error: "Invalid action prompt type requested." });
});

// --------------------------------------------------------
// Production vs Development Asset Setup (Vite Middleware)
// --------------------------------------------------------

async function startApp() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Gombe SS ICT server online at: http://localhost:${PORT}`);
  });
}

startApp().catch((err) => {
  console.error("Failed to start Gombe SS ICT server:", err);
});
