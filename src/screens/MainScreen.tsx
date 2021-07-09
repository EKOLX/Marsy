import React, { FC, useEffect, useLayoutEffect, useState } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useDispatch } from "react-redux";

import IoniconsHeaderButton from "../components/UI/IoniconsHeaderButton";
import { RouteName } from "../navigation/RouteName";
import { setPhotos } from "../store/actions/photosAction";

interface MainScreenProps {
  navigation: any;
}

const MainScreen: FC<MainScreenProps> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadPhotos = async () => {
      setLoading(true);
      await dispatch(setPhotos(2));
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
      <Text>MainScreen</Text>
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
});
