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
    containerIds: {
      pinned: string;
      unpinned: string;
    }
  ) {
    this.pinnedContainer = new Container(containerIds.pinned);
    this.unpinnedContainer = new Container(containerIds.unpinned);
  }
}
