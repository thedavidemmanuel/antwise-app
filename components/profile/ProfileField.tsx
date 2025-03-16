import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface ProfileFieldProps {
  label: string;
  value: string | null | undefined;
  fieldName: string;
  isLast?: boolean;
  isEditable?: boolean;
  isEditing: boolean;
  editValue: string;
  rightComponent?: React.ReactNode;
  onEdit: (field: string, value: string | null) => void;
  onChangeEditValue: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const ProfileField: React.FC<ProfileFieldProps> = ({
  label,
  value,
  fieldName,
  isLast = false,
  isEditable = true,
  isEditing,
  editValue,
  rightComponent,
  onEdit,
  onChangeEditValue,
  onSave,
  onCancel,
}) => {
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
    <View style={[styles.fieldContainer, !isLast && styles.fieldBorder]}>
      <Text style={styles.fieldLabel}>{label}</Text>
      
      {isEditing ? (
        <View style={styles.editContainer}>
          <TextInput
            ref={inputRef}
            style={styles.editInput}
            value={editValue}
            onChangeText={onChangeEditValue}
            autoCapitalize="none"
            onBlur={onSave}
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
            {value || `Enter ${label.toLowerCase()}`}
          </Text>
          {rightComponent || (isEditable && (
            <TouchableOpacity 
              onPress={() => onEdit(fieldName, value || '')} 
              style={styles.editIconButton}
            >
              <Feather name="edit-2" size={16} color="#7C00FE" />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
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
  editInput: {
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
});

export default ProfileField;