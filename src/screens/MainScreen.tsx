import React, { FC, useEffect, useLayoutEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  Image,
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
import { RouteName } from "../navigation/RouteName";
import { AppState } from "../store/AppState";
import { addFavoritePhoto, setPhotos } from "../store/actions/photosAction";

interface MainScreenProps {
  navigation: any;
}

const { width, height } = Dimensions.get("window");
const photosPerScreen = 3;

const MainScreen: FC<MainScreenProps> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [apiPage, setApiPage] = useState(1);
  const [page, setPage] = useState(0);

  const dispatch = useDispatch();

  const photos = useSelector((state: AppState) => state.photosList.photos);

  const translateX = new Animated.Value(0);

  const swipeCompleted = useRef(false);

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
            iconName="md-star-outline"
            onPress={() => navigation.navigate(RouteName.Favorites)}
          />
        </HeaderButtons>
      ),
    });
  }, [navigation]);

  const onCardGestureEvent = Animated.event([
    { nativeEvent: { translationX: translateX } },
  ]);

  const onCardHandlerStateChange = (
    event: HandlerStateChangeEvent<PanGestureHandlerEventPayload>
  ) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const translationX = event.nativeEvent.translationX;
      swipeCompleted.current = false;

      Animated.timing(translateX, {
        toValue: event.nativeEvent.translationX > 0 ? width : -width,
        duration: 600,
        easing: EasingNode.inOut(EasingNode.ease),
      }).start(({ finished }) =>
        onSwipeAnimationComplete(finished, translationX)
      );
    }
  };

  const onSwipeAnimationComplete = (
    finished: boolean,
    translationX: number
  ) => {
    // I don't know why but completion callback runs twice
    if (!swipeCompleted.current && translationX > 0) {
      swipeCompleted.current = true;
      dispatch(addFavoritePhoto(photos[page]));
    } else {
      // Move to trash
    }

    setPage((curPage) => {
      if (curPage + photosPerScreen < photos.length) {
        return curPage + 1;
      } else {
        setApiPage((curApiPage) => curApiPage + 1);
        return 0;
      }
    });
  };

  if (loading) {
    return <ActivityIndicator style={styles.container} size="large" />;
  }

  return (
    <View style={styles.container}>
      {photos
        ?.slice(page, photosPerScreen + page)
        .reverse()
        .map((photo, index) => (
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
                { transform: [{ translateX: index === 2 ? translateX : 0 }] },
              ]}
            >
              <Image style={styles.image} source={{ uri: photo.src }} />
            </Animated.View>
          </PanGestureHandler>
        ))}
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
});
