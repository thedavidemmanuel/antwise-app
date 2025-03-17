export const lessons = [
    {
      id: 'money-basics-lesson1',
      title: 'Where Does All My Money Go?',
      content: `Do you ever reach the end of the month wondering how your salary disappeared so quickly? Understanding where your money goes is the first step to financial control.
  
  When you track your spending, patterns emerge. That daily coffee adds up to thousands monthly. Those "small" online shopping sprees become a significant chunk of your income.
  
  Money tracking isn't about restriction—it's about awareness. When you know where your money goes, you can make intentional choices rather than wondering where it all went.`,
      xp_reward: 50,
      image: 'https://via.placeholder.com/150',
      imageCaption: 'Tracking your expenses leads to financial clarity',
      sections: [
        {
          title: 'Why it matters',
          content: `Tracking your spending isn't just about numbers—it's about taking control of your financial life. When you know exactly where your money goes, you can make intentional decisions about what truly matters to you. This awareness is the foundation of all financial progress.`
        },
        {
          title: 'Getting started',
          content: `Start by recording every expense for just one week. Use a notebook, spreadsheet, or one of many free expense tracking apps. Categorize spending into essentials (rent, food, transportation) and non-essentials (entertainment, dining out). Look for patterns and areas where you might be leaking money unnecessarily.`
        }
      ],
      tip: 'Pro tip: Take pictures of receipts with your phone to make expense tracking easier. Many apps can even extract the data automatically!',
      quiz: {
        question: "What's the first step to controlling your spending?",
        options: [
          { id: '1', text: 'Ignore your expenses', correct: false },
          { id: '2', text: 'Track your spending', correct: true },
          { id: '3', text: 'Spend first, save later', correct: false },
          { id: '4', text: 'Only buy things on sale', correct: false },
        ],
      },
    },
    {
      id: 'money-basics-lesson2',
      title: 'Budgeting for Humans',
      content: `A budget isn't a financial straitjacket—it's your personalized spending plan that ensures you have enough for what truly matters.
  
  Traditional budgeting often fails because it focuses too much on restriction. Modern budgeting is about allocation: making sure your money goes where you want it to go.
  
  The right budget leaves room for joy while keeping you on track financially. It's not about never buying shawarma—it's about knowing how many you can buy while still paying rent.`,
      xp_reward: 75,
      image: 'https://via.placeholder.com/150',
      imageCaption: 'A simple budget helps you take control of your finances',
      sections: [
        {
          title: 'Why it matters',
          content: `Without a budget, your money tends to vanish before covering all your needs. A budget ensures your essentials are covered first, saving is automatic, and discretionary spending is guilt-free because you've planned for it. It transforms money from a source of anxiety to a tool for achieving what you want.`
        },
        {
          title: 'Getting started',
          content: `Begin with the 50/30/20 rule: aim to spend about 50% of your income on needs, 30% on wants, and 20% on savings/debt repayment. Adjust these percentages based on your situation. The key is creating a plan that works for YOUR life, not someone else's idea of what your finances should look like.`
        }
      ],
      tip: 'Pro tip: Create a "fun money" category in your budget that you can spend without guilt. Building pleasure into your budget makes it much more likely you\'ll stick with it!',
      quiz: {
        question: "What's a good reason to create a budget?",
        options: [
          { id: '1', text: 'To impress accountants', correct: false },
          { id: '2', text: 'To have enough money until month-end', correct: true },
          { id: '3', text: 'To spend more on shawarma', correct: false },
          { id: '4', text: 'To make yourself feel bad about spending', correct: false },
        ],
      },
    },
    {
      id: 'money-basics-lesson3',
      title: 'Emergency Fund Essentials',
      content: `Life happens. Cars break down, medical emergencies arise, job loss occurs. An emergency fund is your financial shock absorber for life's unexpected bumps.
  
  An emergency fund isn't an investment—it's insurance. It's the money that keeps a temporary setback from becoming a financial disaster. 
  
  The peace of mind that comes from having this financial buffer is worth far more than any interest you might earn by investing this money instead.`,
      xp_reward: 60,
      image: 'https://via.placeholder.com/150',
      imageCaption: 'An emergency fund provides financial security when life throws curveballs',
      sections: [
        {
          title: 'Why it matters',
          content: `Without an emergency fund, unexpected expenses often lead to debt. This creates a negative cycle where you're paying interest on past emergencies while new ones arise. An emergency fund breaks this cycle and gives you the freedom to make better financial choices even when surprises happen.`
        },
        {
          title: 'Getting started',
          content: `Start with a mini emergency fund of ₦100,000 or one month's expenses, whichever is less. Keep this money in a separate savings account that's easily accessible but not connected to your daily spending. Once you have this foundation, work toward building 3-6 months of essential expenses.`
        }
      ],
      tip: 'Pro tip: Name your emergency fund something specific like "Financial Safety Net" rather than just "Savings." Research shows this makes you less likely to raid it for non-emergencies!',
      quiz: {
        question: "An emergency fund should ideally cover how many months of expenses?",
        options: [
          { id: '1', text: '1 month', correct: false },
          { id: '2', text: '3-6 months', correct: true },
          { id: '3', text: '10 years', correct: false },
          { id: '4', text: '2 weeks', correct: false },
        ],
      },
    },
  ];

  export default { lessons };