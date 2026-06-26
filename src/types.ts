export interface LessonNote {
  title: string;
  content: string[];
}

export interface QuizQuestion {
  q: string;
  options: string[];
  correct: number;
}

export interface VibeIdea {
  id: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: "Web App" | "Game" | "Utility" | "Automation";
  estimatedTime: string;
  tags: string[];
}

export interface DynamicLesson {
  id: string;
  title: string;
  category: "coding" | "cyber" | "vibe";
  difficulty: string;
  overview: string;
  keyPoints: string[];
  sandboxCode?: string;
  sandboxLang?: string;
  expectedOutput?: string;
  quiz?: QuizQuestion[];
}

export interface UserStats {
  points: number;
  streak: number;
  unlockedLevel: string; // "beginner" | "intermediate" | "pro"
  completedTopics: string[]; // list of topic ids
}
