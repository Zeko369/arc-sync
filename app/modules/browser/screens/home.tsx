import React, { useMemo } from "react";
import { Dimensions, Pressable, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";

import { useArcWindow } from "../arcWindowContext";
import { SpaceIcon } from "../components/SpaceIcon";

const screenWidth = Math.min(Dimensions.get("window").height, Dimensions.get("window").width);
const squareWidth = screenWidth / 2;

export const AppHome = () => {
  const arcWindow = useArcWindow();
  const navigation = useNavigation();

  const data = useMemo(() => {
    return Object.values(arcWindow.spaces).map((space) => ({
      id: space.id,
      title: space.title,
      icon: space.icon,
      color: space.color,
      isDark: space.isDarkColor()
    }));
  }, [arcWindow]);

  return (
    <FlashList
      data={data}
      numColumns={2}
      renderItem={({ item }) => {
        return (
          <View
            className={`flex items-center justify-center p-6`}
            style={{ width: squareWidth, height: squareWidth }}
          >
            <Pressable
              className="w-full h-full rounded-3xl items-center justify-center"
              style={
                item.color ? { backgroundColor: `${item.color}90` } : { backgroundColor: "#dadada" }
              }
              onPress={() => (navigation.navigate as any)(item.title)}
            >
              <SpaceIcon
                icon={item.icon}
                size={32}
                color={item.isDark ? "white" : "212121"}
                offsetNoIcon
              />
              <Text className={`text-lg font-bold ${item.isDark ? "text-white" : "text-black"}`}>
                {item.title}
              </Text>
            </Pressable>
          </View>
        );
      }}
    />
  );
};
