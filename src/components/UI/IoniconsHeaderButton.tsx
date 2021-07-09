import React from "react";
import { HeaderButton } from "react-navigation-header-buttons";
import Ionicons from "@expo/vector-icons/Ionicons";

const IoniconsHeaderButton = (props: any) => {
  return <HeaderButton {...props} iconSize={23} IconComponent={Ionicons} />;
};

export default IoniconsHeaderButton;
