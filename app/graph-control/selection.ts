import {BasicGraph, GraphEdge, GraphNode, GraphEdit} from "../graph-model/graph-model";

/** Temporary interface for operations over selections */
export interface SelectionTransformation {
  transformNode(node:GraphNode, edit:GraphEdit);
  transformEdge(node:GraphNode, edit:GraphEdit);
}

export interface GraphSelection {
  remove():GraphSelection;
  transform(transform:SelectionTransformation);
}

export class EmptySelection implements GraphSelection {
  private static _singleton:GraphSelection = new EmptySelection();
  static get singleton() { return this._singleton }

  remove():GraphSelection {
    return EmptySelection._singleton;
  }

  transform(transform:SelectionTransformation) {
  }
}

export class NodeSelection implements GraphSelection {
  constructor(public model:BasicGraph, public node:GraphNode) {}

  remove():GraphSelection {
    return EmptySelection.singleton;
  }
  transform(transform:SelectionTransformation) {
    if (this.model.edit) {
      transform.transformNode(this.node, this.model.edit);
    }
  }
}

export class EdgeSelection implements GraphSelection {
  constructor(public model:BasicGraph, public edge:GraphEdge) {}

  remove():GraphSelection {
    if (this.model.adjacencyEdit.removeEdge(this.edge.start, this.edge.end)) {
      return EmptySelection.singleton;
    } else {
      return this;
    }
  }
  transform(transform:SelectionTransformation) {
    if (this.model.edit) {
      transform.transformNode(this.edge, this.model.edit);
    }
  }
}
