export const lessons = [
    {
      id: 'loans1',
      title: 'Navigating Personal Loans',
      content: `Personal loans can be powerful financial tools when used strategically—or expensive traps when misunderstood.
  
  Unlike specific loans for houses or cars, personal loans can be used for almost anything: debt consolidation, home improvements, major purchases, or emergency expenses. This flexibility makes them versatile but requires careful consideration.
  
  Understanding the various types—secured vs. unsecured, fixed vs. variable rate—and their implications on terms, costs, and risks is essential before signing the dotted line.`,
      xp_reward: 70,
      image: 'https://via.placeholder.com/150',
      imageCaption: 'Personal loans can help consolidate higher-interest debt when used wisely',
      sections: [
        {
          title: 'Why it matters',
          content: `Personal loans often fill gaps other financing can't address. They can provide lower interest rates than credit cards for major expenses, help consolidate high-interest debt, or cover emergency costs when savings aren't sufficient. However, without understanding terms, fees, and repayment obligations, they can create a cycle of debt that's difficult to escape.`
        },
        {
          title: 'Getting started',
          content: `Before applying, check your credit score—it significantly impacts the interest rates you'll be offered. Shop around with multiple lenders, including traditional banks, credit unions, and online lenders. Compare not just interest rates but also origination fees, prepayment penalties, and repayment terms. Calculate the total cost of the loan over its lifetime, not just the monthly payment. Have a clear repayment plan before accepting any loan offer.`
        }
      ],
      tip: `Pro tip: If using a personal loan for debt consolidation, avoid accumulating new debt on the paid-off credit cards. Some people fall into a cycle of consolidating, rebuilding credit card debt, then consolidating again—which can lead to deeper financial problems.`,
      quiz: {
        question: `What factor typically has the biggest impact on personal loan interest rates?`,
        options: [
          { id: '1', text: `Your employer`, correct: false },
          { id: '2', text: `Your credit score`, correct: true },
          { id: '3', text: `The day of the week you apply`, correct: false },
          { id: '4', text: `The loan amount`, correct: false },
        ],
      },
    },
    {
      id: 'loans2',
      title: 'Car Loans: Beyond the Monthly Payment',
      content: `Car financing decisions can impact your financial health for years. Understanding the full picture beyond just the monthly payment is crucial.
  
  Many car buyers focus solely on whether they can afford the monthly payment, missing how factors like loan term, interest rate, down payment, and depreciation affect the total cost of ownership.
  
  The car-buying process is designed to obscure the true cost, with salespeople often steering conversations toward monthly payments rather than purchase price, interest costs, or add-ons.`,
      xp_reward: 75,
      image: 'https://via.placeholder.com/150',
      imageCaption: 'Understanding all aspects of auto financing can save you thousands over the life of the loan',
      sections: [
        {
          title: 'Why it matters',
          content: `Transportation is typically one of your largest budget categories, and poor car financing decisions can drain resources from other important financial goals. Unlike homes, cars are depreciating assets—they lose value over time—making it especially important to minimize financing costs. Being an informed borrower helps you avoid common pitfalls like negative equity (owing more than the car is worth) and excessive interest costs.`
        },
        {
          title: 'Getting started',
          content: `Secure your own financing before visiting dealerships by getting pre-approved through banks or credit unions. This gives you leverage in negotiations and protects you from dealer financing markup. Aim for a loan term of 48 months or less; longer terms may have lower monthly payments but result in higher total costs and potential negative equity. Make at least a 20% down payment if possible to offset initial depreciation. Focus negotiations on the total purchase price, not monthly payments.`
        }
      ],
      tip: `Pro tip: Use the "20/4/10" rule as a guideline: at least 20% down payment, loan term no longer than 4 years, and total transportation costs (including loan payment, insurance, fuel, maintenance) no more than 10% of your gross income.`,
      quiz: {
        question: `Why should you generally avoid 72-month or longer car loans?`,
        options: [
          { id: '1', text: `They're illegal in most states`, correct: false },
          { id: '2', text: `They often lead to negative equity and higher total costs`, correct: true },
          { id: '3', text: `Cars don't typically last that long`, correct: false },
          { id: '4', text: `Banks won't offer loans of that length`, correct: false },
        ],
      },
    },
    {
      id: 'loans3',
      title: 'Mortgage Fundamentals',
      content: `A mortgage is likely the largest debt you'll ever take on. Understanding the fundamentals helps you make choices aligned with your long-term financial goals.
  
  Mortgages come in various types—fixed-rate vs. adjustable, conventional vs. government-backed, different term lengths—each with implications for your monthly payment, total interest paid, and overall financial flexibility.
  
  Your mortgage affects not just your housing costs but also your ability to save, invest, and pursue other financial goals for decades to come.`,
      xp_reward: 80,
      image: 'https://via.placeholder.com/150',
      imageCaption: 'Understanding mortgage options is crucial for making your largest financial decision',
      sections: [
        {
          title: 'Why it matters',
          content: `Your mortgage choice affects your financial life for decades. Beyond the obvious impact on monthly housing costs, it influences your ability to save for other goals, your flexibility during financial hardships, and your net worth development. The difference between an optimal and suboptimal mortgage choice can amount to hundreds of thousands over a lifetime.`
        },
        {
          title: 'Getting started',
          content: `Before house shopping, get pre-approved to understand your budget. Compare different loan types, especially fixed vs. adjustable rates. Fixed rates provide payment stability, while adjustable rates might offer lower initial payments but carry future uncertainty. Consider the total cost over the life of the loan, not just the monthly payment. Understand all costs involved: down payment, closing costs, private mortgage insurance, property taxes, and homeowners insurance.`
        }
      ],
      tip: `Pro tip: Don't automatically accept the longest term available. While a 30-year mortgage offers lower monthly payments, a 15-year mortgage typically comes with lower interest rates and builds equity much faster. If you can afford the higher payments, you'll save significantly on interest and own your home free and clear much sooner.`,
      quiz: {
        question: `What's typically an advantage of a 15-year mortgage compared to a 30-year mortgage?`,
        options: [
          { id: '1', text: `Lower monthly payments`, correct: false },
          { id: '2', text: `Lower interest rate and less total interest paid`, correct: true },
          { id: '3', text: `Larger house purchase possible`, correct: false },
          { id: '4', text: `No down payment required`, correct: false },
        ],
      },
    },
  ];