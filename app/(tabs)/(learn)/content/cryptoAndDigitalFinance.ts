// C:\Users\David\Desktop\antwise-app\app\(tabs)\(learn)\content\cryptoAndDigitalFinance.ts

export const lessons = [
  {
    // Matches content_id = "crypto-digital-finance-lesson1" in Supabase
    id: 'crypto-digital-finance-lesson1',
    title: 'Crypto Basics Without Getting Hacked',
    content: `Explore the wild world of crypto while keeping your coins safe. Think of it as learning to ride a digital bull—thrilling, but you need a good grip (and strong security) to avoid being thrown off.`,
    xp_reward: 10,
    image: 'https://via.placeholder.com/150',
    imageCaption: 'Secure your crypto like a digital Fort Knox!',
    sections: [
      {
        title: 'Why it matters',
        content: `Crypto offers exciting opportunities, but without proper security, your digital wealth can vanish faster than a magician’s trick. Knowing how to protect yourself is essential.`
      },
      {
        title: 'Getting started',
        content: `Invest in a reputable digital wallet, enable two-factor authentication, and double-check exchange security. Think of it as locking the door before you head out—simple but vital.`
      }
    ],
    tip: 'Pro tip: If an offer sounds too flashy (like doubling your Bitcoin overnight), it’s probably a digital mirage—stay alert!',
    quiz: {
      question: "What’s the best way to ensure your crypto stays safe?",
      options: [
        { id: '1', text: 'Keep your private keys written on your desk (for easy access)', correct: false },
        { id: '2', text: 'Use strong security measures and two-factor authentication', correct: true },
        { id: '3', text: 'Share your wallet details with your “trusted” friend', correct: false },
        { id: '4', text: 'Trust every flashy crypto ad you see online', correct: false }
      ]
    }
  },
  {
    // Matches content_id = "crypto-digital-finance-lesson2" in Supabase
    id: 'crypto-digital-finance-lesson2',
    title: 'Stablecoins: Less Drama Crypto',
    content: `Meet stablecoins—crypto’s zen masters. When Bitcoin is throwing tantrums, stablecoins keep things cool and steady, offering a refuge for those who prefer a calmer digital ride.`,
    xp_reward: 10,
    image: 'https://via.placeholder.com/150',
    imageCaption: 'When crypto gets wild, stablecoins keep it chill.',
    sections: [
      {
        title: 'Why it matters',
        content: `Stablecoins reduce the dramatic swings of the crypto market, offering a smoother experience for investors who don’t want to ride an emotional roller coaster.`
      },
      {
        title: 'Getting started',
        content: `Research the stablecoin’s backing and choose ones with transparent, trustworthy assets. They’re not perfect, but they offer a welcome break from extreme volatility.`
      }
    ],
    tip: 'Pro tip: Think of stablecoins as the “zen masters” of crypto—they keep things balanced when markets get too hectic.',
    quiz: {
      question: "Why might a savvy investor opt for stablecoins over wild Bitcoin?",
      options: [
        { id: '1', text: 'Because they promise spontaneous magic money', correct: false },
        { id: '2', text: 'For a more stable, less volatile investment experience', correct: true },
        { id: '3', text: 'Because they’re the trendiest thing in town', correct: false },
        { id: '4', text: 'Because they come with free digital lattes', correct: false }
      ]
    }
  },
  {
    // Matches content_id = "crypto-digital-finance-lesson3" in Supabase
    id: 'crypto-digital-finance-lesson3',
    title: "NFTs: Are JPEGs Money Now?",
    content: `NFTs let you own digital art and collectibles—but don't expect them to turn you into a millionaire overnight. They're like collecting rare trading cards online, with a dash of modern flair and a pinch of meme culture.`,
    xp_reward: 10,
    image: 'https://via.placeholder.com/150',
    imageCaption: 'Digital art: valuable or viral? The debate continues.',
    sections: [
      {
        title: 'Why it matters',
        content: `NFTs represent a new frontier in digital ownership. While they can be a fun and creative asset, the market is unpredictable—so understanding their value is key.`
      },
      {
        title: 'Getting started',
        content: `Do your homework: research the artist, rarity, and community behind an NFT. Treat them like collectible trading cards—you might love them, but they’re not a guaranteed jackpot.`
      }
    ],
    tip: 'Pro tip: Enjoy NFTs for the art and experience they offer, not as a surefire ticket to instant riches.',
    quiz: {
      question: "What best captures the quirky charm of NFTs?",
      options: [
        { id: '1', text: 'They are digital art that may be as unpredictable as a viral meme', correct: true },
        { id: '2', text: 'They guarantee you’ll win a fortune overnight', correct: false },
        { id: '3', text: 'They are physical paintings delivered to your door', correct: false },
        { id: '4', text: 'They are worthless pixels with no market value', correct: false }
      ]
    }
  }
];

export default { lessons };
