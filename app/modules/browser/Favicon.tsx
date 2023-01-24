import { Text, Image } from "react-native";
import { TabNode } from "../../models/nodes";

export const Favicon: React.FC<{ node: TabNode }> = ({ node }) => {
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
