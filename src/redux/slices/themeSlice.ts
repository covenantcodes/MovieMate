import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Appearance } from 'react-native';
import { getThemeMode, setThemeMode as saveThemeMode } from '../../utils/storage';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  isDark: boolean; 
}


const savedThemeMode = getThemeMode();
const systemColorScheme = Appearance.getColorScheme() || 'light';

const initialState: ThemeState = {
  mode: savedThemeMode, 
  isDark: savedThemeMode === 'system' 
    ? systemColorScheme === 'dark'
    : savedThemeMode === 'dark',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode(state, action: PayloadAction<ThemeMode>) {
      state.mode = action.payload;
      
      
      if (action.payload === 'system') {
        state.isDark = Appearance.getColorScheme() === 'dark';
      } else {
        state.isDark = action.payload === 'dark';
      }
      
      saveThemeMode(action.payload);
    },
    
    
    updateSystemTheme(state, action: PayloadAction<'light' | 'dark'>) {
      if (state.mode === 'system') {
        state.isDark = action.payload === 'dark';
      }
    },
  },
});

export const { setThemeMode, updateSystemTheme } = themeSlice.actions;

export default themeSlice.reducer;