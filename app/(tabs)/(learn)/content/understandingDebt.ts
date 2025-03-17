export const lessons = [
  {
    // Matches content_id = "understanding-debt-lesson1" in Supabase
    id: 'understanding-debt-lesson1',
    title: 'Good Debt, Bad Debt, Ugly Debt',
    content: `Not all debt is created equal. Some debts are smart investments—like a student loan that sets you up for success—while others are as unattractive as a pair of designer shoes that drain your wallet.`,
    xp_reward: 10,
    image: 'https://via.placeholder.com/150',
    imageCaption: 'Spot the debt that’s worth it—and the ones that aren’t!',
    sections: [
      {
        title: 'Why it matters',
        content: `Knowing the difference between good and bad debt can save you from future financial headaches. It’s like choosing between investing in your future and splurging on something that loses value faster than you can say “retail therapy.”`
      },
      {
        title: 'Getting started',
        content: `Before borrowing, ask yourself: “Will this debt help me build assets or just drain my wallet?” Smart debt can be a stepping stone to financial freedom, while bad debt can weigh you down.`
      }
    ],
    tip: 'Pro tip: Treat debt like a pair of shoes—only invest if they’ll take you far, not just look good on your feet!',
    quiz: {
      question: "Which example best represents 'good debt'?",
      options: [
        { id: '1', text: 'High-interest credit card debt', correct: false },
        { id: '2', text: 'A student loan for a quality education', correct: true },
        { id: '3', text: 'Debt for a luxury sports car', correct: false },
        { id: '4', text: 'Payday loans for everyday expenses', correct: false }
      ]
    }
  },
  {
    // Matches content_id = "understanding-debt-lesson2" in Supabase
    id: 'understanding-debt-lesson2',
    title: 'Debt Repayment Strategies That Work',
    content: `When juggling multiple debts, you need a solid strategy that saves money and builds momentum—like leveling up in your favorite game. The snowball method clears small debts first, giving you quick wins before tackling the big ones.`,
    xp_reward: 10,
    image: 'https://via.placeholder.com/150',
    imageCaption: 'Every small victory helps in your battle against debt!',
    sections: [
      {
        title: 'Why it matters',
        content: `A smart repayment strategy not only cuts down on interest but also frees up cash for things that really matter—like that extra slice of pizza you deserve.`
      },
      {
        title: 'Getting started',
        content: `List all your debts and choose a method: the snowball method for quick wins or the avalanche method to save on interest. Consistency is key—each cleared debt is a step toward financial freedom.`
      }
    ],
    tip: 'Pro tip: Think of debt repayment as a video game—each debt you clear is a level up on your journey to becoming financially unstoppable!',
    quiz: {
      question: "Which repayment strategy builds momentum by targeting the smallest debts first?",
      options: [
        { id: '1', text: 'Avalanche method', correct: false },
        { id: '2', text: 'Snowball method', correct: true },
        { id: '3', text: 'Making minimum payments on all debts', correct: false },
        { id: '4', text: 'Randomly paying off debts', correct: false }
      ]
    }
  },
  {
    // Matches content_id = "understanding-debt-lesson3" in Supabase
    id: 'understanding-debt-lesson3',
    title: 'Your Credit Score: The Adulting Report Card',
    content: `Your credit score is like your high school report card—you might not love it, but you can’t hide it forever. It shows how responsibly you handle your finances and can open doors to better loans and lower interest rates.`,
    xp_reward: 10,
    image: 'https://via.placeholder.com/150',
    imageCaption: 'Your credit score speaks volumes about your financial habits.',
    sections: [
      {
        title: 'Why it matters',
        content: `A good credit score unlocks opportunities like lower interest rates and favorable loan terms. A poor score, however, can lock you out of financial perks and cost you extra money.`
      },
      {
        title: 'Getting started',
        content: `Monitor your credit score regularly, pay bills on time, and keep your debt levels in check. Consider it your financial GPA—improving it takes effort, but the rewards are worth it.`
      }
    ],
    tip: 'Pro tip: Treat your credit score like your GPA. A little extra effort now can pay off big later!',
    quiz: {
      question: "What is a key benefit of having a good credit score?",
      options: [
        { id: '1', text: 'Higher interest rates on loans', correct: false },
        { id: '2', text: 'Lower interest rates and better loan terms', correct: true },
        { id: '3', text: 'Guaranteed loan approval regardless of income', correct: false },
        { id: '4', text: 'Free shopping sprees', correct: false }
      ]
    }
  }
];

export default { lessons };
