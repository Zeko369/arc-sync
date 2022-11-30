import { INode, Node } from "./Node";
import { TabSchema } from "../../import/parser/schema";

export interface ITabNode extends INode {
  url: string;
  favicon: undefined | { type: "emoji"; value: string } | { type: "icon"; value: string };
}

export class TabNode extends Node implements ITabNode {
  type = "tab";

  readonly url;
  readonly favicon;

  constructor(item: ITabNode) {
    super(item);

    this.url = item.url;
    this.favicon = item.favicon;
  }

  toJSON(): ITabNode {
    return {
      ...super.baseJSON(),
      url: this.url,
      favicon: this.favicon,
    };
  }

  public static getFavicon(data: TabSchema["data"]) {
    if (!data.tab.customInfo) {
      return undefined;
    }

    if ("icon" in data.tab.customInfo.iconType) {
      return {
        type: "icon" as const,
        value: data.tab.customInfo.iconType.icon,
      };
    }

    return {
      type: "emoji" as const,
      value: data.tab.customInfo.iconType.emoji_v2,
    };
  }
}
