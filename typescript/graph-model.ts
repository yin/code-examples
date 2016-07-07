type NodeId = number;

enum GraphOrientation {
    Undirected = 1,
    Directed
}

interface BasicGraph {
  orientation:GraphOrientation;
  nodes:GraphNode[];
  hasNode(node : NodeId) : boolean;
  getNode(node : NodeId) : GraphNode;
  forNodes(callback : (NodeId) => any);
  hasEdge(start : NodeId, end : NodeId) : boolean;
  getEdgeProperties(start : NodeId, end : NodeId) : Object;
  forAllEdges(callback : (NodeId) => any);
  forNodeEdges(start : NodeId, callback : (NodeId) => any);
}

interface EditableGraph {
  createNode(properties : Object) : GraphNode;
  removeNode(node : NodeId) : boolean;
  createEdge(start : NodeId, end : NodeId) : boolean;
  removeEdge(start : NodeId, end : NodeId) : boolean;
}

/**
 * Model class of a graph. The default graph representation is adjagcency
 * list - most algorithm are fastest on this repesentation, but substractive
 * modifications are much slower.
 */
class GraphModel implements BasicGraph, EditableGraph{
  nodes : GraphNode[] = [];
  // TODO yin: Separate edges into a GraphRepresentation (adjacency list,
  // matrix, and edge list maybe) and provide interfaces to efficiently
  // work with them
  /** adjacency list of edges, i.e.: adjacency[startNode][edgeIndex] */
  adjacency : NodeId[][] = [];
  /**
   * Edge properties - sparse matrix representation, i.e.:
   * edgeProps[startNode][endNode] */
  edgeProps : Object[][] = [];
  _lastNodeId : number = 0;

  constructor(public orientation : GraphOrientation) {}

  get nodes() { return this.nodes; }

  /**
   * Creates a graph node and adds it into the graph.
   */
  createNode(properties : Object) : GraphNode {
    if (properties['position'] != null) {
      var node = new GraphNode(++this._lastNodeId, properties);
      if (this.addNode(node))
        return node;
    }
    return null;
  }

  removeNode(node:NodeId):boolean {
    if (this.hasNode(node)) {
      this._removeEdgesInto(node);
      this._removeNode(node);
      return true;
    }
    return false;
  }

  private _removeNode(node:NodeId) {
    delete this.adjacency[node];
    delete this.nodes[node];
  }

  private addNode(node : GraphNode) : boolean {
    if (node != null && !this.hasNode(node.id)) {
      this.nodes.push(node);
      return true;
    }
    return false;
  }

  hasNode(node : NodeId) : boolean {
    return true === this.forNodes((n) => {
      if (n.id == node) {
        throw true;
      }
    });
  }

  getNode(node : NodeId) : GraphNode {
    return this.nodes[node];
  }

  /** This function applies a lambda to all node in the graph, if the lambda
   * throws an expection, this value will be returned and loop stops.
   */
  forNodes(callback : (GraphNode) => any) {
    for (var node of this.nodes) {
      try {
        callback(node);
      } catch (result) {
        return result;
      }
    }
  }

  createEdge(start : NodeId, end : NodeId,
                       properties : Object = null) : boolean {
    if (start != null && end != null
        && this.hasNode(start) && this.hasNode(end)) {
      return this.addEdge(start, end, properties);
    }
    return null;
  }

  removeEdge(start:NodeId, end:NodeId):boolean {
    this._removeEdge(start, end)
    if (this.orientation == GraphOrientation.Undirected) {
      this._removeEdge(end, start);
    }
    return false;
  }

  private _removeEdgesInto(node:NodeId):void {
    this.forAllEdges((start, end) => {
      if (end == node) {
        this._removeEdge(start, end);
      }
    })
  }

  private _removeEdge(start:NodeId, end:NodeId):boolean{
    var startAdj = this.adjacency[start];
    for (var index in startAdj) {
      if (startAdj[index] == end) {
        var adj = this.adjacency[start];
        delete this.edgeProps[start][index];
        delete adj[index];
        // We don't allow duplicate edges, cut it here
        return true;
      }
    }
    return false;
  }

  private addEdge(start : NodeId, end : NodeId,
                  properties : Object = null) : boolean {
    if (!this.hasEdge(start, end)) {
      this.adjacency[start].push(end);
      this.edgeProps[start][end] = properties;
      // TODO yin: Separate directianality logic into strategies
      if (this.orientation == GraphOrientation.Undirected) {
        this.adjacency[end].push(start)
        this.edgeProps[end][start] = properties;
      }
      return true;
    }
    return false;
  }

  hasEdge(start : NodeId, end : NodeId) : boolean {
    if (this.forNodeEdges(start, (s, e) => {
          if (start == s && end == e) {
            throw true;
          }
        }))
      return true;
    if (this.orientation == GraphOrientation.Undirected
        && this.forNodeEdges(start, (s, e) => {
              if (start == s && end == e || (start == e && end == s)) {
            throw true;
            }
        }))
      return true;

    return false;
  }

  getEdgeProperties(start, end) : Object {
    return this.edgeProps[start, end];
  }

  forAllEdges(callback : (number, number) => any) {
    for (var node of this.nodes) {
      var result = this.forNodeEdges(node.id, callback);
      if (result !== undefined)
          return result;
    }
  }

  forNodeEdges(start : NodeId, callback : (number, number) => any) {
    var nodeEdges = this.adjacency[start];
    for (var end of nodeEdges) {
      try {
        callback(start, end);
      } catch (result) {
        return result;
      }
    }
  }

  toString() {
    return this.orientation;
  }

  get type() {
    return this.orientation == GraphOrientation.Directed ? +'oriented' : 'unoriented';
  }
}


class GraphNode {
  constructor(public id: number, public properties : Object) {}

  toString() {
    var position = this.properties['position'];
    return '${id}|' + JSON.stringify(position);
  }
}
