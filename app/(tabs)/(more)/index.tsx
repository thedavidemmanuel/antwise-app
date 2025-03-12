import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSession } from '@/app/_layout'; // Replace Clerk hooks
import { supabase } from '@/lib/supabase';

// Option item component
const OptionItem = ({ 
  icon, 
  title, 
  subtitle, 
  onPress, 
  rightComponent 
}: { 
  icon: React.ComponentProps<typeof Feather>['name']; 
  title: string; 
  subtitle?: string;
  onPress: () => void;
  rightComponent?: React.ReactNode;
}) => (
  <TouchableOpacity style={styles.optionItem} onPress={onPress}>
    <View style={styles.optionIconContainer}>
      <Feather name={icon} size={20} color="#7C00FE" />
    </View>
    
    <View style={styles.optionTextContainer}>
      <Text style={styles.optionTitle}>{title}</Text>
      {subtitle && <Text style={styles.optionSubtitle}>{subtitle}</Text>}
    </View>
    
    {rightComponent ? (
      rightComponent
    ) : (
      <Feather name="chevron-right" size={20} color="#999" />
    )}
  </TouchableOpacity>
);

export default function MoreScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { session } = useSession(); // Use our Supabase session
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = React.useState(true);
  const [isBiometricEnabled, setIsBiometricEnabled] = React.useState(false);
  
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      // Router will automatically redirect to sign in through auth layout protection
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  // Extract user info from session
  const userEmail = session?.user?.email || 'user@example.com';
  // Extract name from email (if available)
  const userDisplayName = userEmail.split('@')[0];
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: Math.max(16, insets.top) }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>More</Text>
        </View>
        
        {/* Profile Section */}
        <TouchableOpacity 
          style={styles.profileSection}
          onPress={() => router.push({
            pathname: '/(tabs)/(more)/profile'
          } as any)}
        >
          <View style={styles.profileInfo}>
            <View style={styles.placeholderAvatar}>
              <Text style={styles.avatarInitial}>
                {userDisplayName.charAt(0).toUpperCase()}
              </Text>
            </View>
            
            <View style={styles.profileTextContainer}>
              <Text style={styles.profileName}>
                {userDisplayName}
              </Text>
              <Text style={styles.profileEmail}>{userEmail}</Text>
            </View>
          </View>
          
          <Feather name="chevron-right" size={20} color="#999" />
        </TouchableOpacity>
        
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <View style={styles.sectionContent}>
            <OptionItem 
              icon="user" 
              title="Profile" 
              subtitle="Manage your personal information"
              onPress={() => router.push({
                pathname: '/(tabs)/(more)/profile'
              } as any)}
            />
            
            <OptionItem 
              icon="shield" 
              title="Security" 
              subtitle="Password, biometrics & 2FA"
              onPress={() => router.push({
                pathname: '/(tabs)/(more)/security'
              } as any)}
            />
            
            <OptionItem 
              icon="bell" 
              title="Notifications" 
              subtitle="Manage notification preferences"
              onPress={() => router.push({
                pathname: '/(tabs)/(more)/notifications'
              } as any)}
            />
            
            <OptionItem 
              icon="settings" 
              title="Preferences" 
              subtitle="Language, currency, region"
              onPress={() => router.push({
                pathname: '/(tabs)/(more)/preferences'
              } as any)}
            />
          </View>
        </View>
        
        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <View style={styles.sectionContent}>
            <OptionItem 
              icon="moon" 
              title="Dark Mode" 
              onPress={() => setIsDarkMode(!isDarkMode)}
              rightComponent={
                <Switch 
                  value={isDarkMode}
                  onValueChange={setIsDarkMode}
                  trackColor={{ false: '#D1D1D6', true: '#7C00FE' }}
                  thumbColor="#FFFFFF"
                />
              }
            />
            
            <OptionItem 
              icon="bell" 
              title="Notifications" 
              onPress={() => setIsNotificationsEnabled(!isNotificationsEnabled)}
              rightComponent={
                <Switch 
                  value={isNotificationsEnabled}
                  onValueChange={setIsNotificationsEnabled}
                  trackColor={{ false: '#D1D1D6', true: '#7C00FE' }}
                  thumbColor="#FFFFFF"
                />
              }
            />
            
            <OptionItem 
              icon="key" 
              title="Biometric Authentication" 
              onPress={() => setIsBiometricEnabled(!isBiometricEnabled)}
              rightComponent={
                <Switch 
                  value={isBiometricEnabled}
                  onValueChange={setIsBiometricEnabled}
                  trackColor={{ false: '#D1D1D6', true: '#7C00FE' }}
                  thumbColor="#FFFFFF"
                />
              }
            />
          </View>
        </View>
        
        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <View style={styles.sectionContent}>
            <OptionItem 
              icon="help-circle" 
              title="Help Center" 
              subtitle="FAQs and support articles"
              onPress={() => router.push({
                pathname: '/(tabs)/(more)/help'
              } as any)}
            />
            
            <OptionItem 
              icon="message-circle" 
              title="Contact Support" 
              subtitle="Get help with your issues"
              onPress={() => router.push({
                pathname: '/(tabs)/(more)/contact'
              } as any)}
            />
            
            <OptionItem 
              icon="info" 
              title="About" 
              subtitle="App version and legal information"
              onPress={() => router.push({
                pathname: '/(tabs)/(more)/about'
              } as any)}
            />
          </View>
        </View>
        
        {/* Sign Out Button */}
        <TouchableOpacity 
          style={styles.signOutButton}
          onPress={handleSignOut}
        >
          <Feather name="log-out" size={20} color="#FF3B30" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
        
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  placeholderAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#7C00FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  profileTextContainer: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  optionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(124, 0, 254, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  optionSubtitle: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
    marginLeft: 8,
  },
  versionText: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
  },
});