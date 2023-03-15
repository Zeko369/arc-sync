import React, { useContext, useEffect, useMemo } from "react";
import { ActivityIndicator, Alert, Text, useColorScheme, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";

import { Button } from "../../../components/Button";
import { CenterWrapper } from "../../../components/CenterWrapper";
import { api } from "../../../lib/api";
import { importWhole } from "../../../models";
import { AuthContext, useAuth } from "../../auth/authContext";
import { ArcWindowProvider } from "../arcWindowContext";
import { SpaceIcon } from "../components/SpaceIcon";
import { AppHome } from "./home";
import { RenderPane } from "./space";

type DataReturn = {
  data: string;
  createdAt: string;
};

export const Browser = () => {
  const auth = useAuth();
  const fullAuth = useContext(AuthContext);

  const {
    data,
    isLoading,
    // isFetching,
    isError,
    error,
    refetch
  } = useQuery(
    ["sync"],
    () => api<DataReturn>("/sync", {}, auth?.token)
    // { refetchInterval: 1000, refetchIntervalInBackground: true }
  );

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const LoadingComponent = useMemo(() => {
    return () => (
      <CenterWrapper>
        {isLoading ? <ActivityIndicator size="large" /> : <Text>Error...{String(error)}</Text>}
        <Button onPress={fullAuth.logout}>
          <Text>Logout</Text>
        </Button>
      </CenterWrapper>
    );
  }, [isLoading, error, auth]);

  if (isError || isLoading) {
    return (
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Loading">
          <Drawer.Screen name="Loading" component={LoadingComponent} />
        </Drawer.Navigator>
      </NavigationContainer>
    );
  }

  return <BrowserBody data={data} refetch={refetch} isFetching={false} />;
};

const Drawer = createDrawerNavigator();
type BrowserBodyProps = { data: DataReturn; isFetching: boolean; refetch: () => void };
const BrowserBody: React.FC<BrowserBodyProps> = ({ data, isFetching, refetch }) => {
  const arcWindow = useMemo(() => importWhole(data), [data]);
  const scheme = useColorScheme();
  const fullAuth = useContext(AuthContext);

  const onLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure?",
      [{ text: "Yes", onPress: fullAuth.logout }, { text: "Cancel" }],
      {
        cancelable: true
      }
    );
  };

  return (
    <ArcWindowProvider arcWindow={arcWindow}>
      <NavigationContainer theme={scheme === "dark" ? DarkTheme : DefaultTheme}>
        <Drawer.Navigator initialRouteName="AppHome">
          <Drawer.Screen
            name="AppHome"
            component={AppHome}
            options={{
              headerRight: () => (
                <View className="flex flex-row">
                  <Button noColor onPress={onLogout}>
                    <Ionicons name="log-out" size={18} color="#212121" />
                  </Button>

                  <Button noColor onPress={refetch} disabled={isFetching}>
                    <Ionicons name="reload" size={18} color={isFetching ? "#A0AEC0" : "#212121"} />
                  </Button>
                </View>
              )
            }}
          />

          {Object.values(arcWindow.spaces)
            .filter((space) => !!space.title)
            .map((space) => (
              <Drawer.Screen
                key={space.id}
                name={space.title}
                component={RenderPane(space.id)}
                options={{
                  headerRight: () => (
                    <Button noColor onPress={refetch} disabled={isFetching}>
                      <Ionicons
                        name="reload"
                        size={18}
                        color={isFetching ? "#A0AEC0" : "#212121"}
                      />
                    </Button>
                  ),
                  drawerIcon: ({ size }) => (
                    <View
                      style={{
                        height: size,
                        width: size
                      }}
                    >
                      <SpaceIcon icon={space.icon} />
                    </View>
                  )
                }}
              />
            ))}
        </Drawer.Navigator>
      </NavigationContainer>
    </ArcWindowProvider>
  );
};
