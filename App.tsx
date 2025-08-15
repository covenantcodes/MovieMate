import React, { useEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Text,
  Appearance,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

// Import Redux store
import { store } from './src/redux/store';
import { updateSystemTheme } from './src/redux/slices/themeSlice';
import { useAppSelector } from './src/redux/hooks';

// Import our theme
import { colors, theme } from './src/config/colors';

// Import components
import ThemeSwitcher from './src/components/ThemeSwitcher';

// Root component with Redux Provider
const AppWrapper = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <App />
      </SafeAreaProvider>
    </Provider>
  );
};

function App(): React.JSX.Element {
  const systemColorScheme = useColorScheme();
  const { isDark, mode } = useAppSelector(state => state.theme);

  // Listen to system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (colorScheme) {
        store.dispatch(updateSystemTheme(colorScheme));
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={
          isDark ? colors.background.dark : colors.background.light
        }
      />
      <AppContent isDarkMode={isDark} />
    </>
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

      {/* Theme Switcher */}
      <ThemeSwitcher />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AppWrapper;
