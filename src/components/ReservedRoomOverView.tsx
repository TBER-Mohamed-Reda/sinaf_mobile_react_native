import { useTheme } from 'native-base';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
interface ReservedRoomOverViewProps {
  title: string;
  date: string;
}
const ReservedRoomOverView: React.FC<ReservedRoomOverViewProps> = ({ title, date }) => {
  const { colors, fonts } = useTheme()
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderBottomColor: colors.gray[200],
      borderBottomWidth: 1
    },
    title: {
      textTransform: 'capitalize',
      fontSize: 16,
      fontFamily: fonts.heading.semiBold,
    },
    dateText: {
      fontSize: 12,
      fontWeight: '500',
      color: colors.gray[400],
      marginLeft: 8,
      fontFamily: fonts.heading.regular,
    },
  });
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.dateText}>{date}</Text>
    </View>
  );
};
export default ReservedRoomOverView;
