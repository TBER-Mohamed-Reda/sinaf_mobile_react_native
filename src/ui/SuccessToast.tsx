import React, { useEffect, useState } from "react";
import { Text, StyleSheet, Animated } from "react-native";

const SuccessToast = ({ message }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [message]);

  if (!visible) {
    return null;
  }

  return (
    <Animated.View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "green",
    width: "90%",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    alignSelf: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
});

export default SuccessToast;
