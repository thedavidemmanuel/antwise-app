import { ModuleLessons } from '@/types/learning';

export const lessons: ModuleLessons = [
  {
    id: "saving-goals-1",
    title: "Setting SMART Financial Goals",
    content: "SMART goals are Specific, Measurable, Achievable, Relevant, and Time-bound. Setting SMART financial goals helps you create a clear path to financial success.",
    xp_reward: 50,
    quiz: {
      question: "What does the 'M' in SMART goals stand for?",
      options: [
        { id: "a", text: "Money", correct: false },
        { id: "b", text: "Manageable", correct: false },
        { id: "c", text: "Measurable", correct: true },
        { id: "d", text: "Meaningful", correct: false }
      ]
    }
  },
  // Add more lessons as needed
];
