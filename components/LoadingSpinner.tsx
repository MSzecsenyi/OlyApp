// src/components/LoadingSpinner.tsx
import { Colors } from "@/constants/Colors";
import React from "react";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";

interface LoadingSpinnerProps {
  size?: "small" | "large";
  color?: string;
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "large",
  color = Colors.light.text,
  message = "Loading...",
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%", // Ensures full width
    height: "100%", // Ensures full height
    backgroundColor: Colors.light.background, // Slightly dim the background
  },
  message: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.light.text,
  },
});

export default LoadingSpinner;
