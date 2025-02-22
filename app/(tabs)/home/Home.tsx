import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Balance from '@/app/(tabs)/home/Balance';
import Shortcuts from '@/app/(tabs)/home/Shortcuts';
import MoneyFlow from '@/app/(tabs)/home/MoneyFlow';
import RecentTransactions from '@/app/(tabs)/home/RecentTransactions';

const Home: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: Math.max(16, insets.top) }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.greeting}>
            <Feather name="user" size={32} color="#000" />
            <Text style={styles.greetingText}>Hi, CRYSTAL</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={() => console.log('Notification pressed')}>
              <Feather name="bell" size={24} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => console.log('Settings pressed')}
              style={styles.settingsButton}
            >
              <Feather name="settings" size={24} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          <Balance />
          <View style={styles.sectionSpacing}>
            <Shortcuts />
          </View>
          <View style={styles.sectionSpacing}>
            <MoneyFlow />
          </View>
          <View style={styles.sectionSpacing}>
            <RecentTransactions />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsButton: {
    marginLeft: 16,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 20 : 16,
  },
  sectionSpacing: {
    marginTop: 24,
  },
});

export default Home;