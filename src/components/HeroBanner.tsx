import React from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Movie, IMAGE_SIZES, tmdbApi } from '../services/tmdbApi';
import Text from './Text';
import { LinearGradient } from 'react-native-linear-gradient';
import { colors, theme } from '../config/colors';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../config/fonts';
import { useAppSelector } from '../redux/hooks';

interface HeroBannerProps {
  movie: Movie | null;
  loading: boolean;
}

const { width, height } = Dimensions.get('window');
const bannerHeight = height * 0.6;

const HeroBanner: React.FC<HeroBannerProps> = ({ movie, loading }) => {
  const navigation = useNavigation();
  const { isDark } = useAppSelector(state => state.theme);
  const themeMode = isDark ? theme.dark : theme.light;

  const handlePress = () => {
    if (movie) {
      navigation.navigate('MovieDetails', { movieId: movie.id });
    }
  };

  if (loading || !movie) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  const backdropUrl = movie.backdrop_path
    ? `${IMAGE_SIZES.backdrop.large}${movie.backdrop_path}`
    : `${IMAGE_SIZES.poster.large}${movie.poster_path}`;

  const isFavorite = tmdbApi.favorites.isFavorite(movie.id);

  const toggleFavorite = () => {
    if (isFavorite) {
      tmdbApi.favorites.remove(movie.id);
    } else {
      tmdbApi.favorites.add(movie);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.container}
      onPress={handlePress}
    >
      <ImageBackground
        source={{ uri: backdropUrl }}
        style={styles.backdrop}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <Text variant="heading1" style={styles.title} numberOfLines={2}>
              {movie.title}
            </Text>

            <Text variant="body2" style={styles.overview} numberOfLines={2}>
              {movie.overview}
            </Text>

            <View style={styles.infoRow}>
              <View style={styles.ratingContainer}>
                <Icon name="star" size={16} color={colors.warning} />
                <Text variant="caption" style={styles.rating}>
                  {movie.vote_average.toFixed(1)}
                </Text>
              </View>

              <Text variant="caption" style={styles.releaseDate}>
                {new Date(movie.release_date).getFullYear()}
              </Text>

              <TouchableOpacity
                onPress={toggleFavorite}
                style={styles.favoriteButton}
              >
                <Icon
                  name={isFavorite ? 'heart' : 'heart-outline'}
                  size={18}
                  color={isFavorite ? colors.error : colors.neutral.white}
                />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    height: bannerHeight,
    marginBottom: 16,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  content: {
    padding: 16,
  },
  title: {
    color: colors.neutral.white,
    marginBottom: 4,
  },
  overview: {
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  rating: {
    color: colors.neutral.white,
    marginLeft: 4,
  },
  releaseDate: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  favoriteButton: {
    marginLeft: 'auto',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HeroBanner;
