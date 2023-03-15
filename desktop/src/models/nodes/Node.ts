export interface INode {
  id: string;
  title: string | null;
  parentID: string | null;
}

export abstract class Node implements INode {
  readonly id: string;
  readonly title: string | null = null;
  readonly parentID: string | null = null;

  abstract type: string;

  constructor(item: INode) {
    this.id = item.id;
    this.title = item.title;

    this.parentID = item.parentID;
  }

  // deno-lint-ignore no-explicit-any
  abstract toJSON(): any;

  baseJSON(): INode & { type: string } {
    return {
      id: this.id,
      type: this.type,

      title: this.title,
      parentID: this.parentID
    };
  }
}
