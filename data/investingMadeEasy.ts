import { ModuleLessons } from '@/types/learning';

export const lessons: ModuleLessons = [
  {
    id: "investing-1",
    title: "Introduction to Investing",
    content: "Investing is putting money into financial schemes, shares, property, or commercial ventures with the expectation of achieving a profit.",
    xp_reward: 75,
    quiz: {
      question: "What is the main purpose of investing?",
      options: [
        { id: "a", text: "To spend money", correct: false },
        { id: "b", text: "To achieve profit or returns over time", correct: true },
        { id: "c", text: "To avoid taxes", correct: false },
        { id: "d", text: "To increase debt", correct: false }
      ]
    }
  },
  // Add more lessons as needed
];
