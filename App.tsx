import React from 'react';
import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Text,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

// Import our theme
import { colors, theme } from './src/config/colors';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const themeMode = isDarkMode ? theme.dark : theme.light;

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={
          isDarkMode ? colors.background.dark : colors.background.light
        }
      />
      <AppContent isDarkMode={isDarkMode} />
    </SafeAreaProvider>
  );
}

function AppContent({
  isDarkMode,
}: {
  isDarkMode: boolean;
}): React.JSX.Element {
  const safeAreaInsets = useSafeAreaInsets();
  const themeMode = isDarkMode ? theme.dark : theme.light;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: themeMode.colors.background,
          paddingTop: safeAreaInsets.top,
          paddingBottom: safeAreaInsets.bottom,
          paddingLeft: safeAreaInsets.left,
          paddingRight: safeAreaInsets.right,
        },
      ]}
    >
      <Text
        style={{
          color: themeMode.colors.text.primary,
          fontSize: 24,
          fontWeight: 'bold',
          textAlign: 'center',
          marginTop: 20,
        }}
      >
        MovieMate
      </Text>
      <Text
        style={{
          color: themeMode.colors.primary.main,
          fontSize: 16,
          textAlign: 'center',
          marginTop: 10,
        }}
      >
        Your personal movie companion
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
