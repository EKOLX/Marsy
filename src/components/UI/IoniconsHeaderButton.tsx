import React from "react";
import { HeaderButton } from "react-navigation-header-buttons";
import Ionicons from "@expo/vector-icons/Ionicons";

const IoniconsHeaderButton = (props: any) => {
  return (
    <HeaderButton
      IconComponent={Ionicons}
      iconSize={23}
      color="red"
      {...props}
    />
  );
};

export default IoniconsHeaderButton;
