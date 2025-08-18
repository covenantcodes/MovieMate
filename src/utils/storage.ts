import { MMKV } from 'react-native-mmkv';

// Create the storage instance
export const storage = new MMKV({
  id: 'moviemate-storage',
  encryptionKey: 'moviemate-secure-key'
});

// Helper functions for common operations
export const StorageKeys = {
  THEME_MODE: 'theme_mode'
};

export const getThemeMode = (): 'light' | 'dark' | 'system' => {
  const theme = storage.getString(StorageKeys.THEME_MODE);
  return (theme as 'light' | 'dark' | 'system') || 'system';
};

export const setThemeMode = (mode: 'light' | 'dark' | 'system'): void => {
  storage.set(StorageKeys.THEME_MODE, mode);
};