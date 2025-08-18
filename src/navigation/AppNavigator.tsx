import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useAppSelector } from '../redux/hooks';
import { theme, colors } from '../config/colors';
import { Platform } from 'react-native';

// Screens
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import MovieDetailsScreen from '../screens/MovieDetailsScreen';
import MovieListScreen from '../screens/MovieListScreen';

// Import custom tab bar
import TabBar from '../components/TabBar';
import { FONT_FAMILY } from '../config/fonts';

// Create navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Home Stack
const HomeStack = () => {
  const { isDark } = useAppSelector(state => state.theme);
  const themeMode = isDark ? theme.dark : theme.light;

  return (
    <Stack.Navigator
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
      }}
    >
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MovieDetails"
        component={MovieDetailsScreen}
        options={{ headerTitle: '' }}
      />
      <Stack.Screen
        name="MovieList"
        component={MovieListScreen}
        options={({ route }) => ({
          title: route.params?.title || 'Movies',
        })}
      />
    </Stack.Navigator>
  );
};

// Search Stack
const SearchStack = () => {
  const { isDark } = useAppSelector(state => state.theme);
  const themeMode = isDark ? theme.dark : theme.light;

  return (
    <Stack.Navigator
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
      }}
    >
      <Stack.Screen
        name="SearchMain"
        component={SearchScreen}
        options={{ title: 'Search' }}
      />
      <Stack.Screen
        name="MovieDetails"
        component={MovieDetailsScreen}
        options={{ headerTitle: '' }}
      />
    </Stack.Navigator>
  );
};

// Favorites Stack
const FavoritesStack = () => {
  const { isDark } = useAppSelector(state => state.theme);
  const themeMode = isDark ? theme.dark : theme.light;

  return (
    <Stack.Navigator
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
      }}
    >
      <Stack.Screen
        name="FavoritesMain"
        component={FavoritesScreen}
        options={{ title: 'Favorites' }}
      />
      <Stack.Screen
        name="MovieDetails"
        component={MovieDetailsScreen}
        options={{ headerTitle: '' }}
      />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  const { isDark } = useAppSelector(state => state.theme);
  const themeMode = isDark ? theme.dark : theme.light;

  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBar={props => <TabBar {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
      >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Search" component={SearchStack} />
        <Tab.Screen name="Favorites" component={FavoritesStack} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
