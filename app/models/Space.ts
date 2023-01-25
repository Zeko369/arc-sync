import { ItemContainerNode } from "./nodes";

export class Container {
  node: ItemContainerNode;

  constructor(public readonly id: string) {
    this.node = new ItemContainerNode({ id, parentID: null, title: null }, []);
  }
}

export class Space {
  pinnedContainer: Container;
  unpinnedContainer: Container;

  constructor(
    readonly id: string,
    readonly title: string,
    readonly icon: { type: "emoji"; value: string } | { type: "icon"; value: string },
    readonly color: string | null,
    containerIds: {
      pinned: string;
      unpinned: string;
    }
  ) {
    this.pinnedContainer = new Container(containerIds.pinned);
    this.unpinnedContainer = new Container(containerIds.unpinned);
  }

  public isDarkColor() {
    if (!this.color) return false;

    const c = this.color.substring(1); // strip #
    const rgb = parseInt(c, 16); // convert rrggbb to decimal
    const r = (rgb >> 16) & 0xff; // extract red
    const g = (rgb >> 8) & 0xff; // extract green
    const b = (rgb >> 0) & 0xff; // extract blue

    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
    return luma > 40;
  }

  public toJSON() {
    return {
      id: this.id,
      title: this.title,
      color: this.color,
      pinnedContainer: this.pinnedContainer.node.toJSON(),
      unpinnedContainer: this.unpinnedContainer.node.toJSON(),
    };
  }
}
