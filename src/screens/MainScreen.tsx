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

  let page = useRef(1);
  let photosCount = useRef(photos.length);

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

  if (loading) {
    return <ActivityIndicator style={styles.container} size="large" />;
  }

  return (
    <View style={styles.container}>
      <ScrollView snapToInterval={width} decelerationRate="fast" horizontal>
        {photos?.map((photo) => (
          <View key={photo.id} style={styles.picture}>
            <Image style={styles.image} source={{ uri: photo.src }} />
          </View>
        ))}
      </ScrollView>
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
    width,
    height,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
