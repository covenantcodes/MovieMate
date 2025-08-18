import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAppSelector } from '../redux/hooks';
import { theme } from '../config/colors';
import { tmdbApi, Movie } from '../services/tmdbApi';
import MovieCard from '../components/MovieCard';
import Text from '../components/Text';
import Icon from 'react-native-vector-icons/Ionicons';

const FavoritesScreen = () => {
  const { isDark } = useAppSelector(state => state.theme);
  const themeMode = isDark ? theme.dark : theme.light;

  const [favorites, setFavorites] = useState<Movie[]>([]);

  const loadFavorites = useCallback(() => {
    const favoritesData = tmdbApi.favorites.getAll();
    setFavorites(favoritesData);
  }, []);

  // Reload favorites when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [loadFavorites]),
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: themeMode.colors.background },
      ]}
    >
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon
            name="heart-outline"
            size={64}
            color={themeMode.colors.text.secondary}
          />
          <Text
            style={[
              styles.emptyText,
              { color: themeMode.colors.text.secondary },
            ]}
          >
            You haven't added any favorites yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <MovieCard movie={item} size="large" style={styles.movieCard} />
          )}
          numColumns={2}
          contentContainerStyle={styles.listContent}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  listContent: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  movieCard: {
    marginHorizontal: 4,
    marginVertical: 8,
  },
});

export default FavoritesScreen;
