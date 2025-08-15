import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Text from '../components/Text';
import { useAppSelector } from '../redux/hooks';
import { theme } from '../config/colors';
import ThemeSwitcher from '../components/ThemeSwitcher';

const SettingsScreen = () => {
  const { isDark } = useAppSelector(state => state.theme);
  const themeMode = isDark ? theme.dark : theme.light;

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: themeMode.colors.background },
      ]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text variant="heading1" style={styles.title}>
        Settings
      </Text>

      <View style={styles.section}>
        <Text variant="heading2" style={styles.sectionTitle}>
          Appearance
        </Text>
        <ThemeSwitcher />
      </View>

      <View style={styles.section}>
        <Text variant="heading2" style={styles.sectionTitle}>
          About
        </Text>
        <Text>MovieMate v1.0</Text>
        <Text style={styles.description}>
          MovieMate is your personal movie companion. Browse popular movies,
          search for your favorites, and save them for later.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  description: {
    marginTop: 8,
  },
});

export default SettingsScreen;
