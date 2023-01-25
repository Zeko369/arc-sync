import React from "react";
import { ScrollView, View } from "react-native";
import { useArcWindow } from "../arcWindowContext";
import { RenderNode } from "../components/RenderNode";

export const RenderPane = (spaceId: string) => () => {
  const arcWindow = useArcWindow();

  return (
    <ScrollView className="w-full" scrollIndicatorInsets={{ right: 1 }}>
      <RenderNode node={arcWindow.spaces[spaceId].pinnedContainer.node} />

      <View className="mt-6 mb-4 bg-gray-400 mx-4" style={{ height: 1 }} />

      <RenderNode node={arcWindow.spaces[spaceId].unpinnedContainer.node} />
    </ScrollView>
  );
};
