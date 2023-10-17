import React, { ReactElement, useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CustomRatingInput = ({ defaultValue = 0, onValueChange }) => {
  const [rating, setRating] = useState(defaultValue);

  const handleRating = (value) => {
    setRating(value);
    if (onValueChange) {
      onValueChange(value);
    }
  };

  const getStarColor = (index) => {
    if (index <= rating) {
      return rating < 2 ? '#DC3645' : rating >= 4 ? '#199954' : '#FFC107';
    } else {
      return '#a0aec0';
    }
  };

  const renderStars = () => {
    const stars: ReactElement<any, any>[] = [];

    for (let i = 1; i <= 5; i++) {
      const starIconName = i <= rating ? 'ios-star' : 'ios-star-outline';
      const starColor = getStarColor(i);

      stars.push(
        <TouchableOpacity key={i} onPress={() => handleRating(i)}>
          <Ionicons name={starIconName} size={25} color={starColor} />
        </TouchableOpacity>
      );
    }

    return stars;
  };

  return <View style={styles.container}>{renderStars()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomRatingInput;
