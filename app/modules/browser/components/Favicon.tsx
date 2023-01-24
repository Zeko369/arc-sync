import { Text, Image } from "react-native";
import { FolderNode, TabNode } from "../../../models/nodes";
import Ionicons from "@expo/vector-icons/Ionicons";

const iconMap: Record<string, any> = {
  document: "document-text-outline",
};

export const Favicon: React.FC<{ node: TabNode | FolderNode }> = ({ node }) => {
  if (node instanceof FolderNode) {
    return <Ionicons name="folder" size={20} color="#007AFF" />;
  }

  if (node.url.startsWith("file:")) {
    return <Ionicons name="desktop-outline" size={20} color="#007AFF" />;
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
      return <Ionicons name={iconMap[node.favicon.value]} size={20} color="#007AFF" />;
    }

    return <Text>ico:{node.favicon.value}</Text>;
  }

  return <Text>{node.favicon.value}</Text>;
};
