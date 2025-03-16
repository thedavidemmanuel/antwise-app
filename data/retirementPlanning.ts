import { ModuleLessons } from '@/types/learning';

export const lessons: ModuleLessons = [
  {
    id: "retirement-1",
    title: "Planning for Retirement",
    content: "Retirement planning involves determining retirement income goals and the actions needed to achieve those goals.",
    xp_reward: 70,
    quiz: {
      question: "When is the best time to start saving for retirement?",
      options: [
        { id: "a", text: "In your 40s", correct: false },
        { id: "b", text: "Right before retirement", correct: false },
        { id: "c", text: "As early as possible", correct: true },
        { id: "d", text: "Only when you have extra money", correct: false }
      ]
    },
    sections: [
      {
        title: "The Power of Compound Interest",
        content: "Starting to save early allows your money more time to grow. Even small amounts invested in your 20s can outperform larger amounts invested in your 40s due to compound interest."
      },
      {
        title: "Retirement Accounts",
        content: "401(k)s, IRAs, and Roth IRAs are special accounts designed for retirement savings. They offer tax advantages to encourage long-term saving."
      },
      {
        title: "Social Security",
        content: "Social Security provides a base level of retirement income, but it was never meant to be your only source of retirement funds. Plan to supplement it with personal savings."
      },
      {
        title: "Withdrawal Strategies",
        content: "The 4% rule suggests withdrawing no more than 4% of your retirement savings annually to make your money last. Consider working with a financial advisor to develop a withdrawal strategy that meets your specific needs."
      }
    ],
    tip: "Many retirement accounts allow early withdrawals under certain circumstances, but usually with penalties. It's generally best to leave the money untouched until retirement age."
  },
  // Add more lessons as needed
];
