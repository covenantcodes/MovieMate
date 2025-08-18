import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAppSelector } from '../redux/hooks';
import { theme, colors } from '../config/colors';
import { Platform } from 'react-native';

// Screens
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import SettingsScreen from '../screens/SettingsScreen';

// Import custom tab bar
import TabBar from '../components/TabBar';
import { FONT_FAMILY } from '../config/fonts';

// Create bottom tab navigator
const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  const { isDark } = useAppSelector(state => state.theme);
  const themeMode = isDark ? theme.dark : theme.light;

  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBar={props => <TabBar {...props} />}
        screenOptions={{
          headerStyle: {
            backgroundColor: themeMode.colors.background,
            shadowColor: 'transparent',
            elevation: 0,
          },
          headerTintColor: themeMode.colors.text.primary,
          headerTitleStyle: {
            fontFamily: FONT_FAMILY.semiBold,
            fontSize: 18,
          },
          tabBarShowLabel: false,
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="Favorites" component={FavoritesScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
