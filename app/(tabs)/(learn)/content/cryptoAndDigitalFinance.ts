export const lessons = [
    {
      id: 'crypto1',
      title: 'Digital Finance Basics',
      content: `Digital finance is transforming how we manage, move, and invest money, creating both opportunities and challenges.
  
  From online banking and mobile payments to cryptocurrencies and blockchain applications, technology is revolutionizing every aspect of financial services—making them more accessible, efficient, and personalized.
  
  Understanding digital finance fundamentals helps you navigate this rapidly evolving landscape, leveraging new tools while avoiding potential pitfalls.`,
      xp_reward: 70,
      image: 'https://via.placeholder.com/150',
      imageCaption: 'Digital finance is transforming how we interact with money',
      sections: [
        {
          title: 'Why it matters',
          content: `Digital finance is no longer optional—it's becoming the dominant way financial services are delivered. Mobile banking, digital payments, and online financial management provide convenience and access unprecedented in human history. However, this shift also brings new responsibilities for security, privacy, and financial literacy. Understanding these tools is increasingly essential for managing your financial life effectively.`
        },
        {
          title: 'Getting started',
          content: `Begin with secure basics: set up online/mobile banking with strong, unique passwords and two-factor authentication. Explore financial apps that help track spending, automate savings, or invest small amounts regularly. Start with established, regulated services from known financial institutions before venturing into newer fintech applications. Be particularly cautious with permissions—only grant apps the minimum access they need to function.`
        }
      ],
      tip: `Pro tip: Create a separate email address used exclusively for financial accounts. This reduces the risk of phishing attacks and makes it easier to monitor for suspicious communications related to your money.`,
      quiz: {
        question: "What's a key security practice when using digital finance applications?",
        options: [
          { id: '1', text: 'Using the same password across all financial apps', correct: false },
          { id: '2', text: 'Enabling two-factor authentication', correct: true },
          { id: '3', text: 'Sharing access with family members', correct: false },
          { id: '4', text: 'Storing passwords in a notes app', correct: false },
        ],
      },
    },
    {
      id: 'crypto2',
      title: 'Understanding Cryptocurrency',
      content: `Cryptocurrencies represent a fundamental shift in how digital value can be created, transferred, and stored without traditional intermediaries like banks.
  
  Unlike conventional currencies issued by governments, cryptocurrencies use cryptography and distributed ledger technology (blockchain) to secure transactions and control the creation of new units.
  
  Bitcoin, the first and most well-known cryptocurrency, emerged in 2009, but thousands of alternative cryptocurrencies ("altcoins") now exist, each with different features, use cases, and underlying technologies.`,
      xp_reward: 75,
      image: 'https://via.placeholder.com/150',
      imageCaption: 'Cryptocurrencies offer a new paradigm for digital value transfer',
      sections: [
        {
          title: 'Why it matters',
          content: `Cryptocurrencies and blockchain technology represent potentially significant innovation in financial systems, with applications ranging from cross-border payments to programmable money. Whether cryptocurrencies become mainstream or remain niche, understanding their basic principles helps you evaluate opportunities, risks, and how they might fit into broader financial planning. Informed decisions about cryptocurrency require understanding what gives these digital assets potential value and what risks they carry.`
        },
        {
          title: 'Getting started',
          content: `Focus first on education rather than investment. Learn the fundamental differences between major cryptocurrencies like Bitcoin and Ethereum. Understand the concept of blockchain, private/public keys, and digital wallets. If you decide to explore ownership, start with small amounts you can afford to lose completely, using established exchanges with strong security measures. Consider cryptocurrency as a high-risk, speculative portion of your overall portfolio rather than a core investment.`
        }
      ],
      tip: `Pro tip: If you decide to own cryptocurrency, learn about "cold storage" (offline storage methods like hardware wallets) for better security. Keeping significant cryptocurrency holdings on exchanges increases vulnerability to hacking and exchange failures.`,
      quiz: {
        question: "What technology underpins most cryptocurrencies?",
        options: [
          { id: '1', text: 'Random Access Memory (RAM)', correct: false },
          { id: '2', text: 'Blockchain', correct: true },
          { id: '3', text: 'Cloud computing', correct: false },
          { id: '4', text: 'Artificial Intelligence', correct: false },
        ],
      },
    },
    {
      id: 'crypto3',
      title: 'Digital Security for Your Money',
      content: `As financial activities increasingly move online, robust digital security practices become essential for protecting your money and identity.
  
  Financial data breaches, phishing attacks, and digital scams are growing more sophisticated, targeting not just financial institutions but individual consumers through various channels.
  
  Understanding common threats and implementing strong security measures significantly reduces your vulnerability to financial fraud and identity theft in the digital age.`,
      xp_reward: 65,
      image: 'https://via.placeholder.com/150',
      imageCaption: 'Strong security practices protect your digital financial life',
      sections: [
        {
          title: 'Why it matters',
          content: `The consequences of digital financial security breaches can be devastating—from drained bank accounts and unauthorized credit card charges to stolen identity used for fraudulent loans. The recovery process is often lengthy and stressful. The good news is that most digital financial threats can be dramatically reduced through consistent security practices. Your digital security is largely under your control, unlike many other financial risks.`
        },
        {
          title: 'Getting started',
          content: `Implement these core security practices: use a password manager to create and store unique, complex passwords for each financial account; enable two-factor authentication wherever available; be highly skeptical of unexpected communications asking for financial information or login credentials, even if they appear to come from legitimate institutions; secure your devices with updated operating systems, anti-malware protection, and screen locks; regularly monitor accounts for suspicious activity; freeze your credit reports to prevent unauthorized account opening.`
        }
      ],
      tip: `Pro tip: Create a "financial security" email address used exclusively for banking, investment, and other financial accounts. This makes it easier to identify phishing attempts and keeps financial notifications separate from potentially vulnerable general email.`,
      quiz: {
        question: "What practice most improves your digital financial security?",
        options: [
          { id: '1', text: 'Using the same password for all financial accounts', correct: false },
          { id: '2', text: 'Using unique passwords and two-factor authentication', correct: true },
          { id: '3', text: 'Clicking links in emails that appear to be from your bank', correct: false },
          { id: '4', text: 'Keeping your Social Security number in your phone\'s notes app', correct: false },
        ],
      },
    },
  ];