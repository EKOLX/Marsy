import React, { FC, useState } from "react";
import { StyleSheet, View, Text, Image, ActivityIndicator } from "react-native";

interface CustomImageProps {
  uri: string;
  loadingIndicatorSize?: "small" | "large";
  onLoad?: () => void;
}

const CustomImage: FC<CustomImageProps> = ({
  uri,
  loadingIndicatorSize = "small",
  onLoad,
}) => {
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Couldn't load image.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {loading && (
        <ActivityIndicator
          style={StyleSheet.absoluteFill}
          size={loadingIndicatorSize}
        />
      )}
      <Image
        style={StyleSheet.absoluteFill}
        source={{ uri }}
        onLoad={() => {
          setLoading(false);
          if (onLoad) {
            onLoad();
          }
        }}
        onError={() => setHasError(true)}
      />
    </View>
  );
};

export default CustomImage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  errorText: {
    padding: 10,
  },
});
