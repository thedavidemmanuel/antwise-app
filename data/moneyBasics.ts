import { ModuleLessons } from '@/types/learning';

export const lessons: ModuleLessons = [
  {
    id: "money-basics-1",
    title: "Understanding Money Fundamentals",
    content: "Money is a medium of exchange that allows people to trade goods and services. Understanding how money works is the first step to financial literacy.",
    xp_reward: 50,
    quiz: {
      question: "What is the primary function of money?",
      options: [
        { id: "a", text: "To make people happy", correct: false },
        { id: "b", text: "To serve as a medium of exchange", correct: true },
        { id: "c", text: "To create debt", correct: false },
        { id: "d", text: "To cause inflation", correct: false }
      ]
    }
  },
  // Add more lessons as needed
];
