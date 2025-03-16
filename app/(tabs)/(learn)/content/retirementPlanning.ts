export const lessons = [
    {
      id: 'retirement1',
      title: 'Why Start Retirement Planning Now?',
      content: `Retirement planning might seem unnecessary when retirement is decades away, but starting early is actually the single most powerful advantage you can give yourself.
  
  Time is the critical ingredient in retirement planning. Starting in your 20s or 30s means your money has more time to grow through compound returns, potentially requiring far less out-of-pocket contributions than starting later.
  
  Even small contributions early in your career can outperform much larger contributions started later, thanks to the mathematical power of compounding over decades.`,
      xp_reward: 70,
      image: 'https://via.placeholder.com/150',
      imageCaption: 'Starting retirement planning early gives your money decades to grow',
      sections: [
        {
          title: 'Why it matters',
          content: `The retirement landscape has changed dramatically. Few workers today can count on generous employer pensions that supported previous generations. Social Security/government pensions exist but typically provide only basic support. This makes personal retirement saving not just important but essential for maintaining your standard of living in retirement. Starting early transforms this challenge from overwhelming to manageable.`
        },
        {
          title: 'Getting started',
          content: `Begin by contributing to any employer-sponsored retirement plan, especially if there's matching (free money!). If no employer plan exists, open an individual retirement account. Start with whatever percentage of income is comfortable—even 1-2% is better than nothing—then increase your contribution rate gradually, particularly when you receive raises. Make retirement contributions automatic so they happen before you have a chance to spend the money elsewhere.`
        }
      ],
      tip: `Pro tip: Increase your retirement contribution by 1% every six months until you reach at least 15% of your income. This gradual approach makes the change almost unnoticeable in your day-to-day finances but dramatically improves your retirement outlook.`,
      quiz: {
        question: "Why is starting retirement savings in your 20s or 30s so advantageous?",
        options: [
          { id: '1', text: 'Retirement accounts offer higher interest rates to younger people', correct: false },
          { id: '2', text: 'More time for compound growth to multiply your contributions', correct: true },
          { id: '3', text: 'Younger people qualify for special retirement bonuses', correct: false },
          { id: '4', text: 'The government provides matching funds for early starters', correct: false },
        ],
      },
    },
    {
      id: 'retirement2',
      title: 'Retirement Accounts: Tax-Advantaged Growth',
      content: `Retirement accounts offer powerful tax advantages that can significantly increase your nest egg compared to regular investment accounts.
  
  Traditional retirement accounts offer tax-deductible contributions and tax-deferred growth, meaning you don't pay taxes until withdrawal in retirement. This provides immediate tax benefits and allows your investments to grow without annual tax drag.
  
  Roth-style accounts offer no immediate tax deduction but provide tax-free growth and tax-free withdrawals in retirement, which can be especially valuable if you expect to be in a higher tax bracket later.`,
      xp_reward: 75,
      image: 'https://via.placeholder.com/150',
      imageCaption: 'Tax-advantaged retirement accounts can significantly boost your retirement savings',
      sections: [
        {
          title: 'Why it matters',
          content: `The tax benefits of retirement accounts can add hundreds of thousands to your retirement nest egg compared to taxable investments. These accounts are specifically designed to encourage long-term saving, with both incentives (tax advantages) and disincentives (early withdrawal penalties) that nudge you toward financial security in retirement.`
        },
        {
          title: 'Getting started',
          content: `Familiarize yourself with the retirement accounts available in your country. In many countries, employer-sponsored plans (like 401(k)s in the US, Superannuation in Australia, or Pension Schemes in UK) offer matching contributions that provide immediate 50-100% returns on your contributions. Individual retirement accounts offer more control over investment choices. Many experts recommend contributing enough to get any employer match first, then maxing out individual retirement accounts, then returning to employer plans for additional contributions.`
        }
      ],
      tip: `Pro tip: When deciding between traditional (tax-deferred) and Roth (tax-free growth) retirement accounts, consider your current tax bracket versus your expected retirement tax bracket. If you expect to be in a higher bracket in retirement, Roth accounts may provide greater long-term benefit despite no immediate tax deduction.`,
      quiz: {
        question: "What distinguishes Roth-style retirement accounts from traditional retirement accounts?",
        options: [
          { id: '1', text: 'Roth accounts have higher contribution limits', correct: false },
          { id: '2', text: 'Roth accounts offer tax-free withdrawals in retirement rather than tax-deferred growth', correct: true },
          { id: '3', text: 'Roth accounts are only available to high-income earners', correct: false },
          { id: '4', text: 'Roth accounts don\'t allow early withdrawals under any circumstances', correct: false },
        ],
      },
    },
    {
      id: 'retirement3',
      title: 'The 4% Rule: How Much Do You Need?',
      content: `One of the most common retirement planning questions is "How much do I need to save?" The 4% rule provides a simple but powerful framework for answering this question.
  
  The rule suggests that withdrawing 4% of your retirement portfolio in the first year, then adjusting that amount for inflation in subsequent years, provides a high probability of your money lasting at least 30 years based on historical market performance.
  
  By working backward from this rule, you can estimate your retirement number: multiply your desired annual retirement income by 25 (which is 100 ÷ 4).`,
      xp_reward: 65,
      image: 'https://via.placeholder.com/150',
      imageCaption: 'Understanding safe withdrawal rates helps determine how much you need for retirement',
      sections: [
        {
          title: 'Why it matters',
          content: `Without a target retirement number, saving feels abstract and unmotivating. The 4% rule provides a concrete goal based on your desired lifestyle in retirement. While not perfect (no rule can predict the future with certainty), it has been extensively tested across various historical market conditions and provides a reasonable starting point for retirement planning.`
        },
        {
          title: 'Getting started',
          content: `Calculate your desired annual retirement income—typically 70-80% of your pre-retirement income, though this varies based on your expected lifestyle and expenses in retirement. Multiply this amount by 25 to get your target retirement portfolio. For example, if you want ₦40,000 monthly in retirement (₦480,000 annually), you'd need approximately ₦12 million (₦480,000 × 25). Use this figure to establish whether your current savings rate puts you on track, needs adjustment, or requires significant change.`
        }
      ],
      tip: `Pro tip: The 4% rule is a starting point, not an absolute. Consider using 3.5% for a more conservative approach that increases the probability of your money lasting through retirement, especially if you retire early or expect a long retirement period.`,
      quiz: {
        question: "Using the 4% rule, approximately how much would you need saved to generate ₦600,000 annually in retirement income?",
        options: [
          { id: '1', text: '₦6 million', correct: false },
          { id: '2', text: '₦15 million', correct: true },
          { id: '3', text: '₦24 million', correct: false },
          { id: '4', text: '₦60 million', correct: false },
        ],
      },
    },
  ];