import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
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
  const formatDateOfBirth = (dateString: string | null | undefined) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      return dateString || '';
    }
  };

  const handleShowDatePicker = () => {
    if (Platform.OS === 'android') {
      try {
        const currentDate = value ? new Date(value) : new Date();
        
        DateTimePickerAndroid.open({
          value: currentDate,
          onChange: (event, selectedDate) => {
            if (event.type !== 'dismissed' && selectedDate) {
              console.log('Selected date:', selectedDate);
              onDateSelected(selectedDate);
            }
          },
          mode: 'date',
          display: 'default',
          maximumDate: new Date()
        });
      } catch (error) {
        console.error('Failed to open date picker:', error);
        if (onEditText) {
          onEditText('date_of_birth', value ?? null);
        }
      }
    } else {
      // For iOS, use the text input fallback for now
      if (onEditText) {
        onEditText('date_of_birth', value ?? null);
      }
    }
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
    </View>
  );
};

const styles = StyleSheet.create({
  // Your existing styles
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
});

export default DatePickerField;