import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { CATEGORY_CONFIG, PlaceCategory } from '@/types/places';

interface CategoryFilterProps {
  activeCategories: string[];
  onToggleCategory: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  activeCategories,
  onToggleCategory,
}) => {
  return (
    <View style={styles.container}>
      {Object.entries(CATEGORY_CONFIG).map(([category, config]) => {
        const isActive = activeCategories.includes(category);
        return (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              isActive && styles.categoryButtonActive,
            ]}
            onPress={() => onToggleCategory(category)}
          >
            <Text style={styles.categoryIcon}>{config.icon}</Text>
            <Text
              style={[
                styles.categoryLabel,
                isActive && styles.categoryLabelActive,
              ]}
            >
              {config.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  categoryButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94A3B8',
  },
  categoryLabelActive: {
    color: '#FFFFFF',
  },
});
