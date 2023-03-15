import React from "react";
import { Image, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { FolderNode, TabNode } from "../../../models/nodes";

const iconMap: Record<string, any> = {
  document: "document-text-outline",
  terminal: "terminal-outline"
};

export const GetIcon: React.FC<{ name: string; color?: string | null }> = (props) => {
  const { name, color } = props;
  return <Ionicons name={name as any} size={20} color={`${color}89` || "#adadad"} />;
};

type FaviconProps = { node: TabNode | FolderNode; color: string | null };
export const Favicon: React.FC<FaviconProps> = ({ node, color }) => {
  if (node instanceof FolderNode) {
    return <GetIcon name="folder" color={color} />;
  }

  if (node.url.startsWith("file:")) {
    return <GetIcon name="desktop-outline" />;
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
    if (iconMap[node.favicon.value]) {
      return <GetIcon name={iconMap[node.favicon.value]} />;
    }

    return <Text>ico:{node.favicon.value}</Text>;
  }

  return <Text>{node.favicon.value}</Text>;
};
