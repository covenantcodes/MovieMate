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
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../config/colors';
import { FONT_FAMILY } from '../config/fonts';

interface HeroBannerProps {
  movie: Movie | null;
  loading: boolean;
}

const { width, height } = Dimensions.get('window');
const bannerHeight = height * 0.4;

const HeroBanner: React.FC<HeroBannerProps> = ({ movie, loading }) => {
  const navigation = useNavigation();

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
            <Text style={styles.title} numberOfLines={2}>
              {movie.title}
            </Text>
            <Text style={styles.overview} numberOfLines={2}>
              {movie.overview}
            </Text>

            <View style={styles.infoRow}>
              <View style={styles.ratingContainer}>
                <Icon name="star" size={16} color={colors.warning.main} />
                <Text style={styles.rating}>
                  {movie.vote_average.toFixed(1)}
                </Text>
              </View>

              <Text style={styles.releaseDate}>
                {new Date(movie.release_date).getFullYear()}
              </Text>

              <TouchableOpacity
                onPress={toggleFavorite}
                style={styles.favoriteButton}
              >
                <Icon
                  name={isFavorite ? 'heart' : 'heart-outline'}
                  size={18}
                  color={isFavorite ? colors.error.main : 'white'}
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
    color: 'white',
    fontSize: 22,
    fontFamily: FONT_FAMILY.bold,
    marginBottom: 4,
  },
  overview: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontFamily: FONT_FAMILY.regular,
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
    color: 'white',
    marginLeft: 4,
    fontFamily: FONT_FAMILY.medium,
  },
  releaseDate: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: FONT_FAMILY.regular,
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
