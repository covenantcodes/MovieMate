import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Text from '../components/Text';
import { useAppSelector } from '../redux/hooks';
import { theme } from '../config/colors';
import { FONT_FAMILY } from '../config/fonts';
import FontTester from '../components/FontTester';

const HomeScreen = () => {
  const { isDark } = useAppSelector(state => state.theme);
  const themeMode = isDark ? theme.dark : theme.light;

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: themeMode.colors.background },
      ]}
    >
      <Text variant="heading1" style={styles.title}>
        Popular Movies
      </Text>
      <Text>Welcome to MovieMate!</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 20,
    fontFamily: FONT_FAMILY.semiBold,
  },
});

export default HomeScreen;
