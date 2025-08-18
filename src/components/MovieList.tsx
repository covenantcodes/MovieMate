import React, { useRef, useEffect } from 'react';
import {
  FlatList,
  StyleSheet,
  ActivityIndicator,
  View,
  Dimensions,
} from 'react-native';
import { Movie } from '../services/tmdbApi';
import MovieCard from './MovieCard';
import { colors } from '../config/colors';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  SlideInDown,
  Layout,
} from 'react-native-reanimated';

// Create an animated version of FlatList
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

interface MovieListProps {
  movies: Movie[];
  loading?: boolean;
  horizontal?: boolean;
  size?: 'small' | 'medium' | 'large';
  showTitle?: boolean;
  showRating?: boolean;
  onEndReached?: () => void;
}

const { width } = Dimensions.get('window');

const MovieList: React.FC<MovieListProps> = ({
  movies,
  loading = false,
  horizontal = true,
  size = 'medium',
  showTitle = true,
  showRating = true,
  onEndReached,
}) => {
  // Animation values
  const listOpacity = useSharedValue(0);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    if (movies.length > 0 && !loading) {
      listOpacity.value = withTiming(1, { duration: 400 });
    }
  }, [movies, loading]);

  const listAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: listOpacity.value,
    };
  });

  if (loading && movies.length === 0) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  const renderItem = ({ item, index }: { item: Movie; index: number }) => {
    const delay = horizontal ? index * 200 : Math.floor(index / 2) * 200;

    return (
      <Animated.View
        entering={SlideInDown.springify()
          .delay(delay)
          .damping(14)
          .mass(1.2)
          .stiffness(80)}
        layout={Layout.springify()}
      >
        <MovieCard
          movie={item}
          size={size}
          showTitle={false}
          showRating={showRating}
        />
      </Animated.View>
    );
  };

  return (
    <Animated.View style={[listAnimatedStyle, styles.container]}>
      <AnimatedFlatList
        ref={listRef}
        data={movies}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
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
            <Animated.View
              entering={SlideInDown.delay(100)}
              style={styles.footerLoader}
            >
              <ActivityIndicator size="small" color={colors.primary.main} />
            </Animated.View>
          ) : null
        }
        numColumns={horizontal ? 1 : 2}
        key={horizontal ? 'horizontal' : 'vertical'}
        scrollEventThrottle={16}
        decelerationRate={0.98}
        snapToAlignment="center"
        snapToInterval={
          horizontal
            ? width *
                (size === 'small' ? 0.28 : size === 'large' ? 0.42 : 0.35) +
              12
            : undefined
        }
        disableIntervalMomentum={horizontal ? true : undefined}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'visible',
  },
  contentContainer: {
    paddingHorizontal: 10,
    paddingBottom: 16,
    paddingTop: 4,
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
