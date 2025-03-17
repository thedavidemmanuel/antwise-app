// C:\Users\David\Desktop\antwise-app\app\(tabs)\(learn)\content\debtAndLoans.ts

export const lessons = [
  {
    // Matches content_id = "debt-and-loans-lesson1" in Supabase
    id: 'debt-and-loans-lesson1',
    title: 'Loan Basics: Friend or Frenemy?',
    content: `Loans can help you buy a car. Too many loans can make you sell that car.`,
    xp_reward: 10,
    image: 'https://via.placeholder.com/150',
    imageCaption: 'Is your loan driving you forward or driving you crazy?',
    sections: [
      {
        title: 'Why it matters',
        content: `Borrowing money can jumpstart big goals—like buying a home or a car—but debt can also become a clingy roommate you can’t evict. Knowing when to say “Yes” to loans (and when to say “Nope!”) keeps you financially sane.`
      },
      {
        title: 'Getting started',
        content: `Ask yourself: “Will this loan help me earn or save money in the long run?” If the answer is “Umm… not really,” it might be time to rethink. Compare loan terms, interest rates, and fees before signing anything—your wallet will thank you.`
      }
    ],
    tip: 'Pro tip: Picture every loan like a business partner. Does it help you grow, or is it just mooching off your wallet?',
    quiz: {
      question: "Which statement best describes a 'good' loan?",
      options: [
        { id: '1', text: 'One that funds your daily latte habit', correct: false },
        { id: '2', text: 'One that helps you invest in an appreciating asset', correct: true },
        { id: '3', text: 'Any loan with a 0% teaser rate forever', correct: false },
        { id: '4', text: 'A loan you can’t pay back until next decade', correct: false }
      ]
    }
  },
  {
    // Matches content_id = "debt-and-loans-lesson2" in Supabase
    id: 'debt-and-loans-lesson2',
    title: "Credit Cards Aren't Evil (Usually)",
    content: `A credit card is like spicy pepper: tasty in moderation, painful in excess.`,
    xp_reward: 10,
    image: 'https://via.placeholder.com/150',
    imageCaption: 'Use credit cards wisely—avoid the financial heartburn!',
    sections: [
      {
        title: 'Why it matters',
        content: `Credit cards can be your friend: earn rewards, build credit, and handle emergencies. But misuse them, and you’ll be stuck paying high interest on last month’s pizza.`
      },
      {
        title: 'Getting started',
        content: `Pay off your balance in full each month. If you can’t, aim to pay more than the minimum to tame that fiery interest. Keep an eye on your credit limit to avoid nasty fees or a lowered credit score.`
      }
    ],
    tip: 'Pro tip: Spice is good in small doses. So are credit cards. Don’t sprinkle them on every single purchase!',
    quiz: {
      question: "How can you avoid credit card 'burn'?",
      options: [
        { id: '1', text: 'Always carry a high balance', correct: false },
        { id: '2', text: 'Make only the minimum payment', correct: false },
        { id: '3', text: 'Pay off your balance in full each month', correct: true },
        { id: '4', text: 'Collect as many cards as possible', correct: false }
      ]
    }
  },
  {
    // Matches content_id = "debt-and-loans-lesson3" in Supabase
    id: 'debt-and-loans-lesson3',
    title: 'Loan Interest: The Silent Wallet Killer',
    content: `Interest doubles debt while you blink—learn to blink less.`,
    xp_reward: 10,
    image: 'https://via.placeholder.com/150',
    imageCaption: 'High interest can sneak up on your finances if you’re not careful.',
    sections: [
      {
        title: 'Why it matters',
        content: `Interest is like a ninja quietly multiplying what you owe. One day it’s a small loan, the next day it’s a giant tab you didn’t see coming. Understanding interest rates helps you slash debt faster.`
      },
      {
        title: 'Getting started',
        content: `Check your loan’s APR (Annual Percentage Rate). Compare lenders. If the interest rate is sky-high, consider refinancing or consolidating. Every extra payment toward principal is like a stealth attack on your debt.`
      }
    ],
    tip: 'Pro tip: Treat high-interest debt like a villain—defeat it first before it drains your wallet’s life force.',
    quiz: {
      question: "What's a good strategy for fighting off high interest?",
      options: [
        { id: '1', text: 'Ignore it until it magically disappears', correct: false },
        { id: '2', text: 'Pay only the minimum forever', correct: false },
        { id: '3', text: 'Refinance or pay extra on the principal', correct: true },
        { id: '4', text: 'Close your eyes and hope for the best', correct: false }
      ]
    }
  }
];

export default { lessons };
