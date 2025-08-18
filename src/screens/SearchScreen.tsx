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
        // No results found state
        <View style={styles.emptyContainer}>
          <Icon
            name="search-outline"
            size={64}
            color={themeMode.colors.text.secondary}
          />
          <Text
            style={[styles.emptyText, { color: themeMode.colors.text.primary }]}
          >
            No movies found for "{query}"
          </Text>
          <Text
            style={[
              styles.emptySubtext,
              { color: themeMode.colors.text.secondary },
            ]}
          >
            Try using different keywords or check your spelling
          </Text>
        </View>
      ) : movies.length === 0 ? (
        // Initial search state
        <View style={styles.emptyContainer}>
          <View style={styles.searchSuggestionContainer}>
            <Icon
              name="film-outline"
              size={80}
              color={colors.primary.main}
              style={styles.searchIcon}
            />

            <Text
              style={[
                styles.emptyHeading,
                { color: themeMode.colors.text.primary },
              ]}
            >
              Find your favorite movies
            </Text>

            <Text
              style={[
                styles.emptySubtext,
                { color: themeMode.colors.text.secondary },
              ]}
            >
              Search by movie title, actor, or director
            </Text>

            {/* Quick search suggestions */}
            <View style={styles.suggestionsContainer}>
              <Text
                style={[
                  styles.suggestionsTitle,
                  { color: themeMode.colors.text.primary },
                ]}
              >
                Try searching for:
              </Text>

              <View style={styles.chipContainer}>
                {['Action', 'Comedy', 'Marvel', 'Star Wars', 'Nolan'].map(
                  suggestion => (
                    <TouchableOpacity
                      key={suggestion}
                      style={[
                        styles.suggestionChip,
                        { backgroundColor: colors.primary.light },
                      ]}
                      onPress={() => {
                        setQuery(suggestion);
                        handleSearch(suggestion);
                      }}
                    >
                      <Text style={styles.suggestionChipText}>
                        {suggestion}
                      </Text>
                    </TouchableOpacity>
                  ),
                )}
              </View>
            </View>

            <View style={styles.trendingSection}>
              <Icon
                name="trending-up-outline"
                size={20}
                color={colors.primary.main}
                style={styles.trendingIcon}
              />
              <Text
                style={[
                  styles.trendingText,
                  { color: themeMode.colors.text.secondary },
                ]}
              >
                Try searching for trending movies
              </Text>
            </View>
          </View>
        </View>
      ) : (
        // Search results
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
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: FONT_FAMILY.medium,
    textAlign: 'center',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: FONT_FAMILY.regular,
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 280,
  },
  searchSuggestionContainer: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 500,
  },
  searchIcon: {
    marginBottom: 20,
  },
  emptyHeading: {
    fontSize: 22,
    fontFamily: FONT_FAMILY.bold,
    textAlign: 'center',
    marginBottom: 8,
  },
  suggestionsContainer: {
    marginTop: 30,
    width: '100%',
  },
  suggestionsTitle: {
    fontSize: 15,
    fontFamily: FONT_FAMILY.medium,
    marginBottom: 12,
    textAlign: 'center',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginHorizontal: -4,
  },
  suggestionChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    margin: 4,
  },
  suggestionChipText: {
    color: colors.neutral.white,
    fontFamily: FONT_FAMILY.medium,
    fontSize: 14,
  },
  trendingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  trendingIcon: {
    marginRight: 8,
  },
  trendingText: {
    fontSize: 14,
    fontFamily: FONT_FAMILY.medium,
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
