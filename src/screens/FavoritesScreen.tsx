import React, { FC } from "react";
import {
  StyleSheet,
  View,
  Image,
  FlatList,
  ListRenderItem,
  Dimensions,
  PixelRatio,
} from "react-native";
import { useSelector } from "react-redux";
import Photo from "../models/Photo";

import { AppState } from "../store/AppState";

interface FavoritesScreenProps {}

const FavoritesScreen: FC<FavoritesScreenProps> = () => {
  const favorites = useSelector(
    (state: AppState) => state.photosList.favoritesPhotos
  );

  const renderFavorite: ListRenderItem<Photo> = ({ item }) => {
    const { width } = Dimensions.get("window");
    const itemMargin = 10;
    const numColumns = 3;
    const size = PixelRatio.roundToNearestPixel(
      (width - itemMargin * 2 * (numColumns + 1)) / numColumns
    );

    return (
      <View
        key={item.id}
        style={[
          styles.imageContainer,
          { width: size, height: size, margin: itemMargin },
        ]}
      >
        <Image style={styles.image} source={{ uri: item.src }} />
      </View>
    );
  };

  const keyExtractor = (photo: Photo) => photo.id.toString();

  return (
    <View style={styles.container}>
      <FlatList
        numColumns={3}
        data={favorites}
        renderItem={renderFavorite}
        keyExtractor={keyExtractor}
      />
    </View>
  );
};

export default FavoritesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
