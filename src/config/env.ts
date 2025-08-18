// This file will provide a safe way to access environment variables

import { Platform } from 'react-native';

// Default fallback values (never use real keys here)
const defaultConfig = {
  TMDB_API_KEY: '',
  TMDB_API_TOKEN: '',
  API_URL: 'https://api.themoviedb.org/3',
  IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
};

// This approach uses environment variables in development and a secure method in production
function getConfig() {
  if (__DEV__) {
    // In development, load from .env file through the config plugin
    return {
      TMDB_API_KEY: process.env.TMDB_API_KEY || defaultConfig.TMDB_API_KEY,
      TMDB_API_TOKEN: process.env.TMDB_API_TOKEN || defaultConfig.TMDB_API_TOKEN,
      API_URL: process.env.API_URL || defaultConfig.API_URL,
      IMAGE_BASE_URL: process.env.IMAGE_BASE_URL || defaultConfig.IMAGE_BASE_URL,
    };
  } else {
    // In production, these would be injected during the build process
    // or retrieved from a secure storage mechanism
    return {
      ...defaultConfig,
      // Production values would be injected at build time
    };
  }
}

export default getConfig();