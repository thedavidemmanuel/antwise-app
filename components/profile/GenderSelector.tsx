import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface GenderSelectorProps {
  value: string | null | undefined;
  onSelect: (gender: string) => void;
}

const GenderSelector: React.FC<GenderSelectorProps> = ({ value, onSelect }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleGenderSelect = (gender: string) => {
    onSelect(gender);
    setModalVisible(false);
  };

  return (
    <>
      <View style={[styles.fieldContainer, styles.fieldBorder]}>
        <Text style={styles.fieldLabel}>Gender</Text>
        <View style={styles.valueContainer}>
          <Text style={styles.fieldValue}>
            {value || 'Select gender'}
          </Text>
          <TouchableOpacity 
            onPress={() => setModalVisible(true)} 
            style={styles.editIconButton}
          >
            <Feather name="chevron-right" size={20} color="#7C00FE" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Gender Selection Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Gender</Text>
            
            <TouchableOpacity 
              style={styles.modalOption}
              onPress={() => handleGenderSelect('Male')}
            >
              <Text style={styles.modalOptionText}>Male</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.modalOption}
              onPress={() => handleGenderSelect('Female')}
            >
              <Text style={styles.modalOptionText}>Female</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.modalOption}
              onPress={() => handleGenderSelect('Other')}
            >
              <Text style={styles.modalOptionText}>Other</Text>
            </TouchableOpacity>
            
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
  modalOption: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
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

export default GenderSelector;