import { Button, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useCommandList } from "@/hooks/useCommandList";
import { router } from "expo-router";
import LoadingSpinner from "@/components/LoadingSpinner";

const NoConnectionScreen = () => {
  const { data, loading, fetchData } = useCommandList();
  const [firstFetch, setFirstFetch] = useState(true);

  useEffect(() => {
    if (data) {
      router.back();
    }
  }, [data]);

  return (
    <View style={styles.container}>
      {!firstFetch && loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Text style={styles.text}>
            Nincs kapcsolat. Kérlek csatlakozz Olympus géped wifijéhez!
          </Text>
          <Button
            title="Újratöltés"
            onPress={() => {
              fetchData();
              setFirstFetch(false);
            }}
          />
        </>
      )}
    </View>
  );
};

export default NoConnectionScreen;

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
