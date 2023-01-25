import React, { ComponentProps } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { View, Text } from "react-native";

import { Space } from "../../../models/Space";

const spaceIconMap: Record<string, ComponentProps<typeof Ionicons>["name"]> = {
  planet: "planet",
  fileTrayFull: "file-tray-full",
};

type SpaceIconProps = {
  icon: Space["icon"];
  size?: number;
  offsetNoIcon?: boolean;
  color?: string;
};
export const SpaceIcon: React.FC<SpaceIconProps> = ({ icon, offsetNoIcon, size = 18, color }) => {
  if (icon.type === "icon") {
    if (icon.value === "NO_ICON") {
      return (
        <View
          className="flex items-center justify-center"
          style={{ width: size, marginBottom: offsetNoIcon ? 12 : undefined }}
        >
          <View
            style={{
              width: size / 2,
              height: size / 2,
              backgroundColor: "#A0AEC0",
              borderRadius: size / 4,
            }}
          />
        </View>
      );
    }

    if (spaceIconMap[icon.value]) {
      return <Ionicons name={spaceIconMap[icon.value]} size={size} color={color} />;
    }

    return <Text>{icon.value} missing</Text>;
  } else if (icon.type === "emoji") {
    return <Text style={{ fontSize: size, color }}>{icon.value}</Text>;
  }

  return <Text>NO_ICON</Text>;
};
