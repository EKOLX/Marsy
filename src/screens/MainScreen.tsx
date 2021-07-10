import React, { FC, useEffect, useLayoutEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import {
  PanGestureHandler,
  HandlerStateChangeEvent,
  State,
  PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import Animated, { EasingNode } from "react-native-reanimated";

import IoniconsHeaderButton from "../components/UI/IoniconsHeaderButton";
import IoniconsButton from "../components/UI/IoniconsButton";
import { RouteName } from "../navigation/RouteName";
import { AppState } from "../store/AppState";
import {
  addFavoritePhoto,
  removeFavoritePhoto,
  setPhotos,
} from "../store/actions/photosAction";

interface MainScreenProps {
  navigation: any;
}

const { width, height } = Dimensions.get("window");
const photosPerScreen = 3;

const MainScreen: FC<MainScreenProps> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [apiPage, setApiPage] = useState(1);
  const [page, setPage] = useState(0);

  const dispatch = useDispatch();

  const photos = useSelector((state: AppState) => state.photosList.photos);

  const translateX = new Animated.Value(0);

  const lastSwipedPhotoId = useRef(-1);

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

  const onCardGestureEvent = Animated.event([
    { nativeEvent: { translationX: translateX } },
  ]);

  const onCardHandlerStateChange = (
    event: HandlerStateChangeEvent<PanGestureHandlerEventPayload>
  ) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      moveCard(event.nativeEvent.translationX);
    }
  };

  const moveCard = (translationX: number) => {
    lastSwipedPhotoId.current = -1;

    Animated.timing(translateX, {
      toValue: translationX > 0 ? width : -width,
      duration: 600,
      easing: EasingNode.inOut(EasingNode.ease),
    }).start(({ finished }) =>
      onSwipeAnimationComplete(finished, translationX)
    );
  };

  const onSwipeAnimationComplete = (
    finished: boolean,
    translationX: number
  ) => {
    // I don't know why but completion callback runs twice
    if (lastSwipedPhotoId.current < 0) {
      lastSwipedPhotoId.current = photos[page].id;

      if (translationX > 0) {
        dispatch(addFavoritePhoto(photos[page]));
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
    }
  };

  const onUndoButtonPressed = () => {
    dispatch(removeFavoritePhoto(lastSwipedPhotoId.current));
    setPage((curPage) => curPage - 1);
    setCanUndo(false);
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

  return (
    <View style={styles.container}>
      {photos
        ?.slice(page, photosPerScreen + page)
        .reverse()
        .map((photo, index) => {
          const canBeMoved =
            index === 2 ||
            (photos.length - 2 === page && index === 1) ||
            (photos.length - 1 === page && index === 0);

          return (
            <PanGestureHandler
              key={photo.id}
              onGestureEvent={onCardGestureEvent}
              onHandlerStateChange={onCardHandlerStateChange}
            >
              <Animated.View
                style={[
                  styles.picture,
                  {
                    top: 30 + index * 16,
                    bottom: 80 - index * 10,
                    width: width - 110 + index * 40,
                  },
                  { transform: [{ translateX: canBeMoved ? translateX : 0 }] },
                ]}
              >
                <Image style={styles.image} source={{ uri: photo.src }} />
              </Animated.View>
            </PanGestureHandler>
          );
        })}
      <View style={styles.actions}>
        <IoniconsButton
          iconName="md-thumbs-down"
          style={[styles.action, { backgroundColor: "black" }]}
          onTap={() => moveCard(-1)}
        />
        <Text style={styles.statusText}>
          {loading ? "Downloading..." : `${photos.length} cards`}
        </Text>
        <IoniconsButton
          iconName="md-thumbs-up"
          style={[styles.action, { backgroundColor: "red" }]}
          onTap={() => moveCard(1)}
        />
      </View>
    </View>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  picture: {
    position: "absolute",
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
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    width: width - 10,
    paddingHorizontal: 50,
    bottom: 25,
  },
  action: {
    width: width / 6,
    height: width / 6,
    borderRadius: width / 3,
  },
  statusText: {
    marginTop: 40,
    color: "gray",
    fontWeight: "400",
  },
});
