import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAppSelector } from '../redux/hooks';
import { theme, colors } from '../config/colors';

// Screens
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import SettingsScreen from '../screens/SettingsScreen';

// Import icons
import Icon from 'react-native-vector-icons/Ionicons';
import { FONT_FAMILY } from '../config/fonts';

// Create bottom tab navigator
const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  const { isDark } = useAppSelector(state => state.theme);
  const themeMode = isDark ? theme.dark : theme.light;

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: colors.primary.main,
          tabBarInactiveTintColor: themeMode.colors.text.secondary,
          tabBarStyle: {
            backgroundColor: themeMode.colors.background,
            borderTopColor: isDark
              ? colors.neutral.grey800
              : colors.neutral.grey300,
            paddingBottom: 5,
            paddingTop: 5,
            height: 60,
          },
          headerStyle: {
            backgroundColor: themeMode.colors.background,
            shadowColor: 'transparent', // iOS
            elevation: 0, // Android
          },
          headerTintColor: themeMode.colors.text.primary,
          headerTitleStyle: {
            fontFamily: FONT_FAMILY.semiBold,
            fontSize: 18,
          },
          tabBarLabelStyle: {
            fontFamily: FONT_FAMILY.medium,
            fontSize: 12,
            paddingBottom: 5,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Search"
          component={SearchScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="search-outline" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Favorites"
          component={FavoritesScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="heart-outline" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="settings-outline" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
