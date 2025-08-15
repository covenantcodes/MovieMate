import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { setThemeMode } from '../redux/slices/themeSlice';
import { colors } from '../config/colors';

type ThemeOption = 'light' | 'dark' | 'system';

const ThemeSwitcher: React.FC = () => {
  const { mode } = useAppSelector(state => state.theme);
  const dispatch = useAppDispatch();

  const options: ThemeOption[] = ['light', 'dark', 'system'];

  const handleThemeChange = (selectedMode: ThemeOption) => {
    dispatch(setThemeMode(selectedMode));
  };

  return (
    <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
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
    color: colors.neutral.grey600,
  },
  selectedOptionText: {
    color: colors.neutral.white,
  },
});

export default ThemeSwitcher;
