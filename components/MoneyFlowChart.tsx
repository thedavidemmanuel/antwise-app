import React from 'react';
import { View, Text, StyleSheet, Platform, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import type { ChartDatum } from '../data/chartData';

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
  const formatRWF = (value: number) => `RWF ${value.toLocaleString()}`;

  const calculatePercentageChange = (values: number[]) => {
    if (values.length < 2) return 0;
    const firstValue = values[0];
    const lastValue = values[values.length - 1];
    return ((lastValue - firstValue) / firstValue) * 100;
  };

  const moneyInData = data.map(item => item.moneyIn);
  const moneyOutData = data.map(item => item.moneyOut);
  const moneyInChange = calculatePercentageChange(moneyInData);
  const moneyOutChange = calculatePercentageChange(moneyOutData);

  const renderChart = (chartValues: number[], color: string) => (
    <LineChart
      data={{
        labels: [],
        datasets: [{ data: chartValues }],
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
                  {formatRWF(moneyInData[moneyInData.length - 1])}
                </Text>
              </View>
              <Text style={[styles.percentageText, styles.positiveChange]}>
                +{moneyInChange.toFixed(1)}%
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
                  {formatRWF(moneyOutData[moneyOutData.length - 1])}
                </Text>
              </View>
              <Text style={[styles.percentageText, styles.negativeChange]}>
                {moneyOutChange.toFixed(1)}%
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