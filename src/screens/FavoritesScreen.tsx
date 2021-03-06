import React, { FC, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ListRenderItem,
  Dimensions,
  PixelRatio,
  TouchableHighlight,
  Alert,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";

import { AppState } from "../store/AppState";
import { removeFavoritePhoto } from "../store/actions/photosAction";
import Photo from "../models/Photo";
import Image from "../components/UI/CustomImage";

interface FavoritesScreenProps {}

const screenWidth = Dimensions.get("window").width;
// Sizes can be changed according to screen width.
const numColumns = 3;
const itemMargin = 10;

const FavoritesScreen: FC<FavoritesScreenProps> = () => {
  const [fullScreenImageUri, setFullScreenImageUri] = useState("");

  const dispatch = useDispatch();

  const favorites = useSelector(
    (state: AppState) => state.photosList.favoritesPhotos
  );

  const onImageLongPress = (imageId: number) => {
    Alert.alert(
      "Deletion",
      "Are you sure you want to remove the image from your favorites?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            dispatch(removeFavoritePhoto(imageId));
          },
        },
      ]
    );
  };

  const renderFavorite: ListRenderItem<Photo> = ({ item }) => {
    const size = PixelRatio.roundToNearestPixel(
      (screenWidth - itemMargin * 2 * (numColumns + 1)) / numColumns
    );

    return (
      <TouchableHighlight
        style={[
          styles.imageContext,
          { width: size, height: size, margin: itemMargin },
        ]}
        onPress={() => setFullScreenImageUri(item.src)}
        onLongPress={() => onImageLongPress(item.id)}
      >
        <Image uri={item.src} />
      </TouchableHighlight>
    );
  };

  const keyExtractor = (photo: Photo) => photo.id.toString();

  if (favorites.length === 0) {
    return (
      <View style={styles.container}>
        <Text>You don't have any favorite picture.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        numColumns={numColumns}
        contentContainerStyle={styles.imagesContainer}
        data={favorites}
        renderItem={renderFavorite}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
      />
      {fullScreenImageUri ? (
        <TouchableHighlight
          style={styles.fullScreenOverlay}
          onPress={() => setFullScreenImageUri("")}
        >
          <Image uri={fullScreenImageUri} loadingIndicatorSize="large" />
        </TouchableHighlight>
      ) : null}
    </View>
  );
};

export default FavoritesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imagesContainer: {
    flexGrow: 1,
    width: screenWidth - itemMargin * 2,
    paddingBottom: 20,
  },
  imageContext: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
    overflow: "hidden",
  },
  fullScreenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black",
    zIndex: 2,
  },
});
