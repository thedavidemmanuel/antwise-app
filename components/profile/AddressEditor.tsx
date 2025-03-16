import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  Modal, 
  KeyboardAvoidingView,
  Platform,
  StyleSheet 
} from 'react-native';
import { Feather } from '@expo/vector-icons';

interface AddressEditorProps {
  value: string | null | undefined;
  onSave: (address: string) => void;
}

const AddressEditor: React.FC<AddressEditorProps> = ({ value, onSave }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [address, setAddress] = useState(value || '');

  const handleSave = () => {
    onSave(address);
    setModalVisible(false);
  };

  const handleCancel = () => {
    // Reset to original value
    setAddress(value || '');
    setModalVisible(false);
  };

  return (
    <>
      <View style={[styles.fieldContainer]}>
        <Text style={styles.fieldLabel}>Address</Text>
        <View style={styles.valueContainer}>
          <Text style={styles.fieldValue} numberOfLines={2}>
            {value || 'Enter address'}
          </Text>
          <TouchableOpacity 
            onPress={() => setModalVisible(true)} 
            style={styles.editIconButton}
          >
            <Feather name="chevron-right" size={20} color="#7C00FE" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Address Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ width: '100%', alignItems: 'center' }}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Enter Address</Text>
              
              <TextInput
                style={styles.addressInput}
                value={address}
                onChangeText={setAddress}
                placeholder="Enter your address"
                multiline={true}
                numberOfLines={3}
                autoFocus
              />
              
              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={[styles.modalActionButton, styles.cancelButton]}
                  onPress={handleCancel}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.modalActionButton, styles.saveButton]}
                  onPress={handleSave}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  fieldContainer: {
    paddingVertical: 16,
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
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
    textAlign: 'center',
  },
  addressInput: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginVertical: 16,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalActionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F0F0F0',
  },
  saveButton: {
    backgroundColor: '#7C00FE',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#333333',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default AddressEditor;