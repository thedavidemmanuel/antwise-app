// C:\Users\David\Desktop\antwise-app\app\(tabs)\(learn)\content\retirementPlanning.ts

export const lessons = [
  {
    // Matches content_id = "retirement-long-term-lesson1" in Supabase
    id: 'retirement-long-term-lesson1',
    title: "Retirement Isn't Just for Old People",
    content: `Start planning early and retire young. If you wait too long, you'll be debugging code at 70 instead of enjoying life's sunsets. Think of retirement as the ultimate long vacation—when you're old enough to relax, you'll want a plan that lets you truly kick back.`,
    xp_reward: 10,
    image: 'https://via.placeholder.com/150',
    imageCaption: 'Plan early—retirement is the longest vacation you’ll ever take!',
    sections: [
      {
        title: 'Why it matters',
        content: `Retirement isn’t simply an age—it's about financial freedom. With a solid plan, you can trade endless workdays for endless leisure, whether that's perfecting your golf swing or finally learning salsa.`
      },
      {
        title: 'Getting started',
        content: `Assess your current savings and future needs. The earlier you begin, the more time your money has to grow—like planting a tree that eventually provides cool shade on a sunny day.`
      }
    ],
    tip: 'Pro tip: Think of retirement planning as your ultimate “get out of work free” card—start early, and let compound interest do the heavy lifting!',
    quiz: {
      question: "What’s the biggest perk of starting retirement planning early?",
      options: [
        { id: '1', text: 'More time to procrastinate on work', correct: false },
        { id: '2', text: 'Allowing your money to grow like a well-watered tree', correct: true },
        { id: '3', text: 'An instant upgrade to luxury living', correct: false },
        { id: '4', text: 'Guaranteeing a stress-free life (if only!)', correct: false }
      ]
    }
  },
  {
    // Matches content_id = "retirement-long-term-lesson2" in Supabase
    id: 'retirement-long-term-lesson2',
    title: "Why You Need Retirement Savings (Now!)",
    content: `Early action is the secret sauce to future comfort. Saving today means more beaches later and fewer spreadsheets in your golden years. Don't wait for a "perfect moment"—it might slip away while you're busy chasing deadlines.`,
    xp_reward: 10,
    image: 'https://via.placeholder.com/150',
    imageCaption: 'Save now for a future full of beach days and relaxed afternoons!',
    sections: [
      {
        title: 'Why it matters',
        content: `Retirement savings give you the freedom to choose how you spend your later years—without being forced to work indefinitely. It's like building a financial cushion that lets you trade stress for leisure.`
      },
      {
        title: 'Getting started',
        content: `Figure out how much you’ll need to live comfortably and start saving as early as possible. Even small, consistent contributions can transform into a treasure chest over time.`
      }
    ],
    tip: 'Pro tip: Every coin saved is a step closer to that tropical retreat—think of it as depositing future happiness.',
    quiz: {
      question: "Why is starting your retirement savings early so clever?",
      options: [
        { id: '1', text: 'Because it forces you to stop spending on coffee (ouch!)', correct: false },
        { id: '2', text: 'It lets compound interest work its magic over time', correct: true },
        { id: '3', text: 'It guarantees you’ll retire tomorrow (if only!)', correct: false },
        { id: '4', text: 'It means you can skip budgeting forever', correct: false }
      ]
    }
  },
  {
    // Matches content_id = "retirement-long-term-lesson3" in Supabase
    id: 'retirement-long-term-lesson3',
    title: 'Compound Interest Magic',
    content: `Compound interest is like having a tiny financial wizard that works while you sleep. It transforms modest savings into a substantial nest egg—if you let it do its thing. Just remember: slow and steady wins the wealth race.`,
    xp_reward: 10,
    image: 'https://via.placeholder.com/150',
    imageCaption: 'Let your money work magic while you enjoy life’s perks!',
    sections: [
      {
        title: 'Why it matters',
        content: `Compound interest can turn even a small amount of savings into a sizeable fund over time. It's the quiet force behind financial growth—working diligently in the background, like a wizard in a quiet study.`
      },
      {
        title: 'Getting started',
        content: `Invest regularly and reinvest your earnings. Patience is key—let compound interest work its magic gradually, like a fine wine that gets better with age.`
      }
    ],
    tip: 'Pro tip: The earlier you start, the more time compound interest has to work its magic—think of it as a financial fairy tale with a happy ending!',
    quiz: {
      question: "How does compound interest pull off its 'magic'?",
      options: [
        { id: '1', text: 'By turning pennies into fortunes overnight (almost like sorcery)', correct: false },
        { id: '2', text: 'By gradually multiplying your savings over time', correct: true },
        { id: '3', text: 'By relying on luck and a sprinkle of fairy dust', correct: false },
        { id: '4', text: 'By working only while you sleep (and dreaming of money)', correct: false }
      ]
    }
  }
];

export default { lessons };
