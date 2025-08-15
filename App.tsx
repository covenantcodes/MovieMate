import React, { useEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  Appearance,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

//  Redux section
import { store } from './src/redux/store';
import { updateSystemTheme } from './src/redux/slices/themeSlice';
import { useAppSelector } from './src/redux/hooks';

// Config Section
import { colors, theme } from './src/config/colors';

// Navigation
import AppNavigator from './src/navigation/AppNavigator';

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
  const { isDark } = useAppSelector(state => state.theme);

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
      <AppNavigator />
    </>
  );
}

export default AppWrapper;
