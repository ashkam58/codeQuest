export interface UserData {
  xp: number;
  level: number;
  unlockedBadges: string[];
  quizScores: Record<number, number>; // level -> score mapping
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'drag-drop';
  question: string;
  options?: string[]; // for multiple choice
  correctAnswer: string | boolean | string[]; // varies by type
  explanation?: string;
}

export interface KnowledgeCheckConfig {
  levelId: number;
  title: string;
  questions: Question[];
}

export interface Badge {
  id: string;
  name: string;
  icon: string; // Emoji or Lucide icon name
  description: string;
}

// Helper to keep track of available badges
export const BADGE_REGISTRY: Record<string, Badge> = {
  first_algorithm: { id: 'first_algorithm', name: 'First Algorithm', icon: '📝', description: 'Created your first sequence of steps.' },
  bug_hunter: { id: 'bug_hunter', name: 'Bug Hunter', icon: '🐛', description: 'Found and fixed an error in code.' },
  robot_trainer: { id: 'robot_trainer', name: 'Robot Trainer', icon: '🤖', description: 'Guided a computer through a maze.' },
  future_dev: { id: 'future_dev', name: 'Future Developer', icon: '💻', description: 'Explored real-world coding projects.' },
  python_explorer: { id: 'python_explorer', name: 'Python Explorer', icon: '🐍', description: 'Wrote your first Python code.' },
  website_creator: { id: 'website_creator', name: 'Website Creator', icon: '🌐', description: 'Built an HTML profile card.' },
};
