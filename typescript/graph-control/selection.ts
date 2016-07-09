import {GraphEdge} from "../graph-model";
import {BasicGraph} from "../graph-model";
import {GraphNode} from "../graph-model";

export interface Selection {
  remove():Selection;
  setProperty(key:string, value:Object);
}

export class EmptySelection implements Selection {
  private static singleton:Selection = new EmptySelection();
  static get singleton() { return this.singleton }

  remove():Selection {
    return EmptySelection.singleton;
  }
  setProperty(key:string, value:Object) {
  }
}

export class NodeSelection implements Selection {
  constructor(public model:BasicGraph, public node:GraphNode) {}

  remove():Selection {
    return EmptySelection.singleton;
  }
  setProperty(key:string, value:Object) {
    this.node.properties[key] = value;
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
  setProperty(key:string, value:Object) {
    this.edge.properties[key] = value;
  }
}
