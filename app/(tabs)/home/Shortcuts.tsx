import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

type IconName = React.ComponentProps<typeof Feather>['name'];

interface ShortcutItemProps {
  icon: IconName;
  label: string;
  onPress: () => void;
}

const ShortcutItem: React.FC<ShortcutItemProps> = ({ icon, label, onPress }) => {
  return (
    <TouchableOpacity style={styles.shortcutItem} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Feather name={icon} size={24} color="#7C00FE" />
      </View>
      <Text style={styles.shortcutLabel} numberOfLines={1}>{label}</Text>
    </TouchableOpacity>
  );
};

const Shortcuts: React.FC = () => {
  const shortcuts: Array<{ icon: IconName; label: string }> = [
    { icon: 'file-text', label: 'Pay Bills' },
    { icon: 'gift', label: 'Rewards' },
    { icon: 'smartphone', label: 'Airtime' },
    { icon: 'wifi', label: 'Data' },
    { icon: 'tv', label: 'Cable TV' },
  ] as const;

  const handleShortcutPress = (label: string) => {
    console.log(`${label} pressed`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shortcuts</Text>
      <View style={styles.card}>
        <View style={styles.shortcutsContainer}>
          {shortcuts.map((shortcut, index) => (
            <ShortcutItem
              key={index}
              icon={shortcut.icon}
              label={shortcut.label}
              onPress={() => handleShortcutPress(shortcut.label)}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
    fontFamily: 'Inter',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  shortcutsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
  shortcutItem: {
    alignItems: 'center',
    width: '18%',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(124, 0, 254, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  shortcutLabel: {
    fontSize: 12,
    color: '#000000',
    textAlign: 'center',
    fontFamily: 'Inter-SemiBold',
    paddingHorizontal: 2,
  },
});

export default Shortcuts;