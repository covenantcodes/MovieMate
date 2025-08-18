import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Animated, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SplashScreenLib from 'react-native-splash-screen';
import { useAppSelector } from '../redux/hooks';
import { theme, colors } from '../config/colors';
import { FONT_FAMILY } from '../config/fonts';
import Text from '../components/Text';
import images from '../config/images';

const { width, height } = Dimensions.get('window');

const SplashScreen: React.FC = () => {
  const navigation = useNavigation();
  const { isDark } = useAppSelector(state => state.theme);
  const themeMode = isDark ? theme.dark : theme.light;

  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Hide the native splash screen
    SplashScreenLib.hide();

    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to Home after splash screen
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, navigation]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: themeMode.colors.background },
      ]}
    >
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Image source={images.icon} style={styles.logo} resizeMode="contain" />
        <Text
          variant="heading1"
          style={[styles.appName, { color: themeMode.colors.text.primary }]}
        >
          MovieMate
        </Text>
        <Text
          style={[styles.tagline, { color: themeMode.colors.text.secondary }]}
        >
          Your personal movie companion
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: width * 0.4,
    height: width * 0.4,
    marginBottom: 24,
  },
  appName: {
    fontSize: 32,
    marginBottom: 8,
  },
  tagline: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default SplashScreen;
