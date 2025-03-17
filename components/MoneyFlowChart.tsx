import React from 'react';
import { View, Text, StyleSheet, Platform, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

type ChartDatum = {
  date: string;
  moneyIn: number;
  moneyOut: number;
};

type MoneyFlowChartProps = {
  data: ChartDatum[];
  timeframe: 'week' | 'month' | 'year';
};

const { width } = Dimensions.get('window');
const TOTAL_WIDTH = width * 0.92;
const GAP = 8;
const CARD_WIDTH = (TOTAL_WIDTH - GAP) / 2;
const CARD_HEIGHT = 120;
const CARD_PADDING = 12;

const MoneyFlowChart: React.FC<MoneyFlowChartProps> = ({ data, timeframe }) => {
  // Formatter for amounts
  const formatRWF = (value: number | undefined) => {
    const safeValue = typeof value === 'number' ? value : 0;
    return `RWF ${safeValue.toLocaleString()}`;
  };

  // Helper: compute cumulative sum so that the chart and totals reflect the entire period’s flow.
  const cumulativeSum = (values: number[]) => {
    let total = 0;
    return values.map((val) => {
      total += val;
      return total;
    });
  };

  // Use safe data array
  const safeData = data && data.length > 0 ? data : [];
  
  // Get daily amounts from safeData
  const dailyMoneyIn = safeData.map(item => item?.moneyIn || 0);
  const dailyMoneyOut = safeData.map(item => item?.moneyOut || 0);
  
  // Compute cumulative totals
  const cumulativeMoneyIn = cumulativeSum(dailyMoneyIn);
  const cumulativeMoneyOut = cumulativeSum(dailyMoneyOut);

  // Calculate percentage change based on cumulative totals (from first day to last day)
  const calculateChange = (cumulative: number[]) => {
    if (cumulative.length < 2) return 0;
    const first = cumulative[0];
    const last = cumulative[cumulative.length - 1];
    // If the first cumulative value is zero, avoid division by zero (show 0 if both are 0, else 100)
    if (first === 0) return last === 0 ? 0 : 100;
    return ((last - first) / first) * 100;
  };

  const moneyInChange = calculateChange(cumulativeMoneyIn);
  const moneyOutChange = calculateChange(cumulativeMoneyOut);

  // Use the last cumulative value as the total money in/out for the period
  const latestMoneyIn = cumulativeMoneyIn.length > 0 ? cumulativeMoneyIn[cumulativeMoneyIn.length - 1] : 0;
  const latestMoneyOut = cumulativeMoneyOut.length > 0 ? cumulativeMoneyOut[cumulativeMoneyOut.length - 1] : 0;

  // Format percentage with sign and one decimal place
  const formatPercentage = (value: number) => {
    const formattedValue = Math.abs(value).toFixed(1);
    return value >= 0 ? `+${formattedValue}%` : `-${formattedValue}%`;
  };

  // Render chart using the cumulative data and consistent inner width
  const renderChart = (chartValues: number[], color: string) => {
    const dataPoints = chartValues.length > 0 ? chartValues : [0, 0];
    return (
      <LineChart
        data={{
          labels: [],
          datasets: [{ data: dataPoints }],
        }}
        width={CARD_WIDTH - 2 * CARD_PADDING} // use the card's inner width for consistency
        height={55}
        withDots={false}
        withInnerLines={false}
        withOuterLines={false}
        withHorizontalLabels={false}
        withVerticalLabels={false}
        fromZero
        transparent
        chartConfig={{
          backgroundGradientFrom: 'transparent',
          backgroundGradientTo: 'transparent',
          backgroundColor: 'transparent',
          color: () => color,
          fillShadowGradient: color,
          fillShadowGradientOpacity: 0.5,
          strokeWidth: 2,
          useShadowColorFromDataset: false,
          propsForBackgroundLines: {
            stroke: 'transparent',
          },
        }}
        style={{
          margin: 0,
          padding: 0,
          alignSelf: 'center', // center the chart inside the card
          backgroundColor: 'transparent',
        }}
        bezier
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* Money In Card */}
        <View style={styles.card}>
          <View style={styles.contentContainer}>
            <View style={styles.headerContainer}>
              <View>
                <Text style={styles.cardLabel}>Money In</Text>
                <Text style={styles.amountText}>
                  {formatRWF(latestMoneyIn)}
                </Text>
              </View>
              <Text 
                style={[
                  styles.percentageText, 
                  moneyInChange >= 0 ? styles.positiveChange : styles.negativeChange
                ]}
              >
                {formatPercentage(moneyInChange)}
              </Text>
            </View>
            <View style={[styles.chartWrapper, { backgroundColor: 'transparent' }]}>
              {renderChart(cumulativeMoneyIn, '#4CD964')}
            </View>
          </View>
        </View>

        {/* Money Out Card */}
        <View style={styles.card}>
          <View style={styles.contentContainer}>
            <View style={styles.headerContainer}>
              <View>
                <Text style={styles.cardLabel}>Money Out</Text>
                <Text style={styles.amountText}>
                  {formatRWF(latestMoneyOut)}
                </Text>
              </View>
              <Text 
                style={[
                  styles.percentageText, 
                  // For Money Out, a negative change (less spending) is good
                  moneyOutChange <= 0 ? styles.positiveChange : styles.negativeChange
                ]}
              >
                {formatPercentage(moneyOutChange)}
              </Text>
            </View>
            <View style={[styles.chartWrapper, { backgroundColor: 'transparent' }]}>
              {renderChart(cumulativeMoneyOut, '#FF3B30')}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'transparent',
  },
  row: {
    flexDirection: 'row',
    width: TOTAL_WIDTH,
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: CARD_PADDING,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    backgroundColor: 'transparent',
  },
  cardLabel: {
    fontSize: 10,
    color: '#000000',
    fontFamily: 'Inter-Regular',
    lineHeight: 14,
  },
  amountText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#000000',
    fontFamily: 'Inter-SemiBold',
    marginTop: 2,
    lineHeight: 14,
  },
  percentageText: {
    fontSize: 10,
    fontWeight: '400',
    fontFamily: 'Inter-Regular',
    lineHeight: 14,
  },
  positiveChange: {
    color: '#4CD964',
  },
  negativeChange: {
    color: '#932323',
  },
  chartWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
});

export default MoneyFlowChart;
