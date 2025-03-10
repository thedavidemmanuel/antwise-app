import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

interface Wallet {
  id: number;
  name: string;
  balance: number;
  currency: string;
  locked: boolean;
}

const Finances: React.FC = () => {
  const router = useRouter();
  const [wallets, setWallets] = useState<Wallet[]>([
    { id: 1, name: 'Emergency Fund', balance: 5000, currency: 'USD', locked: false },
    { id: 2, name: 'Vacation Savings', balance: 1500, currency: 'USD', locked: false },
    { id: 3, name: 'Car Savings', balance: 2500, currency: 'USD', locked: true },
  ]);

  const toggleLock = (id: number) => {
    setWallets(prev =>
      prev.map(wallet =>
        wallet.id === id ? { ...wallet, locked: !wallet.locked } : wallet
      )
    );
  };

  const createWallet = () => {
    // In a real app, you might navigate to a "create wallet" screen or show a modal.
    const newWallet: Wallet = {
      id: wallets.length + 1,
      name: `New Wallet ${wallets.length + 1}`,
      balance: 0,
      currency: 'USD',
      locked: false,
    };
    setWallets(prev => [...prev, newWallet]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Wallets</Text>
      {wallets.map(wallet => (
        <View key={wallet.id} style={styles.walletCard}>
          <View style={styles.walletInfo}>
            <Text style={styles.walletName}>{wallet.name}</Text>
            <Text style={styles.walletBalance}>
              {wallet.currency} {wallet.balance}
            </Text>
          </View>
          <TouchableOpacity 
            style={[styles.lockButton, wallet.locked ? styles.locked : styles.unlocked]}
            onPress={() => toggleLock(wallet.id)}
          >
            {wallet.locked ? (
              <>
                <Feather name="lock" size={16} color="#FFF" />
                <Text style={styles.lockText}>Locked</Text>
              </>
            ) : (
              <>
                <Feather name="unlock" size={16} color="#FFF" />
                <Text style={styles.lockText}>Unlock</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity style={styles.createWalletButton} onPress={createWallet}>
        <Text style={styles.createWalletButtonText}>Create Wallet</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: '#F2F2F2',
    flexGrow: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
    color: '#000',
  },
  walletCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  walletInfo: {
    flex: 1,
  },
  walletName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  walletBalance: {
    fontSize: 14,
    color: '#666',
  },
  lockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  locked: {
    backgroundColor: '#FF3B30',
  },
  unlocked: {
    backgroundColor: '#7C00FE',
  },
  lockText: {
    color: '#FFF',
    marginLeft: 6,
    fontSize: 12,
  },
  createWalletButton: {
    backgroundColor: '#7C00FE',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  createWalletButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Finances;
