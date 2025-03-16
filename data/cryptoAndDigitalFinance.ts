import { ModuleLessons } from '@/types/learning';

export const lessons: ModuleLessons = [
  {
    id: "crypto-1",
    title: "Introduction to Cryptocurrency",
    content: "Cryptocurrency is a digital or virtual currency that uses cryptography for security and operates on a technology called blockchain.",
    xp_reward: 80,
    quiz: {
      question: "What technology underpins most cryptocurrencies?",
      options: [
        { id: "a", text: "Artificial Intelligence", correct: false },
        { id: "b", text: "Cloud Computing", correct: false },
        { id: "c", text: "Blockchain", correct: true },
        { id: "d", text: "Virtual Reality", correct: false }
      ]
    },
    sections: [
      {
        title: "What is Blockchain?",
        content: "Blockchain is a distributed ledger technology that records transactions across many computers. This makes it difficult or impossible to change, hack, or cheat the system."
      },
      {
        title: "Types of Cryptocurrencies",
        content: "Bitcoin was the first cryptocurrency, but there are now thousands of alternatives ('altcoins') like Ethereum, Ripple, and Litecoin. Each has unique features and use cases."
      },
      {
        title: "Crypto Wallets",
        content: "Crypto wallets don't actually store your cryptocurrency. Instead, they store the private keys needed to access and manage your crypto holdings on the blockchain."
      },
      {
        title: "Risks of Crypto Investing",
        content: "Cryptocurrency markets are highly volatile. Prices can swing dramatically in short periods, regulatory landscapes are evolving, and security breaches can occur."
      }
    ],
    tip: "Never share your private keys or seed phrases with anyone. Store them securely offline and keep backup copies in separate secure locations."
  },
  // Add more lessons as needed
];
