// components/BottomNavigation.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Dimensions, SafeAreaView } from 'react-native';
import { Home, Wallet, CreditCard, BookOpen, Menu } from 'lucide-react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const navigationItems = [
  { icon: Home, label: 'Home', name: 'Dashboard' },
  { icon: Wallet, label: 'Finances', name: 'finances' },
  { icon: CreditCard, label: 'Cards', name: 'cards' },
  { icon: BookOpen, label: 'Learn', name: 'learn' },
  { icon: Menu, label: 'More', name: 'more' },
] as const;

export function BottomNavigation({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const isAndroid = Platform.OS === 'android';
  
  // Calculate responsive dimensions
  const tabWidth = SCREEN_WIDTH / navigationItems.length;
  const iconSize = Math.min(Math.round(tabWidth * 0.2), 30); // Responsive icon size
  
  // Calculate bottom padding based on platform and safe area
  const bottomPadding = isAndroid ? 8 : Math.max(insets.bottom, 20);
  
  // Calculate nav height including safe area
  const navHeight = 56 + (isAndroid ? 0 : insets.bottom);

  return (
    <View style={[
      styles.container,
      {
        height: navHeight,
        paddingBottom: bottomPadding,
      }
    ]}>
      <View style={styles.content}>
        {navigationItems.map((item, index) => {
          const isActive = state?.index === index;
          const IconComponent = item.icon;
          
          // Calculate responsive margins
          const marginHorizontal = Math.round(tabWidth * 0.1);
          
          return (
            <TouchableOpacity
              key={item.name}
              style={[
                styles.navItem,
                {
                  width: tabWidth,
                  marginHorizontal: marginHorizontal,
                }
              ]}
              onPress={() => navigation.navigate(item.name)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <IconComponent
                size={iconSize}
                color={isActive ? '#7C00FE' : '#989898'}
                style={styles.icon}
              />
              <Text 
                style={[
                  styles.label,
                  { 
                    color: isActive ? '#7C00FE' : '#989898',
                    fontSize: Math.min(Math.round(tabWidth * 0.12), 12) // Responsive font size
                  }
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 10,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 56, // Base height without safe area
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  icon: {
    marginBottom: 4,
  },
  label: {
    fontFamily: Platform.select({ ios: 'Inter', android: 'Inter-Regular' }),
    fontWeight: '600',
    textAlign: 'center',
  },
});