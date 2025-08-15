import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Appearance } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  isDark: boolean; 
}

// Get initial system preference
const systemColorScheme = Appearance.getColorScheme() || 'light';

const initialState: ThemeState = {
  mode: 'system', 
  isDark: systemColorScheme === 'dark',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode(state, action: PayloadAction<ThemeMode>) {
      state.mode = action.payload;
      
      // Update isDark based on the new mode
      if (action.payload === 'system') {
        state.isDark = Appearance.getColorScheme() === 'dark';
      } else {
        state.isDark = action.payload === 'dark';
      }
    },
    
    // Handle system theme changes
    updateSystemTheme(state, action: PayloadAction<'light' | 'dark'>) {
      if (state.mode === 'system') {
        state.isDark = action.payload === 'dark';
      }
    },
  },
});

export const { setThemeMode, updateSystemTheme } = themeSlice.actions;

export default themeSlice.reducer;