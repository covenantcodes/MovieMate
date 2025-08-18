import React, { useRef, useEffect } from 'react';
import { FlatList, StyleSheet, ActivityIndicator, View, Dimensions } from 'react-native';
import { Movie } from '../services/tmdbApi';
import MovieCard from './MovieCard';
import { colors } from '../config/colors';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  FadeIn,
  SlideInRight,
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
  const listTranslateY = useSharedValue(50);
  const listRef = useRef<FlatList>(null);
  
  // Trigger entrance animation when movies are loaded
  useEffect(() => {
    if (movies.length > 0 && !loading) {
      listOpacity.value = withTiming(1, { duration: 500 });
      listTranslateY.value = withSpring(0, {
        damping: 12,
        stiffness: 100,
      });
    }
  }, [movies, loading]);
  
  const listAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: listOpacity.value,
      transform: [{ translateY: listTranslateY.value }],
    };
  });
  
  if (loading && movies.length === 0) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  // Render item with animation
  const renderItem = ({ item, index }: { item: Movie; index: number }) => {
    // Delay each item's animation based on its position
    const delay = horizontal ? index * 100 : Math.floor(index / 2) * 100;
    
    return (
      <Animated.View
        entering={FadeIn.delay(delay).springify()}
        layout={Layout.springify()}
      >
        <MovieCard
          movie={item}
          size={size}
          showTitle={showTitle}
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
              entering={FadeIn}
              style={styles.footerLoader}
            >
              <ActivityIndicator size="small" color={colors.primary.main} />
            </Animated.View>
          ) : null
        }
        numColumns={horizontal ? 1 : 2}
        key={horizontal ? 'horizontal' : 'vertical'}
        // Add smooth scrolling behaviors
        scrollEventThrottle={16}
        decelerationRate={0.98}
        snapToAlignment="center"
        // Add bonus behavior for horizontal lists
        ...(horizontal && {
          snapToInterval: width * (size === 'small' ? 0.28 : size === 'large' ? 0.42 : 0.35) + 12,
          disableIntervalMomentum: true,
          showsHorizontalScrollIndicator: false,
        })
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
