import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

import { useAuth } from "../modules/auth/context";
import { Button } from "../components/Button";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { useMemo, useState } from "react";
import { importWhole } from "../models";
import { RenderNode } from "../modules/browser/RenderNode";

const MainWrapper = () => {
  const auth = useAuth();
  const { data, isLoading, isError } = useQuery(["sync"], () =>
    api<{ data: string }>("/sync", {}, auth?.token)
  );

  if (isError) {
    return <Text>Error...</Text>;
  }

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return <Main raw={data.data} />;
};

const Main: React.FC<{ raw: string }> = ({ raw }) => {
  const arcWindow = useMemo(() => importWhole(raw), [raw]);
  const [spaceId, setSpaceId] = useState(Object.keys(arcWindow.spaces)[0]);

  return (
    <>
      <View style={{ flexDirection: "row" }}>
        {Object.values(arcWindow.spaces).map((space) => (
          <Pressable
            key={space.id}
            onPress={() => setSpaceId(space.id)}
            style={{
              flex: 1,
              paddingVertical: 8,
              justifyContent: "center",
              alignItems: "center",
              borderBottomColor: space.id === spaceId ? "black" : "transparent",
              borderBottomWidth: 2,
            }}
          >
            <Text style={{ fontWeight: spaceId === space.id ? "bold" : undefined }}>
              {space.title}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView>
        <RenderNode node={arcWindow.spaces[spaceId].pinnedContainer.node} />
        <RenderNode node={arcWindow.spaces[spaceId].unpinnedContainer.node} />
      </ScrollView>
    </>
  );
};

export default function Home() {
  const auth = useAuth();
  const router = useRouter();

  if (!auth) {
    return (
      <View>
        <Text>Not logged in</Text>
        <Button onPress={() => router.push("/login")}>
          <Text>Login</Text>
        </Button>
      </View>
    );
  }

  return (
    <View>
      <Text>Logged in as {auth.id}</Text>
      <MainWrapper />
    </View>
  );
}
