import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  ScrollView,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  useNavigation,
} from "@react-navigation/native";

import { api } from "../../../lib/api";
import { useAuth } from "../../auth/authContext";
import { CenterWrapper } from "../../../components/CenterWrapper";
import { importWhole } from "../../../models";
import { ArcWindowProvider, useArcWindow } from "../arcWindowContext";
import { RenderNode } from "../components/RenderNode";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Button } from "../../../components/Button";
import { FlashList } from "@shopify/flash-list";
import { Space } from "../../../models/Space";
import { AppHome } from "./home";
import { RenderPane } from "./space";
import { SpaceIcon } from "../components/SpaceIcon";

export const Browser = () => {
  const auth = useAuth();
  const { data, isLoading, isFetching, isError, refetch } = useQuery(
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

  return <BrowserBody raw={data.data} refetch={refetch} isFetching={isFetching} />;
};

const Drawer = createDrawerNavigator();
type BrowserBodyProps = { raw: string; isFetching: boolean; refetch: () => void };
const BrowserBody: React.FC<BrowserBodyProps> = ({ raw, isFetching, refetch }) => {
  const arcWindow = useMemo(() => importWhole(raw), [raw]);
  const scheme = useColorScheme();

  return (
    <ArcWindowProvider arcWindow={arcWindow}>
      <NavigationContainer theme={scheme === "dark" ? DarkTheme : DefaultTheme}>
        <Drawer.Navigator initialRouteName="AppHome">
          <Drawer.Screen
            name="AppHome"
            component={AppHome}
            options={{
              headerRight: () => (
                <Button noColor onPress={refetch} disabled={isFetching}>
                  <Ionicons name="reload" size={18} color={isFetching ? "#A0AEC0" : "#212121"} />
                </Button>
              ),
            }}
          />

          {Object.values(arcWindow.spaces).map((space) => (
            <Drawer.Screen
              key={space.id}
              name={space.title}
              component={RenderPane(space.id)}
              options={{
                headerRight: () => (
                  <Button noColor onPress={refetch} disabled={isFetching}>
                    <Ionicons name="reload" size={18} color={isFetching ? "#A0AEC0" : "#212121"} />
                  </Button>
                ),
                drawerIcon: () => <SpaceIcon icon={space.icon} />,
              }}
            />
          ))}
        </Drawer.Navigator>
      </NavigationContainer>
    </ArcWindowProvider>
  );
};
