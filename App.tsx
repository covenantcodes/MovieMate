import React, { useEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Appearance,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

//  Redux section
import { store } from './src/redux/store';
import { updateSystemTheme } from './src/redux/slices/themeSlice';
import { useAppSelector } from './src/redux/hooks';

// Config Section
import { colors, theme } from './src/config/colors';
import { FONT_FAMILY } from './src/config/fonts';

// Component Section
import ThemeSwitcher from './src/components/ThemeSwitcher';
import Text from './src/components/Text';

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
      <Text style={[styles.title, { color: themeMode.colors.text.primary }]}>
        MovieMate
      </Text>
      <Text style={[styles.subtitle, { color: themeMode.colors.primary.main }]}>
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
  title: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 24,
    textAlign: 'center',
    marginTop: 20,
  },
  subtitle: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default AppWrapper;
