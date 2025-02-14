import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Home, Wallet, CreditCard, BookOpen, Menu } from 'lucide-react-native';
import { useRouter, useNavigation } from 'expo-router';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const navigationItems = [
  { icon: Home, label: 'Home', name: 'Dashboard' },
  { icon: Wallet, label: 'Finances', name: 'finances' },
  { icon: CreditCard, label: 'Cards', name: 'cards' },
  { icon: BookOpen, label: 'Learn', name: 'learn' },
  { icon: Menu, label: 'More', name: 'more' },
] as const;

export function BottomNavigation({ state, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      {navigationItems.map((item, index) => {
        const isActive = state?.index === index;
        const IconComponent = item.icon;
        return (
          <TouchableOpacity
            key={item.name}
            style={styles.navItem}
            onPress={() => navigation.navigate(item.name)}
          >
            <IconComponent
              size={30}
              color={isActive ? '#7C00FE' : '#989898'}
              style={styles.icon}
            />
            <Text style={[
              styles.label,
              { color: isActive ? '#7C00FE' : '#989898' }
            ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 37,
    backgroundColor: '#fff',
  },
  navItem: {
    width: 35,
    height: 45,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    marginBottom: 0,
  },
  label: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 15,
  },
});
