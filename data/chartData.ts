// Types for our chart data
export type Timeframe = 'week' | 'month' | 'year';

export interface ChartDatum {
  date: string;
  moneyIn: number;
  moneyOut: number;
}

// Sample data for initial rendering
export const weeklyData: ChartDatum[] = [
  { date: '10/3', moneyIn: 1200, moneyOut: 800 },
  { date: '11/3', moneyIn: 1500, moneyOut: 750 },
  { date: '12/3', moneyIn: 1100, moneyOut: 900 },
  { date: '13/3', moneyIn: 1700, moneyOut: 850 },
  { date: '14/3', moneyIn: 1400, moneyOut: 950 },
  { date: '15/3', moneyIn: 1800, moneyOut: 1000 },
  { date: '16/3', moneyIn: 2000, moneyOut: 1050 },
];

export const monthlyData: ChartDatum[] = [
  { date: '1/3', moneyIn: 5000, moneyOut: 3500 },
  { date: '6/3', moneyIn: 6200, moneyOut: 4100 },
  { date: '11/3', moneyIn: 5800, moneyOut: 3900 },
  { date: '16/3', moneyIn: 7100, moneyOut: 4500 },
  { date: '21/3', moneyIn: 8000, moneyOut: 5100 },
  { date: '26/3', moneyIn: 8500, moneyOut: 5300 },
];

export const yearlyData: ChartDatum[] = [
  { date: 'Jan', moneyIn: 15000, moneyOut: 12000 },
  { date: 'Feb', moneyIn: 18000, moneyOut: 13500 },
  { date: 'Mar', moneyIn: 17000, moneyOut: 13000 },
  { date: 'Apr', moneyIn: 19000, moneyOut: 14200 },
  { date: 'May', moneyIn: 20500, moneyOut: 15000 },
  { date: 'Jun', moneyIn: 21000, moneyOut: 15500 },
  { date: 'Jul', moneyIn: 22000, moneyOut: 16000 },
  { date: 'Aug', moneyIn: 23500, moneyOut: 16800 },
  { date: 'Sep', moneyIn: 24000, moneyOut: 17200 },
  { date: 'Oct', moneyIn: 25000, moneyOut: 17800 },
  { date: 'Nov', moneyIn: 26500, moneyOut: 18500 },
  { date: 'Dec', moneyIn: 28000, moneyOut: 19000 },
];