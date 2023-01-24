import { Text, Image } from "react-native";
import { FolderNode, TabNode } from "../../../models/nodes";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";

const iconMap: Record<string, any> = {
  document: "document-text-outline"
};

export const GetIcon: React.FC<{ name: string }> = ({ name }) => {
  return <Ionicons name={name as any} size={20} color="#007AFF" />;
};

export const Favicon: React.FC<{ node: TabNode | FolderNode }> = ({ node }) => {
  if (node instanceof FolderNode) {
    return <GetIcon name="folder" />;
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
