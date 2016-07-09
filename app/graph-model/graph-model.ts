import {GraphAdjacencyListImpl, GraphAdjacencyList, GraphAdjacencyEdit} from "./graph-adjacency";

export type NodeId = number;
export type EdgeId = number;

export enum GraphOrientation {
  Undirected = 1,
  Directed
}

export interface BasicGraph {
  orientation:GraphOrientation;
  nodes:GraphNode[];
  adjacencyList:GraphAdjacencyList;
  adjacencyEdit:GraphAdjacencyEdit;
  hasNode(node:NodeId):boolean;
  getNode(node:NodeId):GraphNode;
  forNodes(callback:(NodeId) => any);
  isUndirected:boolean;
  isDirected:boolean;
  /** If this model is muttable, returns an instance of GraphEdit. */
  edit:GraphEdit;
}

export interface GraphEdit {
  createNode(properties:Object):GraphNode;
  removeNode(node:NodeId):boolean;
  mergeNode(node:GraphNode, properties:Object);
  createEdge(start:NodeId, end:NodeId, properties:Object):boolean;
  removeEdge(start:NodeId, end:NodeId):boolean;
  mergeEdge(edge:GraphEdge, properties:Object);
}

/**
 * Model class of a graph. The default graph representation is adjagcency
 * list - most algorithm are fastest on this repesentation, but substractive
 * modifications are much slower.
 */
export class GraphModel implements BasicGraph, GraphEdit {
  nodes:GraphNode[] = [];
  // TODO yin: Separate edges into a GraphRepresentation (adjacency list,
  // matrix, and edge list maybe) and provide interfaces to efficiently
  // work with them
  private adjacency:GraphAdjacencyListImpl = new GraphAdjacencyListImpl(this);
  private _lastNodeId:NodeId = 0;
  private _lastEdgeId:EdgeId = 0;
  private _nodeCount = 0;
  private _edgeCount = 0;

  constructor(public orientation:GraphOrientation) {
  }

  get edit() {
    return this;
  }

  /** Returns adjacency list representation of Graph edges. There might be others implemented
   * in the future based as views, or rather synchronized independent data structures, but
   * having multiple representations caps performance to the worse case everytime.
   */
  get adjacencyList() {
    return this.adjacency
  }

  get adjacencyEdit() {
    return this.adjacency
  }

  get isUndirected() {
    return this.orientation == GraphOrientation.Undirected
  }

  get isDirected() {
    return this.orientation == GraphOrientation.Directed
  }

  /**
   * Creates a graph node and adds it into the graph.
   */
  createNode(properties:Object):GraphNode {
    if (properties['position'] != null) {
      var node = new GraphNode(++this._lastNodeId, properties);
      if (this.addNode(node)) {
        this._nodeCount++;
        return node;
      }
    }
    return null;
  }

  removeNode(node:NodeId):boolean {
    if (this.hasNode(node)) {
      this.adjacency.$removeEdgesInto(node);
      this._removeNode(node);
      this._nodeCount--;
      return true;
    }
    return false;
  }

  private _removeNode(node:NodeId) {
    delete this.adjacency[node];
    delete this.nodes[node];
  }

  private addNode(node:GraphNode):boolean {
    if (node != null && !this.hasNode(node.id)) {
      this.nodes.push(node);
      return true;
    }
    return false;
  }

  mergeNode(node:GraphNode, properties:Object) {
  }

  hasNode(node:NodeId):boolean {
    return true === this.forNodes((n) => {
          if (n.id == node) {
            throw true;
          }
        });
  }

  getNode(node:NodeId):GraphNode {
    return this.nodes[node];
  }

  /** This function applies a lambda to all node in the graph, if the lambda
   * throws an expection, this value will be returned and loop stops.
   */
  forNodes(callback:(GraphNode) => any) {
    for (var node of this.nodes) {
      try {
        callback(node);
      } catch (result) {
        return result;
      }
    }
  }

  createEdge(start:NodeId, end:NodeId, properties:Object):boolean {
    var edge = new GraphEdge(this._lastEdgeId++, start, end, properties);
    if (this.adjacency.createEdge(edge)) {
      this._edgeCount++;
      return true;
    }
    return false;
  }

  removeEdge(start:NodeId, end:NodeId):boolean {
    return this.adjacency.removeEdge(start, end);
  }

  mergeEdge(edge:GraphEdge, properties:Object) {
    this.merge(properties, edge.properties);
  }

  private merge(from:Object, into:Object) {
    for (var i in from) {
      if (from.hasOwnProperty(i)) {
        into[i] = from[i];
      }
    }
  }

  toString() {
    return this.type;
  }

  get type() {
    return this.orientation == GraphOrientation.Directed ? +'directed' : 'undirected';
  }
}

export class GraphNode {
  constructor(public id: number, public properties : Object) {}

  toString() {
    var position = this.properties['position'];
    return '${id}|' + JSON.stringify(position);
  }
}

export class GraphEdge {
  constructor(public id: number, public start:NodeId, public end:NodeId, public properties:Object) {}

  toString() {
    var position = this.properties['position'];
    return '${this.id}(${this.start}->${this.end}|' + JSON.stringify(position);
  }
}
