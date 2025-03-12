import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, Platform, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { markOnboardingSeen } from '@/lib/storage';

const { width, height } = Dimensions.get('window');
const scale = Math.min(width / 375, height / 812);
const scaledSize = (size: number) => size * scale;

interface Slide {
  id: string;
  coloredWord: string;
  title: string;
  description: string;
  image: any;
}

interface TitleProps {
  coloredWord: string;
  title: string;
}

const slides: Slide[] = [
  {
    id: '1',
    coloredWord: 'Grow',
    title: 'your money',
    description: 'Access thoughtfully curated features specifically tailored to help you manage your finances',
    image: require('../assets/images/onboarding1.png'),
  },
  {
    id: '2',
    coloredWord: 'Shop',
    title: 'Globally',
    description: 'Wether you’re shopping online, paying tuition fees, subscibing to netflix, our USD card has you covered.',
    image: require('../assets/images/onboarding2.png'),
  },
  {
    id: '3',
    coloredWord: 'Build Healthy',
    title: 'Financial Habits',
    description: 'Learn and develop smart money habits with AI budgeting, savings, and accountability tools.',
    image: require('../assets/images/onboarding3.png'),
  },
];

// Update the Title component
const Title = ({ coloredWord, title }: TitleProps) => {
  const words = title.split(' ');
  return (
    <Text style={styles.title}>
      <Text style={styles.coloredText}>{coloredWord}</Text>
      <Text>{` ${words.join(' ')}`}</Text>
    </Text>
  );
};

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  // Handle navigation with onboarding completion
  const handleSignIn = async () => {
    await markOnboardingSeen();
    router.replace("/(auth)/sign-in");
  };

  const handleSignUp = async () => {
    await markOnboardingSeen();
    router.replace("/(auth)/sign-up");
  };

  const renderSlide = ({ item }: { item: Slide }) => (
    <View style={[styles.container, { width }]}>
      <Image 
        source={require('../assets/images/antwise-logo.png')} 
        style={styles.logo} 
        resizeMode="contain"
      />

      <Title coloredWord={item.coloredWord} title={item.title} />

      <View style={styles.imageContainer}>
        <Image 
          source={item.image} 
          style={styles.image}
          resizeMode="contain" 
        />
      </View>

      <Text style={styles.description}>{item.description}</Text>

      <View style={styles.dotContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { backgroundColor: index === currentIndex ? '#7C00FE' : '#E5E5E5' }
            ]}
          />
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.signInButton}
          onPress={handleSignIn}
        >
          <Text style={styles.signInText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.signUpButton}
          onPress={handleSignUp}
        >
          <Text style={styles.signUpText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <FlatList
      data={slides}
      renderItem={renderSlide}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      onMomentumScrollEnd={(e) => {
        const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
        setCurrentIndex(newIndex);
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: scaledSize(30),
  },
  logo: {
    width: scaledSize(220),
    height: scaledSize(70),
    marginBottom: scaledSize(30),
  },
  title: {
    fontSize: scaledSize(16),
    color: '#000000',
    marginBottom: scaledSize(20),
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'Inter-SemiBold',
  },
  coloredText: {
    color: '#7C00FE',
  },
  imageContainer: {
    width: width * 0.85,
    aspectRatio: 1,
    backgroundColor: 'rgba(124, 0, 254, 0.1)',
    borderRadius: scaledSize(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scaledSize(30),
  },
  image: {
    width: '90%',
    height: '90%',
  },
  description: {
    fontSize: scaledSize(12),
    color: '#000000',
    textAlign: 'center',
    width: width * 0.9,
    lineHeight: scaledSize(15),
    marginBottom: scaledSize(20),
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'Inter-Regular',
  },
  dotContainer: {
    flexDirection: 'row',
    marginBottom: scaledSize(30),
  },
  dot: {
    width: scaledSize(19),
    height: scaledSize(10),
    borderRadius: scaledSize(5),
    marginHorizontal: scaledSize(5),
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  signInButton: {
    width: width * 0.7,
    height: scaledSize(44),
    backgroundColor: '#7C00FE',
    borderRadius: scaledSize(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scaledSize(15),
  },
  signInText: {
    color: '#FFFFFF',
    fontSize: scaledSize(18),
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'Inter-Regular',
  },
  signUpButton: {
    width: width * 0.7,
    height: scaledSize(44),
    borderWidth: 2,
    borderColor: '#7C00FE',
    borderRadius: scaledSize(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    color: '#7C00FE',
    fontSize: scaledSize(18),
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'Inter-Regular',
  },
});