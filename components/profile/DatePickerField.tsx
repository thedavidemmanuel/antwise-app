import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Modal, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

interface DatePickerFieldProps {
  label: string;
  value: string | null | undefined;
  onDateSelected: (date: Date) => void;
  onEditText?: (field: string, value: string | null) => void;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({ 
  label, 
  value, 
  onDateSelected,
  onEditText
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [tempDate, setTempDate] = useState(() => {
    return value ? new Date(value) : new Date();
  });
  
  // Generate arrays for year, month, and day selection
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Calculate days in the selected month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const days = Array.from(
    { length: getDaysInMonth(tempDate.getFullYear(), tempDate.getMonth()) }, 
    (_, i) => i + 1
  );

  const formatDateOfBirth = (dateString: string | null | undefined) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      return dateString || '';
    }
  };

  const handleSelectYear = (year: number) => {
    const newDate = new Date(tempDate);
    newDate.setFullYear(year);
    
    // Adjust for invalid dates (e.g., Feb 29 in non-leap years)
    const month = newDate.getMonth();
    const maxDays = getDaysInMonth(year, month);
    if (newDate.getDate() > maxDays) {
      newDate.setDate(maxDays);
    }
    
    setTempDate(newDate);
  };

  const handleSelectMonth = (monthIndex: number) => {
    const newDate = new Date(tempDate);
    newDate.setMonth(monthIndex);
    
    // Adjust for invalid dates (e.g., Feb 30)
    const year = newDate.getFullYear();
    const maxDays = getDaysInMonth(year, monthIndex);
    if (newDate.getDate() > maxDays) {
      newDate.setDate(maxDays);
    }
    
    setTempDate(newDate);
  };

  const handleSelectDay = (day: number) => {
    const newDate = new Date(tempDate);
    newDate.setDate(day);
    setTempDate(newDate);
  };

  const handleConfirm = () => {
    onDateSelected(tempDate);
    setModalVisible(false);
  };

  const handleShowDatePicker = () => {
    if (Platform.OS === 'android' && value) {
      setTempDate(new Date(value as string));
    } else if (!value) {
      // Default to 18 years ago if no date is selected
      const defaultDate = new Date();
      defaultDate.setFullYear(defaultDate.getFullYear() - 18);
      setTempDate(defaultDate);
    }
    
    if (Platform.OS === 'android' && false) { // Disabled Android native picker
      try {
        const currentDate = value ? new Date(value as string) : new Date();
        
        DateTimePickerAndroid.open({
          value: currentDate,
          onChange: (event, selectedDate) => {
            if (event.type !== 'dismissed' && selectedDate) {
              onDateSelected(selectedDate);
            }
          },
          mode: 'date',
          display: 'default',
          maximumDate: new Date()
        });
      } catch (error) {
        console.error('Failed to open date picker:', error);
        onEditText?.('date_of_birth', value ?? null);
      }
    } else {
      // Use our custom modal picker for both platforms
      setModalVisible(true);
    }
  };

  const renderPickerSection = (
    title: string, 
    items: (string | number)[], 
    selectedItem: number,
    onSelect: (index: number) => void
  ) => {
    return (
      <View style={styles.pickerSection}>
        <Text style={styles.pickerTitle}>{title}</Text>
        <ScrollView style={styles.pickerScrollView}>
          {items.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.pickerItem,
                selectedItem === (typeof item === 'number' ? item : index) && styles.selectedItem
              ]}
              onPress={() => onSelect(typeof item === 'number' ? item : index)}
            >
              <Text 
                style={[
                  styles.pickerItemText,
                  selectedItem === (typeof item === 'number' ? item : index) && styles.selectedItemText
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={[styles.fieldContainer, styles.fieldBorder]}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.valueContainer}>
        <Text style={styles.fieldValue}>
          {formatDateOfBirth(value) || 'Select date of birth'}
        </Text>
        <TouchableOpacity 
          onPress={handleShowDatePicker}
          style={styles.editIconButton}
        >
          <Feather name="calendar" size={16} color="#7C00FE" />
        </TouchableOpacity>
      </View>
      
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Date of Birth</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Feather name="x" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.pickerContainer}>
              {renderPickerSection(
                'Year', 
                years, 
                tempDate.getFullYear(), 
                handleSelectYear
              )}
              
              {renderPickerSection(
                'Month', 
                months, 
                tempDate.getMonth(), 
                handleSelectMonth
              )}
              
              {renderPickerSection(
                'Day', 
                days, 
                tempDate.getDate(), 
                handleSelectDay
              )}
            </View>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.confirmButton} 
                onPress={handleConfirm}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  // Original styles
  fieldContainer: {
    paddingVertical: 16,
  },
  fieldBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  fieldLabel: {
    fontSize: 14,
    color: '#777777',
    marginBottom: 8,
  },
  valueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldValue: {
    fontSize: 16,
    color: '#333333',
    flex: 1,
  },
  editIconButton: {
    padding: 8,
  },
  
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  pickerSection: {
    flex: 1,
    marginHorizontal: 5,
  },
  pickerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 10,
    textAlign: 'center',
  },
  pickerScrollView: {
    height: 200,
  },
  pickerItem: {
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  selectedItem: {
    backgroundColor: '#7C00FE20',
  },
  pickerItemText: {
    fontSize: 16,
    color: '#333',
  },
  selectedItemText: {
    color: '#7C00FE',
    fontWeight: 'bold',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    padding: 12,
    marginRight: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#555',
  },
  confirmButton: {
    backgroundColor: '#7C00FE',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  confirmButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default DatePickerField;