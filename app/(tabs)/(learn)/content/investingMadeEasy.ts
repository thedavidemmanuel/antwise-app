// C:\Users\David\Desktop\antwise-app\app\(tabs)\(learn)\content\investingMadeEasy.ts

export const lessons = [
  {
    // Matches content_id = "investing-made-easy-lesson1" in Supabase
    id: 'investing-made-easy-lesson1',
    title: "Stocks, Explained Like You’re Five",
    content: `Buying stock is like grabbing a slice of pizza—you get paid when it tastes good!`,
    xp_reward: 10,
    image: 'https://via.placeholder.com/150',
    imageCaption: 'Slice of the pie = slice of the profits!',
    sections: [
      {
        title: 'Why it matters',
        content: `Stocks represent partial ownership of a company. When the company thrives, your slice of pizza (stock) grows in value—and you might even get dividends (a yummy extra topping).`
      },
      {
        title: 'Getting started',
        content: `Look for reputable companies you believe in. Consider diversification (like ordering different pizza toppings) to spread out risk.`
      }
    ],
    tip: 'Pro tip: Think long-term! Day trading can be like flipping pizzas in midair—risky and prone to burns.',
    quiz: {
      question: "What does it mean to buy a stock?",
      options: [
        { id: '1', text: 'You loan money to the company temporarily', correct: false },
        { id: '2', text: 'You get partial ownership in the company', correct: true },
        { id: '3', text: 'You must work for that company', correct: false },
        { id: '4', text: 'You receive free pizza for life', correct: false }
      ]
    }
  },
  {
    // Matches content_id = "investing-made-easy-lesson2" in Supabase
    id: 'investing-made-easy-lesson2',
    title: "What's a Mutual Fund Anyway?",
    content: `Mutual funds are group projects where everyone passes. Investing in groups means less scary, more money!`,
    xp_reward: 10,
    image: 'https://via.placeholder.com/150',
    imageCaption: 'Everyone chips in, everyone reaps the rewards!',
    sections: [
      {
        title: 'Why it matters',
        content: `By pooling your money with others, you can invest in a diverse set of stocks or bonds. This lowers your risk compared to betting all your money on a single company.`
      },
      {
        title: 'Getting started',
        content: `Research mutual funds that fit your goals—like growth, income, or a balanced mix. Check fees and performance history, but remember that past results don’t guarantee future returns.`
      }
    ],
    tip: 'Pro tip: Think of mutual funds like a group buffet—you pay once, get a variety, and reduce the risk of a single bad dish.',
    quiz: {
      question: "What's the main advantage of a mutual fund?",
      options: [
        { id: '1', text: 'It guarantees profit every year', correct: false },
        { id: '2', text: 'You only invest in one company at a time', correct: false },
        { id: '3', text: 'It spreads your money across multiple investments', correct: true },
        { id: '4', text: 'It’s managed by a fortune-teller', correct: false }
      ]
    }
  },
  {
    // Matches content_id = "investing-made-easy-lesson3" in Supabase
    id: 'investing-made-easy-lesson3',
    title: 'Crypto: Risky or Rewarding?',
    content: `Crypto can make you rich—or just give you heartburn. Let’s choose wisely.`,
    xp_reward: 10,
    image: 'https://via.placeholder.com/150',
    imageCaption: 'Crypto might be the wild west of finance!',
    sections: [
      {
        title: 'Why it matters',
        content: `Cryptocurrencies are volatile. Prices can skyrocket or plummet in hours. Understand the risks before diving in.`
      },
      {
        title: 'Getting started',
        content: `Use reputable exchanges and secure your digital wallet. Never invest more than you’re willing to lose—like a trip to the casino, but with more tech jargon.`
      }
    ],
    tip: 'Pro tip: If someone promises guaranteed crypto returns, run. Guaranteed profits + crypto = suspicious!',
    quiz: {
      question: "Why is crypto considered high risk?",
      options: [
        { id: '1', text: 'It’s regulated by every country', correct: false },
        { id: '2', text: 'Prices can swing dramatically in a short time', correct: true },
        { id: '3', text: 'It’s always worth zero', correct: false },
        { id: '4', text: 'It’s the same as a traditional savings account', correct: false }
      ]
    }
  }
];

export default { lessons };
