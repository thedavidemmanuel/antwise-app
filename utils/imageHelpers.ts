/**
 * Helper utilities for handling images in the app
 */

import { Platform, Alert } from 'react-native';

// Safe imports with fallbacks
let ImagePicker: any = null;
let ImageManipulator: any = null;

try {
  ImagePicker = require('expo-image-picker');
  ImageManipulator = require('expo-image-manipulator');
} catch (err) {
  console.log('Image modules not available:', err);
}

/**
 * Checks if image picker functionality is available
 */
export const isImagePickerAvailable = () => {
  return !!ImagePicker;
};

/**
 * Picks an image from the device's media library
 */
export const pickImage = async ({
  aspect = [1, 1],
  quality = 0.8,
  allowsEditing = true,
} = {}) => {
  if (!isImagePickerAvailable()) {
    Alert.alert('Feature Unavailable', 'Image picker is not available on this device.');
    return null;
  }

  try {
    // Request permissions first
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Please allow access to your photo library.');
      return null;
    }
    
    // Launch the picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing,
      aspect,
      quality,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      return result.assets[0]; // Return the selected asset
    }
    
    return null; // User cancelled or no selection
  } catch (error) {
    console.error('Error picking image:', error);
    return null;
  }
};

/**
 * Processes an image (resize, compress, etc)
 */
export const processImage = async (uri: string, options = { width: 300, height: 300, compress: 0.7 }) => {
  if (!ImageManipulator) {
    console.error('Image manipulator not available');
    return null;
  }
  
  try {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: options.width, height: options.height } }],
      { format: ImageManipulator.SaveFormat.JPEG, compress: options.compress }
    );
    
    return result;
  } catch (error) {
    console.error('Error processing image:', error);
    return null;
  }
};

/**
 * Gets a blob from an image URI
 */
export const getImageBlob = async (uri: string) => {
  try {
    const response = await fetch(uri);
    return await response.blob();
  } catch (error) {
    console.error('Error converting image to blob:', error);
    return null;
  }
};
