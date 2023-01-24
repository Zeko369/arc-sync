import { Text, View } from "react-native";
import { TabNode, ItemContainerNode, FolderNode, Node } from "../../models/nodes";
import { Favicon } from "./Favicon";

export const RenderNode: React.FC<{ node: Node }> = ({ node }) => {
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
  } else {
    return <Text>Can't render {JSON.stringify(node)}</Text>;
  }
};
