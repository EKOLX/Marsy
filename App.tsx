import React from "react";
import { Provider } from "react-redux";

import configureStore from "./src/store/configureStore";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <Provider store={configureStore()}>
      <AppNavigator />
    </Provider>
  );
}
