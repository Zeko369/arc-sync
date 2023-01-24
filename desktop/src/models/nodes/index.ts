import { FolderNode } from "./FolderNode";
import { GenericNode } from "./GenericNode";
import { ItemContainerNode } from "./ItemContainerNode";
import { Node } from "./Node";
import { TabNode } from "./TabNode";

export * from "./FolderNode";
export * from "./Node";
export * from "./TabNode";
export * from "./ItemContainerNode";
export * from "./GenericNode";

const parseJSON = (item: any): Node => {
  switch (item["type"]) {
    case "itemContainer":
      return new ItemContainerNode(item, item["children"].map(parseJSON));
    case "folder":
      return new FolderNode(item, item["children"].map(parseJSON));
    case "tab":
      return new TabNode(item);
    case "generic":
      return new GenericNode(item);
    default:
      throw new Error("Unknown type");
  }
};
export const fromJSON = (item: any): Node => {
  return parseJSON(item);
};
