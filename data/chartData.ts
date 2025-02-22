// Types for our chart data
export type ChartDatum = {
    period: string;
    moneyIn: number;
    moneyOut: number;
  };
  
  export type Timeframe = 'week' | 'month' | 'year';
  
  // This week's data
  export const weeklyData: ChartDatum[] = [
    { period: 'Mon', moneyIn: 5000, moneyOut: 3000 },
    { period: 'Tue', moneyIn: 6000, moneyOut: 4000 },
    { period: 'Wed', moneyIn: 4500, moneyOut: 3500 },
    { period: 'Thu', moneyIn: 7000, moneyOut: 4500 },
    { period: 'Fri', moneyIn: 5500, moneyOut: 3800 },
    { period: 'Sat', moneyIn: 4800, moneyOut: 3200 },
    { period: 'Sun', moneyIn: 3500, moneyOut: 2500 }
  ];
  
  // This month's data
  export const monthlyData: ChartDatum[] = [
    { period: 'Week 1', moneyIn: 35000, moneyOut: 25000 },
    { period: 'Week 2', moneyIn: 42000, moneyOut: 28000 },
    { period: 'Week 3', moneyIn: 38000, moneyOut: 26000 },
    { period: 'Week 4', moneyIn: 45000, moneyOut: 30000 }
  ];
  
  // This year's data
  export const yearlyData: ChartDatum[] = [
    { period: 'Jan', moneyIn: 150000, moneyOut: 100000 },
    { period: 'Feb', moneyIn: 180000, moneyOut: 120000 },
    { period: 'Mar', moneyIn: 165000, moneyOut: 110000 },
    { period: 'Apr', moneyIn: 190000, moneyOut: 125000 },
    { period: 'May', moneyIn: 175000, moneyOut: 115000 },
    { period: 'Jun', moneyIn: 195000, moneyOut: 130000 },
    { period: 'Jul', moneyIn: 185000, moneyOut: 122000 },
    { period: 'Aug', moneyIn: 200000, moneyOut: 135000 },
    { period: 'Sep', moneyIn: 188000, moneyOut: 126000 },
    { period: 'Oct', moneyIn: 205000, moneyOut: 138000 },
    { period: 'Nov', moneyIn: 195000, moneyOut: 130000 },
    { period: 'Dec', moneyIn: 220000, moneyOut: 145000 }
  ];