export const lessons = [
  {
    id: 'saving-smart-goals-lesson1',
    title: 'Emergency Fund: The Sequel',
    content: `Take your emergency fund from side character to financial superhero! When life throws a plot twist—like your phone diving into a pool—your emergency fund should swoop in to save the day.`,
    xp_reward: 10,
    image: 'https://via.placeholder.com/150',
    imageCaption: 'Your emergency fund: reliable like Wi-Fi, essential like air.',
    sections: [
      {
        title: 'Why It Matters',
        content: `An emergency fund protects you from financial cliffhangers. Think of it as binge-watching your favorite series without fear of subscription cancellations.`
      },
      {
        title: 'Getting Started',
        content: `Consistently set aside a portion of your income—no amount is too small. Like leveling up in your favorite game, steady progress unlocks big wins.`
      }
    ],
    tip: 'Pro tip: Automate your savings—like hitting “subscribe” on financial peace of mind.',
    quiz: {
      question: "When unexpected expenses strike, your emergency fund becomes...?",
      options: [
        { id: '1', text: 'The plot armor protecting your wallet', correct: true },
        { id: '2', text: 'An unreliable friend who ghosts you', correct: false },
        { id: '3', text: 'A magician making money disappear', correct: false },
        { id: '4', text: 'Your hype squad, cheering but doing nothing else', correct: false }
      ]
    }
  },
  {
    id: 'saving-smart-goals-lesson2',
    title: 'Saving Goals: Wishful Thinking, But Make It SMART',
    content: `Saving without goals is like cooking without a recipe—sure, edible, but is it tasty? SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound) turn vague ideas into delicious results.`,
    xp_reward: 10,
    image: 'https://via.placeholder.com/150',
    imageCaption: 'SMART goals: The recipe to financial success!',
    sections: [
      {
        title: 'Why It Matters',
        content: `SMART goals help you keep track and stay motivated—like your fitness app reminding you to move (but for your wallet).`
      },
      {
        title: 'Getting Started',
        content: `Start by clearly defining your goal: “Save ₦100,000 in one year for a laptop” beats “Maybe save some money sometime.” Check your progress regularly—like checking likes on your latest post.`
      }
    ],
    tip: 'Pro tip: Write your SMART goals down—because your brain is great, but it’s also busy remembering song lyrics.',
    quiz: {
      question: "A SMART goal is best described as...?",
      options: [
        { id: '1', text: 'A goal clearer than your phone camera on portrait mode', correct: false },
        { id: '2', text: 'Specific, measurable, achievable, relevant, and time-bound', correct: true },
        { id: '3', text: 'Hoping your savings grow faster than gossip', correct: false },
        { id: '4', text: 'Vague enough to impress your friends', correct: false }
      ]
    }
  },
  {
    id: 'saving-smart-goals-lesson3',
    title: "Savings on Autopilot: Lazy Yet Genius",
    content: `Auto-saving is like having a personal assistant for your money, working silently in the background—minus the awkward small talk. Set it, forget it, and smile when your account grows by itself.`,
    xp_reward: 10,
    image: 'https://via.placeholder.com/150',
    imageCaption: 'Automated saving: because your memory already has too many tabs open.',
    sections: [
      {
        title: 'Why It Matters',
        content: `Auto-saving takes the effort out of saving, freeing your mind to stress about more important things—like what’s for dinner.`
      },
      {
        title: 'Getting Started',
        content: `Schedule automatic transfers directly from your paycheck. It’s the lazy person’s route to wealth—the best kind.`
      }
    ],
    tip: 'Pro tip: Automate your savings today—your future self will thank you by buying better gifts.',
    quiz: {
      question: "What’s the magic behind automated savings?",
      options: [
        { id: '1', text: 'It secretly puts money away so you can’t impulsively spend it', correct: true },
        { id: '2', text: 'It turns your bank into a mysterious wizard', correct: false },
        { id: '3', text: 'It makes money rain from the ceiling', correct: false },
        { id: '4', text: 'It gently shames you for buying coffee every morning', correct: false }
      ]
    }
  }
];

export default { lessons };
