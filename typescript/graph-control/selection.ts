import {GraphEdge} from "../graph-model";
import {BasicGraph} from "../graph-model";
import {GraphNode} from "../graph-model";
import {GraphEdit} from "../graph-model";

/** Temporary interface for operations over selections */
export interface SelectionTransformation {
  transformNode(node:GraphNode, edit:GraphEdit);
  transformEdge(node:GraphNode, edit:GraphEdit);
}

export interface Selection {
  remove():Selection;
  transform(transform:SelectionTransformation);
}

export class EmptySelection implements Selection {
  private static singleton:Selection = new EmptySelection();
  static get singleton() { return this.singleton }

  remove():Selection {
    return EmptySelection.singleton;
  }

  transform(transform:SelectionTransformation) {
  }
}

export class NodeSelection implements Selection {
  constructor(public model:BasicGraph, public node:GraphNode) {}

  remove():Selection {
    return EmptySelection.singleton;
  }
  transform(transform:SelectionTransformation) {
    if (this.model instanceof GraphEdit) {
      transform.transformNode(this.node, <GraphEdit>this.model);
    }
  }
}

export class EdgeSelection implements Selection {
  constructor(public model:BasicGraph, public edge:GraphEdge) {}

  remove():Selection {
    if (this.model.adjacencyEdit.removeEdge(this.edge.start, this.edge.end)) {
      return EmptySelection.singleton;
    } else {
      return this;
    }
  }
  transform(transform:SelectionTransformation) {
    if (this.model instanceof GraphEdit) {
      transform.transformNode(this.edge, <GraphEdit>this.model);
    }
  }
}
