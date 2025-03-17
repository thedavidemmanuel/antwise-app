// C:\Users\David\Desktop\antwise-app\app\(tabs)\(learn)\content\financialPlanning.ts

export const lessons = [
  {
    // Matches content_id = "financial-planning-future-lesson1" in Supabase
    id: 'financial-planning-future-lesson1',
    title: 'Setting Realistic Money Goals',
    content: `Dream big, budget smart, and live happier. Picture your financial goal as a wish list that even Santa would scrutinize—specific, measurable, achievable, relevant, and time-bound. It’s your roadmap from "I wish" to "I did."`,
    xp_reward: 10,
    image: 'https://via.placeholder.com/150',
    imageCaption: 'Set goals as clear as your morning coffee!',
    sections: [
      {
        title: 'Why it matters',
        content: `Realistic money goals transform vague dreams into concrete plans. They’re like a GPS for your finances—steering you away from dead ends and unnecessary detours.`
      },
      {
        title: 'Getting started',
        content: `Use the SMART framework. For example, "Save ₦50,000 in 6 months for a vacation" is far more actionable than "save money someday." Write your goal down and break it into bite-sized milestones.`
      }
    ],
    tip: 'Pro tip: A goal written down is like a treasure map—harder to misplace than a fleeting thought!',
    quiz: {
      question: "Which option best captures a SMART goal that even a savvy elf would approve of?",
      options: [
        { id: '1', text: 'A vague wish to be rich someday', correct: false },
        { id: '2', text: 'Saving ₦50,000 in 6 months for a vacation', correct: true },
        { id: '3', text: 'Hoping money multiplies like rabbits without a plan', correct: false },
        { id: '4', text: 'Wishing for a financial miracle on random days', correct: false }
      ]
    }
  },
  {
    // Matches content_id = "financial-planning-future-lesson2" in Supabase
    id: 'financial-planning-future-lesson2',
    title: 'How to Actually Stick to a Budget',
    content: `A good budget includes Netflix and chill—not just beans and rice. It’s about balancing fun and frugality so you enjoy life without emptying your wallet. Think of your budget as the recipe for a perfectly balanced financial smoothie.`,
    xp_reward: 10,
    image: 'https://via.placeholder.com/150',
    imageCaption: 'A balanced budget is like the perfect recipe—satisfying and sustainable.',
    sections: [
      {
        title: 'Why it matters',
        content: `A well-planned budget keeps overspending in check and ensures you’re saving for tomorrow, all while enjoying today’s little pleasures. It’s the secret sauce behind financial stability.`
      },
      {
        title: 'Getting started',
        content: `Begin by tracking your expenses and categorizing them. Identify areas to trim without sacrificing your fun—maybe swap out one pricey latte for a homemade brew.`
      }
    ],
    tip: 'Pro tip: Use budgeting apps—they’re like having a personal financial coach who never takes a day off (or charges a fee).',
    quiz: {
      question: "Which statement best describes a budget that even your inner comedian would stick to?",
      options: [
        { id: '1', text: 'Spend freely until your bank account sends a warning', correct: false },
        { id: '2', text: 'Track expenses and set realistic limits to enjoy life responsibly', correct: true },
        { id: '3', text: 'Ignore your spending and hope for the best', correct: false },
        { id: '4', text: 'Budget only on days ending with “y”', correct: false }
      ]
    }
  },
  {
    // Matches content_id = "financial-planning-future-lesson3" in Supabase
    id: 'financial-planning-future-lesson3',
    title: 'Building & Protecting Your Wealth',
    content: `Insurance is boring until life happens—then it’s your superhero. Protect your wealth with smart strategies so that when the unexpected strikes, you’re not left high and dry. Think of it as building a safety net that grows as you do.`,
    xp_reward: 10,
    image: 'https://via.placeholder.com/150',
    imageCaption: 'Wealth protection is your financial shield in unpredictable times.',
    sections: [
      {
        title: 'Why it matters',
        content: `A solid wealth protection strategy safeguards you from unforeseen financial blows. It’s the difference between a minor setback and a full-blown catastrophe.`
      },
      {
        title: 'Getting started',
        content: `Review your insurance policies, consider additional coverage if needed, and invest in assets that balance growth with protection. It’s like equipping your financial castle with sturdy walls and a trusty moat.`
      }
    ],
    tip: 'Pro tip: Think of your wealth protection plan as an umbrella—better to have it and not need it than need it and wish you had one!',
    quiz: {
      question: "Which of the following best describes the benefit of a robust wealth protection strategy?",
      options: [
        { id: '1', text: 'It guarantees you’ll never lose money (if only that were true!)', correct: false },
        { id: '2', text: 'It safeguards you from unexpected financial storms', correct: true },
        { id: '3', text: 'It lets you spend without ever checking your balance', correct: false },
        { id: '4', text: 'It replaces the need for a diversified portfolio', correct: false }
      ]
    }
  }
];

export default { lessons };
