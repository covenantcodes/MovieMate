export type RootStackParamList = {
  // Main tab navigator screens
  Home: undefined;
  Search: undefined; 
  Favorites: undefined;
  Settings: undefined;
  
  // Stack navigator screens
  HomeMain: undefined;
  SearchMain: undefined;
  FavoritesMain: undefined;
  SettingsMain: undefined;
  Splash: undefined;
  // Detail screens
  MovieDetails: { movieId: number };
  MovieList: { 
    type: 'popular' | 'top_rated' | 'upcoming' | 'now_playing' | 'recommended'; 
    title: string 
  };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}