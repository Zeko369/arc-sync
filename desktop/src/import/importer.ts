import { readFile } from "node:fs/promises";

import { convertArrayToObj, iterateOverWeirdArray } from "./iterationUtils";
import { ArcWindow } from "../models/ArcWindow";
import { ItemContainerNode } from "../models/nodes";
import { Space } from "../models/Space";
import { ArcParser } from "./parser";
import { ArcNode } from "./parser/schema";

export class Importer {
  static FILENAME = `${process.env["HOME"]}/Library/Application\ Support/Arc/StorableSidebar.json`;

  async loadFile() {
    const file = await readFile(Importer.FILENAME, "utf8");
    return JSON.parse(file);
  }

  async import(): Promise<ArcWindow> {
    const parsed = await this.loadFile();

    // TODO: Make this more generic and work in more cases
    const windows = parsed["sidebar"]["containers"].filter((window: any) => !window["global"]);
    const window = windows[0];

    const arcWindow = new ArcWindow({});

    iterateOverWeirdArray<{ containerIDs: string[]; title: string }>(
      window["spaces"],
      (spaceId, space) => {
        const containerIds = convertArrayToObj<string, "pinned" | "unpinned">(
          space["containerIDs"]
        );

        arcWindow.spaces[spaceId] = new Space(spaceId, space["title"], {
          pinned: containerIds["pinned"],
          unpinned: containerIds["unpinned"],
        });
      }
    );

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
