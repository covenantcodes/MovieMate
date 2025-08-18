import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Share,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { useAppSelector } from '../redux/hooks';
import { theme, colors } from '../config/colors';
import { tmdbApi, MovieDetails, IMAGE_SIZES } from '../services/tmdbApi';
import Text from '../components/Text';
import { FONT_FAMILY } from '../config/fonts';

// Import your new components
// import MovieBackdrop from '../components/MovieDetails/MovieBackdrop';
// import MovieHeader from '../components/MovieDetails/MovieHeader';
// import MovieCast from '../components/MovieDetails/MovieCast';
// import MovieDetailsTable from '../components/MovieDetails/MovieDetailsTable';

import {
  MovieBackdrop,
  MovieHeader,
  MovieCast,
  MovieDetailsTable,
} from '../components/MovieDetails/index';

const { width, height } = Dimensions.get('window');

// Define types for navigation
type RootStackParamList = {
  Home: undefined;
  MovieDetails: { movieId: number };
  MovieList: {
    type: 'popular' | 'top_rated' | 'upcoming' | 'now_playing' | 'recommended';
    title: string;
  };
  Search: undefined;
  Settings: undefined;
  Favorites: undefined;
};

type MovieDetailsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'MovieDetails'
>;

type MovieDetailsScreenRouteProp = RouteProp<
  RootStackParamList,
  'MovieDetails'
>;

interface MovieDetailsScreenProps {
  navigation: MovieDetailsScreenNavigationProp;
  route: MovieDetailsScreenRouteProp;
}

const MovieDetailsScreen: React.FC<MovieDetailsScreenProps> = ({
  route,
  navigation,
}) => {
  const { movieId } = route.params;
  const { isDark } = useAppSelector(state => state.theme);
  const themeMode = isDark ? theme.dark : theme.light;

  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  // Fetch movie details
  useEffect(() => {
    const loadMovieDetails = async () => {
      try {
        const movieDetails = await tmdbApi.getMovieDetails(movieId);
        setMovie(movieDetails);

        // Check if movie is favorite
        const favoriteStatus = tmdbApi.favorites.isFavorite(movieId);
        setIsFavorite(favoriteStatus);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMovieDetails();
  }, [movieId]);

  // Toggle favorite status
  const toggleFavorite = () => {
    if (movie) {
      if (isFavorite) {
        tmdbApi.favorites.remove(movie.id);
        setIsFavorite(false);
      } else {
        tmdbApi.favorites.add(movie);
        setIsFavorite(true);
      }
    }
  };

  // Share movie
  const shareMovie = async () => {
    if (movie) {
      try {
        await Share.share({
          message: `Check out ${movie.title} on MovieMate! ${
            movie.homepage || ''
          }`,
          title: movie.title,
        });
      } catch (error) {
        console.error('Error sharing movie:', error);
      }
    }
  };

  // Watch trailer
  const watchTrailer = () => {
    if (movie?.videos?.results && movie.videos.results.length > 0) {
      // Find trailer
      const trailer = movie.videos.results.find(
        video => video.type === 'Trailer' && video.site === 'YouTube',
      );

      if (trailer) {
        const youtubeUrl = `https://www.youtube.com/watch?v=${trailer.key}`;
        Linking.openURL(youtubeUrl);
      }
    }
  };

  // Helper functions
  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Loading state
  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.loadingContainer,
          { backgroundColor: themeMode.colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary.main} />
      </SafeAreaView>
    );
  }

  // Error state
  if (!movie) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: themeMode.colors.background },
        ]}
      >
        <Text
          variant="heading2"
          style={{ color: themeMode.colors.text.primary }}
        >
          Failed to load movie details.
        </Text>
      </SafeAreaView>
    );
  }

  // Backdrop URL
  const backdropUrl = movie.backdrop_path
    ? `${IMAGE_SIZES.backdrop.large}${movie.backdrop_path}`
    : movie.poster_path
    ? `${IMAGE_SIZES.poster.large}${movie.poster_path}`
    : 'https://via.placeholder.com/1280x720?text=No+Image';

  // Poster URL
  const posterUrl = movie.poster_path
    ? `${IMAGE_SIZES.poster.medium}${movie.poster_path}`
    : 'https://via.placeholder.com/342x513?text=No+Poster';

  const hasTrailer =
    movie.videos?.results &&
    movie.videos.results.some(
      video => video.type === 'Trailer' && video.site === 'YouTube',
    );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: themeMode.colors.background }}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Backdrop with actions */}
        <MovieBackdrop
          imageUrl={backdropUrl}
          onBack={() => navigation.goBack()}
          onFavorite={toggleFavorite}
          onShare={shareMovie}
          onWatchTrailer={hasTrailer ? watchTrailer : undefined}
          isFavorite={isFavorite}
          themeColors={themeMode.colors}
        />

        <View style={styles.contentContainer}>
          {/* Movie header info */}
          <MovieHeader
            title={movie.title}
            posterUrl={posterUrl}
            releaseYear={new Date(movie.release_date).getFullYear().toString()}
            rating={movie.vote_average}
            runtime={movie.runtime}
            genres={movie.genres}
            formatRuntime={formatRuntime}
            themeColors={themeMode.colors}
          />

          {/* Tagline */}
          {movie.tagline && (
            <View>
              <Text
                style={[
                  styles.tagline,
                  { color: themeMode.colors.text.secondary },
                ]}
              >
                {movie.tagline}
              </Text>
            </View>
          )}

          {/* Overview */}
          <View>
            <Text variant="heading2" style={styles.sectionTitle}>
              Overview
            </Text>
            <Text
              style={[
                styles.overview,
                { color: themeMode.colors.text.primary },
              ]}
            >
              {movie.overview || 'No overview available.'}
            </Text>
          </View>

          {/* Cast */}
          {movie.credits?.cast && movie.credits.cast.length > 0 && (
            <MovieCast
              cast={movie.credits.cast.slice(0, 10)}
              themeColors={themeMode.colors}
            />
          )}

          {/* Movie details table */}
          <MovieDetailsTable
            status={movie.status}
            releaseDate={movie.release_date}
            budget={movie.budget}
            revenue={movie.revenue}
            productionCompanies={movie.production_companies}
            productionCountries={movie.production_countries || []}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
            themeColors={themeMode.colors}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    marginTop: -20,
    backgroundColor: 'transparent',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  tagline: {
    fontStyle: 'italic',
    marginBottom: 16,
    fontSize: 16,
    fontFamily: FONT_FAMILY.regular,
  },
  sectionTitle: {
    marginBottom: 12,
    marginTop: 16,
  },
  overview: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: FONT_FAMILY.regular,
  },
});

export default MovieDetailsScreen;
