import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  USER_EMAIL: 'antwise:user_email',
  USER_FIRST_NAME: 'antwise:user_first_name',
  USER_LAST_NAME: 'antwise:user_last_name',
  HAS_SEEN_ONBOARDING: 'antwise:has_seen_onboarding'
};

// Store user details securely
export async function storeUserDetails(email: string, firstName: string, lastName: string) {
  try {
    await AsyncStorage.multiSet([
      [KEYS.USER_EMAIL, email],
      [KEYS.USER_FIRST_NAME, firstName],
      [KEYS.USER_LAST_NAME, lastName],
    ]);
    return true;
  } catch (error) {
    console.error('Error storing user details:', error);
    return false;
  }
}

// Get stored user details
export async function getUserDetails() {
  try {
    const values = await AsyncStorage.multiGet([
      KEYS.USER_EMAIL,
      KEYS.USER_FIRST_NAME,
      KEYS.USER_LAST_NAME,
    ]);
    
    const email = values[0][1];
    const firstName = values[1][1];
    const lastName = values[2][1];

    if (email && firstName) {
      return { email, firstName, lastName };
    }
    return null;
  } catch (error) {
    console.error('Error getting user details:', error);
    return null;
  }
}

// Clear stored user details on logout
export async function clearUserDetails() {
  try {
    await AsyncStorage.multiRemove([
      KEYS.USER_EMAIL,
      KEYS.USER_FIRST_NAME,
      KEYS.USER_LAST_NAME,
    ]);
    return true;
  } catch (error) {
    console.error('Error clearing user details:', error);
    return false;
  }
}

// Mark that user has seen onboarding
export async function markOnboardingSeen() {
  try {
    await AsyncStorage.setItem(KEYS.HAS_SEEN_ONBOARDING, 'true');
    return true;
  } catch (error) {
    console.error('Error marking onboarding as seen:', error);
    return false;
  }
}

// Check if user has seen onboarding
export async function hasSeenOnboarding() {
  try {
    const value = await AsyncStorage.getItem(KEYS.HAS_SEEN_ONBOARDING);
    return value === 'true';
  } catch (error) {
    console.error('Error checking if onboarding has been seen:', error);
    return false;
  }
}
