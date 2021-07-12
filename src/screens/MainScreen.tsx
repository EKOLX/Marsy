import React, { FC, useEffect, useLayoutEffect, useState, useRef } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import { RouteName } from "../navigation/RouteName";
import { AppState } from "../store/AppState";
import {
  addFavoritePhoto,
  removeFavoritePhoto,
  setPhotos,
} from "../store/actions/photosAction";
import IoniconsHeaderButton from "../components/UI/IoniconsHeaderButton";
import Swiper from "../components/Swiper";
import Photo from "../models/Photo";
import { Direction } from "../models/Direction";

interface MainScreenProps {
  navigation: any;
}

const MainScreen: FC<MainScreenProps> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [page, setPage] = useState(0);
  const [apiPage, setApiPage] = useState(1);

  const dispatch = useDispatch();

  const photos = useSelector((state: AppState) => state.photosList.photos);

  const lastMovedCardId = useRef(-1);

  useEffect(() => {
    const loadPhotos = async () => {
      setLoading(true);
      await dispatch(setPhotos(apiPage));
      setLoading(false);
    };

    loadPhotos();
  }, [apiPage]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
          <Item
            title="Favorites"
            iconName="md-heart-outline"
            onPress={() => navigation.navigate(RouteName.Favorites)}
          />
        </HeaderButtons>
      ),
    });
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
          <Item
            title="Undo"
            onPress={onUndoButtonPressed}
            color={!canUndo ? "#ccc" : "red"}
            disabled={!canUndo}
          />
        </HeaderButtons>
      ),
    });
  }, [canUndo]);

  const onUndoButtonPressed = () => {
    dispatch(removeFavoritePhoto(lastMovedCardId.current));
    setPage((curPage) => curPage - 1);
    setCanUndo(false);
  };

  const onCardSwipeEnd = (direction: Direction, photo: Photo) => {
    lastMovedCardId.current = photo.id;

    if (direction === Direction.Right) {
      dispatch(addFavoritePhoto(photo));
    } else {
      // Move to trash
    }

    setPage((curPage) => {
      if (curPage < photos.length - 1) {
        return curPage + 1;
      } else {
        setApiPage((curApiPage) => curApiPage + 1);
        return 0;
      }
    });
    setCanUndo(true);
  };

  if (loading) {
    return <ActivityIndicator style={styles.container} size="large" />;
  }

  if (photos.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No image to show.</Text>
      </View>
    );
  }

  return <Swiper images={photos} topPage={page} onSwipeEnd={onCardSwipeEnd} />;
};

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
