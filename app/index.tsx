import React, { useCallback, useEffect, useState } from "react";
import { Text, StyleSheet, FlatList, ViewToken } from "react-native";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useGetImageListRoot } from "@/hooks/useGetImgListRoot";
import Thumbnail from "@/components/Thumbnail";
import { DisplayImageProps } from "./displayImage{name}";
import { FileExtension } from "@/types/FileExtension";
import { SafeAreaView } from "react-native-safe-area-context";
import semaphoreInstance from "@/utils/Semaphore";

const semaphore = semaphoreInstance;

export default function Index() {
  const {
    data: imageListText,
    loading,
    error,
    fetchData,
  } = useGetImageListRoot();
  const [imageList, setImageList] = useState<DisplayImageProps[]>([]);
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (loading) {
      fetchData();
    }
  }, [loading, error]);

  useEffect(() => {
    if (imageListText) {
      const lines = imageListText.split("\n");
      const groupedFiles: { [key: string]: DisplayImageProps } = {};

      lines.forEach((line) => {
        const parts = line.split(",");
        if (parts.length < 3) return;

        const filenameWithExt = parts[1].trim();
        const size = parseInt(parts[2], 10);
        const extension = filenameWithExt.split(".").pop() || "";
        const baseFilename = filenameWithExt.replace(/\.[^/.]+$/, ""); // Remove the extension

        if (!groupedFiles[baseFilename]) {
          groupedFiles[baseFilename] = {
            filename: baseFilename,
            metadata: [],
          };
        }

        groupedFiles[baseFilename].metadata.push({
          extension,
          size,
        });
      });

      const groupedFilesArray = Object.values(groupedFiles).reverse();
      setImageList(groupedFilesArray);
    }
  }, [imageListText]);

  // Render function for FlatList
  const renderItem = useCallback(({ item }: { item: DisplayImageProps }) => {
    // Determine the extension to use for the thumbnail
    const extensionPriority = [
      FileExtension.JPG,
      FileExtension.ORF,
      FileExtension.MOV,
    ];

    let thumbnailFilename = null;

    for (const ext of extensionPriority) {
      const meta = item.metadata.find((meta) => meta.extension === ext);
      if (meta) {
        thumbnailFilename = `${item.filename}.${ext}`;
        break;
      }
    }

    return thumbnailFilename ? (
      <Thumbnail filename={thumbnailFilename} />
    ) : (
      <Text>No thumbnail available</Text>
    );
  }, []);

  // Key extractor function for FlatList
  const keyExtractor = (item: DisplayImageProps) => item.filename;

  interface ViewableItemsChangedInfo {
    viewableItems: ViewToken<DisplayImageProps>[];
    changed: ViewToken<DisplayImageProps>[];
  }

  const onViewableItemsChanged = useCallback(
    ({ viewableItems, changed }: ViewableItemsChangedInfo) => {
      const currentlyVisible = new Set<string>();

      viewableItems.forEach((viewableItem) => {
        const filename = viewableItem.item.filename;
        currentlyVisible.add(filename);
        if (!visibleItems.has(filename)) {
          console.log(`Showing ${filename}`);
        }
      });

      visibleItems.forEach((filename) => {
        if (!currentlyVisible.has(filename)) {
          console.log(`${filename} left the screen`);
        }
      });

      setVisibleItems(currentlyVisible);
    },
    [visibleItems]
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <LoadingSpinner message="Töltés... Biztosan csatlakozva vagy az Olympus gépedhez?" />
      ) : imageListText ? (
        <FlatList
          style={styles.flatList}
          numColumns={3}
          contentContainerStyle={styles.flatListContainer}
          getItemLayout={(data, index) => ({
            length: 120,
            offset: 120 * index,
            index,
          })}
          onViewableItemsChanged={onViewableItemsChanged}
          data={imageList}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
        />
      ) : (
        <Text style={styles.text}>Hiba történt az oldal betöltése közben</Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  flatList: {
    width: "100%",
  },
  flatListContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});
