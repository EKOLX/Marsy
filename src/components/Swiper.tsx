import React, { FC, useRef, useState } from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import { useDispatch } from "react-redux";
import {
  PanGestureHandler,
  HandlerStateChangeEvent,
  State,
  PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import Animated, { EasingNode } from "react-native-reanimated";

import { addFavoritePhoto } from "../store/actions/photosAction";
import IoniconsButton from "../components/UI/IoniconsButton";
import Photo from "../models/Photo";
import Image from "../components/UI/CustomImage";

interface SwiperProps {
  images: Array<Photo>;
  topPage: number;
  onSwipeComplete: (movedCardId: number) => void;
}

const SCREEN_WIDTH = Dimensions.get("window").width;
const PHOTOS_PER_SCREEN = 3;

const Swiper: FC<SwiperProps> = ({ images, topPage, onSwipeComplete }) => {
  const [loading, setLoading] = useState(false);

  const translateX = new Animated.Value(0);

  const lastSwipedPhotoId = useRef(-1);

  const dispatch = useDispatch();

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

  // As an argument could be used enum as well
  const moveCard = (translationX: number) => {
    lastSwipedPhotoId.current = -1;

    Animated.timing(translateX, {
      toValue: translationX > 0 ? SCREEN_WIDTH : -SCREEN_WIDTH,
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
    //
    if (lastSwipedPhotoId.current < 0) {
      lastSwipedPhotoId.current = images[topPage].id;

      if (translationX > 0) {
        dispatch(addFavoritePhoto(images[topPage]));
      } else {
        // Move to trash
      }

      onSwipeComplete(lastSwipedPhotoId.current);
    }
  };

  return (
    <View style={styles.container}>
      {images
        ?.slice(topPage, PHOTOS_PER_SCREEN + topPage)
        .reverse()
        .map((photo, index) => {
          // only top Image View
          const canBeMoved =
            index === 2 || // when there are 3 images
            (images.length - 2 === topPage && index === 1) || // 2 images
            (images.length - 1 === topPage && index === 0); // 1 image

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
                    width: SCREEN_WIDTH - 110 + index * 40,
                  },
                  { transform: [{ translateX: canBeMoved ? translateX : 0 }] },
                ]}
              >
                <Image
                  uri={photo.src}
                  onLoad={() => setLoading(false)}
                  loadingIndicatorSize="large"
                />
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
          {loading ? "Downloading..." : `${images.length} cards`}
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

export default Swiper;

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
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    width: SCREEN_WIDTH - 10,
    paddingHorizontal: 50,
    bottom: 25,
  },
  action: {
    width: SCREEN_WIDTH / 6,
    height: SCREEN_WIDTH / 6,
    borderRadius: SCREEN_WIDTH / 3,
  },
  statusText: {
    marginTop: 40,
    color: "gray",
    fontWeight: "400",
  },
});
