import React, { useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import MoneyFlowChart from '../../components/MoneyFlowChart';
import { weeklyData, monthlyData, yearlyData, Timeframe } from '../../data/chartData';

type MeasureCallback = (
  x: number,
  y: number,
  width: number,
  height: number,
  pageX: number,
  pageY: number
) => void;

const CalendarIcon: React.FC = React.memo(() => (
  <View style={styles.calendarIcon} accessible accessibilityLabel="Calendar">
    <View style={styles.calendarTop} />
    <View style={styles.calendarBody} />
  </View>
));

const MoneyFlow: React.FC = () => {
  const [timeframe, setTimeframe] = useState<Timeframe>('week');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const selectorRef = useRef<View>(null);

  const getDisplayTimeframe = () => {
    switch (timeframe) {
      case 'week':
        return 'This Week';
      case 'month':
        return 'This Month';
      case 'year':
        return 'This Year';
      default:
        return 'This Week';
    }
  };

  const getDataForTimeframe = () => {
    switch (timeframe) {
      case 'week':
        return weeklyData;
      case 'month':
        return monthlyData;
      case 'year':
        return yearlyData;
      default:
        return weeklyData;
    }
  };

  const toggleDropdown = useCallback(() => {
    if (selectorRef.current) {
      selectorRef.current.measure(
        (x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
          setDropdownPosition({
            top: pageY + height + 4,
            left: pageX,
          });
          setDropdownVisible(prev => !prev);
        }
      );
    }
  }, []);

  return (
    <View style={styles.moneyFlowSection}>
      <View style={styles.moneyFlowHeader}>
        <View style={styles.titleContainer}>
          <Text style={styles.moneyFlowTitle}>Money Flow</Text>
          <TouchableOpacity 
            onPress={toggleDropdown}
            accessibilityRole="button"
            accessibilityLabel={`Select time period. Currently selected ${getDisplayTimeframe()}`}
          >
            <View ref={selectorRef} style={styles.periodSelector}>
              <CalendarIcon />
              <Text style={styles.periodText}>{getDisplayTimeframe()}</Text>
              <View style={styles.arrowDown} />
            </View>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.insightsButton} 
          onPress={() => console.log('More Insights pressed')}
          accessibilityRole="button"
          accessibilityLabel="More Insights"
        >
          <Text style={styles.moreInsights}>More Insights</Text>
          <View style={styles.arrowRight} />
        </TouchableOpacity>
      </View>

      <Modal
        visible={dropdownVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          onPress={() => setDropdownVisible(false)}
          activeOpacity={1}
        >
          <View
            style={[
              styles.dropdownContainer,
              {
                position: 'absolute',
                top: dropdownPosition.top,
                left: dropdownPosition.left,
              },
            ]}
          >
            <FlatList
              data={['This Week', 'This Month', 'This Year'] as const}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    setTimeframe(item.toLowerCase().split(' ')[1] as Timeframe);
                    setDropdownVisible(false);
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${item}`}
                >
                  <Text
                    style={[
                      styles.dropdownText,
                      getDisplayTimeframe() === item && styles.selectedText,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      <MoneyFlowChart data={getDataForTimeframe()} timeframe={timeframe} />
    </View>
  );
};

const styles = StyleSheet.create({
  moneyFlowSection: {
    marginHorizontal: 16,
    marginBottom: 0,
  },
  moneyFlowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moneyFlowTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    color: '#000000',
    marginLeft: -16,  // adjusted to be flush with the edge like the Shortcuts title
  },
  calendarIcon: {
    width: 12,
    height: 12,
    marginRight: 4,
  },
  calendarTop: {
    width: '100%',
    height: 3,
    backgroundColor: '#7C3AED',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  calendarBody: {
    width: '100%',
    height: 9,
    backgroundColor: '#7C3AED',
    opacity: 0.2,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  periodSelector: {
    backgroundColor: 'rgba(124, 58, 237, 0.05)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    height: 27,
  },
  periodText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#7C3AED',
    marginRight: 4,
  },
  arrowDown: {
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 5,
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#000000',
  },
  insightsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moreInsights: {
    fontSize: 12,
    color: '#7C3AED',
    fontFamily: 'Inter-SemiBold',
    marginRight: 4,
  },
  arrowRight: {
    width: 10,
    height: 10,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: '#7C3AED',
    transform: [{ rotate: '45deg' }],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  dropdownContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    width: 120,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#000000',
  },
  selectedText: {
    color: '#7C3AED',
    fontFamily: 'Inter-Medium',
  },
});

export default MoneyFlow;
