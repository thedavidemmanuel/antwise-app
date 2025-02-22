export interface PeriodData {
  date: string;
  in: number;
  out: number;
}

export interface FinancialPeriodData {
  date: string;
  amount: number;
}

export interface FinancialData {
  moneyIn: FinancialPeriodData[];
  moneyOut: FinancialPeriodData[];
  week: {
    periodData: PeriodData[];
  };
}

export const mockFinancialData: FinancialData = {
  moneyIn: [
    { date: '2024-02-01', amount: 150000 },
    { date: '2024-02-02', amount: 210000 },
  ],
  moneyOut: [
    { date: '2024-02-01', amount: 75000 },
    { date: '2024-02-02', amount: 530000 },
  ],
  week: {
    periodData: [
      { date: '2024-02-01', in: 150000, out: 75000 },
      { date: '2024-02-02', in: 210000, out: 530000 },
    ]
  }
};
