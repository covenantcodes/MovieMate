import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Image,
  FlatList,
  Linking,
  Share,
  Platform,
} from 'react-native';
import { useAppSelector } from '../redux/hooks';
import { theme, colors } from '../config/colors';
import { tmdbApi, MovieDetails, IMAGE_SIZES } from '../services/tmdbApi';
import Text from '../components/Text';
import { LinearGradient } from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { FONT_FAMILY } from '../config/fonts';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';

const { width, height } = Dimensions.get('window');
const backdropHeight = height * 0.4;

type MovieDetailsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'MovieDetails'
>;

type MovieDetailsScreenRouteProp = RouteProp<
  RootStackParamList,
  'MovieDetails'
>;

interface MovieDetailsScreenProp {
  navigation: MovieDetailsScreenNavigationProp;
  route: MovieDetailsScreenRouteProp;
}

const MovieDetailsScreen: React.FC<MovieDetailsScreenProp> = ({
  route,
  navigation,
}) => {
  const { movieId } = route.params;
  const { isDark } = useAppSelector(state => state.theme);
  const themeMode = isDark ? theme.dark : theme.light;

  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  // Fetch movie details
  useEffect(() => {
    const loadMovieDetails = async () => {
      try {
        const movieDetails = await tmdbApi.getMovieDetails(movieId);
        setMovie(movieDetails);

        // Check if movie is favorite
        const favoriteStatus = tmdbApi.favorites.isFavorite(movieId);
        setIsFavorite(favoriteStatus);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMovieDetails();
  }, [movieId]);

  // Toggle favorite status
  const toggleFavorite = () => {
    if (movie) {
      if (isFavorite) {
        tmdbApi.favorites.remove(movie.id);
        setIsFavorite(false);
      } else {
        tmdbApi.favorites.add(movie);
        setIsFavorite(true);
      }
    }
  };

  // Share movie
  const shareMovie = async () => {
    if (movie) {
      try {
        await Share.share({
          message: `Check out ${movie.title} on MovieMate! ${
            movie.homepage || ''
          }`,
          title: movie.title,
        });
      } catch (error) {
        console.error('Error sharing movie:', error);
      }
    }
  };

  // Watch trailer
  const watchTrailer = () => {
    if (movie?.videos?.results && movie.videos.results.length > 0) {
      // Find trailer
      const trailer = movie.videos.results.find(
        video => video.type === 'Trailer' && video.site === 'YouTube',
      );

      if (trailer) {
        const youtubeUrl = `https://www.youtube.com/watch?v=${trailer.key}`;
        Linking.openURL(youtubeUrl);
      }
    }
  };

  // Format runtime
  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Loading state
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

  // Error state
  if (!movie) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: themeMode.colors.background },
        ]}
      >
        <Text
          variant="heading2"
          style={{ color: themeMode.colors.text.primary }}
        >
          Failed to load movie details.
        </Text>
      </View>
    );
  }

  // Backdrop URL
  const backdropUrl = movie.backdrop_path
    ? `${IMAGE_SIZES.backdrop.large}${movie.backdrop_path}`
    : movie.poster_path
    ? `${IMAGE_SIZES.poster.large}${movie.poster_path}`
    : 'https://via.placeholder.com/1280x720?text=No+Image';

  // Poster URL
  const posterUrl = movie.poster_path
    ? `${IMAGE_SIZES.poster.medium}${movie.poster_path}`
    : 'https://via.placeholder.com/342x513?text=No+Poster';

  return (
    <View style={{ flex: 1, backgroundColor: themeMode.colors.background }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Backdrop with gradient overlay */}
        <ImageBackground source={{ uri: backdropUrl }} style={styles.backdrop}>
          <LinearGradient colors={['transparent']} style={styles.gradient}>
            {/* Back button */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            {/* Actions row */}
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={toggleFavorite}
              >
                <Icon
                  name={isFavorite ? 'heart' : 'heart-outline'}
                  size={28}
                  color={isFavorite ? colors.error.main : 'white'}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={shareMovie}
              >
                <Icon name="share-outline" size={28} color="white" />
              </TouchableOpacity>

              {movie.videos?.results &&
                movie.videos.results.some(
                  video => video.type === 'Trailer' && video.site === 'YouTube',
                ) && (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.trailerButton]}
                    onPress={watchTrailer}
                  >
                    <Icon name="play" size={20} color="white" />
                    <Text style={styles.trailerText}>Trailer</Text>
                  </TouchableOpacity>
                )}
            </View>
          </LinearGradient>
        </ImageBackground>

        <View style={styles.contentContainer}>
          {/* Movie info */}
          <View style={styles.infoContainer}>
            <View style={styles.posterContainer}>
              <Image source={{ uri: posterUrl }} style={styles.poster} />
            </View>

            <View style={styles.detailsContainer}>
              <Text variant="heading1" style={styles.title} numberOfLines={2}>
                {movie.title}
              </Text>

              {/* Rating and year */}
              <View style={styles.ratingYearContainer}>
                {movie.vote_average > 0 && (
                  <View style={styles.ratingContainer}>
                    <Icon name="star" size={16} color={colors.warning.main} />
                    <Text style={styles.rating}>
                      {movie.vote_average.toFixed(1)}
                    </Text>
                  </View>
                )}

                <Text
                  style={[
                    styles.year,
                    { color: themeMode.colors.text.secondary },
                  ]}
                >
                  {new Date(movie.release_date).getFullYear()}
                </Text>

                {movie.runtime > 0 && (
                  <Text
                    style={[
                      styles.runtime,
                      { color: themeMode.colors.text.secondary },
                    ]}
                  >
                    {formatRuntime(movie.runtime)}
                  </Text>
                )}
              </View>

              {/* Genres */}
              {movie.genres && movie.genres.length > 0 && (
                <View style={styles.genresContainer}>
                  {movie.genres.map(genre => (
                    <View key={genre.id} style={styles.genrePill}>
                      <Text style={styles.genreText}>{genre.name}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Tagline */}
          {movie.tagline && (
            <View>
              <Text
                style={[
                  styles.tagline,
                  { color: themeMode.colors.text.secondary },
                ]}
              >
                {movie.tagline}
              </Text>
            </View>
          )}

          {/* Overview */}
          <View>
            <Text variant="heading2" style={styles.sectionTitle}>
              Overview
            </Text>
            <Text
              style={[
                styles.overview,
                { color: themeMode.colors.text.primary },
              ]}
            >
              {movie.overview || 'No overview available.'}
            </Text>
          </View>

          {/* Cast */}
          {movie.credits?.cast && movie.credits.cast.length > 0 && (
            <View>
              <Text variant="heading2" style={styles.sectionTitle}>
                Cast
              </Text>
              <FlatList
                horizontal
                data={movie.credits.cast.slice(0, 10)}
                keyExtractor={item => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.castContainer}
                renderItem={({ item }) => (
                  <View style={styles.castItem}>
                    <Image
                      source={{
                        uri: item.profile_path
                          ? `${IMAGE_SIZES.profile.medium}${item.profile_path}`
                          : 'https://via.placeholder.com/185x278?text=No+Image',
                      }}
                      style={styles.castImage}
                    />
                    <Text style={styles.castName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.castCharacter} numberOfLines={1}>
                      {item.character}
                    </Text>
                  </View>
                )}
              />
            </View>
          )}

          {/* Movie info details - Redesigned */}
          <View style={styles.movieInfoContainer}>
            <Text variant="heading2" style={styles.sectionTitle}>
              Details
            </Text>

            <View
              style={[
                styles.detailCard,
                { backgroundColor: themeMode.colors.card },
              ]}
            >
              {/* Main details */}
              <View style={styles.detailSection}>
                <View style={styles.detailItem}>
                  <Icon
                    name="calendar-outline"
                    size={20}
                    color={colors.primary.main}
                  />
                  <View style={styles.detailTextContainer}>
                    <Text style={styles.detailLabel}>Release Date</Text>
                    <Text
                      style={[
                        styles.detailValue,
                        { color: themeMode.colors.text.primary },
                      ]}
                    >
                      {formatDate(movie.release_date)}
                    </Text>
                  </View>
                </View>

                {movie.runtime > 0 && (
                  <View style={styles.detailItem}>
                    <Icon
                      name="time-outline"
                      size={20}
                      color={colors.primary.main}
                    />
                    <View style={styles.detailTextContainer}>
                      <Text style={styles.detailLabel}>Runtime</Text>
                      <Text
                        style={[
                          styles.detailValue,
                          { color: themeMode.colors.text.primary },
                        ]}
                      >
                        {formatRuntime(movie.runtime)}
                      </Text>
                    </View>
                  </View>
                )}

                <View style={styles.detailItem}>
                  <Icon
                    name="stats-chart-outline"
                    size={20}
                    color={colors.primary.main}
                  />
                  <View style={styles.detailTextContainer}>
                    <Text style={styles.detailLabel}>Status</Text>
                    <Text
                      style={[
                        styles.detailValue,
                        { color: themeMode.colors.text.primary },
                      ]}
                    >
                      {movie.status}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Divider */}
              <View
                style={[
                  styles.divider,
                  { backgroundColor: themeMode.colors.border },
                ]}
              />

              {/* Financial information */}
              <View style={styles.detailSection}>
                {movie.budget > 0 && (
                  <View style={styles.detailItem}>
                    <Icon
                      name="cash-outline"
                      size={20}
                      color={colors.success.main}
                    />
                    <View style={styles.detailTextContainer}>
                      <Text style={styles.detailLabel}>Budget</Text>
                      <Text
                        style={[
                          styles.detailValue,
                          { color: themeMode.colors.text.primary },
                        ]}
                      >
                        {formatCurrency(movie.budget)}
                      </Text>
                    </View>
                  </View>
                )}

                {movie.revenue > 0 && (
                  <View style={styles.detailItem}>
                    <Icon
                      name="trending-up-outline"
                      size={20}
                      color={
                        movie.revenue > movie.budget
                          ? colors.success.main
                          : colors.error.main
                      }
                    />
                    <View style={styles.detailTextContainer}>
                      <Text style={styles.detailLabel}>Revenue</Text>
                      <Text
                        style={[
                          styles.detailValue,
                          { color: themeMode.colors.text.primary },
                        ]}
                      >
                        {formatCurrency(movie.revenue)}
                      </Text>
                    </View>
                  </View>
                )}

                {movie.revenue > 0 && movie.budget > 0 && (
                  <View style={styles.detailItem}>
                    <Icon
                      name={
                        movie.revenue > movie.budget
                          ? 'trophy-outline'
                          : 'trending-down-outline'
                      }
                      size={20}
                      color={
                        movie.revenue > movie.budget
                          ? colors.success.main
                          : colors.error.main
                      }
                    />
                    <View style={styles.detailTextContainer}>
                      <Text style={styles.detailLabel}>Profit</Text>
                      <Text
                        style={[
                          styles.detailValue,
                          {
                            color:
                              movie.revenue > movie.budget
                                ? colors.success.main
                                : colors.error.main,
                          },
                        ]}
                      >
                        {formatCurrency(movie.revenue - movie.budget)}
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              {/* Divider */}
              {(movie.production_companies?.length > 0 ||
                movie.production_countries?.length > 0) && (
                <View
                  style={[
                    styles.divider,
                    { backgroundColor: themeMode.colors.border },
                  ]}
                />
              )}

              {/* Production information */}
              <View style={styles.detailSection}>
                {movie.production_companies &&
                  movie.production_companies.length > 0 && (
                    <View style={styles.detailItem}>
                      <Icon
                        name="business-outline"
                        size={20}
                        color={colors.primary.main}
                      />
                      <View style={styles.detailTextContainer}>
                        <Text style={styles.detailLabel}>Studios</Text>
                        <Text
                          style={[
                            styles.detailValue,
                            { color: themeMode.colors.text.primary },
                          ]}
                        >
                          {movie.production_companies
                            .map(company => company.name)
                            .join(', ')}
                        </Text>
                      </View>
                    </View>
                  )}

                {movie.production_countries &&
                  movie.production_countries.length > 0 && (
                    <View style={styles.detailItem}>
                      <Icon
                        name="globe-outline"
                        size={20}
                        color={colors.primary.main}
                      />
                      <View style={styles.detailTextContainer}>
                        <Text style={styles.detailLabel}>Countries</Text>
                        <Text
                          style={[
                            styles.detailValue,
                            { color: themeMode.colors.text.primary },
                          ]}
                        >
                          {movie.production_countries
                            .map(country => country.name)
                            .join(', ')}
                        </Text>
                      </View>
                    </View>
                  )}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
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
  backdrop: {
    width: width,
    height: backdropHeight,
  },
  gradient: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  trailerButton: {
    width: 'auto',
    paddingHorizontal: 16,
    borderRadius: 20,
    flexDirection: 'row',
    backgroundColor: colors.primary.main,
  },
  trailerText: {
    color: 'white',
    marginLeft: 4,
    fontFamily: FONT_FAMILY.medium,
    fontSize: 14,
  },
  contentContainer: {
    marginTop: -20,
    backgroundColor: 'transparent',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    marginTop: -60,
  },
  posterContainer: {
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  poster: {
    width: width * 0.28,
    height: width * 0.42,
    borderRadius: 12,
  },
  detailsContainer: {
    flex: 1,
    marginTop: 60,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
  },
  ratingYearContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  rating: {
    color: 'white',
    marginLeft: 4,
    fontSize: 14,
    fontFamily: FONT_FAMILY.medium,
  },
  year: {
    fontSize: 14,
    fontFamily: FONT_FAMILY.medium,
    marginRight: 16,
  },
  runtime: {
    fontSize: 14,
    fontFamily: FONT_FAMILY.medium,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  genrePill: {
    backgroundColor: colors.primary.main,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    color: 'white',
    fontSize: 12,
    fontFamily: FONT_FAMILY.medium,
  },
  tagline: {
    fontStyle: 'italic',
    marginBottom: 16,
    fontSize: 16,
    fontFamily: FONT_FAMILY.regular,
  },
  sectionTitle: {
    marginBottom: 8,
    marginTop: 16,
  },
  overview: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: FONT_FAMILY.regular,
  },
  castContainer: {
    paddingVertical: 8,
  },
  castItem: {
    marginRight: 16,
    alignItems: 'center',
    width: 100,
  },
  castImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  castName: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: 14,
    textAlign: 'center',
  },
  castCharacter: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 12,
    color: colors.neutral.grey600,
    textAlign: 'center',
  },
  movieInfoContainer: {
    marginBottom: 20,
  },
  detailCard: {
    borderRadius: 16,
    padding: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  detailSection: {
    marginVertical: 0,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  detailTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  detailLabel: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: 13,
    color: colors.neutral.grey600,
    marginBottom: 0,
  },
  detailValue: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 15,
    marginTop: 1,
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 8,
  },
});

export default MovieDetailsScreen;
