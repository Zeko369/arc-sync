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
    containerIds: {
      pinned: string;
      unpinned: string;
    }
  ) {
    this.pinnedContainer = new Container(containerIds.pinned);
    this.unpinnedContainer = new Container(containerIds.unpinned);
  }

  public toJSON() {
    return {
      id: this.id,
      icon: this.icon,
      title: this.title,
      pinnedContainer: this.pinnedContainer.node.toJSON(),
      unpinnedContainer: this.unpinnedContainer.node.toJSON()
    };
  }
}
