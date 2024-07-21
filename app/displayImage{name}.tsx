import { StyleSheet, Text, View } from "react-native";
import React from "react";

export interface DisplayImageProps {
  filename: string;
  metadata: {
    extension: string;
    size: number;
  }[];
}

const displayImage = () => {
  return (
    <View>
      <Text>displayImage</Text>
    </View>
  );
};

export default displayImage;

const styles = StyleSheet.create({});
