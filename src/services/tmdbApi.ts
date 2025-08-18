import { MMKV } from 'react-native-mmkv';

// Initialize storage
export const storage = new MMKV({
  id: 'moviemate-storage',
});

// API Constants
const API_KEY = '13432e4bd810325fe35c9f96dfd0ee94';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Image sizes
export const IMAGE_SIZES = {
  poster: {
    small: `${IMAGE_BASE_URL}/w185`,
    medium: `${IMAGE_BASE_URL}/w342`,
    large: `${IMAGE_BASE_URL}/w500`,
    original: `${IMAGE_BASE_URL}/original`,
  },
  backdrop: {
    small: `${IMAGE_BASE_URL}/w300`,
    medium: `${IMAGE_BASE_URL}/w780`,
    large: `${IMAGE_BASE_URL}/w1280`,
    original: `${IMAGE_BASE_URL}/original`,
  },
  profile: {
    small: `${IMAGE_BASE_URL}/w45`,
    medium: `${IMAGE_BASE_URL}/w185`,
    large: `${IMAGE_BASE_URL}/h632`,
    original: `${IMAGE_BASE_URL}/original`,
  },
};

// Headers for authentication
const headers = {
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMzQzMmU0YmQ4MTAzMjVmZTM1YzlmOTZkZmQwZWU5NCIsIm5iZiI6MTc1NTE4NzAzOS45MTUsInN1YiI6IjY4OWUwNzVmODNlNGE4ZTNmYzVkMmE2NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.JMaNG4gsMHrbb6LJxQ8hofn1R_1M3aQMRxzYYDNoVEk',
  'Content-Type': 'application/json',
};

// Movie interfaces
export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  adult: boolean;
  original_language: string;
}

export interface MovieDetails extends Movie {
  budget: number;
  genres: { id: number; name: string }[];
  homepage: string;
  imdb_id: string;
  production_companies: { id: number; logo_path: string; name: string; origin_country: string }[];
  production_countries: {iso_2166_1: string; name: string}[];
  revenue: number;
  runtime: number;
  status: string;
  tagline: string;
  videos: {
    results: {
      id: string;
      key: string;
      name: string;
      site: string;
      type: string;
    }[];
  };
  credits: {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }[];
    crew: {
      id: number;
      name: string;
      job: string;
      profile_path: string | null;
    }[];
  };
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

// API Methods
export const tmdbApi = {
  // Get popular movies
  getPopularMovies: async (page: number = 1): Promise<MovieResponse> => {
    try {
      const response = await fetch(`${BASE_URL}/movie/popular?page=${page}`, { headers });
      return await response.json();
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw error;
    }
  },
  
  // Get now playing movies
  getNowPlayingMovies: async (page: number = 1): Promise<MovieResponse> => {
    try {
      const response = await fetch(`${BASE_URL}/movie/now_playing?page=${page}`, { headers });
      return await response.json();
    } catch (error) {
      console.error('Error fetching now playing movies:', error);
      throw error;
    }
  },
  
  // Get top rated movies
  getTopRatedMovies: async (page: number = 1): Promise<MovieResponse> => {
    try {
      const response = await fetch(`${BASE_URL}/movie/top_rated?page=${page}`, { headers });
      return await response.json();
    } catch (error) {
      console.error('Error fetching top rated movies:', error);
      throw error;
    }
  },
  
  // Get upcoming movies
  getUpcomingMovies: async (page: number = 1): Promise<MovieResponse> => {
    try {
      const response = await fetch(`${BASE_URL}/movie/upcoming?page=${page}`, { headers });
      return await response.json();
    } catch (error) {
      console.error('Error fetching upcoming movies:', error);
      throw error;
    }
  },
  
  // Get movie details
  getMovieDetails: async (movieId: number): Promise<MovieDetails> => {
    try {
      const response = await fetch(
        `${BASE_URL}/movie/${movieId}?append_to_response=videos,credits`,
        { headers }
      );
      return await response.json();
    } catch (error) {
      console.error(`Error fetching movie details for ID ${movieId}:`, error);
      throw error;
    }
  },
  
  // Search movies
  searchMovies: async (query: string, page: number = 1): Promise<MovieResponse> => {
    try {
      const response = await fetch(
        `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}`,
        { headers }
      );
      return await response.json();
    } catch (error) {
      console.error(`Error searching movies for query "${query}":`, error);
      throw error;
    }
  },

  // Get movie genres
  getGenres: async (): Promise<{ genres: { id: number; name: string }[] }> => {
    try {
      const response = await fetch(`${BASE_URL}/genre/movie/list`, { headers });
      return await response.json();
    } catch (error) {
      console.error('Error fetching genres:', error);
      throw error;
    }
  },

  // Favorites management
  favorites: {
    getAll: (): Movie[] => {
      const favoritesJson = storage.getString('favorites');
      return favoritesJson ? JSON.parse(favoritesJson) : [];
    },
    
    add: (movie: Movie): void => {
      const favorites = tmdbApi.favorites.getAll();
      if (!favorites.some(fav => fav.id === movie.id)) {
        favorites.push(movie);
        storage.set('favorites', JSON.stringify(favorites));
      }
    },
    
    remove: (movieId: number): void => {
      let favorites = tmdbApi.favorites.getAll();
      favorites = favorites.filter(movie => movie.id !== movieId);
      storage.set('favorites', JSON.stringify(favorites));
    },
    
    isFavorite: (movieId: number): boolean => {
      const favorites = tmdbApi.favorites.getAll();
      return favorites.some(movie => movie.id === movieId);
    }
  },

  
  getRecommendedMovies: async (page: number = 1): Promise<MovieResponse> => {
    try {
      
      const [popularResponse, topRatedResponse] = await Promise.all([
        tmdbApi.getPopularMovies(page),
        tmdbApi.getTopRatedMovies(page)
      ]);
      
      
      const combinedMovies = [
        ...popularResponse.results.filter(movie => movie.vote_average >= 7.0),
        ...topRatedResponse.results.filter(movie => movie.popularity > 50)
      ];
      
     
      const uniqueMovies = Array.from(
        new Map(combinedMovies.map(movie => [movie.id, movie])).values()
      );
      
    
      const recommendedMovies = uniqueMovies
        .sort((a, b) => {
          const scoreA = a.vote_average * 10 + a.popularity/10;
          const scoreB = b.vote_average * 10 + b.popularity/10;
          return scoreB - scoreA;
        })
        .slice(0, 20); 
      
      return {
        page: 1,
        results: recommendedMovies,
        total_pages: 1,
        total_results: recommendedMovies.length
      };
    } catch (error) {
      console.error('Error fetching recommended movies:', error);
      throw error;
    }
  },
};