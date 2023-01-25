import React from "react";
import { ScrollView, View } from "react-native";
import { useArcWindow } from "../arcWindowContext";
import { RenderNode } from "../components/RenderNode";
import { SpaceProvider } from "../spaceContext";

export const RenderPane = (spaceId: string) => () => {
  const arcWindow = useArcWindow();
  const space = arcWindow.spaces[spaceId];
  console.log(space);

  return (
    <SpaceProvider color={space.color}>
      <ScrollView className="w-full" scrollIndicatorInsets={{ right: 1 }}>
        <RenderNode node={space.pinnedContainer.node} />

        <View className="mt-6 mb-4 bg-gray-400 mx-4" style={{ height: 1 }} />

        <RenderNode node={space.unpinnedContainer.node} />
      </ScrollView>
    </SpaceProvider>
  );
};
