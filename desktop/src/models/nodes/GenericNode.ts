import { INode, Node } from "./Node";

export interface IGenericNode extends INode {}

export class GenericNode extends Node implements IGenericNode {
  type = "generic";

  constructor(item: IGenericNode) {
    super(item);
  }

  toJSON(): IGenericNode {
    return {
      ...super.baseJSON(),
    };
  }
}
