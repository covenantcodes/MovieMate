import React from 'react';
import { FlatList, StyleSheet, ActivityIndicator, View } from 'react-native';
import { Movie } from '../services/tmdbApi';
import MovieCard from './MovieCard';
import { colors } from '../config/colors';

interface MovieListProps {
  movies: Movie[];
  loading?: boolean;
  horizontal?: boolean;
  size?: 'small' | 'medium' | 'large';
  showTitle?: boolean;
  showRating?: boolean;
  onEndReached?: () => void;
}

const MovieList: React.FC<MovieListProps> = ({
  movies,
  loading = false,
  horizontal = true,
  size = 'medium',
  showTitle = true,
  showRating = true,
  onEndReached,
}) => {
  if (loading && movies.length === 0) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  return (
    <FlatList
      data={movies}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => (
        <MovieCard
          movie={item}
          size={size}
          showTitle={showTitle}
          showRating={showRating}
        />
      )}
      horizontal={horizontal}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[
        styles.contentContainer,
        !horizontal && styles.gridContainer,
      ]}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        loading ? (
          <View style={styles.footerLoader}>
            <ActivityIndicator size="small" color={colors.primary.main} />
          </View>
        ) : null
      }
      numColumns={horizontal ? 1 : 2}
      key={horizontal ? 'horizontal' : 'vertical'}
    />
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 10,
    paddingBottom: 16,
  },
  gridContainer: {
    alignItems: 'center',
  },
  loaderContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerLoader: {
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MovieList;
