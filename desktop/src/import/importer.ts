// deno-lint-ignore-file no-explicit-any

import { ArcWindow } from "../models/ArcWindow.ts";
import { ItemContainerNode } from "../models/nodes/index.ts";
import { Space } from "../models/Space.ts";
import { convertArrayToObj, iterateOverWeirdArray } from "./iterationUtils.ts";
import { ArcParser } from "./parser/index.ts";
import { ArcNode } from "./parser/schema.ts";

export class Importer {
  static FILENAME = `${Deno.env.get("HOME")}/Library/Application\ Support/Arc/StorableSidebar.json`;

  private oldFile = "";

  async loadFile() {
    const file = await Deno.readTextFile(Importer.FILENAME);
    if (file === this.oldFile) {
      throw new Error("SAME_FILE");
    }

    this.oldFile = file;

    return JSON.parse(file);
  }

  async import(): Promise<ArcWindow> {
    const parsed = await this.loadFile();

    // TODO: Make this more generic and work in more cases
    const windows = parsed["sidebar"]["containers"].filter((window: any) => !window["global"]);
    const window = windows[0];

    const arcWindow = new ArcWindow({});

    iterateOverWeirdArray<{
      containerIDs: string[];
      title: string;
      customInfo: { iconType?: any; windowTheme?: any };
    }>(window["spaces"], (spaceId, space) => {
      const containerIds = convertArrayToObj<string, "pinned" | "unpinned">(space["containerIDs"]);

      let icon: any = { type: "icon" as const, value: "NO_ICON" };
      if (space["customInfo"]?.["iconType"]?.["icon"]) {
        icon = { type: "icon" as const, value: space["customInfo"]?.["iconType"]?.["icon"] };
      } else if (space["customInfo"]?.["iconType"]?.["emoji_v2"]) {
        icon = { type: "emoji" as const, value: space["customInfo"]?.["iconType"]?.["emoji_v2"] };
      }

      let color: string | null = null;
      const tmpColor = space["customInfo"]?.windowTheme?.primaryColorPalette?.shadedDark;
      if (tmpColor) {
        const convert = (x: number) =>
          Math.max(Math.round(x * 255), 0)
            .toString(16)
            .padStart(2, "0");

        color = `#${convert(tmpColor.red)}${convert(tmpColor.green)}${convert(tmpColor.blue)}`;
      }

      arcWindow.spaces[spaceId] = new Space(spaceId, space["title"], icon, color, {
        pinned: containerIds["pinned"],
        unpinned: containerIds["unpinned"]
      });
    });

    // FIXME: this is a lie
    const tmpItemsObj = convertArrayToObj<ArcNode>(window["items"]);

    iterateOverWeirdArray(window["items"], (id, item) => {
      // const parseResult = arcNodeSchema.safeParse(item);
      // if (!parseResult.success) {
      //   console.log(item);
      //   throw new Error(parseResult.error.message);
      // }

      // Let's say this is ok
      const parsed = item as ArcNode; // parseResult.data;
      if (
        !(
          "itemContainer" in parsed["data"] &&
          "spaceItems" in parsed["data"]["itemContainer"]["containerType"]
        )
      ) {
        return;
      }

      const spaceId = parsed.data.itemContainer.containerType.spaceItems._0;
      const space = arcWindow.spaces[spaceId];
      if (!space) {
        throw new Error("Space not found");
      }

      const container =
        space.pinnedContainer.id === id ? space.pinnedContainer : space.unpinnedContainer;
      if (!container) {
        throw new Error("Container not found");
      }

      container.node = ArcParser.parse(parsed, tmpItemsObj) as ItemContainerNode;
    });

    return arcWindow;
  }
}
