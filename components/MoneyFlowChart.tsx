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
  // Fix: Handle potential undefined values safely
  const formatRWF = (value: number | undefined) => {
    // Make sure value is a number and not undefined
    const safeValue = typeof value === 'number' ? value : 0;
    return `RWF ${safeValue.toLocaleString()}`;
  };

  // Percentage calculation explained
  const calculatePercentageChange = (values: number[]) => {
    // If we don't have at least 2 values, return 0 (no change)
    if (!values || values.length < 2) return 0;
    
    // Get first and last non-zero values
    let firstValue = 0;
    let lastValue = 0;
    
    // Find first non-zero value in the dataset
    for (let i = 0; i < values.length; i++) {
      if (values[i] > 0) {
        firstValue = values[i];
        break;
      }
    }
    
    // Find last non-zero value in the dataset
    for (let i = values.length - 1; i >= 0; i--) {
      if (values[i] > 0) {
        lastValue = values[i];
        break;
      }
    }
    
    // If first value is still zero (all data points were zero), return 0
    if (firstValue === 0) return 0;
    
    // Calculate percentage change: ((last - first) / first) * 100
    return ((lastValue - firstValue) / firstValue) * 100;
  };

  // Ensure data is valid
  const safeData = data && data.length > 0 ? data : [];
  
  // Fix: Ensure we have valid numbers for each entry
  const moneyInData = safeData.map(item => item?.moneyIn || 0);
  const moneyOutData = safeData.map(item => item?.moneyOut || 0);
  
  const moneyInChange = calculatePercentageChange(moneyInData);
  const moneyOutChange = calculatePercentageChange(moneyOutData);

  // Get the latest values safely
  const latestMoneyIn = moneyInData.length > 0 ? moneyInData[moneyInData.length - 1] : 0;
  const latestMoneyOut = moneyOutData.length > 0 ? moneyOutData[moneyOutData.length - 1] : 0;

  // Format percentage with sign and 1 decimal place
  const formatPercentage = (value: number) => {
    const formattedValue = Math.abs(value).toFixed(1);
    return value >= 0 ? `+${formattedValue}%` : `-${formattedValue}%`;
  };

  const renderChart = (chartValues: number[], color: string) => {
    // Ensure we have at least some data points
    const dataPoints = chartValues.length > 0 ? chartValues : [0, 0];
    
    return (
      <LineChart
        data={{
          labels: [],
          datasets: [{ data: dataPoints }],
        }}
        width={CARD_WIDTH - 2 * CARD_PADDING + 90}
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
          alignSelf: 'flex-start',
          backgroundColor: 'transparent',
          marginLeft: -65,
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
              {renderChart(moneyInData, '#4CD964')}
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
              {/* For Money Out, a negative percentage is actually good (spending less) */}
              <Text 
                style={[
                  styles.percentageText, 
                  // Inverted logic for expenses: negative change is good (green)
                  moneyOutChange <= 0 ? styles.positiveChange : styles.negativeChange
                ]}
              >
                {formatPercentage(moneyOutChange)}
              </Text>
            </View>
            <View style={[styles.chartWrapper, { backgroundColor: 'transparent' }]}>
              {renderChart(moneyOutData, '#FF3B30')}
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
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
});

export default MoneyFlowChart;