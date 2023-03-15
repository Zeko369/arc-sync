import { Space } from "./Space";

export class ArcWindow {
  constructor(public spaces: Record<string, Space>) {}

  public getContainer(id: string) {
    for (const space of Object.values(this.spaces)) {
      if (space.pinnedContainer.id === id) {
        return space.pinnedContainer;
      }
      if (space.unpinnedContainer.id === id) {
        return space.unpinnedContainer;
      }
    }

    return null;
  }

  public toJSON() {
    return {
      spaces: Object.values(this.spaces).map((space) => space.toJSON())
    };
  }
}
