import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useAppSelector } from '../redux/hooks';
import { theme, colors } from '../config/colors';
import { tmdbApi, Movie } from '../services/tmdbApi';
import MovieCard from '../components/MovieCard';
import Text from '../components/Text';

interface MovieListScreenProps {
  route: {
    params: {
      type:
        | 'popular'
        | 'top_rated'
        | 'upcoming'
        | 'now_playing'
        | 'recommended';
      title: string;
    };
  };
}

const MovieListScreen: React.FC<MovieListScreenProps> = ({ route }) => {
  const { type } = route.params;
  const { isDark } = useAppSelector(state => state.theme);
  const themeMode = isDark ? theme.dark : theme.light;

  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMorePages, setHasMorePages] = useState(true);

  const loadMovies = async (currentPage: number) => {
    if (currentPage === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      let response;
      switch (type) {
        case 'popular':
          response = await tmdbApi.getPopularMovies(currentPage);
          break;
        case 'top_rated':
          response = await tmdbApi.getTopRatedMovies(currentPage);
          break;
        case 'upcoming':
          response = await tmdbApi.getUpcomingMovies(currentPage);
          break;
        case 'now_playing':
          response = await tmdbApi.getNowPlayingMovies(currentPage);
          break;
        case 'recommended':
          response = await tmdbApi.getRecommendedMovies(currentPage);
          break;
        default:
          response = await tmdbApi.getPopularMovies(currentPage);
      }

      if (currentPage === 1) {
        setMovies(response.results);
      } else {
        setMovies(prevMovies => [...prevMovies, ...response.results]);
      }

      setHasMorePages(response.page < response.total_pages);
    } catch (error) {
      console.error('Error loading movies:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadMovies(1);
  }, [type]);

  const handleLoadMore = () => {
    if (!loadingMore && hasMorePages) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadMovies(nextPage);
    }
  };

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

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: themeMode.colors.background },
      ]}
    >
      <FlatList
        data={movies}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        renderItem={({ item }) => (
          <MovieCard movie={item} size="large" style={styles.movieCard} />
        )}
        contentContainerStyle={styles.listContent}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color={colors.primary.main} />
            </View>
          ) : null
        }
      />
    </View>
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
  listContent: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  movieCard: {
    marginHorizontal: 8,
    marginVertical: 10,
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});

export default MovieListScreen;
