import { INode, Node } from "./Node.ts";

export interface IFolderNode extends INode {
  children: INode[];
}

export class FolderNode extends Node implements IFolderNode {
  type = "folder";

  children;

  constructor(item: Omit<IFolderNode, "children">, children: Node[]) {
    super(item);
    this.children = children;
  }

  addChild(child: Node) {
    this.children.push(child);
  }

  toJSON(): IFolderNode {
    return {
      ...super.baseJSON(),
      children: this.children.map((tab) => tab.toJSON())
    };
  }
}
