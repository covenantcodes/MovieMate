import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAppSelector } from '../../redux/hooks';
import { theme } from '../../config/colors';
import { FONT_FAMILY } from '../../config/fonts';
import SearchScreen from '../../screens/SearchScreen';
import MovieDetailsScreen from '../../screens/MovieDetailsScreen';
import { RootStackParamList } from '../types';

const Stack = createStackNavigator<RootStackParamList>();

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
        headerTitleStyle: { fontFamily: FONT_FAMILY.semiBold, fontSize: 18 },
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
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default SearchStack;
