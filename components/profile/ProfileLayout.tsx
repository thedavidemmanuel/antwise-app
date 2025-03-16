import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';

// Import child components without file extensions
import ProfileHeader from './ProfileHeader';
import AccountNumber from './AccountNumber';
import ProfileField from './ProfileField';
import CountryCodePicker from './CountryCodePicker';
import GenderSelector from './GenderSelector';
import DatePickerField from './DatePickerField';
import AddressEditor from './AddressEditor';

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
  address: string | null;
}

interface ProfileLayoutProps {
  userId: string;
  userEmail: string;
}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({ userId, userEmail }) => {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [selectedCountryCode, setSelectedCountryCode] = useState('+250'); // Default to Rwanda

  // Fetch profile data from Supabase
  const fetchProfile = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
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
      }
    } catch (error) {
      console.error('Exception fetching profile:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Create a new profile if one doesn't exist
  const createProfile = async () => {
    if (!userId) return;
    
    try {
      // Get user metadata from auth for potential data
      const { data: userData } = await supabase.auth.getUser();
      const metadata = userData?.user?.user_metadata || {};
      
      const newProfile: Partial<ProfileData> = {
        id: userId,
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
    if (!userId || !profile) return;
    
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
            console.error('Invalid date format:', e);
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
        .eq('id', userId);
      
      if (updateError) {
        console.error('Error updating profile:', updateError);
      } else {
        // Update local state with the new values
        setProfile(prev => prev ? { ...prev, ...updates } : null);
      }
    } catch (error) {
      console.error('Exception updating profile:', error);
    } finally {
      setSaving(false);
      setIsEditing(null);
    }
  };

  // Handle profile field edit
  const handleEdit = (field: string, currentValue: string | null) => {
    setIsEditing(field);
    // If editing phone number, extract the number without country code
    if (field === 'phone_number' && currentValue) {
      // Try to extract country code and phone number
      const match = currentValue.match(/^(\+\d+)\s*(.*)$/);
      if (match) {
        setSelectedCountryCode(match[1]);
        setEditValue(match[2]);
      } else {
        setEditValue(currentValue);
      }
    } else {
      setEditValue(currentValue || '');
    }
  };

  // Handle save edit
  const handleSaveEdit = () => {
    if (!isEditing) return;
    
    // For phone number, combine country code with the number
    if (isEditing === 'phone_number') {
      updateProfileField(isEditing, `${selectedCountryCode} ${editValue}`);
    } else {
      updateProfileField(isEditing, editValue);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditing(null);
  };

  // Handle date selection
  const handleDateSelected = (date: Date) => {
    const formattedDate = date.toISOString().split('T')[0];
    updateProfileField('date_of_birth', formattedDate);
  };

  // Handle gender selection
  const handleGenderSelect = (gender: string) => {
    updateProfileField('gender', gender);
  };

  // Handle address update
  const handleAddressUpdate = (address: string) => {
    updateProfileField('address', address);
  };

  // Handle avatar update
  const handleAvatarUpdate = (url: string) => {
    setProfile(prev => prev ? { ...prev, avatar_url: url } : null);
  };

  // Refresh profile data
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProfile();
  };

  // Initialize
  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7C00FE" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
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
        <ProfileHeader 
          userId={userId}
          fullName={profile?.full_name}
          firstName={profile?.first_name}
          email={userEmail}
          avatarUrl={profile?.avatar_url}
          onAvatarUpdate={handleAvatarUpdate}
        />
        
        {/* Account Info Card */}
        <View style={styles.card}>
          {/* Account Number */}
          <AccountNumber 
            phoneNumber={profile?.phone_number ?? null}
            userId={userId}
            onEditPress={() => handleEdit('phone_number', profile?.phone_number ?? null)} 
          />
          
          {/* Full Name */}
          <ProfileField
            label="Full Name"
            value={profile?.full_name}
            fieldName="full_name"
            isEditing={isEditing === 'full_name'}
            editValue={editValue}
            isEditable={false}
            onEdit={handleEdit}
            onChangeEditValue={setEditValue}
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
          />
          
          {/* Nickname */}
          <ProfileField
            label="Nickname"
            value={profile?.nickname || profile?.full_name}
            fieldName="nickname"
            isEditing={isEditing === 'nickname'}
            editValue={editValue}
            onEdit={handleEdit}
            onChangeEditValue={setEditValue}
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
          />
          
          {/* Mobile Number with Country Code */}
          <CountryCodePicker
            label="Mobile Number"
            phoneNumber={profile?.phone_number}
            isEditing={isEditing === 'phone_number'}
            selectedCountryCode={selectedCountryCode}
            phoneValue={editValue}
            onEdit={handleEdit}
            onChangePhoneValue={setEditValue}
            onSelectCountryCode={setSelectedCountryCode}
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
          />
          
          {/* Gender */}
          <GenderSelector
            value={profile?.gender}
            onSelect={handleGenderSelect}
          />
          
          {/* Date of Birth */}
          <DatePickerField
            label="Date of Birth"
            value={profile?.date_of_birth}
            onDateSelected={handleDateSelected}
            onEditText={handleEdit}
          />
          
          {/* Email */}
          <ProfileField
            label="Email"
            value={userEmail}
            fieldName="email"
            isEditing={isEditing === 'email'}
            editValue={editValue}
            isEditable={false}
            onEdit={handleEdit}
            onChangeEditValue={setEditValue}
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
          />
          
          {/* Address */}
          <AddressEditor
            value={profile?.address}
            onSave={handleAddressUpdate}
          />
        </View>

        {/* Extra padding at bottom to ensure content is visible when keyboard is open */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

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
});

export default ProfileLayout;