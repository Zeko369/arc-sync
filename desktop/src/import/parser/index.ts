// deno-lint-ignore-file no-case-declarations
import {
  FolderNode,
  GenericNode,
  ItemContainerNode,
  Node,
  TabNode
} from "../../models/nodes/index.ts";
import { compact } from "../../util.ts";
import { ArcNode, itemContainerSchema, listSchema, tabSchema } from "./schema.ts";

export class ArcParser {
  private static getType(obj: { data: Record<string, unknown> }) {
    return Object.keys(obj["data"])[0];
  }

  private static handleChildren(childrenIds: string[], lookupObj: Record<string, ArcNode>) {
    return compact(childrenIds.map((childId) => lookupObj[childId])).map((c) =>
      ArcParser.parse(c, lookupObj)
    );
  }

  public static parse(item: ArcNode, lookupObj: Record<string, ArcNode>): Node {
    const type = ArcParser.getType(item);

    switch (type) {
      case "itemContainer":
        const itemContainer = itemContainerSchema.parse(item);
        return new ItemContainerNode(
          itemContainer,
          ArcParser.handleChildren(itemContainer.childrenIds, lookupObj)
        );
      case "list":
        const list = listSchema.parse(item);
        return new FolderNode(list, ArcParser.handleChildren(list.childrenIds, lookupObj));
      case "tab":
        const { data, ...rest } = tabSchema.parse(item);
        return new TabNode({
          ...rest,
          favicon: TabNode.getFavicon(data),
          url: data["tab"]["savedURL"],
          title: rest.title || data["tab"]["savedTitle"]
        });
      case "easel":
      case "splitView":
        return new GenericNode(item);
      default:
        throw new Error("Unknown type");
    }
  }
}
