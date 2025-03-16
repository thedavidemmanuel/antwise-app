import { ModuleLessons } from '@/types/learning';

export const lessons: ModuleLessons = [
  {
    id: "understanding-debt-1",
    title: "What is Debt?",
    content: "Debt is money borrowed by one party from another. Understanding different types of debt and how to manage it is crucial for financial health.",
    xp_reward: 50,
    quiz: {
      question: "Which of the following is generally considered 'good debt'?",
      options: [
        { id: "a", text: "Credit card debt", correct: false },
        { id: "b", text: "Payday loans", correct: false },
        { id: "c", text: "Student loans for education", correct: true },
        { id: "d", text: "Loan for vacation", correct: false }
      ]
    }
  },
  // Add more lessons as needed
];
