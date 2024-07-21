import React, { useEffect, useState, memo } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { useGetThumbnail } from "@/hooks/useGetThumbnail";
import { Buffer } from "buffer"; // For base64 encoding

export interface ThumbnailProps {
  filename: string;
  extension?: string;
  hasPrio?: boolean;
}

// Memoize the Thumbnail component
const Thumbnail = memo(({ filename, extension, hasPrio }: ThumbnailProps) => {
  const { data, loading, error } = useGetThumbnail(filename);
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      // Convert Uint8Array to base64 string
      const base64String = Buffer.from(data).toString("base64");
      const imageUri = `data:image/jpeg;base64,${base64String}`;
      setImageUri(imageUri);
    }
  }, [data]);

  if (error) return <Text>Error loading image</Text>;

  return (
    <View style={styles.container}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <Text>{filename}</Text>
      )}
    </View>
  );
});

export default Thumbnail;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    width: "33.33%",
    height: 100,
  },
  image: {
    width: 100, // Adjust the width
    height: 100, // Adjust the height
    borderRadius: 10,
  },
});
