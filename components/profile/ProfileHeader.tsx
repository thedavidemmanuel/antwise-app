import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { supabase } from '@/lib/supabase';

// Get screen dimensions for responsive design
const { width } = Dimensions.get('window');
const AVATAR_SIZE = 120;

interface ProfileHeaderProps {
  userId: string;
  fullName: string | null | undefined;
  firstName: string | null | undefined;
  email: string;
  avatarUrl: string | null | undefined;
  onAvatarUpdate: (url: string) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  userId,
  fullName,
  firstName,
  email,
  avatarUrl,
  onAvatarUpdate,
}) => {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [avatarSource, setAvatarSource] = useState<string | null>(avatarUrl || null);

  // Generate placeholder avatar when no image is available
  const getPlaceholderAvatar = () => {
    const name = fullName || firstName || email.split('@')[0];
    return name.charAt(0).toUpperCase();
  };

  // Profile picture upload function
  const handleProfilePictureUpload = async () => {
    if (!userId) return;
    
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
      const fileName = `${userId}-${Date.now()}.${fileExtension}`;
      
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
        .eq('id', userId);
      
      if (updateError) {
        Alert.alert('Error', 'Failed to update profile with new avatar');
        console.error('Error updating profile with avatar_url:', updateError);
      } else {
        // Notify parent component
        onAvatarUpdate(fileName);
        Alert.alert('Success', 'Profile picture updated!');
      }
    } catch (error) {
      console.error('Exception in handleProfilePictureUpload:', error);
      Alert.alert('Error', 'An unexpected error occurred while uploading the image');
    } finally {
      setUploadingImage(false);
    }
  };

  // Update avatar source when prop changes
  React.useEffect(() => {
    setAvatarSource(avatarUrl || null);
  }, [avatarUrl]);

  return (
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
          {fullName || firstName || email.split('@')[0]}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default ProfileHeader;