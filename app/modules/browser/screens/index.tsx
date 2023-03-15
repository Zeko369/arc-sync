import React, { useMemo } from "react";
import { ActivityIndicator, Text, useColorScheme } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";

import { Button } from "../../../components/Button";
import { CenterWrapper } from "../../../components/CenterWrapper";
import { api } from "../../../lib/api";
import { importWhole } from "../../../models";
import { useAuth } from "../../auth/authContext";
import { ArcWindowProvider } from "../arcWindowContext";
import { SpaceIcon } from "../components/SpaceIcon";
import { AppHome } from "./home";
import { RenderPane } from "./space";

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
              )
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
                drawerIcon: () => <SpaceIcon icon={space.icon} />
              }}
            />
          ))}
        </Drawer.Navigator>
      </NavigationContainer>
    </ArcWindowProvider>
  );
};
