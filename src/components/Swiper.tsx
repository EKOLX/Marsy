import React, { FC, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  PanResponder,
  Animated,
} from "react-native";
// import {
//   PanGestureHandler,
//   PanGestureHandlerEventPayload,
//   HandlerStateChangeEvent,
//   State,
// } from "react-native-gesture-handler";
// import ReAnimated, { EasingNode } from "react-native-reanimated";

import IoniconsButton from "../components/UI/IoniconsButton";
import Photo from "../models/Photo";
import Image from "../components/UI/CustomImage";
import { Direction } from "../models/Direction";

interface SwiperProps {
  images: Array<Photo>;
  topPage: number;
  onSwipeEnd: (direction: Direction, photo: Photo) => void;
}

const screenWidth = Dimensions.get("window").width;
const swipeThreshold = screenWidth * 0.3;
const imagesPerScreen = 3;

const Swiper: FC<SwiperProps> = ({ images, topPage, onSwipeEnd }) => {
  const [loading, setLoading] = useState(true);

  //const translateX = new ReAnimated.Value(0);
  const cardPosition = new Animated.ValueXY();

  const lastSwipedPhotoId = useRef(-1);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gesture) => {
      cardPosition.setValue({ x: gesture.dx, y: 0 });
    },
    onPanResponderRelease: (event, gesture) => {
      if (gesture.dx > swipeThreshold) {
        moveCard(Direction.Right);
      } else if (gesture.dx < -swipeThreshold) {
        moveCard(Direction.Left);
      } else {
        resetCardPosition();
      }
    },
  });

  const resetCardPosition = () => {
    Animated.spring(cardPosition, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  };

  // const onCardGestureEvent = ReAnimated.event([
  //   { nativeEvent: { translationX: translateX } },
  // ]);

  // const onCardHandlerStateChange = (
  //   event: HandlerStateChangeEvent<PanGestureHandlerEventPayload>
  // ) => {
  //   if (event.nativeEvent.oldState === State.ACTIVE) {
  //     moveCard(
  //       event.nativeEvent.translationX > 0 ? Direction.Right : Direction.Left
  //     );
  //   }
  // };

  // As an argument could be used enum as well
  const moveCard = (direction: Direction) => {
    lastSwipedPhotoId.current = -1;

    // ReAnimated.timing(translateX, {
    //   toValue: direction === Direction.Right ? screenWidth : -screenWidth,
    //   duration: 600,
    //   easing: EasingNode.inOut(EasingNode.ease),
    // }).start(() => onSwipeAnimationComplete(direction));

    Animated.timing(cardPosition, {
      toValue: {
        x: direction === Direction.Right ? screenWidth : -screenWidth,
        y: 0,
      },
      duration: 600,
      useNativeDriver: false,
    }).start(() => onSwipeAnimationComplete(direction));
  };

  const onSwipeAnimationComplete = (direction: Direction) => {
    if (lastSwipedPhotoId.current < 0) {
      lastSwipedPhotoId.current = images[topPage].id;

      cardPosition.setValue({ x: 0, y: 0 });

      onSwipeEnd(direction, images[topPage]);
    }
  };

  return (
    <View style={styles.container}>
      {/* <PanGestureHandler
        onGestureEvent={onCardGestureEvent}
        onHandlerStateChange={onCardHandlerStateChange}
      >
        <ReAnimated.View style={styles.container}> */}
      {images
        ?.slice(topPage, imagesPerScreen + topPage)
        .reverse()
        .map((image, index) => {
          const isTopCard =
            index === 2 || // when there are 3 images
            (images.length - 2 === topPage && index === 1) || // 2 images
            (images.length - 1 === topPage && index === 0); // 1 image

          return (
            <Animated.View
              key={image.id}
              style={[
                styles.picture,
                {
                  top: 30 + index * 16,
                  bottom: 80 - index * 10,
                  width: screenWidth - 110 + index * 40,
                },
                {
                  transform: [{ translateX: isTopCard ? cardPosition.x : 0 }], // translateX
                },
              ]}
              {...panResponder.panHandlers}
            >
              <Image
                uri={image.src}
                onLoad={() => {
                  if (isTopCard) setLoading(false);
                }}
                loadingIndicatorSize="large"
              />
            </Animated.View>
          );
        })}
      {/* </ReAnimated.View>
      </PanGestureHandler> */}
      <View style={styles.actions}>
        <IoniconsButton
          iconName="md-thumbs-down"
          style={[styles.action, { backgroundColor: "black" }]}
          onTap={() => moveCard(Direction.Left)}
        />
        <Text style={styles.statusText}>
          {loading ? "Downloading..." : `${images.length} cards`}
        </Text>
        <IoniconsButton
          iconName="md-thumbs-up"
          style={[styles.action, { backgroundColor: "red" }]}
          onTap={() => moveCard(Direction.Right)}
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
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
    overflow: "hidden",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    width: screenWidth - 10,
    paddingHorizontal: 50,
    bottom: 25,
  },
  action: {
    width: screenWidth / 6,
    height: screenWidth / 6,
    borderRadius: screenWidth / 3,
  },
  statusText: {
    marginTop: 40,
    color: "gray",
    fontWeight: "400",
  },
});
