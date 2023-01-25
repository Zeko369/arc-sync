import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, ScrollView, Text, useColorScheme, View } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";

import { api } from "../../../lib/api";
import { useAuth } from "../../auth/authContext";
import { CenterWrapper } from "../../../components/CenterWrapper";
import { importWhole } from "../../../models";
import { ArcWindowProvider, useArcWindow } from "../arcWindowContext";
import { RenderNode } from "../components/RenderNode";
import Ionicons from "@expo/vector-icons/Ionicons";

export const Browser = () => {
  const auth = useAuth();
  const { data, isLoading, isError } = useQuery(
    ["sync"],
    () => api<{ data: string }>("/sync", {}, auth?.token),
    { refetchInterval: 1000 }
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

const spaceIconMap = {
  planet: "planet",
  fileTrayFull: "file-tray-full"
};

const Drawer = createDrawerNavigator();
const BrowserBody: React.FC<{ raw: string }> = ({ raw }) => {
  const arcWindow = useMemo(() => importWhole(raw), [raw]);
  const scheme = useColorScheme();

  return (
    <ArcWindowProvider arcWindow={arcWindow}>
      <NavigationContainer theme={scheme === "dark" ? DarkTheme : DefaultTheme}>
        <Drawer.Navigator initialRouteName={Object.values(arcWindow.spaces)[0].title}>
          {Object.values(arcWindow.spaces).map(space => (
            <Drawer.Screen
              key={space.id}
              name={space.title}
              component={RenderPane(space.id)}
              options={{
                drawerIcon: () => {
                  if (space.icon.type === "icon") {
                    if (space.icon.value === "NO_ICON") {
                      return (
                        <View className="flex items-center justify-center" style={{ width: 18 }}>
                          <View
                            style={{
                              width: 8,
                              height: 8,
                              backgroundColor: "#A0AEC0",
                              borderRadius: 4
                            }}
                          />
                        </View>
                      );
                    }

                    // @ts-ignore
                    if (spaceIconMap[space.icon.value]) {
                      return (
                        <Ionicons
                          // @ts-ignore
                          name={spaceIconMap[space.icon.value]}
                          size={18}
                          color={scheme === "dark" ? "white" : "#212121"}
                        />
                      );
                    }

                    return <Text>{space.icon.value} missing</Text>;
                  } else if (space.icon.type === "emoji") {
                    return <Text>{space.icon.value}</Text>;
                  }

                  return <Text>NO_ICON</Text>;
                }
              }}
            />
          ))}
        </Drawer.Navigator>
      </NavigationContainer>
    </ArcWindowProvider>
  );
};
