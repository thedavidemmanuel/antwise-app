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
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { useSession } from '@/app/_layout';
import { supabase } from '@/lib/supabase';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import DateTimePicker from '@react-native-community/datetimepicker';

// Get screen dimensions for responsive design
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
  address: string | null; // Add address field to interface
}

const ProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const { session } = useSession();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [accountNumber, setAccountNumber] = useState('8104259027');
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [genderModalVisible, setGenderModalVisible] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [avatarSource, setAvatarSource] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  
  const userEmail = session?.user?.email || '';
  const inputRef = useRef<TextInput>(null);

  // Fetch profile data from Supabase
  const fetchProfile = async () => {
    if (!session?.user?.id) return;
    
    try {
      setLoading(true);
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (profileError) {
        console.error('Error fetching profile:', profileError);
        if (profileError.code === 'PGRST116') { // Record not found
          // Create a new profile if one doesn't exist
          await createProfile();
          return;
        }
      } else if (profileData) {
        setProfile(profileData as ProfileData);
        
        // If there's an avatar_url, load it from Supabase Storage
        if (profileData.avatar_url) {
          fetchAvatar(profileData.avatar_url);
        }
      }
    } catch (error) {
      console.error('Exception fetching profile:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch avatar from storage
  const fetchAvatar = async (avatarUrl: string) => {
    try {
      const { data: fileData, error: fileError } = await supabase.storage
        .from('avatars')
        .download(avatarUrl);
        
      if (fileError) {
        console.error('Error downloading avatar:', fileError);
      } else if (fileData) {
        // Convert blob to base64 and set as avatar source
        const fr = new FileReader();
        fr.onload = () => {
          setAvatarSource(fr.result as string);
        };
        fr.readAsDataURL(fileData);
      }
    } catch (downloadError) {
      console.error('Error processing avatar download:', downloadError);
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
      
      const { data: createdProfile, error: createError } = await supabase
        .from('profiles')
        .insert(newProfile)
        .select()
        .single();
      
      if (createError) {
        console.error('Error creating profile:', createError);
      } else if (createdProfile) {
        setProfile(createdProfile as ProfileData);
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
      
      // Create updates object
      const updates: Record<string, any> = {};
      
      // Handle special cases for different field types
      if (field === 'date_of_birth') {
        // Set to null if value is empty string, otherwise use the value if it's a valid date
        if (!value.trim()) {
          updates[field] = null;
        } else {
          // Try to parse the value as a date
          try {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
              // Format the date as YYYY-MM-DD for PostgreSQL
              updates[field] = date.toISOString().split('T')[0];
            } else {
              throw new Error('Invalid date format');
            }
          } catch (e) {
            Alert.alert('Error', 'Please enter a valid date in format MM/DD/YYYY');
            setSaving(false);
            setIsEditing(null);
            return;
          }
        }
      } else {
        // For other fields, use the value as is
        updates[field] = value.trim() || null;
      }
      
      // If the field is first_name or last_name, also update full_name
      if (field === 'first_name' || field === 'last_name') {
        const updatedProfile = {
          ...profile,
          [field]: value
        };
        
        updates.full_name = `${updatedProfile.first_name || ''} ${updatedProfile.last_name || ''}`.trim() || null;
      }
      
      // If field is nickname, update both nickname and full_name
      if (field === 'nickname') {
        updates.full_name = value.trim() || null; // Set full_name to nickname
      }
      
      console.log('Updating profile with:', updates);
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', session.user.id);
      
      if (updateError) {
        Alert.alert('Error', 'Failed to update profile');
        console.error('Error updating profile:', updateError);
      } else {
        // Update local state with the new values
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

  // Profile picture upload function
  const handleProfilePictureUpload = async () => {
    if (!session?.user?.id) return;
    
    try {
      setUploadingImage(true);
      
      // Request permissions
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission required', 'Please grant access to your photo library to upload a profile picture.');
        setUploadingImage(false);
        return;
      }
      
      // Launch image picker
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (pickerResult.canceled || !pickerResult.assets || pickerResult.assets.length === 0) {
        setUploadingImage(false);
        return;
      }
      
      // Get the selected asset
      const asset = pickerResult.assets[0];
      
      // Set temporary preview
      setAvatarSource(asset.uri);
      
      // Use FileSystem to read the file directly instead of fetch
      const fileInfo = await FileSystem.getInfoAsync(asset.uri);
      
      if (!fileInfo.exists) {
        throw new Error('File does not exist');
      }
      
      // Create file name with proper extension
      const fileExtension = asset.uri.split('.').pop() || 'jpg';
      const fileName = `${session.user.id}-${Date.now()}.${fileExtension}`;
      
      // Read the file content directly
      const fileContent = await FileSystem.readAsStringAsync(asset.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      // Upload directly using base64
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, fileContent, {
          contentType: `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`,
          upsert: true
        });
      
      if (uploadError) {
        Alert.alert('Error', 'Failed to upload profile picture');
        console.error('Error uploading image:', uploadError);
        setUploadingImage(false);
        return;
      }
      
      // Update profile with new avatar_url
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: fileName })
        .eq('id', session.user.id);
      
      if (updateError) {
        Alert.alert('Error', 'Failed to update profile with new avatar');
        console.error('Error updating profile with avatar_url:', updateError);
      } else {
        // Update local state
        setProfile(prev => prev ? { ...prev, avatar_url: fileName } : null);
        Alert.alert('Success', 'Profile picture updated!');
      }
    } catch (error) {
      console.error('Exception in handleProfilePictureUpload:', error);
      Alert.alert('Error', 'An unexpected error occurred while uploading the image');
    } finally {
      setUploadingImage(false);
    }
  };

  // Set gender
  const setGender = async (gender: string) => {
    await updateProfileField('gender', gender);
    setGenderModalVisible(false);
  };

  // Set address
  const setAddress = async (address: string) => {
    await updateProfileField('address', address);
    setAddressModalVisible(false);
  };

  // Handle date change
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    
    if (event.type === 'dismissed') {
      return;
    }
    
    if (selectedDate) {
      setTempDate(selectedDate);
      
      // Format date for display and storage (YYYY-MM-DD)
      const formattedDate = selectedDate.toISOString().split('T')[0];
      updateProfileField('date_of_birth', formattedDate);
    }
  };

  // Show date picker
  const showDatePickerModal = () => {
    // Initialize with current date value if available
    if (profile?.date_of_birth) {
      setTempDate(new Date(profile.date_of_birth));
    } else {
      setTempDate(new Date());
    }
    setShowDatePicker(true);
  };

  // Refresh profile data
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProfile();
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
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={['#7C00FE']}
              tintColor="#7C00FE"
            />
          }
        >
          {/* Profile Picture Section */}
          <View style={styles.avatarSection}>
            {uploadingImage ? (
              <View style={styles.avatarContainer}>
                <ActivityIndicator size="large" color="#7C00FE" />
              </View>
            ) : avatarSource ? (
              <Image
                source={{ uri: avatarSource }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarPlaceholderText}>
                  {getPlaceholderAvatar()}
                </Text>
              </View>
            )}
            
            <TouchableOpacity
              style={styles.editAvatarButton}
              onPress={handleProfilePictureUpload}
            >
              <Feather name="camera" size={16} color="#FFFFFF" />
            </TouchableOpacity>
            
            <View style={styles.nameContainer}>
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
            <View style={[styles.fieldContainer, styles.fieldBorder]}>
              <Text style={styles.fieldLabel}>Date of Birth</Text>
              <View style={styles.valueContainer}>
                <Text style={styles.fieldValue}>
                  {profile?.date_of_birth ? formatDateOfBirth(profile.date_of_birth) : 'Select date of birth'}
                </Text>
                <TouchableOpacity 
                  onPress={showDatePickerModal}
                  style={styles.editIconButton}
                >
                  <Feather name="calendar" size={16} color="#7C00FE" />
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Email */}
            {renderProfileField(
              'Email',
              userEmail,
              'email',
              false,
              false
            )}
            
            {/* Address */}
            <View style={[styles.fieldContainer]}>
              <Text style={styles.fieldLabel}>Address</Text>
              <View style={styles.valueContainer}>
                <Text style={styles.fieldValue} numberOfLines={2}>
                  {profile?.address || 'Enter address'}
                </Text>
                <TouchableOpacity 
                  onPress={() => setAddressModalVisible(true)} 
                  style={styles.editIconButton}
                >
                  <Feather name="chevron-right" size={20} color="#7C00FE" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Extra padding at bottom to ensure content is visible when keyboard is open */}
          <View style={styles.bottomPadding} />
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

      {/* Address Modal */}
      <Modal
        visible={addressModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAddressModalVisible(false)}
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
                value={profile?.address || ''}
                onChangeText={(text) => setProfile(prev => prev ? { ...prev, address: text } : null)}
                placeholder="Enter your address"
                multiline={true}
                numberOfLines={3}
                autoFocus
              />
              
              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={[styles.modalActionButton, styles.cancelButton]}
                  onPress={() => setAddressModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.modalActionButton, styles.saveButton]}
                  onPress={() => setAddress(profile?.address || '')}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={tempDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}
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
  bottomPadding: {
    height: 100, // Add extra padding at bottom
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
  nameContainer: {
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
  modalCancelText: {
    fontSize: 16,
    color: '#7C00FE',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ProfileScreen;