import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { Movie, IMAGE_SIZES, tmdbApi } from '../services/tmdbApi';
import Text from './Text';
import { colors } from '../config/colors';
import { FONT_FAMILY } from '../config/fonts';
import { useAppSelector } from '../redux/hooks';
import { theme } from '../config/colors';

interface MovieCardProps {
  movie: Movie;
  size?: 'small' | 'medium' | 'large';
  showTitle?: boolean;
  showRating?: boolean;
  style?: any;
}

const { width } = Dimensions.get('window');

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  size = 'medium',
  showTitle = true,
  showRating = true,
  style,
}) => {
  const navigation = useNavigation();
  const { isDark } = useAppSelector(state => state.theme);
  const themeMode = isDark ? theme.dark : theme.light;

  const isFavorite = tmdbApi.favorites.isFavorite(movie.id);

  // Scale animation on press
  const scale = useSharedValue(1);

  // Animation styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  // Card dimensions based on size
  const getCardDimensions = () => {
    switch (size) {
      case 'small':
        return { width: width * 0.28, height: width * 0.42 };
      case 'large':
        return { width: width * 0.42, height: width * 0.63 };
      case 'medium':
      default:
        return { width: width * 0.35, height: width * 0.525 };
    }
  };

  const dimensions = getCardDimensions();

  // Image URL
  const posterUrl = movie.poster_path
    ? `${IMAGE_SIZES.poster.medium}${movie.poster_path}`
    : 'https://via.placeholder.com/342x513?text=No+Poster';

  const handlePress = () => {
    // Animate press effect
    scale.value = withSpring(0.95, { mass: 0.5 }, () => {
      scale.value = withSpring(1);
    });

    // Navigate to movie details
    navigation.navigate('MovieDetails', { movieId: movie.id });
  };

  const toggleFavorite = () => {
    if (isFavorite) {
      tmdbApi.favorites.remove(movie.id);
    } else {
      tmdbApi.favorites.add(movie);
    }
  };

  // Calculate rating color
  const getRatingColor = (rating: number) => {
    if (rating >= 7) return colors.success.main;
    if (rating >= 5) return colors.warning.main;
    return colors.error.main;
  };

  return (
    <Animated.View style={[styles.container, animatedStyle, style]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handlePress}
        style={[
          styles.card,
          { width: dimensions.width, height: dimensions.height },
        ]}
      >
        <Image
          source={{ uri: posterUrl }}
          style={styles.poster}
          resizeMode="cover"
        />

        {showRating && movie.vote_average > 0 && (
          <View style={styles.ratingContainer}>
            <Text
              style={[
                styles.rating,
                { color: getRatingColor(movie.vote_average) },
              ]}
            >
              {movie.vote_average.toFixed(1)}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={toggleFavorite}
        >
          <Icon
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={18}
            color={
              isFavorite ? colors.error.main : themeMode.colors.text.primary
            }
          />
        </TouchableOpacity>
      </TouchableOpacity>

      {showTitle && (
        <Text
          numberOfLines={1}
          style={[
            styles.title,
            { width: dimensions.width, color: themeMode.colors.text.primary },
          ]}
        >
          {movie.title}
        </Text>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 6,
    marginVertical: 10,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  poster: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  ratingContainer: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.75)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  rating: {
    fontSize: 12,
    fontFamily: FONT_FAMILY.medium,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginTop: 6,
    fontSize: 14,
    fontFamily: FONT_FAMILY.medium,
    textAlign: 'center',
  },
});

export default MovieCard;
