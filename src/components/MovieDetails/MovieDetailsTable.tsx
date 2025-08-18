import React from 'react';
import { View, StyleSheet } from 'react-native';
import Text from '../Text';
import { FONT_FAMILY } from '../../config/fonts';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../config/colors';

interface DetailItem {
  icon: string;
  iconColor?: string;
  label: string;
  value: string;
}

interface ProductionCompany {
  id: number;
  name: string;
}

interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

interface MovieDetailsTableProps {
  status: string;
  releaseDate: string;
  budget: number;
  revenue: number;
  productionCompanies: ProductionCompany[];
  productionCountries: ProductionCountry[];
  formatCurrency: (amount: number) => string;
  formatDate: (date: string) => string;
  themeColors: any;
}

const MovieDetailsTable: React.FC<MovieDetailsTableProps> = ({
  status,
  releaseDate,
  budget,
  revenue,
  productionCompanies,
  productionCountries,
  formatCurrency,
  formatDate,
  themeColors,
}) => {
  // Create items array
  const detailItems: DetailItem[] = [
    {
      icon: 'calendar-outline',
      iconColor: colors.primary.main,
      label: 'Release Date',
      value: formatDate(releaseDate),
    },
    {
      icon: 'stats-chart-outline',
      iconColor: colors.primary.main,
      label: 'Status',
      value: status,
    },
  ];

  // Add financial details if available
  if (budget > 0) {
    detailItems.push({
      icon: 'cash-outline',
      iconColor: colors.success.main,
      label: 'Budget',
      value: formatCurrency(budget),
    });
  }

  if (revenue > 0) {
    detailItems.push({
      icon: 'trending-up-outline',
      iconColor: revenue > budget ? colors.success.main : colors.error.main,
      label: 'Revenue',
      value: formatCurrency(revenue),
    });
  }

  if (revenue > 0 && budget > 0) {
    const profit = revenue - budget;
    detailItems.push({
      icon: profit > 0 ? 'trophy-outline' : 'trending-down-outline',
      iconColor: profit > 0 ? colors.success.main : colors.error.main,
      label: 'Profit',
      value: formatCurrency(profit),
    });
  }

  // Add production companies if available
  if (productionCompanies && productionCompanies.length > 0) {
    detailItems.push({
      icon: 'business-outline',
      iconColor: colors.primary.main,
      label: 'Studios',
      value: productionCompanies.map(company => company.name).join(', '),
    });
  }

  // Add production countries if available
  if (productionCountries && productionCountries.length > 0) {
    detailItems.push({
      icon: 'globe-outline',
      iconColor: colors.primary.main,
      label: 'Countries',
      value: productionCountries.map(country => country.name).join(', '),
    });
  }

  return (
    <View style={styles.container}>
      <Text variant="heading2" style={styles.sectionTitle}>
        Details
      </Text>

      <View style={[styles.detailCard, { backgroundColor: themeColors.card }]}>
        {detailItems.map((item, index) => (
          <React.Fragment key={item.label}>
            <View style={styles.detailItem}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: `${item.iconColor}15` }, // 15% opacity version of the icon color
                ]}
              >
                <Icon
                  name={item.icon}
                  size={18}
                  color={item.iconColor || colors.primary.main}
                />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>{item.label}</Text>
                <Text
                  style={[styles.value, { color: themeColors.text.primary }]}
                >
                  {item.value}
                </Text>
              </View>
            </View>

            {index < detailItems.length - 1 && (
              <View
                style={[
                  styles.separator,
                  { backgroundColor: themeColors.border },
                ]}
              />
            )}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
    marginTop: 16,
  },
  detailCard: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    color: colors.neutral.grey600,
    fontFamily: FONT_FAMILY.medium,
    marginBottom: 2,
  },
  value: {
    fontSize: 15,
    fontFamily: FONT_FAMILY.regular,
  },
  separator: {
    height: 1,
    width: '100%',
    marginVertical: 8,
  },
});

export default MovieDetailsTable;
