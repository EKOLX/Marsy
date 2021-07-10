import React, { FC } from "react";
import { StyleSheet, View, Text } from "react-native";
import { useSelector } from "react-redux";

import { AppState } from "../store/AppState";

interface FavoritesScreenProps {}

const FavoritesScreen: FC<FavoritesScreenProps> = () => {
  const favorites = useSelector(
    (state: AppState) => state.photosList.favoritesPhotos
  );

  return (
    <View>
      {favorites.map((fav) => (
        <Text key={fav.id}>{fav.src}</Text>
      ))}
    </View>
  );
};

export default FavoritesScreen;

const styles = StyleSheet.create({});
