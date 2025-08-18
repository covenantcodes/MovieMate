import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import { useAppSelector } from '../redux/hooks';
import { theme, colors } from '../config/colors';
import { tmdbApi, Movie } from '../services/tmdbApi';
import MovieCard from '../components/MovieCard';
import Text from '../components/Text';
import Icon from 'react-native-vector-icons/Ionicons';
import { FONT_FAMILY } from '../config/fonts';

const SearchScreen = () => {
  const { isDark } = useAppSelector(state => state.theme);
  const themeMode = isDark ? theme.dark : theme.light;

  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const handleSearch = async (searchQuery: string, searchPage = 1) => {
    if (!searchQuery.trim()) {
      setMovies([]);
      return;
    }

    if (searchPage === 1) {
      setLoading(true);
    }

    try {
      const response = await tmdbApi.searchMovies(searchQuery, searchPage);

      if (searchPage === 1) {
        setMovies(response.results);
      } else {
        setMovies(prev => [...prev, ...response.results]);
      }

      setTotalPages(response.total_pages);
    } catch (error) {
      console.error('Error searching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (page < totalPages && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      handleSearch(query, nextPage);
    }
  };

  const handleClearSearch = () => {
    setQuery('');
    setMovies([]);
    setPage(1);
  };

  const handleSubmitSearch = () => {
    Keyboard.dismiss();
    setPage(1);
    handleSearch(query);
  };

  useEffect(() => {
    // Debounce search input
    const timer = setTimeout(() => {
      if (query) {
        setPage(1);
        handleSearch(query);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: themeMode.colors.background },
      ]}
    >
      {/* Search Input */}
      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: isDark
              ? colors.neutral.grey800
              : colors.neutral.grey200,
          },
        ]}
      >
        <Icon name="search" size={20} color={themeMode.colors.text.secondary} />
        <TextInput
          style={[styles.searchInput, { color: themeMode.colors.text.primary }]}
          placeholder="Search for movies..."
          placeholderTextColor={themeMode.colors.text.secondary}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          onSubmitEditing={handleSubmitSearch}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={handleClearSearch}>
            <Icon
              name="close-circle"
              size={20}
              color={themeMode.colors.text.secondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {loading && page === 1 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary.main} />
        </View>
      ) : movies.length === 0 && query ? (
        <View style={styles.emptyContainer}>
          <Icon
            name="search-outline"
            size={64}
            color={themeMode.colors.text.secondary}
          />
          <Text
            style={[
              styles.emptyText,
              { color: themeMode.colors.text.secondary },
            ]}
          >
            No movies found for "{query}"
          </Text>
        </View>
      ) : movies.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon
            name="film-outline"
            size={64}
            color={themeMode.colors.text.secondary}
          />
          <Text
            style={[
              styles.emptyText,
              { color: themeMode.colors.text.secondary },
            ]}
          >
            Search for your favorite movies
          </Text>
        </View>
      ) : (
        <FlatList
          data={movies}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <MovieCard movie={item} size="large" style={styles.movieCard} />
          )}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading && page > 1 ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={colors.primary.main} />
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontFamily: FONT_FAMILY.regular,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: FONT_FAMILY.medium,
    textAlign: 'center',
  },
  listContent: {
    alignItems: 'center',
    paddingBottom: 16,
  },
  movieCard: {
    marginHorizontal: 4,
    marginVertical: 8,
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});

export default SearchScreen;
