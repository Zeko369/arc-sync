import { TabSchema } from "../../import/parser/schema.ts";
import { INode, Node } from "./Node.ts";

export interface ITabNode extends INode {
  url: string;
  domain: string;
  favicon: undefined | { type: "emoji"; value: string } | { type: "icon"; value: string };
}

export class TabNode extends Node implements ITabNode {
  type = "tab";

  readonly url;
  readonly domain;
  readonly favicon;

  constructor(item: Omit<ITabNode, "domain">) {
    super(item);

    this.url = item.url;
    this.domain = new URL(item.url).hostname;
    this.favicon = item.favicon;
  }

  toJSON(): ITabNode {
    return {
      ...super.baseJSON(),
      url: this.url,
      domain: this.domain,
      favicon: this.favicon
    };
  }

  public static getFavicon(data: TabSchema["data"]) {
    if (!data.tab.customInfo) {
      return undefined;
    }

    if ("icon" in data.tab.customInfo.iconType) {
      return {
        type: "icon" as const,
        value: data.tab.customInfo.iconType.icon
      };
    }

    return {
      type: "emoji" as const,
      value: data.tab.customInfo.iconType.emoji_v2
    };
  }
}
