import { ModuleLessons } from '@/types/learning';

export const lessons: ModuleLessons = [
  {
    id: "financial-planning-1",
    title: "Basics of Financial Planning",
    content: "Financial planning is the process of meeting your life goals through proper management of your finances.",
    xp_reward: 60,
    quiz: {
      question: "What is the first step in financial planning?",
      options: [
        { id: "a", text: "Investing in stocks", correct: false },
        { id: "b", text: "Setting financial goals", correct: true },
        { id: "c", text: "Opening a bank account", correct: false },
        { id: "d", text: "Taking out loans", correct: false }
      ]
    }
  },
  // Add more lessons as needed
];
