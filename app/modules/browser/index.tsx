import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Text, View, Pressable, ScrollView } from "react-native";
import { api } from "../../lib/api";
import { importWhole } from "../../models";
import { useAuth } from "../auth/context";
import { RenderNode } from "./RenderNode";

export const Browser = () => {
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

  return <BrowserBody raw={data.data} />;
};

const BrowserBody: React.FC<{ raw: string }> = ({ raw }) => {
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
