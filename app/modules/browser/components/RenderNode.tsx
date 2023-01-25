import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as WebBrowser from "expo-web-browser";

import { TabNode, ItemContainerNode, FolderNode, Node } from "../../../models/nodes";
import { Favicon } from "./Favicon";
import { useSpaceContext } from "../spaceContext";

const Tab = ({ children, onPress, color }: any) => {
  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <View
          className={`flex flex-row px-3 py-2 rounded-xl items-center border mt-2`}
          style={{
            borderColor: pressed ? color : `${color}89`,
            backgroundColor: pressed ? `${color}1f` : "white",
          }}
        >
          {children}
        </View>
      )}
    </Pressable>
  );
};

export const RenderNode: React.FC<{ node: Node }> = ({ node }) => {
  const isContainer = node instanceof ItemContainerNode;
  const hasTab = node instanceof TabNode || (node instanceof FolderNode && !isContainer);

  const hasChildren = node instanceof FolderNode;
  const space = useSpaceContext();

  const [collapsed, setCollapsed] = useState(true);
  const showChildren = (isContainer || !collapsed) && hasChildren;

  const onPress = () => {
    if (hasChildren) {
      return setCollapsed((c) => !c);
    }

    if (node instanceof TabNode) {
      WebBrowser.openBrowserAsync(node.url);
    }
  };

  return (
    <>
      {hasTab && (
        <Tab onPress={onPress} color={space.color}>
          <Favicon node={node} color={space.color} />

          <Text numberOfLines={1} className="ml-2 text-lg" style={{ flex: 1 }}>
            {node.title || (node as TabNode)?.url?.slice(0, 32)}
          </Text>

          {hasChildren && (
            <Ionicons
              name={collapsed ? "chevron-down" : "chevron-up"}
              size={20}
              color={space.color || "black"}
            />
          )}
        </Tab>
      )}

      {hasChildren && (
        <View
          className={`ml-4 ${isContainer ? "mr-4" : ""}`}
          style={showChildren ? {} : { height: 0, width: 0, opacity: 0 }}
        >
          {node.children.map((child) => (
            <RenderNode key={child.id} node={child} />
          ))}
        </View>
      )}
    </>
  );
};
