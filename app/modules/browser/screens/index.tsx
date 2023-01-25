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

const SpaceIcon: React.FC<{ icon: Space["icon"]; size?: number; offsetNoIcon?: boolean }> = ({
  icon,
  offsetNoIcon,
  size = 18,
}) => {
  const scheme = useColorScheme();
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

    // @ts-ignore
    if (spaceIconMap[icon.value]) {
      return (
        <Ionicons
          // @ts-ignore
          name={spaceIconMap[icon.value]}
          size={size}
          color={scheme === "dark" ? "white" : "#212121"}
        />
      );
    }

    return <Text>{icon.value} missing</Text>;
  } else if (icon.type === "emoji") {
    return <Text style={{ fontSize: size }}>{icon.value}</Text>;
  }

  return <Text>NO_ICON</Text>;
};

const screenWidth = Math.min(Dimensions.get("window").height, Dimensions.get("window").width);
const squareWidth = screenWidth / 2;

const AppHome = () => {
  const arcWindow = useArcWindow();
  const navigation = useNavigation();

  const data = useMemo(() => {
    return Object.values(arcWindow.spaces).map((space) => ({
      id: space.id,
      title: space.title,
      icon: space.icon,
    }));
  }, [arcWindow]);

  return (
    <FlashList
      data={data}
      numColumns={2}
      renderItem={({ item, index }) => {
        return (
          <View
            className={`flex items-center justify-center p-6`}
            style={{ width: squareWidth, height: squareWidth }}
          >
            <Pressable
              className="w-full h-full bg-orange-200 rounded-3xl items-center justify-center"
              onPress={() => (navigation.navigate as any)(item.title)}
            >
              <SpaceIcon icon={item.icon} size={32} offsetNoIcon />
              <Text className="text-lg font-bold">{item.title}</Text>
            </Pressable>
          </View>
        );
      }}
    />
  );
};

const spaceIconMap = {
  planet: "planet",
  fileTrayFull: "file-tray-full",
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
          <Drawer.Screen name="AppHome" component={AppHome} />

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
