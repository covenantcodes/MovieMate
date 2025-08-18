import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { setThemeMode } from '../redux/slices/themeSlice';
import { colors } from '../config/colors';
import { FONT_FAMILY } from '../config/fonts';

type ThemeOption = 'light' | 'dark' | 'system';

const ThemeSwitcher: React.FC = () => {
  const { mode } = useAppSelector(state => state.theme);
  const dispatch = useAppDispatch();

  // Animation values
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const options: ThemeOption[] = ['light', 'dark', 'system'];

  const handleThemeChange = (selectedMode: ThemeOption) => {
    // Play animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    // Dispatch theme change
    dispatch(setThemeMode(selectedMode));
  };

  return (
    <Animated.View
      style={[styles.container, { transform: [{ scale: scaleAnim }] }]}
    >
      <Text style={styles.title}>Theme</Text>
      <View style={styles.optionsContainer}>
        {options.map(option => (
          <TouchableOpacity
            key={option}
            style={[styles.option, mode === option && styles.selectedOption]}
            onPress={() => handleThemeChange(option)}
          >
            <Text
              style={[
                styles.optionText,
                mode === option && styles.selectedOptionText,
              ]}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 0, // Changed from 16
    padding: 0, // Changed from 16
  },
  title: {
    fontSize: 18,
    fontFamily: FONT_FAMILY.semiBold,
    marginBottom: 12,
    display: 'none', // Hide the title since we already have it in Settings
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  option: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.neutral.grey300,
  },
  selectedOption: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  optionText: {
    fontFamily: FONT_FAMILY.medium,
    color: colors.neutral.grey600,
  },
  selectedOptionText: {
    color: colors.neutral.white,
  },
});

export default ThemeSwitcher;
