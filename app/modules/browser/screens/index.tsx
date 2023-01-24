import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";

import { api } from "../../../lib/api";
import { useAuth } from "../../auth/authContext";
import { CenterWrapper } from "../../../components/CenterWrapper";
import { importWhole } from "../../../models";
import { ArcWindowProvider, useArcWindow } from "../arcWindowContext";
import { RenderNode } from "../components/RenderNode";

export const Browser = () => {
  const auth = useAuth();
  const { data, isLoading, isError } = useQuery(["sync"], () =>
    api<{ data: string }>("/sync", {}, auth?.token)
  );

  if (isError || isLoading) {
    return (
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Loading">
          <Drawer.Screen
            name="Loading"
            component={() => (
              <CenterWrapper>
                {isLoading ? <ActivityIndicator size="large" /> : <Text>Error...</Text>}
              </CenterWrapper>
            )}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    );
  }

  return <BrowserBody raw={data.data} />;
};

const RenderPane = (spaceId: string) => () => {
  const arcWindow = useArcWindow();

  return (
    <ScrollView className="w-full" scrollIndicatorInsets={{ right: 1 }}>
      <RenderNode node={arcWindow.spaces[spaceId].pinnedContainer.node} />

      <View className="mt-6 mb-4 bg-gray-400 mx-4" style={{ height: 1 }} />

      <RenderNode node={arcWindow.spaces[spaceId].unpinnedContainer.node} />
    </ScrollView>
  );
};

const Drawer = createDrawerNavigator();
const BrowserBody: React.FC<{ raw: string }> = ({ raw }) => {
  const arcWindow = useMemo(() => importWhole(raw), [raw]);

  return (
    <ArcWindowProvider arcWindow={arcWindow}>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName={Object.values(arcWindow.spaces)[0].title}>
          {Object.values(arcWindow.spaces).map(space => (
            <Drawer.Screen key={space.id} name={space.title} component={RenderPane(space.id)} />
          ))}
        </Drawer.Navigator>
      </NavigationContainer>
    </ArcWindowProvider>
  );
};
