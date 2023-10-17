import { Center } from 'native-base';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const CustomRating = ({ rating }) => {
    const filledStarColor =
        rating < 2 ? '#DC3645' : rating >= 4 ? '#199954' : '#FFC107';

    const renderStars = () => {
        const stars: React.ReactNode[] = [];
        const fullStars = Math.floor(rating);
        const decimalStar = rating % 1;

        for (let i = 0; i < 5; i++) {
            stars.push(<Icon key={i} name="star" size={15} color="gray" />);
        }

        for (let i = 0; i < fullStars; i++) {
            stars[i] = (
                <Icon key={i} name="star" size={15} color={filledStarColor} />
            );
        }

        if (decimalStar > 0) {
            stars[fullStars] = (
                <Icon
                    key={fullStars}
                    name="star-half-full"
                    size={15}
                    color={filledStarColor}
                />
            );
        }

        return stars;
    };

    return (
        <View style={styles.container}>{renderStars()}</View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default CustomRating;
