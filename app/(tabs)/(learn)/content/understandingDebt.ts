export const lessons = [
    {
      id: 'debt1',
      title: 'Good Debt vs. Bad Debt',
      content: `Not all debt is created equal. Some debt can build your future, while other debt can demolish it.
  
  Good debt is an investment that potentially increases your net worth or has future value—like education loans, business loans, or mortgages. Bad debt finances consumption, depreciation, or luxury with no long-term financial benefit.
  
  Understanding this distinction helps you make strategic borrowing decisions rather than viewing all debt as inherently good or bad.`,
      xp_reward: 70,
      image: 'https://via.placeholder.com/150',
      imageCaption: 'Understanding which debts are productive investments is essential for financial health',
      sections: [
        {
          title: 'Why it matters',
          content: `The debt you carry impacts every aspect of your financial life, from your monthly cash flow to your ability to invest for the future. By distinguishing between beneficial debt that builds wealth and destructive debt that drains resources, you can make strategic borrowing decisions that support your financial goals rather than undermining them.`
        },
        {
          title: 'Getting started',
          content: `Evaluate your current debts based on their purpose, interest rate, and whether they're connected to appreciating assets. High-interest consumer debt for depreciating items (like credit card debt for electronics or vacations) typically fits the "bad debt" category. Low-interest loans for appreciating assets or income-generating qualifications may be "good debt" if the terms are reasonable and aligned with your overall financial plan.`
        }
      ],
      tip: 'Pro tip: Before taking on any debt, calculate the total cost including all interest over the life of the loan. Seeing that a ₦400,000 car could cost ₦600,000 with financing might change your perspective on whether the debt is worthwhile.',
      quiz: {
        question: "Which of the following is most likely to be considered 'good debt'?",
        options: [
          { id: '1', text: 'Credit card balance for a vacation', correct: false },
          { id: '2', text: 'A reasonable mortgage for a primary residence', correct: true },
          { id: '3', text: 'Payday loans for everyday expenses', correct: false },
          { id: '4', text: 'Store credit for the latest smartphone', correct: false },
        ],
      },
    },
    {
      id: 'debt2',
      title: 'Understanding Interest: Simple vs. Compound',
      content: `Interest is the price you pay to borrow money. Understanding how it works is crucial for managing debt effectively.
  
  Simple interest is calculated only on the initial amount borrowed (the principal). Compound interest—which most consumer loans use—is calculated on both the principal and the accumulated interest, making the cost grow exponentially over time.
  
  This compounding effect explains why high-interest debt can feel impossible to escape—you're not just paying for what you borrowed, but also for the interest that keeps accumulating on unpaid interest.`,
      xp_reward: 65,
      image: 'https://via.placeholder.com/150',
      imageCaption: 'Compound interest can work against you with debt, unlike with investments',
      sections: [
        {
          title: 'Why it matters',
          content: `The way interest accumulates dramatically affects the total cost of borrowing and how long it takes to repay debt. When you understand interest mechanics, you can prioritize debt repayment more effectively, potentially saving thousands in interest costs. This knowledge also helps you evaluate loan offers beyond just the monthly payment amount.`
        },
        {
          title: 'Getting started',
          content: `For existing debts, find the annual percentage rate (APR) for each. This standardized measure helps you compare different loans. Pay particular attention to how interest compounds—daily, monthly, or annually. For credit cards and other revolving debt, understand how the average daily balance is calculated and how grace periods work. Even small extra payments against principal can significantly reduce the total interest paid over the life of a loan.`
        }
      ],
      tip: 'Pro tip: When making extra payments on loans, explicitly state that the additional amount should be applied to the principal balance, not to future payments. This reduces the balance on which interest is calculated, saving you money and shortening the repayment period.',
      quiz: {
        question: "Why is compound interest particularly problematic with credit card debt?",
        options: [
          { id: '1', text: 'Credit cards always have fixed interest rates', correct: false },
          { id: '2', text: 'Interest is calculated on both principal and accumulated interest', correct: true },
          { id: '3', text: 'Credit card debt never compounds', correct: false },
          { id: '4', text: 'The government regulates credit card interest differently', correct: false },
        ],
      },
    },
    {
      id: 'debt3',
      title: 'Strategic Debt Repayment',
      content: `With multiple debts, having a strategic repayment plan can save you money and accelerate your journey to financial freedom.
  
  Two main approaches are the "avalanche method" (focusing on highest interest rates first) and the "snowball method" (paying off smallest balances first). The avalanche saves more money mathematically, while the snowball provides psychological wins that can maintain motivation.
  
  Beyond the methods, understanding which debts impact your credit score most heavily and which have tax-deductible interest can further refine your repayment strategy.`,
      xp_reward: 75,
      image: 'https://via.placeholder.com/150',
      imageCaption: 'A strategic approach to debt repayment can accelerate your path to financial freedom',
      sections: [
        {
          title: 'Why it matters',
          content: `Without a strategic approach, many people make minimum payments across all debts, which extends repayment timelines and increases interest costs. A focused debt repayment strategy directs your resources where they'll have the greatest impact, whether that's saving money on interest or creating psychological momentum through quick wins.`
        },
        {
          title: 'Getting started',
          content: `List all your debts with their balances, interest rates, and minimum payments. For the avalanche method, after making all minimum payments, direct any extra money to the highest-interest debt first. For the snowball method, target the smallest balance first regardless of interest rate. Whichever method you choose, the key is consistency—maintain your total debt payment amount even as individual debts are paid off, redirecting freed-up money to the next debt on your list.`
        }
      ],
      tip: 'Pro tip: Consider a hybrid approach: start with the snowball method to build momentum by eliminating a small debt or two, then switch to the avalanche method to minimize interest costs on your larger remaining debts.',
      quiz: {
        question: "Which debt repayment strategy typically results in the least total interest paid?",
        options: [
          { id: '1', text: 'Making minimum payments on all debts equally', correct: false },
          { id: '2', text: 'The avalanche method (highest interest rate first)', correct: true },
          { id: '3', text: 'The snowball method (smallest balance first)', correct: false },
          { id: '4', text: 'Paying just a little extra on each debt', correct: false },
        ],
      },
    },
  ];