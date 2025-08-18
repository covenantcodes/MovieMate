import React from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Text from '../Text';
import colors from '../../config/colors';
import { FONT_FAMILY } from '../../config/fonts';

const { height } = Dimensions.get('window');
const backdropHeight = height * 0.4;

interface MovieBackdropProps {
  imageUrl: string;
  onBack: () => void;
  onFavorite: () => void;
  onShare: () => void;
  onWatchTrailer?: () => void;
  isFavorite: boolean;
  themeColors: any;
}

const MovieBackdrop: React.FC<MovieBackdropProps> = ({
  imageUrl,
  onBack,
  onFavorite,
  onShare,
  onWatchTrailer,
  isFavorite,
  themeColors,
}) => {
  return (
    <ImageBackground source={{ uri: imageUrl }} style={styles.backdrop}>
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)', themeColors.background]}
        style={styles.gradient}
      >
        {/* Back button */}
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        {/* Actions row */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionButton} onPress={onFavorite}>
            <Icon
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={28}
              color={isFavorite ? themeColors.error.main : 'white'}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={onShare}>
            <Icon name="share-outline" size={28} color="white" />
          </TouchableOpacity>

          {onWatchTrailer && (
            <TouchableOpacity
              style={[styles.actionButton, styles.trailerButton]}
              onPress={onWatchTrailer}
            >
              <Icon name="play" size={20} color="white" />
              <Text style={styles.trailerText}>Trailer</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    width: '100%',
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
});

export default MovieBackdrop;
