import { ArcWindow } from "./ArcWindow";
import { fromJSON, ItemContainerNode } from "./nodes";
import { Space } from "./Space";

export const importWhole = (data: any): ArcWindow => {
  return new ArcWindow(
    Object.fromEntries(
      data.spaces.map((space: any) => {
        const s = new Space(space["id"], space["title"], space["icon"], space["color"], {
          pinned: space["pinnedContainer"]["id"],
          unpinned: space["unpinnedContainer"]["id"]
        });

        s.pinnedContainer.node = fromJSON(space["pinnedContainer"]) as ItemContainerNode;
        s.unpinnedContainer.node = fromJSON(space["unpinnedContainer"]) as ItemContainerNode;

        return [space.id, s];
      })
    )
  );
};
