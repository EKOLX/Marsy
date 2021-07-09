import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { RouteName } from "./RouteName";
import MainScreen from "../screens/MainScreen";
import FavoritesScreen from "../screens/FavoritesScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={RouteName.Main}>
        <Stack.Screen
          name={RouteName.Main}
          component={MainScreen}
          options={{ title: "My Mars" }}
        />
        <Stack.Screen
          name={RouteName.Favorites}
          component={FavoritesScreen}
          options={{ title: "My Favorites" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
