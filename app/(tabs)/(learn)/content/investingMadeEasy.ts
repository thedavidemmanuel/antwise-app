export const lessons = [
    {
      id: 'investing1',
      title: 'Why Invest? Making Your Money Work For You',
      content: `Saving keeps your money safe, but investing helps it grow. While savings lose value to inflation over time, investments have the potential to outpace inflation and build wealth.
  
  Investing isn't just for the wealthy. Even small amounts, consistently invested, can grow significantly over time thanks to compound returns—what Einstein allegedly called "the eighth wonder of the world."
  
  In today's world, not investing is actually a risky choice because inflation gradually erodes the purchasing power of money sitting in savings accounts.`,
      xp_reward: 70,
      image: 'https://via.placeholder.com/150',
      imageCaption: 'Compound interest turns small investments into significant wealth over time',
      sections: [
        {
          title: 'Why it matters',
          content: `While saving protects your money, investing grows it. With bank interest rates typically below inflation, money in savings accounts actually loses purchasing power over time. Investing gives your money the potential to outpace inflation and build wealth for your future goals, whether that's retirement, education, or major purchases.`
        },
        {
          title: 'Getting started',
          content: `Before investing, ensure you have an emergency fund and have paid off high-interest debt. Then start with low-cost index funds that give you broad market exposure without requiring extensive knowledge. Even ₦5,000 monthly in a diversified investment can grow significantly over decades. Remember: time in the market beats timing the market.`
        }
      ],
      tip: 'Pro tip: The Rule of 72 gives you a quick way to estimate how long it will take your investment to double. Just divide 72 by your expected annual return percentage. For example, at 8% returns, your money would double in approximately 9 years (72 ÷ 8 = 9).',
      quiz: {
        question: "Why is keeping all your money in savings accounts problematic long-term?",
        options: [
          { id: '1', text: 'Banks might go bankrupt', correct: false },
          { id: '2', text: 'Inflation reduces purchasing power', correct: true },
          { id: '3', text: 'Savings accounts have monthly fees', correct: false },
          { id: '4', text: "It's illegal to keep large amounts in savings", correct: false },
        ],
      },
    },
    {
      id: 'investing2',
      title: 'Investment Basics: Assets, Risk and Return',
      content: `Understanding different investment types is like learning the ingredients before cooking. Each asset class—stocks, bonds, real estate, etc.—has different risk and return characteristics.
  
  Risk and return are inseparable in investing. Generally, assets with higher potential returns come with higher risk, while safer investments offer lower returns. Your job is finding the balance that lets you sleep at night while still reaching your goals.
  
  Time is a crucial factor in your investment choices. Money you'll need soon should be in lower-risk investments, while money for distant goals can withstand more volatility for potential higher returns.`,
      xp_reward: 80,
      image: 'https://via.placeholder.com/150',
      imageCaption: 'Understanding the risk-return tradeoff is essential for successful investing',
      sections: [
        {
          title: 'Why it matters',
          content: `Without understanding investment basics, you might take on too much risk and panic-sell during market downturns, or be too conservative and miss growth opportunities. Knowing the characteristics of different investments helps you build a portfolio aligned with your goals, timeline, and risk tolerance. This knowledge is your foundation for all investment decisions.`
        },
        {
          title: 'Getting started',
          content: `Learn about the main asset classes: stocks (ownership in companies), bonds (loans to governments or corporations), cash equivalents (money market accounts, certificates of deposit), and alternative investments like real estate. Start by investing small amounts in well-diversified, low-cost index funds that give you exposure to many stocks at once, reducing the risk of any single company's failure affecting your whole portfolio.`
        }
      ],
      tip: 'Pro tip: Don\'t just consider return; think about risk-adjusted return. An investment that gives 8% with low volatility might be better than one offering 10% but with heart-stopping ups and downs that might cause you to sell at the wrong time.',
      quiz: {
        question: "Which statement about risk and return is generally true?",
        options: [
          { id: '1', text: 'Lower risk always means no return', correct: false },
          { id: '2', text: 'Higher potential returns usually come with higher risk', correct: true },
          { id: '3', text: 'Stocks are always safer than bonds', correct: false },
          { id: '4', text: 'Risk is completely eliminated in diversified portfolios', correct: false },
        ],
      },
    },
    {
      id: 'investing3',
      title: 'The Magic of Compound Returns',
      content: `Compound returns—earning returns on your previous returns—is how small, consistent investments grow into substantial wealth over time.
  
  The key to compound returns is patience and consistency. Starting early with smaller amounts often leads to better results than waiting to invest larger amounts later.
  
  This mathematical phenomenon explains why the gap between those who start investing in their 20s versus 30s is so dramatic—it's not just about the extra decade of contributions, but the extra decade of compounding.`,
      xp_reward: 65,
      image: 'https://via.placeholder.com/150',
      imageCaption: 'The exponential growth of compound returns over time',
      sections: [
        {
          title: 'Why it matters',
          content: `Compounding transforms investing from linear growth (adding to savings) to exponential growth (multiplication). This power means that time is often more important than the amount invested. Understanding compound returns helps you prioritize starting soon—even with small amounts—rather than waiting until you can invest larger sums.`
        },
        {
          title: 'Getting started',
          content: `To maximize compound returns, reinvest all investment earnings rather than withdrawing them. Set up automatic investments to maintain consistency regardless of market conditions or emotional reactions. Remember that the early years may seem slow—the dramatic growth happens in later years as your earnings begin to generate their own substantial earnings.`
        }
      ],
      tip: 'Pro tip: Use the "Rule of 72" to estimate how long it will take your money to double. Divide 72 by your expected annual return percentage. At 7% returns, your money doubles approximately every 10 years; at 10%, it doubles every 7.2 years.',
      quiz: {
        question: "What makes compound returns so powerful for wealth building?",
        options: [
          { id: '1', text: 'It requires no initial investment', correct: false },
          { id: '2', text: 'You earn returns on both your original investment and previous returns', correct: true },
          { id: '3', text: 'It guarantees fixed returns regardless of market conditions', correct: false },
          { id: '4', text: 'It only works with certain types of investments', correct: false },
        ],
      },
    },
  ];