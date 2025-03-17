// C:\Users\David\Desktop\antwise-app\app\(tabs)\(learn)\content\cybersecurityFraudPrevention.ts

export const lessons = [
    {
      // Matches content_id = "cybersecurity-fraud-prevention-lesson1" in Supabase
      id: 'cybersecurity-fraud-prevention-lesson1',
      title: 'Scam-Proof Your Wallet',
      content: `Spot financial scams and stay financially safe. Think of every suspicious text or email as a Trojan Horse—harmless on the outside, chaos inside! Learn to recognize red flags and avoid handing over your precious data to digital tricksters.`,
      xp_reward: 10,
      image: 'https://via.placeholder.com/150',
      imageCaption: 'Protect your money from digital bandits!',
      sections: [
        {
          title: 'Why it matters',
          content: `Financial scams can drain your bank account in seconds. A single click on a fraudulent link or a quick response to a suspicious text can cost you big time.`
        },
        {
          title: 'Getting started',
          content: `Use your scam radar: be wary of unsolicited offers, messages asking for urgent action, or promises that sound too good to be true. If something feels off, it probably is!`
        }
      ],
      tip: 'Pro tip: If a message claims “Your account is locked! Click here now!”—pause. Go directly to the official website or app instead of clicking a random link.',
      quiz: {
        question: "Which is a good way to avoid scam traps?",
        options: [
          { id: '1', text: 'Click on every link labeled “urgent!”', correct: false },
          { id: '2', text: 'Send your bank details to unknown emails', correct: false },
          { id: '3', text: 'Verify suspicious links or offers before acting', correct: true },
          { id: '4', text: 'Reply to spam to see what happens', correct: false }
        ]
      }
    },
    {
      // Matches content_id = "cybersecurity-fraud-prevention-lesson2" in Supabase
      id: 'cybersecurity-fraud-prevention-lesson2',
      title: 'Cybersecurity Essentials for Your Finances',
      content: `Keep your money and identity safe online. Think of your passwords as VIP tickets—unique, guarded, and never shared! Two-factor authentication is your backstage bouncer, ensuring no one sneaks in uninvited.`,
      xp_reward: 10,
      image: 'https://via.placeholder.com/150',
      imageCaption: 'Guard your financial data like a secret formula!',
      sections: [
        {
          title: 'Why it matters',
          content: `One hacked account can snowball into a nightmare—credit card fraud, drained savings, and stolen identities. Strong security habits block these threats.`
        },
        {
          title: 'Getting started',
          content: `Use unique, complex passwords for each financial app or website. Consider a password manager, and always enable two-factor authentication for an extra layer of protection.`
        }
      ],
      tip: 'Pro tip: Think of 2FA codes like one-time VIP passes—valid only once and only for you. No one else gets in!',
      quiz: {
        question: "What's the best practice to protect your financial accounts?",
        options: [
          { id: '1', text: 'Using the same password everywhere for convenience', correct: false },
          { id: '2', text: 'Sharing your password with friends you trust', correct: false },
          { id: '3', text: 'Using unique, strong passwords and 2FA', correct: true },
          { id: '4', text: 'Writing your passwords on sticky notes', correct: false }
        ]
      }
    },
    {
      // Matches content_id = "cybersecurity-fraud-prevention-lesson3" in Supabase
      id: 'cybersecurity-fraud-prevention-lesson3',
      title: 'Avoiding Ponzi & Pyramid Schemes',
      content: `Recognize scams that disguise themselves as “investments.” If someone promises to double your money overnight with zero risk, run! Ponzi and pyramid schemes often rely on new recruits to pay off earlier investors, eventually crumbling like a house of cards.`,
      xp_reward: 10,
      image: 'https://via.placeholder.com/150',
      imageCaption: 'If the returns seem magical, it might be an illusion.',
      sections: [
        {
          title: 'Why it matters',
          content: `Ponzi and pyramid schemes can wipe out savings and ruin trust in legitimate investments. By the time the scheme collapses, it’s often too late for victims to recover their money.`
        },
        {
          title: 'Getting started',
          content: `Always do thorough research on any “investment opportunity.” Check regulatory bodies and reviews. If the pitch sounds like “earn 100% returns in 2 weeks,” it’s probably a trap.`
        }
      ],
      tip: 'Pro tip: Ask yourself, “Where is the real value coming from?” If it’s just from recruiting more people, you might be the one left holding the bag!',
      quiz: {
        question: "Which statement about Ponzi or pyramid schemes is TRUE?",
        options: [
          { id: '1', text: 'They guarantee stable, realistic returns', correct: false },
          { id: '2', text: 'They rely on constant recruitment to pay earlier investors', correct: true },
          { id: '3', text: 'They’re always regulated by governments', correct: false },
          { id: '4', text: 'They never collapse if enough people join', correct: false }
        ]
      }
    }
  ];
  
  export default { lessons };
  