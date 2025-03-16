import { ModuleLessons } from '@/types/learning';

export const lessons: ModuleLessons = [
  {
    id: "debt-loans-1",
    title: "Types of Loans",
    content: "Different types of loans serve different purposes. Understanding the differences helps you make better borrowing decisions.",
    xp_reward: 55,
    quiz: {
      question: "Which loan type typically has the highest interest rate?",
      options: [
        { id: "a", text: "Mortgage", correct: false },
        { id: "b", text: "Auto loan", correct: false },
        { id: "c", text: "Credit card", correct: true },
        { id: "d", text: "Federal student loan", correct: false }
      ]
    },
    sections: [
      {
        title: "Secured vs Unsecured Loans",
        content: "Secured loans require collateral, while unsecured loans don't. Due to the lower risk for lenders, secured loans typically offer better terms and lower interest rates."
      },
      {
        title: "Common Loan Types",
        content: "Mortgages, auto loans, student loans, personal loans, and credit cards are the most common forms of consumer debt. Each has different terms, rates, and purposes."
      },
      {
        title: "Loan Terms",
        content: "The loan term is the length of time you have to repay the loan. Longer terms mean lower monthly payments but higher total interest paid over the life of the loan."
      },
      {
        title: "Mortgage Loans",
        content: "Mortgages are loans used to purchase homes. They typically have the lowest interest rates and longest terms (15-30 years), allowing for more affordable monthly payments."
      }
    ],
    tip: "Always compare APR (Annual Percentage Rate) rather than just interest rates when shopping for loans. APR includes most fees and gives you a more accurate picture of the total cost."
  },
  // Add more lessons as needed
];
