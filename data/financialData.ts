export interface PeriodData {
  date: string;
  in: number;
  out: number;
}

export interface FinancialData {
  moneyIn: Array<{ date: string; amount: number }>;
  moneyOut: Array<{ date: string; amount: number }>;
  week: {
    periodData: PeriodData[];
  };
}

export const mockFinancialData: FinancialData = {
  moneyIn: [
    { date: '2024-02-05', amount: 150000 },
    { date: '2024-02-06', amount: 210000 },
    // ...more data
  ],
  moneyOut: [
    { date: '2024-02-05', amount: 75000 },
    { date: '2024-02-06', amount: 80000 },
    // ...more data
  ],
  week: {
    periodData: [
      { date: '2024-02-05', in: 150000, out: 75000 },
      { date: '2024-02-06', in: 210000, out: 80000 },
      // ...more data
    ]
  }
};
