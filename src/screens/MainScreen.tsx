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
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

import IoniconsHeaderButton from "../components/UI/IoniconsHeaderButton";
import { RouteName } from "../navigation/RouteName";
import { AppState } from "../store/AppState";
import { setPhotos } from "../store/actions/photosAction";

interface MainScreenProps {
  navigation: any;
}

const { width, height } = Dimensions.get("window");

const MainScreen: FC<MainScreenProps> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const photos = useSelector((state: AppState) => state.photosList.photos);

  const page = useRef(1);
  const photosCount = useRef(photos.length);

  const translateX = new Animated.Value(0);

  useEffect(() => {
    const loadPhotos = async () => {
      setLoading(true);
      await dispatch(setPhotos(page.current));
      setLoading(false);
    };

    loadPhotos();
  }, [dispatch]);

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

  const onGestureEvent = Animated.event([
    { nativeEvent: { translationX: translateX } },
  ]);

  if (loading) {
    return <ActivityIndicator style={styles.container} size="large" />;
  }

  return (
    <View style={styles.container}>
      {photos?.slice(0, 3).map((photo, index) => (
        <PanGestureHandler key={photo.id} onGestureEvent={onGestureEvent}>
          <Animated.View
            style={[
              styles.picture,
              {
                top: 30 + index * 16,
                bottom: 80 - index * 10,
                width: width - 110 + index * 40,
              },
              { transform: [{ translateX }] },
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
