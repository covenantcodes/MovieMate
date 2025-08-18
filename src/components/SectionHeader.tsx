import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Text from './Text';
import { useAppSelector } from '../redux/hooks';
import { theme } from '../config/colors';
import { FONT_FAMILY } from '../config/fonts';
import Icon from 'react-native-vector-icons/Ionicons';

interface SectionHeaderProps {
  title: string;
  onSeeAll?: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, onSeeAll }) => {
  const { isDark } = useAppSelector(state => state.theme);
  const themeMode = isDark ? theme.dark : theme.light;

  return (
    <View style={styles.container}>
      <Text variant="heading2" style={{ color: themeMode.colors.text.primary }}>
        {title}
      </Text>

      {onSeeAll && (
        <TouchableOpacity onPress={onSeeAll} style={styles.seeAllButton}>
          <Text
            style={[
              styles.seeAllText,
              { color: themeMode.colors.text.secondary },
            ]}
          >
            See All
          </Text>
          <Icon
            name="chevron-forward"
            size={16}
            color={themeMode.colors.text.secondary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
    marginTop: 16,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: 14,
    marginRight: 2,
  },
});

export default SectionHeader;
