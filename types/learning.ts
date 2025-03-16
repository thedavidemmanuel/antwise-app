// types/learning.ts

// Types for lesson content
export interface LessonSection {
  title: string;
  content: string;
}

export interface QuickCheckOption {
  id: string;
  text: string;
  correct?: boolean;
}

export interface QuickCheck {
  question: string;
  options: QuickCheckOption[];
}

// Alias for compatibility with existing code
export type Quiz = QuickCheck;
export type QuizOption = QuickCheckOption;

export interface LessonContent {
  id: string;
  title: string;
  content: string;
  xp_reward: number;
  image?: string;
  imageCaption?: string;
  sections?: LessonSection[];
  tip?: string;
  quiz?: QuickCheck;
}

// Module map type
export type ModuleId = 'money-basics' | 'saving-goals' | 'investing' | 
                      'financial-planning' | 'understanding-debt' | 
                      'debt-loans' | 'retirement' | 'crypto';

// Type for all lessons content map
export type LessonsContentMap = {
  [key in ModuleId]: LessonContent[];
};

export type ModuleLessons = LessonContent[];