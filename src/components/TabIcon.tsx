import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';

interface TabIconProps {
  name: string;
  color: string;
  size: number;
  isFocused: boolean;
  inactiveColor: string;
}

const TabIcon: React.FC<TabIconProps> = ({
  name,
  color,
  inactiveColor,
  size,
  isFocused,
}) => {
  // Animation values
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const animatedColor = useSharedValue(isFocused ? 1 : 0);

  // Update animation values when focus changes
  useEffect(() => {
    if (isFocused) {
      scale.value = withSpring(1.2, { damping: 10, stiffness: 100 });
      opacity.value = withTiming(1, { duration: 200 });
      animatedColor.value = withTiming(1, { duration: 200 });
    } else {
      scale.value = withSpring(1, { damping: 10, stiffness: 100 });
      opacity.value = withTiming(0, { duration: 150 });
      animatedColor.value = withTiming(0, { duration: 200 });
    }
  }, [isFocused]);

  // Use a solid icon when focused, outline when not focused
  const iconName = isFocused ? name.replace('-outline', '') : name;

  // Animated styles
  const iconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const backgroundStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value * 0.2,
      backgroundColor: color,
    };
  });

  const iconColorStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        animatedColor.value,
        [0, 1],
        [inactiveColor, color],
      ),
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.background, backgroundStyle]} />
      <Animated.View style={iconStyle}>
        <Animated.Text style={iconColorStyle}>
          <Icon name={iconName} size={size} />
        </Animated.Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
  },
});

export default TabIcon;
