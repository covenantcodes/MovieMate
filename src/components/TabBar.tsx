import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useAnimatedReaction,
} from 'react-native-reanimated';
import Text from './Text';
import { useAppSelector } from '../redux/hooks';
import { theme, colors } from '../config/colors';
import ReanimatedTabIcon from './TabIcon';
import { FONT_FAMILY } from '../config/fonts';
import { Platform } from 'react-native';

const { width } = Dimensions.get('window');

const TabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const { isDark } = useAppSelector(state => state.theme);
  const themeMode = isDark ? theme.dark : theme.light;
  const insets = useSafeAreaInsets();

  // Calculate tab width
  const tabWidth = width / state.routes.length;

  // Shared values for animations
  const indicatorPosition = useSharedValue(state.index * tabWidth);

  // Update indicator position when tab changes
  useAnimatedReaction(
    () => state.index,
    currentIndex => {
      indicatorPosition.value = withSpring(currentIndex * tabWidth, {
        damping: 15,
        stiffness: 120,
      });
    },
    [state.index],
  );

  // Animated styles for indicator
  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: indicatorPosition.value }],
    };
  });

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: themeMode.colors.background,
          borderTopColor: isDark
            ? colors.neutral.grey800
            : colors.neutral.grey300,
          paddingBottom: insets.bottom || (Platform.OS === 'ios' ? 25 : 0),
        },
      ]}
    >
      {/* Animated Indicator */}
      <Animated.View
        style={[
          styles.indicator,
          { width: tabWidth, backgroundColor: colors.primary.main },
          indicatorStyle,
        ]}
      />

      {/* Tab Buttons */}
      <View style={styles.tabButtonsContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          // Get icon name based on route
          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = 'home-outline';
              break;
            case 'Search':
              iconName = 'search-outline';
              break;
            case 'Favorites':
              iconName = 'heart-outline';
              break;
            case 'Settings':
              iconName = 'settings-outline';
              break;
            default:
              iconName = 'ellipse-outline';
          }

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              style={styles.tabButton}
            >
              <ReanimatedTabIcon
                name={iconName}
                color={colors.primary.main}
                inactiveColor={themeMode.colors.text.secondary}
                size={24}
                isFocused={isFocused}
              />
              <Text
                style={[
                  styles.label,
                  {
                    color: isFocused
                      ? colors.primary.main
                      : themeMode.colors.text.secondary,
                  },
                ]}
              >
                {route.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderTopWidth: 1,
  },
  tabButtonsContainer: {
    flexDirection: 'row',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  indicator: {
    height: 3,
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: 3,
  },
  label: {
    fontSize: 10,
    fontFamily: FONT_FAMILY.medium,
    marginTop: 4,
  },
});

export default TabBar;
