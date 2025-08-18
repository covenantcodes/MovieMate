import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  ScrollView,
  RefreshControl,
  View,
  StatusBar,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAppSelector } from '../redux/hooks';
import { theme } from '../config/colors';
import { FONT_FAMILY } from '../config/fonts';
import { tmdbApi, Movie } from '../services/tmdbApi';

// Components
import Text from '../components/Text';
import HeroBanner from '../components/HeroBanner';
import SectionHeader from '../components/SectionHeader';
import MovieList from '../components/MovieList';

const HomeScreen = ({ navigation }) => {
  const { isDark } = useAppSelector(state => state.theme);
  const themeMode = isDark ? theme.dark : theme.light;

  // State variables
  const [nowPlaying, setNowPlaying] = useState<Movie[]>([]);
  const [popular, setPopular] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState({
    nowPlaying: true,
    popular: true,
    topRated: true,
    upcoming: true,
  });
  const [refreshing, setRefreshing] = useState(false);

  // Load initial data
  const loadMovies = useCallback(async () => {
    try {
      // Load now playing movies
      const nowPlayingResponse = await tmdbApi.getNowPlayingMovies();
      setNowPlaying(nowPlayingResponse.results);

      // Select a random movie for the hero banner
      const randomIndex = Math.floor(
        Math.random() * Math.min(5, nowPlayingResponse.results.length),
      );
      setFeaturedMovie(nowPlayingResponse.results[randomIndex]);

      // Load other movie categories
      const [popularResponse, topRatedResponse, upcomingResponse] =
        await Promise.all([
          tmdbApi.getPopularMovies(),
          tmdbApi.getTopRatedMovies(),
          tmdbApi.getUpcomingMovies(),
        ]);

      setPopular(popularResponse.results);
      setTopRated(topRatedResponse.results);
      setUpcoming(upcomingResponse.results);
    } catch (error) {
      console.error('Error loading movies:', error);
    } finally {
      setLoading({
        nowPlaying: false,
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

  // Load movies when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadMovies();
    }, [loadMovies]),
  );

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: themeMode.colors.background },
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
      <HeroBanner movie={featuredMovie} loading={loading.nowPlaying} />

      {/* Now Playing Section */}
      <View style={styles.section}>
        <SectionHeader
          title="Now Playing"
          onSeeAll={() =>
            navigation.navigate('MovieList', {
              type: 'now_playing',
              title: 'Now Playing',
            })
          }
        />
        <MovieList
          movies={nowPlaying}
          loading={loading.nowPlaying}
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
    marginBottom: 8,
  },
});

export default HomeScreen;
