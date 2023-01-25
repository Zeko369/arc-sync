// deno-lint-ignore-file no-explicit-any
import { FolderNode } from "./FolderNode.ts";
import { GenericNode } from "./GenericNode.ts";
import { ItemContainerNode } from "./ItemContainerNode.ts";
import { Node } from "./Node.ts";
import { TabNode } from "./TabNode.ts";

export * from "./FolderNode.ts";
export * from "./Node.ts";
export * from "./TabNode.ts";
export * from "./ItemContainerNode.ts";
export * from "./GenericNode.ts";

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
