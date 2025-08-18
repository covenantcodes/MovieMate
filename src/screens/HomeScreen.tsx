import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  ScrollView,
  RefreshControl,
  View,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppSelector } from '../redux/hooks';
import { theme } from '../config/colors';
import { FONT_FAMILY } from '../config/fonts';
import { tmdbApi, Movie } from '../services/tmdbApi';
import { RootStackParamList } from '../navigation/types';

// Components
import Text from '../components/Text';
import HeroBanner from '../components/HeroBanner';
import SectionHeader from '../components/SectionHeader';
import MovieList from '../components/MovieList';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { isDark } = useAppSelector(state => state.theme);
  const themeMode = isDark ? theme.dark : theme.light;

  // State variables
  const [recommended, setRecommended] = useState<Movie[]>([]);
  const [popular, setPopular] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState({
    recommended: true,
    popular: true,
    topRated: true,
    upcoming: true,
  });
  const [refreshing, setRefreshing] = useState(false);

  const loadMovies = useCallback(async () => {
    try {
      const nowPlayingResponse = await tmdbApi.getNowPlayingMovies();

      const randomIndex = Math.floor(
        Math.random() * Math.min(5, nowPlayingResponse.results.length),
      );
      setFeaturedMovie(nowPlayingResponse.results[randomIndex]);

      const [
        recommendedResponse,
        popularResponse,
        topRatedResponse,
        upcomingResponse,
      ] = await Promise.all([
        tmdbApi.getRecommendedMovies(),
        tmdbApi.getPopularMovies(),
        tmdbApi.getTopRatedMovies(),
        tmdbApi.getUpcomingMovies(),
      ]);

      setRecommended(recommendedResponse.results);
      setPopular(popularResponse.results);
      setTopRated(topRatedResponse.results);
      setUpcoming(upcomingResponse.results);
    } catch (error) {
      console.error('Error loading movies:', error);
    } finally {
      setLoading({
        recommended: false,
        popular: false,
        topRated: false,
        upcoming: false,
      });
      setRefreshing(false);
    }
  }, []);

  // Pull to refresh
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadMovies();
  }, [loadMovies]);

  useFocusEffect(
    useCallback(() => {
      loadMovies();
    }, [loadMovies]),
  );

  return (
    <ScrollView
      style={[
        styles.container,
        { flex: 1, backgroundColor: themeMode.colors.background },
      ]}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={themeMode.colors.text.primary}
        />
      }
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />

      {/* Hero Banner */}
      <HeroBanner movie={featuredMovie} loading={loading.recommended} />

      {/* Recommended Section - Replaced Now Playing */}
      <View style={styles.section}>
        <SectionHeader
          title="Recommended for You"
          onSeeAll={() =>
            navigation.navigate('MovieList', {
              type: 'recommended',
              title: 'Recommended for You',
            })
          }
        />
        <MovieList
          movies={recommended}
          loading={loading.recommended}
          size="medium"
        />
      </View>

      {/* Popular Section */}
      <View style={styles.section}>
        <SectionHeader
          title="Popular"
          onSeeAll={() =>
            navigation.navigate('MovieList', {
              type: 'popular',
              title: 'Popular Movies',
            })
          }
        />
        <MovieList movies={popular} loading={loading.popular} size="medium" />
      </View>

      {/* Top Rated Section */}
      <View style={styles.section}>
        <SectionHeader
          title="Top Rated"
          onSeeAll={() =>
            navigation.navigate('MovieList', {
              type: 'top_rated',
              title: 'Top Rated Movies',
            })
          }
        />
        <MovieList movies={topRated} loading={loading.topRated} size="medium" />
      </View>

      {/* Upcoming Section */}
      <View style={styles.section}>
        <SectionHeader
          title="Coming Soon"
          onSeeAll={() =>
            navigation.navigate('MovieList', {
              type: 'upcoming',
              title: 'Upcoming Movies',
            })
          }
        />
        <MovieList movies={upcoming} loading={loading.upcoming} size="medium" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 0,
  },
});

export default HomeScreen;
