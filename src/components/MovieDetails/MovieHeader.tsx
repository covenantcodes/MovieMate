import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { FONT_FAMILY } from '../../config/fonts';
import Text from '../Text';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../config/colors';

const { width } = Dimensions.get('window');

interface MovieHeaderProps {
  title: string;
  posterUrl: string;
  releaseYear: string;
  rating: number;
  runtime: number;
  genres: { id: number; name: string }[];
  formatRuntime: (minutes: number) => string;
  themeColors: any;
}

const MovieHeader: React.FC<MovieHeaderProps> = ({
  title,
  posterUrl,
  releaseYear,
  rating,
  runtime,
  genres,
  formatRuntime,
  themeColors,
}) => {
  return (
    <View style={styles.infoContainer}>
      <View style={styles.posterContainer}>
        <Image source={{ uri: posterUrl }} style={styles.poster} />
      </View>

      <View style={styles.detailsContainer}>
        <Text variant="heading1" style={styles.title} numberOfLines={2}>
          {title}
        </Text>

        {/* Rating and year */}
        <View style={styles.ratingYearContainer}>
          {rating > 0 && (
            <View style={styles.ratingContainer}>
              <Icon name="star" size={16} color={colors.warning.main} />
              <Text style={styles.rating}>{rating.toFixed(1)}</Text>
            </View>
          )}

          <Text style={[styles.year, { color: themeColors.text.secondary }]}>
            {releaseYear}
          </Text>

          {runtime > 0 && (
            <Text
              style={[styles.runtime, { color: themeColors.text.secondary }]}
            >
              {formatRuntime(runtime)}
            </Text>
          )}
        </View>

        {/* Genres */}
        {genres && genres.length > 0 && (
          <View style={styles.genresContainer}>
            {genres.map(genre => (
              <View key={genre.id} style={styles.genrePill}>
                <Text style={styles.genreText}>{genre.name}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default MovieHeader;
