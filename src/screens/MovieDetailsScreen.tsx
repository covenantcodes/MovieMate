import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useAppSelector } from '../redux/hooks';
import { theme, colors } from '../config/colors';
import { tmdbApi, MovieDetails } from '../services/tmdbApi';
import Text from '../components/Text';

const MovieDetailsScreen = ({ route }) => {
  const { movieId } = route.params;
  const { isDark } = useAppSelector(state => state.theme);
  const themeMode = isDark ? theme.dark : theme.light;

  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMovieDetails = async () => {
      try {
        const movieDetails = await tmdbApi.getMovieDetails(movieId);
        setMovie(movieDetails);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMovieDetails();
  }, [movieId]);

  if (loading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: themeMode.colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  if (!movie) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: themeMode.colors.background },
        ]}
      >
        <Text>Failed to load movie details.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: themeMode.colors.background },
      ]}
    >
      <Text variant="heading1" style={styles.title}>
        {movie.title}
      </Text>
      <Text>{movie.overview}</Text>
      <Text style={styles.infoText}>Full implementation coming soon!</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: 16,
  },
  infoText: {
    marginTop: 20,
    fontStyle: 'italic',
  },
});

export default MovieDetailsScreen;
