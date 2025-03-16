export const lessons = [
    {
      id: 'planning1',
      title: 'Financial Planning Fundamentals',
      content: `Financial planning isn't just for the wealthy—it's for anyone who wants to make intentional choices about their money rather than reacting to whatever happens.
  
  A good financial plan integrates all aspects of your financial life: spending, saving, investing, insurance, taxes, and estate planning. Each area affects the others, which is why considering them together is so powerful.
  
  Unlike budgeting, which focuses on the present, financial planning takes the long view—connecting today's decisions with your future goals and dreams.`,
      xp_reward: 75,
      image: 'https://via.placeholder.com/150',
      imageCaption: 'A comprehensive financial plan provides a roadmap for your financial journey',
      sections: [
        {
          title: 'Why it matters',
          content: `Without a financial plan, you might optimize individual aspects of your finances while missing opportunities for integration. For example, you might save diligently but in tax-inefficient ways, or have the right investments but inadequate protection against risks. A holistic plan ensures all parts of your financial life work together to maximize your resources.`
        },
        {
          title: 'Getting started',
          content: `Begin by defining what financial success means to YOU—not what society or social media suggests. Write down your major life goals with rough timelines. Next, take inventory of your current situation: assets, debts, income, and expenses. The gap between your current reality and your goals becomes the foundation of your financial plan. Focus first on high-impact areas like building emergency savings, eliminating high-interest debt, and capturing any employer retirement matches.`
        }
      ],
      tip: 'Pro tip: Schedule quarterly "money dates" with yourself (and partner if applicable) to review your financial plan and progress. These regular check-ins prevent small issues from becoming major problems and keep your financial goals top of mind.',
      quiz: {
        question: "What distinguishes financial planning from budgeting?",
        options: [
          { id: '1', text: 'Financial planning is only for wealthy people', correct: false },
          { id: '2', text: 'Financial planning focuses on long-term goals while budgeting focuses on day-to-day money management', correct: true },
          { id: '3', text: 'Financial planning requires professional assistance while budgeting can be done yourself', correct: false },
          { id: '4', text: 'Financial planning is a one-time activity while budgeting is ongoing', correct: false },
        ],
      },
    },
    {
      id: 'planning2',
      title: 'Cash Flow Management: Beyond Budgeting',
      content: `Cash flow management is about directing your money with intention rather than wondering where it went at month's end.
  
  Unlike rigid budgeting, effective cash flow management focuses on aligning your spending with your values and goals—ensuring your most important priorities get funded first.
  
  When you manage cash flow effectively, you actually experience more financial freedom because you've already handled the essentials and allocated funds for your true priorities.`,
      xp_reward: 70,
      image: 'https://via.placeholder.com/150',
      imageCaption: 'Managing your cash flow gives you control over your financial future',
      sections: [
        {
          title: 'Why it matters',
          content: `Cash flow is the foundation of all financial goals. Without positive cash flow (more coming in than going out), you can't build emergency savings, invest for the future, or achieve major financial milestones. Mastering this fundamental skill turns money from a source of stress to a tool for creating the life you want.`
        },
        {
          title: 'Getting started',
          content: `Implement a "pay yourself first" system where savings and important goals are funded automatically when income arrives—before discretionary spending. Consider using separate accounts for different purposes: fixed expenses, variable expenses, short-term savings, and long-term investments. This creates clear visual boundaries between money allocated for different purposes, making it easier to make conscious spending decisions.`
        }
      ],
      tip: 'Pro tip: Use the 24-hour rule for non-essential purchases over a certain amount (you define what\'s "significant" for your situation). Wait 24 hours before buying. This breaks the impulse cycle and ensures you still want the item after the initial excitement passes.',
      quiz: {
        question: "What's a key principle of effective cash flow management?",
        options: [
          { id: '1', text: 'Spending should be spontaneous to enjoy life', correct: false },
          { id: '2', text: 'Paying yourself first by automating savings before discretionary spending', correct: true },
          { id: '3', text: 'Credit cards should be avoided completely', correct: false },
          { id: '4', text: 'All expenses should be cut to the absolute minimum', correct: false },
        ],
      },
    },
    {
      id: 'planning3',
      title: 'Protecting Your Financial Future',
      content: `Building wealth is only half the equation—protecting it against unexpected events is equally important.
  
  Insurance is not an expense but a risk management tool that prevents financial disasters from derailing your carefully built plans. The right coverage provides peace of mind and financial security.
  
  From health and life insurance to property and liability protection, each type of insurance addresses specific risks. Understanding what you need—and what you don't—is key to efficient protection.`,
      xp_reward: 65,
      image: 'https://via.placeholder.com/150',
      imageCaption: "Insurance provides a safety net for life's unexpected challenges",
      sections: [
        {
          title: 'Why it matters',
          content: `Without adequate protection, a single unfortunate event—medical emergency, disability, lawsuit, or natural disaster—can wipe out years of diligent saving and investing. Insurance transfers these catastrophic risks to an insurance company in exchange for manageable premium payments, preserving your financial foundation even when life throws curveballs.`
        },
        {
          title: 'Getting started',
          content: `Focus first on high-impact, essential coverage: health insurance to protect against medical costs, auto insurance for vehicle-related liabilities, and appropriate housing insurance (renters or homeowners). If others depend on your income, term life insurance is usually the most cost-effective way to protect them. Aim for insurance that covers catastrophic risks rather than small, manageable expenses—higher deductibles usually mean lower premiums.`
        }
      ],
      tip: "Pro tip: Review your insurance coverage annually or after major life changes (marriage, children, home purchase). Your needs evolve over time, and regular reviews ensure you're neither underinsured against important risks nor paying for coverage you no longer need.",
      quiz: {
        question: "What's a key principle when purchasing insurance?",
        options: [
          { id: '1', text: 'Always choose the lowest deductible available', correct: false },
          { id: '2', text: 'Focus on covering catastrophic risks rather than small expenses', correct: true },
          { id: '3', text: 'Purchase the maximum coverage for everything', correct: false },
          { id: '4', text: 'Insurance is unnecessary if you have savings', correct: false },
        ],
      },
    },
  ];