import React, { useMemo, useState } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { View, Text, TextInput, Pressable, SafeAreaView, ScrollView, Image } from "react-native";
import * as SecureStore from "expo-secure-store";

import { importWhole } from "./models";
import { FolderNode, ItemContainerNode, TabNode } from "./models/nodes";
import { Node } from "./models/nodes/Node";

const AuthScreen = ({ refetch }) => {
  const [userId, setUserId] = useState("");

  const login = async () => {
    await SecureStore.setItemAsync("auth", userId);
    await refetch();
  };

  return (
    <View>
      <Text>Enter userID</Text>
      <TextInput value={userId} onChangeText={setUserId} />

      <Pressable onPress={login} style={{ padding: 20 }}>
        <Text>Click me</Text>
      </Pressable>
    </View>
  );
};

const Favicon: React.FC<{ node: TabNode }> = ({ node }) => {
  if (node.url.startsWith("file:")) {
    return <Text>LOCAL</Text>;
  }

  if (!node.favicon) {
    return (
      <Image
        style={{ width: 20, height: 20 }}
        source={{ uri: `https://www.google.com/s2/favicons?domain=${node.domain}&sz=128` }}
      />
    );
  }

  if (node.favicon.type === "icon") {
    return <Text>ico:{node.favicon.value}</Text>;
  }

  return <Text>{node.favicon.value}</Text>;
};

const RenderNode: React.FC<{ node: Node }> = ({ node }) => {
  if (node instanceof TabNode) {
    return (
      <View className="flex flex-row">
        <Favicon node={node} />
        <Text style={{ fontSize: 14, marginLeft: 4 }}>{node.title || node.url.slice(0, 32)}</Text>
      </View>
    );
  } else if (node instanceof ItemContainerNode || node instanceof FolderNode) {
    return (
      <View>
        <Text style={{ fontSize: 16 }}>{node.title}</Text>
        <View style={{ marginLeft: 12 }}>
          {node.children.map((child) => (
            <RenderNode key={child.id} node={child} />
          ))}
        </View>
      </View>
    );
  }
};

const SpacesTabs = ({ data }) => {
  const arcWindow = useMemo(() => importWhole(data["data"]), [data]);
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

const ShowData = ({ userId }) => {
  const { data, isLoading, isError } = useQuery(["data", userId], async () => {
    const res = await fetch(`http://192.168.0.129:3000/syncs/${userId}`);
    return await res.json();
  });

  if (isError) {
    return <Text>Error...</Text>;
  }

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (data) {
    return <SpacesTabs data={data} />;
  }
};

const Stuff = () => {
  const auth = useQuery(["auth"], () => {
    return SecureStore.getItemAsync("auth");
  });

  if (auth.isError) {
    return <Text>Error...</Text>;
  }

  if (auth.isLoading) {
    return <Text>Loading...</Text>;
  }

  if (auth.data) {
    return <ShowData userId={auth.data} />;
  }

  return <AuthScreen refetch={auth.refetch} />;
};

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView>
        <Stuff />
      </SafeAreaView>
    </QueryClientProvider>
  );
}
