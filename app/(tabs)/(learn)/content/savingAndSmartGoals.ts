export const lessons = [
    {
      id: 'saving1',
      title: 'Why Save?',
      content: `Saving isn't just about having money for the future. It's about creating possibilities and protection for yourself today and tomorrow.
  
  Consistent saving is the foundation of financial wellbeing. It reduces stress, increases your options, and gives you the power to say "yes" to opportunities and "no" to situations that aren't right for you.
  
  While investing gets more attention, saving is what makes investing possible. Think of saving as the reliable foundation upon which you build your financial house.`,
      xp_reward: 60,
      image: 'https://via.placeholder.com/150',
      imageCaption: 'Building an emergency fund provides peace of mind',
      sections: [
        {
          title: 'Why it matters',
          content: `Saving isn't just about having money for the future. It's about creating financial security and peace of mind for yourself and your loved ones. When you have savings, you're better prepared for unexpected expenses, which reduces stress and gives you more control over your life.`
        },
        {
          title: 'Getting started',
          content: `Start small and be consistent. Even setting aside a small amount regularly can grow into a substantial emergency fund over time. The key is to make saving a habit.`
        }
      ],
      tip: 'Pro tip: Set up automatic transfers to your savings account right after you get paid. What you don\'t see, you won\'t miss!',
      quiz: {
        question: "How many months of expenses should an emergency fund ideally cover?",
        options: [
          { id: '1', text: '1 month', correct: false },
          { id: '2', text: '3-6 months', correct: true },
          { id: '3', text: '12 months', correct: false },
          { id: '4', text: '24 months', correct: false },
        ],
      },
    },
    {
      id: 'saving2',
      title: 'Setting SMART Financial Goals',
      content: `Dreaming is free, but achieving dreams requires a plan. SMART goals transform vague wishes into achievable realities.
  
  SMART stands for Specific, Measurable, Achievable, Relevant, and Time-bound. Instead of "save more money," a SMART goal would be "save ₦500,000 for a house down payment by December 2023."
  
  When your goals are SMART, you can track progress, celebrate milestones, and make adjustments when needed. You're no longer just hoping—you're planning.`,
      xp_reward: 75,
      image: 'https://via.placeholder.com/150',
      imageCaption: 'SMART goals turn financial dreams into reality',
      sections: [
        {
          title: 'Why it matters',
          content: `Without clear goals, saving becomes an abstract concept with no emotional connection. SMART goals give your saving purpose and direction. You're not just saving "because you should"—you're saving for your dream home, starting a business, or taking that special trip. This emotional connection makes you much more likely to stick with your saving plan.`
        },
        {
          title: 'Getting started',
          content: `Choose one financial goal that matters deeply to you. Apply the SMART framework: make it Specific (exactly what you want), Measurable (how much money needed), Achievable (realistic for your income), Relevant (truly important to you), and Time-bound (with a target date). Break this goal into smaller monthly or weekly targets to make it less overwhelming.`
        }
      ],
      tip: 'Pro tip: Visualize your goal! Keep a picture of the house you\'re saving for, the business you want to start, or the graduation cap representing your education fund. This visual reminder strengthens your commitment.',
      quiz: {
        question: "What does the 'M' in SMART goals stand for?",
        options: [
          { id: '1', text: 'Miraculous', correct: false },
          { id: '2', text: 'Measurable', correct: true },
          { id: '3', text: 'Monetary', correct: false },
          { id: '4', text: 'Meaningful', correct: false },
        ],
      },
    },
    {
      id: 'saving3',
      title: 'Automation: Your Saving Superpower',
      content: `Willpower is finite. Automation removes the need for daily financial discipline by making saving your default.
  
  When saving is automatic, you don't have to remember to save or fight the temptation to spend that money elsewhere. It happens without any mental effort on your part.
  
  Automation isn't just convenient—it's transformative. Research shows that people who automate their savings save more than twice as much as those who don't, even with the same income.`,
      xp_reward: 65,
      image: 'https://via.placeholder.com/150',
      imageCaption: 'Automating your savings is like having a financial assistant working 24/7',
      sections: [
        {
          title: 'Why it matters',
          content: `Relying on willpower alone for saving is like trying to bail out a leaky boat with a teaspoon—eventually, you'll get tired. Automation changes the equation by making saving the default rather than something you have to actively choose each time. This removes the psychological friction that makes consistent saving difficult.`
        },
        {
          title: 'Getting started',
          content: `Set up an automatic transfer from your checking account to a separate savings account the day after you typically get paid. Start with just 5-10% of your income if you're new to saving. Increase this percentage gradually as you adjust your spending habits. Many employers also offer direct deposit to multiple accounts, which can automate saving before you even see the money.`
        }
      ],
      tip: 'Pro tip: Increase your automatic savings amount by 1% every three months. This gradual change will be barely noticeable in your daily life but will significantly impact your savings over time!',
      quiz: {
        question: "What's the best timing for automated transfers to savings?",
        options: [
          { id: '1', text: 'At the end of the month if money is left over', correct: false },
          { id: '2', text: 'Right after you get paid', correct: true },
          { id: '3', text: 'When you feel motivated to save', correct: false },
          { id: '4', text: 'Only during sales to avoid temptation', correct: false },
        ],
      },
    },
  ];