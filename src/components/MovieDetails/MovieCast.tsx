import React from 'react';
import { View, StyleSheet, FlatList, Image } from 'react-native';
import Text from '../Text';
import { FONT_FAMILY } from '../../config/fonts';
import { colors } from '../../config/colors';
import { IMAGE_SIZES } from '../../services/tmdbApi';

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface MovieCastProps {
  cast: CastMember[];
  themeColors: any;
}

const MovieCast: React.FC<MovieCastProps> = ({ cast, themeColors }) => {
  if (!cast || cast.length === 0) return null;

  return (
    <View>
      <Text variant="heading2" style={styles.sectionTitle}>
        Cast
      </Text>
      <FlatList
        horizontal
        data={cast.slice(0, 10)}
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
            <Text
              style={[
                styles.castCharacter,
                { color: themeColors.text.secondary },
              ]}
              numberOfLines={1}
            >
              {item.character}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    marginBottom: 12,
    marginTop: 16,
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
    textAlign: 'center',
  },
});

export default MovieCast;
