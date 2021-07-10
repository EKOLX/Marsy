import React, { FC } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface IoniconsButtonProps {
  iconName: any;
  onTap: () => void;
  style?: any;
}

const IoniconsButton: FC<IoniconsButtonProps> = ({
  iconName,
  style,
  onTap,
}) => {
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onTap}>
      <Ionicons name={iconName} size={37} color="white" />
    </TouchableOpacity>
  );
};

export default IoniconsButton;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});
