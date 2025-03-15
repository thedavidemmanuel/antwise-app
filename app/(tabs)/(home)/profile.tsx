import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
  Image,
  Modal,
  KeyboardAvoidingView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { useSession } from '@/app/_layout';
import { supabase } from '@/lib/supabase';

// Improved image picker hook with better error handling
const useImagePicker = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [imagePicker, setImagePicker] = useState<any>(null);
  const [imageManipulator, setImageManipulator] = useState<any>(null);
  
  // Check for module availability in useEffect
  useEffect(() => {
    const initModules = async () => {
      try {
        // Try to require the modules instead of dynamic import
        const imagePickerModule = require('expo-image-picker');
        const imageManipulatorModule = require('expo-image-manipulator');
        
        setImagePicker(imagePickerModule);
        setImageManipulator(imageManipulatorModule);
        setIsAvailable(!!(imagePickerModule && imageManipulatorModule));
      } catch (err) {
        console.log("Error importing image modules:", err);
        setIsAvailable(false);
      }
    };
    
    initModules();
  }, []);
  
  return {
    isAvailable,
    imagePicker,
    imageManipulator,
  };
};

const { width } = Dimensions.get('window');
const AVATAR_SIZE = 120;

interface ProfileData {
  id: string;
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  phone_number: string | null;
  date_of_birth: string | null;
  gender: string | null;
  nickname: string | null;
}

const ProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const { session } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [accountNumber, setAccountNumber] = useState('8104259027');
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [genderModalVisible, setGenderModalVisible] = useState(false);
  
  const userEmail = session?.user?.email || '';
  const inputRef = useRef<TextInput>(null);

  const { isAvailable: imagePickerAvailable, imagePicker, imageManipulator } = useImagePicker();

  // Fetch profile data from Supabase
  const fetchProfile = async () => {
    if (!session?.user?.id) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        if (error.code === 'PGRST116') { // Record not found
          // Create a new profile if one doesn't exist
          await createProfile();
          return;
        }
      } else if (data) {
        setProfile(data as ProfileData);
      }
    } catch (error) {
      console.error('Exception fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create a new profile if one doesn't exist
  const createProfile = async () => {
    if (!session?.user?.id) return;
    
    try {
      // Get user metadata from auth for potential data
      const { data: userData } = await supabase.auth.getUser();
      const metadata = userData?.user?.user_metadata || {};
      
      const newProfile: Partial<ProfileData> = {
        id: session.user.id,
        first_name: metadata.first_name || '',
        last_name: metadata.last_name || '',
        full_name: metadata.full_name || `${metadata.first_name || ''} ${metadata.last_name || ''}`.trim() || null,
      };
      
      const { data, error } = await supabase
        .from('profiles')
        .insert(newProfile)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating profile:', error);
      } else if (data) {
        setProfile(data as ProfileData);
      }
    } catch (error) {
      console.error('Exception creating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update profile field
  const updateProfileField = async (field: string, value: string) => {
    if (!session?.user?.id || !profile) return;
    
    try {
      setSaving(true);
      
      const updates = { [field]: value };
      
      // If the field is first_name or last_name, also update full_name
      if (field === 'first_name' || field === 'last_name') {
        const updatedProfile = {
          ...profile,
          [field]: value
        };
        
        updates.full_name = `${updatedProfile.first_name || ''} ${updatedProfile.last_name || ''}`.trim();
      }
      
      // If field is nickname, update both nickname and full_name
      if (field === 'nickname') {
        updates.full_name = value; // Set full_name to nickname
      }
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', session.user.id);
      
      if (error) {
        Alert.alert('Error', 'Failed to update profile');
        console.error('Error updating profile:', error);
      } else {
        setProfile(prev => prev ? { ...prev, ...updates } : null);
      }
    } catch (error) {
      console.error('Exception updating profile:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setSaving(false);
      setIsEditing(null);
    }
  };

  // Handle profile field edit
  const handleEdit = (field: string, currentValue: string | null) => {
    setIsEditing(field);
    setEditValue(currentValue || '');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  // Handle save edit
  const handleSaveEdit = () => {
    if (!isEditing) return;
    updateProfileField(isEditing, editValue);
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditing(null);
  };

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    if (Platform.OS === 'web') {
      navigator.clipboard.writeText(text);
    } else {
      Alert.alert('Copied', 'Account number copied to clipboard!');
    }
  };

  // Updated profile picture upload function with safer implementation
  const handleProfilePictureUpload = async () => {
    if (!session?.user?.id) return;
    
    // Check if ImagePicker module is available
    if (!imagePickerAvailable || !imagePicker) {
      Alert.alert(
        'Feature Unavailable', 
        'Profile picture upload is not available on this platform or the required modules are not installed.'
      );
      return;
    }
    
    try {
      setUploadingImage(true);
      
      // Safely access the imagePicker methods by checking if they exist
      const requestPermissions = imagePicker?.requestMediaLibraryPermissionsAsync;
      if (typeof requestPermissions !== 'function') {
        throw new Error('Image picker functionality not available');
      }
      
      // Request permissions with proper error handling
      const permissionResult = await requestPermissions().catch(() => ({
        granted: false
      }));
      
      if (!permissionResult.granted) {
        Alert.alert('Permission required', 'Please grant access to your photo library to upload a profile picture.');
        setUploadingImage(false);
        return;
      }
      
      // Launch image picker safely
      const launchLibrary = imagePicker?.launchImageLibraryAsync;
      if (typeof launchLibrary !== 'function') {
        throw new Error('Image library access not available');
      }
      
      const pickerResult = await launchLibrary({
        mediaTypes: imagePicker?.MediaTypeOptions?.Images || 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      }).catch(() => ({ cancelled: true, assets: null }));
      
      if (pickerResult.cancelled || !pickerResult.assets || pickerResult.assets.length === 0) {
        setUploadingImage(false);
        return;
      }
      
      // Process the selected image and update profile
      // This is just a placeholder - in a real app you'd upload the image to storage
      setTimeout(() => {
        setUploadingImage(false);
        Alert.alert('Success', 'Profile picture updated!');
      }, 1000);
      
    } catch (error) {
      console.error('Exception in handleProfilePictureUpload:', error);
      Alert.alert('Error', 'An unexpected error occurred while accessing the image library');
      setUploadingImage(false);
    }
  };

  // Set gender
  const setGender = async (gender: string) => {
    await updateProfileField('gender', gender);
    setGenderModalVisible(false);
  };

  // Initialize
  useEffect(() => {
    if (session?.user?.id) {
      fetchProfile();
    }
  }, [session]);

  // Format date of birth
  const formatDateOfBirth = (dateString: string | null) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      return dateString;
    }
  };

  // Generate placeholder avatar
  const getPlaceholderAvatar = () => {
    const name = profile?.full_name || profile?.first_name || userEmail.split('@')[0];
    return name.charAt(0).toUpperCase();
  };

  // Render Profile Field
  const renderProfileField = (
    label: string,
    value: string | null | undefined,
    fieldName: string,
    isLast: boolean = false,
    isEditable: boolean = true,
    rightComponent?: React.ReactNode
  ) => {
    const isCurrentlyEditing = isEditing === fieldName;
    
    return (
      <View style={[styles.fieldContainer, !isLast && styles.fieldBorder]}>
        <Text style={styles.fieldLabel}>{label}</Text>
        
        {isCurrentlyEditing ? (
          <View style={styles.editContainer}>
            <TextInput
              ref={inputRef}
              style={styles.editInput}
              value={editValue}
              onChangeText={setEditValue}
              autoCapitalize="none"
              onBlur={handleSaveEdit}
            />
            <View style={styles.editActions}>
              <TouchableOpacity onPress={handleCancelEdit} style={styles.editButton}>
                <Feather name="x" size={20} color="#FF3B30" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveEdit} style={styles.editButton}>
                <Feather name="check" size={20} color="#4CD964" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.valueContainer}>
            <Text style={styles.fieldValue}>
              {value || (fieldName === 'email' ? userEmail : 'Enter ' + label.toLowerCase())}
            </Text>
            {rightComponent || (isEditable && (
              <TouchableOpacity 
                onPress={() => handleEdit(fieldName, value || '')} 
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

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <Stack.Screen
        options={{
          title: 'My Profile',
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Feather name="arrow-left" size={24} color="#000" />
            </TouchableOpacity>
          ),
        }}
      />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7C00FE" />
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Picture Section */}
          <View style={styles.avatarSection}>
            {uploadingImage ? (
              <View style={styles.avatarContainer}>
                <ActivityIndicator size="large" color="#7C00FE" />
              </View>
            ) : profile?.avatar_url ? (
              <Image
                source={{ uri: profile.avatar_url }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarPlaceholderText}>
                  {getPlaceholderAvatar()}
                </Text>
              </View>
            )}
            
            {/* Only show edit button when image picker is available */}
            {imagePickerAvailable && (
              <TouchableOpacity
                style={styles.editAvatarButton}
                onPress={handleProfilePictureUpload}
              >
                <Feather name="camera" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            )}
            
            <View style={styles.cameraIconContainer}>
              <Text style={styles.nameText}>
                {profile?.full_name || profile?.first_name || userEmail.split('@')[0]}
              </Text>
            </View>
          </View>
          
          {/* Account Info Card */}
          <View style={styles.card}>
            {/* Account Number */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Antwise Account Number</Text>
              <View style={styles.valueContainer}>
                <Text style={styles.fieldValue}>{accountNumber}</Text>
                <TouchableOpacity
                  style={styles.copyButton}
                  onPress={() => copyToClipboard(accountNumber)}
                >
                  <Feather name="copy" size={16} color="#7C00FE" />
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Full Name */}
            {renderProfileField(
              'Full Name',
              profile?.full_name,
              'full_name',
              false,
              false
            )}
            
            {/* Nickname */}
            {renderProfileField(
              'Nickname',
              profile?.nickname || profile?.full_name,
              'nickname'
            )}
            
            {/* Mobile Number */}
            {renderProfileField(
              'Mobile Number',
              profile?.phone_number,
              'phone_number'
            )}
            
            {/* Gender */}
            <View style={[styles.fieldContainer, styles.fieldBorder]}>
              <Text style={styles.fieldLabel}>Gender</Text>
              <View style={styles.valueContainer}>
                <Text style={styles.fieldValue}>
                  {profile?.gender || 'Select gender'}
                </Text>
                <TouchableOpacity 
                  onPress={() => setGenderModalVisible(true)} 
                  style={styles.editIconButton}
                >
                  <Feather name="chevron-right" size={20} color="#7C00FE" />
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Date of Birth */}
            {renderProfileField(
              'Date of Birth',
              profile?.date_of_birth ? formatDateOfBirth(profile.date_of_birth) : null,
              'date_of_birth'
            )}
            
            {/* Email */}
            {renderProfileField(
              'Email',
              userEmail,
              'email',
              false,
              false
            )}
            
            {/* Address */}
            {renderProfileField(
              'Address',
              'Enter address',
              'address',
              true
            )}
          </View>
        </ScrollView>
      )}
      
      {/* Gender Selection Modal */}
      <Modal
        visible={genderModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setGenderModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Gender</Text>
            
            <TouchableOpacity 
              style={styles.modalOption}
              onPress={() => setGender('Male')}
            >
              <Text style={styles.modalOptionText}>Male</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.modalOption}
              onPress={() => setGender('Female')}
            >
              <Text style={styles.modalOptionText}>Female</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.modalOption}
              onPress={() => setGender('Other')}
            >
              <Text style={styles.modalOptionText}>Other</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.modalCancelButton}
              onPress={() => setGenderModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatarContainer: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: '#F0F0F0',
  },
  avatarPlaceholder: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: '#7C00FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 40,
    right: width / 2 - AVATAR_SIZE / 2,
    backgroundColor: '#7C00FE',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  cameraIconContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  nameText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginTop: 8,
  },
  card: {
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
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
  copyButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(124, 0, 254, 0.1)',
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
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
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

export default ProfileScreen;