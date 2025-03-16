import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  Modal, 
  FlatList, 
  StyleSheet 
} from 'react-native';
import { Feather } from '@expo/vector-icons';

// Country codes data
const COUNTRY_CODES = [
  { code: '+250', country: 'Rwanda' },
  { code: '+256', country: 'Uganda' },
  { code: '+254', country: 'Kenya' },
  { code: '+255', country: 'Tanzania' },
  { code: '+257', country: 'Burundi' },
  { code: '+243', country: 'Congo DRC' },
  { code: '+27', country: 'South Africa' },
  { code: '+251', country: 'Ethiopia' },
  { code: '+20', country: 'Egypt' },
  { code: '+234', country: 'Nigeria' },
  { code: '+1', country: 'USA/Canada' },
  { code: '+44', country: 'UK' },
  { code: '+33', country: 'France' },
  { code: '+49', country: 'Germany' },
];

interface CountryCodePickerProps {
  label: string;
  phoneNumber: string | null | undefined;
  isEditing: boolean;
  selectedCountryCode: string;
  phoneValue: string;
  onEdit: (field: string, value: string | null) => void;
  onChangePhoneValue: (value: string) => void;
  onSelectCountryCode: (code: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const CountryCodePicker: React.FC<CountryCodePickerProps> = ({
  label,
  phoneNumber,
  isEditing,
  selectedCountryCode,
  phoneValue,
  onEdit,
  onChangePhoneValue,
  onSelectCountryCode,
  onSave,
  onCancel,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // Focus the input when editing starts
  React.useEffect(() => {
    if (isEditing) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isEditing]);

  return (
    <>
      <View style={[styles.fieldContainer, styles.fieldBorder]}>
        <Text style={styles.fieldLabel}>{label}</Text>
        
        {isEditing ? (
          <View style={styles.editContainer}>
            <TouchableOpacity 
              style={styles.countryCodeSelector}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.countryCodeText}>{selectedCountryCode}</Text>
              <Feather name="chevron-down" size={16} color="#7C00FE" />
            </TouchableOpacity>
            <TextInput
              ref={inputRef}
              style={styles.phoneEditInput}
              value={phoneValue}
              onChangeText={onChangePhoneValue}
              keyboardType="phone-pad"
              autoCapitalize="none"
              onBlur={onSave}
              placeholder="Enter phone number"
            />
            <View style={styles.editActions}>
              <TouchableOpacity onPress={onCancel} style={styles.editButton}>
                <Feather name="x" size={20} color="#FF3B30" />
              </TouchableOpacity>
              <TouchableOpacity onPress={onSave} style={styles.editButton}>
                <Feather name="check" size={20} color="#4CD964" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.valueContainer}>
            <Text style={styles.fieldValue}>
              {phoneNumber || 'Enter phone number'}
            </Text>
            <TouchableOpacity 
              onPress={() => onEdit('phone_number', phoneNumber || '')} 
              style={styles.editIconButton}
            >
              <Feather name="edit-2" size={16} color="#7C00FE" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Country Code Selection Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.countryCodeModalContent]}>
            <Text style={styles.modalTitle}>Select Country Code</Text>
            
            <FlatList
              data={COUNTRY_CODES}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[
                    styles.countryCodeItem,
                    selectedCountryCode === item.code && styles.selectedCountryCodeItem
                  ]}
                  onPress={() => {
                    onSelectCountryCode(item.code);
                    setModalVisible(false);
                  }}
                >
                  <Text style={[
                    styles.countryCodeItemText,
                    selectedCountryCode === item.code && styles.selectedCountryCodeItemText
                  ]}>
                    {item.code} ({item.country})
                  </Text>
                  {selectedCountryCode === item.code && (
                    <Feather name="check" size={18} color="#7C00FE" />
                  )}
                </TouchableOpacity>
              )}
              style={styles.countryCodeList}
            />
            
            <TouchableOpacity 
              style={styles.modalCancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
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
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCodeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(124, 0, 254, 0.1)',
    marginRight: 8,
  },
  countryCodeText: {
    fontSize: 16,
    color: '#7C00FE',
    marginRight: 4,
  },
  phoneEditInput: {
    flex: 1,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#7C00FE',
    paddingVertical: 4,
  },
  editActions: {
    flexDirection: 'row',
  },
  editButton: {
    padding: 8,
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  countryCodeModalContent: {
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
    textAlign: 'center',
  },
  countryCodeList: {
    width: '100%',
    marginVertical: 10,
  },
  countryCodeItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedCountryCodeItem: {
    backgroundColor: 'rgba(124, 0, 254, 0.05)',
  },
  countryCodeItemText: {
    fontSize: 16,
    color: '#333333',
  },
  selectedCountryCodeItemText: {
    color: '#7C00FE',
    fontWeight: '600',
  },
  modalCancelButton: {
    marginTop: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(124, 0, 254, 0.1)',
    borderRadius: 8,
  },
  modalCancelText: {
    fontSize: 16,
    color: '#7C00FE',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default CountryCodePicker;