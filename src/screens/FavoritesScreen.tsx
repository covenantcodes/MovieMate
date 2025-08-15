import React from 'react';
import { View, StyleSheet } from 'react-native';
import Text from '../components/Text';
import { useAppSelector } from '../redux/hooks';
import { theme } from '../config/colors';

const FavoritesScreen = () => {
  const { isDark } = useAppSelector(state => state.theme);
  const themeMode = isDark ? theme.dark : theme.light;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: themeMode.colors.background },
      ]}
    >
      <Text variant="heading1" style={styles.title}>
        Favorites
      </Text>
      <Text>Your favorite movies will appear here</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 20,
  },
});

export default FavoritesScreen;
