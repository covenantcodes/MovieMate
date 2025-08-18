import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  Platform,
  Switch,
} from 'react-native';
import Text from '../components/Text';
import { useAppSelector } from '../redux/hooks';
import { theme, colors } from '../config/colors';
import ThemeSwitcher from '../components/ThemeSwitcher';
import Icon from 'react-native-vector-icons/Ionicons';
import { FONT_FAMILY } from '../config/fonts';

const APP_VERSION = '1.0.0';

const SettingsScreen = () => {
  const { isDark } = useAppSelector(state => state.theme);
  const themeMode = isDark ? theme.dark : theme.light;

  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  const clearCache = () => {
    console.log('Cache cleared');
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: themeMode.colors.background },
      ]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.appInfoContainer}>
          <Image
            source={require('../assets/images/app-icon.png')}
            style={styles.appIcon}
          />
          <View style={styles.appTextContainer}>
            <Text
              variant="heading1"
              style={[
                styles.appTitle,
                { color: themeMode.colors.text.primary },
              ]}
            >
              MovieMate
            </Text>
            <Text
              style={[
                styles.appVersion,
                { color: themeMode.colors.text.secondary },
              ]}
            >
              Version {APP_VERSION}
            </Text>
          </View>
        </View>
      </View>

      {/* Appearance Section */}
      <View
        style={[styles.sectionCard, { backgroundColor: themeMode.colors.card }]}
      >
        <Text
          variant="heading2"
          style={[
            styles.sectionTitle,
            { color: themeMode.colors.text.primary },
          ]}
        >
          Appearance
        </Text>
        <ThemeSwitcher />
      </View>

      {/* Preferences Section */}
      <View
        style={[styles.sectionCard, { backgroundColor: themeMode.colors.card }]}
      >
        <Text
          variant="heading2"
          style={[
            styles.sectionTitle,
            { color: themeMode.colors.text.primary },
          ]}
        >
          Preferences
        </Text>

        <View style={styles.settingItem}>
          <View style={styles.settingTextContainer}>
            <Text
              style={[
                styles.settingLabel,
                { color: themeMode.colors.text.primary },
              ]}
            >
              Show adult content
            </Text>
            <Text
              style={[
                styles.settingDescription,
                { color: themeMode.colors.text.secondary },
              ]}
            >
              Include mature content in search results
            </Text>
          </View>
          <Switch
            trackColor={{
              false: colors.neutral.grey300,
              true: colors.primary.light,
            }}
            thumbColor={colors.primary.main}
            ios_backgroundColor={colors.neutral.grey300}
            value={false}
            // Update this with your actual state and handler
            onValueChange={() => {}}
          />
        </View>

        <View
          style={[
            styles.separator,
            { backgroundColor: themeMode.colors.border },
          ]}
        />

        <TouchableOpacity style={styles.settingItem} onPress={clearCache}>
          <View style={styles.settingTextContainer}>
            <Text
              style={[
                styles.settingLabel,
                { color: themeMode.colors.text.primary },
              ]}
            >
              Clear cache
            </Text>
            <Text
              style={[
                styles.settingDescription,
                { color: themeMode.colors.text.secondary },
              ]}
            >
              Free up storage space
            </Text>
          </View>
          <Icon name="trash-outline" size={20} color={colors.primary.main} />
        </TouchableOpacity>
      </View>

      {/* Support Section */}
      <View
        style={[styles.sectionCard, { backgroundColor: themeMode.colors.card }]}
      >
        <Text
          variant="heading2"
          style={[
            styles.sectionTitle,
            { color: themeMode.colors.text.primary },
          ]}
        >
          Support
        </Text>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => openLink('https://www.themoviedb.org/')}
        >
          <View style={styles.settingTextContainer}>
            <Text
              style={[
                styles.settingLabel,
                { color: themeMode.colors.text.primary },
              ]}
            >
              Data provided by TMDB
            </Text>
            <Text
              style={[
                styles.settingDescription,
                { color: themeMode.colors.text.secondary },
              ]}
            >
              Visit The Movie Database
            </Text>
          </View>
          <Icon name="open-outline" size={20} color={colors.primary.main} />
        </TouchableOpacity>

        <View
          style={[
            styles.separator,
            { backgroundColor: themeMode.colors.border },
          ]}
        />

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => openLink('mailto:support@moviemate.app')}
        >
          <View style={styles.settingTextContainer}>
            <Text
              style={[
                styles.settingLabel,
                { color: themeMode.colors.text.primary },
              ]}
            >
              Contact support
            </Text>
            <Text
              style={[
                styles.settingDescription,
                { color: themeMode.colors.text.secondary },
              ]}
            >
              Send us feedback or report issues
            </Text>
          </View>
          <Icon name="mail-outline" size={20} color={colors.primary.main} />
        </TouchableOpacity>
      </View>

      {/* About Section */}
      <View
        style={[styles.sectionCard, { backgroundColor: themeMode.colors.card }]}
      >
        <Text
          variant="heading2"
          style={[
            styles.sectionTitle,
            { color: themeMode.colors.text.primary },
          ]}
        >
          About
        </Text>

        <Text
          style={[styles.aboutText, { color: themeMode.colors.text.secondary }]}
        >
          MovieMate is your personal movie companion. Browse popular movies,
          search for your favorites, and save them for later. We aim to provide
          the best user experience for movie enthusiasts.
        </Text>

        <View style={styles.socialContainer}>
          {['logo-github', 'logo-twitter', 'logo-instagram'].map(
            (icon, index) => (
              <TouchableOpacity
                key={icon}
                style={[
                  styles.socialButton,
                  { backgroundColor: colors.primary.light },
                ]}
                onPress={() => {}}
              >
                <Icon name={icon} size={22} color={colors.neutral.white} />
              </TouchableOpacity>
            ),
          )}
        </View>

        <Text
          style={[
            styles.copyrightText,
            { color: themeMode.colors.text.secondary },
          ]}
        >
          © 2025 MovieMate. All rights reserved.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  headerSection: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  appInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  appIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
  },
  appTextContainer: {
    justifyContent: 'center',
  },
  appTitle: {
    fontSize: 24,
  },
  appVersion: {
    fontSize: 14,
    fontFamily: FONT_FAMILY.regular,
  },
  sectionCard: {
    borderRadius: 16,
    marginBottom: 20,
    padding: 16,
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
  sectionTitle: {
    marginBottom: 16,
    fontSize: 18,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontFamily: FONT_FAMILY.medium,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    fontFamily: FONT_FAMILY.regular,
  },
  separator: {
    height: 1,
    width: '100%',
    marginVertical: 8,
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 22,
    fontFamily: FONT_FAMILY.regular,
    marginBottom: 20,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  socialButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  copyrightText: {
    fontSize: 12,
    fontFamily: FONT_FAMILY.regular,
    textAlign: 'center',
  },
});

export default SettingsScreen;
