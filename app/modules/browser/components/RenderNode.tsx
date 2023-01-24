import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { TabNode, ItemContainerNode, FolderNode, Node } from "../../../models/nodes";
import { Favicon } from "./Favicon";

const Tab = ({ children, onPress }: any) => {
  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <View
          className={`flex flex-row px-3 py-2 rounded-xl items-center border-blue-500 border mt-2 ${
            pressed ? "bg-blue-200" : "bg-white"
          }`}
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

  const [collapsed, setCollapsed] = useState(true);
  const showChildren = (isContainer || !collapsed) && hasChildren;

  const onPress = () => {
    if (hasChildren) {
      setCollapsed((c) => !c);
    }
  };

  return (
    <>
      {hasTab && (
        <Tab onPress={onPress}>
          <Favicon node={node} />

          <Text numberOfLines={1} className="ml-2 text-lg w-11/12">
            {node.title || (node as TabNode)?.url?.slice(0, 32)}
          </Text>
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
