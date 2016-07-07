library graph_model;
import 'dart:math' show Point;
import 'dart:convert' show JSON;
import 'util.dart' show For;

/** Creates a new graph builder, by which a graph can be additively constructed.
 * If directed is true, the graph will be a interpretted as directed graph.
 */
function GraphModelBuilder() {
  this.nextId = 0;
}
/** Creates a new node in graph. Parameters references should not
 * be shared between nodes.
 */
GraphModelBuilder.prototype.createNode = function(properties) {
  var node = new GraphNode(nextId++);
  node.propeties = properties;
  return node;
}
/** Creates a edge in graph. Parameters references should not
 * be shared between edges.
 */
GraphModelBuilder.prototype.createNode = function(first, second, properties) {
  var node = new GraphNode(nextId++);
  node.propeties = properties;
  return node;
}
/** Creates a edge in graph. Parameters references should not
 * be shared between edges.
 */
GraphModelBuilder.prototype.build = function(first, second, properties) {
  var node = new GraphNode(nextId++);
  node.propeties = properties;
  return node;
}


class GraphModel {
  static final bool debug_parse = false;
  // graphType: #oriented, #bidirectional
  Symbol graphType;
  List<GraphNode> nodes = [];
  List<GraphEdge> edges = [];
  static int lastNodeId = 0;
  static int lastEdgeId = 0;

  GraphModel({Symbol graphType : #oriented}) : graphType = graphType;

  GraphNode createNode(Map properties) {
    if (properties['position'] != null) {
      GraphNode node = new GraphNode(++lastNodeId);
      node.properties = properties;
      return node;
    }
    return null;
  }

  bool addNode(GraphNode node) {
    if (node != null && !hasNode(node)) {
      nodes.add(node);
      return true;
    }
    return false;
  }

  bool hasNode(GraphNode node) {
    return true == forNodes((n) {
      if (n == node) {
        throw true;
      }
    });
  }

  GraphEdge createEdge(GraphNode start, GraphNode end, {Map properties : null }) {
    if (start != null && end != null && hasNode(start) && hasNode(end)) {
      GraphEdge edge = new GraphEdge(++lastEdgeId);
      edge.start = start;
      edge.end = end;
      edge.properties = properties != null ? properties : {};
      return edge;
    }
    return null;
  }

  bool addEdge(edge) {
    if (!hasEdge(edge)) {
      edges.add(edge);
     return true;
    }
    return false;
  }

  bool hasEdge(GraphEdge edge, {bool opposite : false}) {
    GraphNode start = edge.start;
    GraphNode end = edge.end;
    return true == forEdges((e) {
      if ((graphType == #bidirectional || opposite == false)
          && e.start == start && e.end == end) {
        throw true;
      } else if ((graphType == #bidirectional || opposite == true)
          && e.start == end && e.end == start) {
        throw true;
      }
    });
  }

  dynamic forNodes(void callback(GraphNode)) {
    return For.each(nodes, callback);
  }

  dynamic forEdges(void callback(GraphEdge)) {
    return For.each(edges, callback);
  }

  String toString() => type + ';' +
      nodes.map((node) => node.toString()).join('+') + ';' +
      edges.map((edge) => edge.toString()).join('+');
  String get type => graphType == #oriented ? 'oriented' :
                     graphType == #bidirectional ? 'bidirectional' :
                     'unknown';

  GraphModel.parse(String string) {
    if (string != null) {
      List<String> graph = string.split(';');
      // String.split(in) returns List of length 1, if in == ''
      if (graph.length == 3) {
        List<String> nodes = graph[1].split('+');
        List<String> edges = graph[2].split('+');
        graphType = graph[0] == "oriented" ? #oriented : #bidirectional;
        _parseNodes(nodes);
        _parseEdges(edges);
      }
    }
  }

  void _parseNodes(List<String> nodes) {
    int maxId = 0;
    this.nodes = [];
    for (String nodeString in nodes) {
      if (debug_parse) {
        print('parse.node: $nodeString');
      }
      List<String> fields = nodeString.split('|');
      // String.split(in) returns List of length 1, if in == ''
      if (fields.length == 2) {
        Map props = {};
        try {
          props = JSON.decode(fields[1]);
        } catch(e) { /* ignore malformed properties */ }
        if (props['x'] != null && props['y'] != null) {
          props['position'] = new Point(props['x'], props['y']);
          props.remove('x');
          props.remove('y');
        }
        GraphNode node = createNode(props);
        int id = node.id = int.parse(fields[0]);
        if (addNode(node) && maxId < node.id) {
          maxId = node.id;
        }
      }
    }
    if (debug_parse) {
      print("nodeId.max = $maxId");
    }
    lastNodeId = maxId;
  }

  void _parseEdges(List<String> edges) {
    int maxId = 0;
    this.edges = [];
    for (String edgeString in edges) {
      if (debug_parse) {
        print('parse.edge: $edgeString');
      }
      // String.split(in) returns List of length 1, if in == ''
      List<String> fields = edgeString.split('|');
      if (fields.length == 3) {
        List<String> nodesString = fields[1].split('-');
        Map properties;
        try {
          properties = JSON.decode(fields[2]);
        } catch (e) { /* ignore malformed properties */ }
        GraphNode start, end;
        forNodes((node) {
          int id = node.id;
          var startId = int.parse(nodesString[0]);
          var endId = int.parse(nodesString[1]);
          if (node.id == startId) {
            start = node;
          }
          if (node.id == endId) {
            end = node;
          }
          if (start != null && end != null) {
            new For.Break().Do;
          }
        });
        GraphEdge edge = createEdge(start, end, properties: properties);
        int id = int.parse(fields[0]);
        if (edge != null) {
          edge.id = int.parse(fields[0]);
          if (addEdge(edge) && maxId < edge.id) {
            maxId = edge.id;
          }
        }
      }
    }
    lastEdgeId = maxId;
    if (debug_parse) {
      print('parse.edge: maxId $maxId');
    }
  }
}


function GraphNode(id) {
  this.id = id;
  this.properties = {};
}
GraphNode.prototype.toString() {
    var position = properties['position'];
    return id + '|' + JSON.encode(position);
}

function GraphEdge(id) {
  this.id = id;
}
class GraphEdge {
  int id;
  GraphNode start;
  GraphNode end;
  Map properties;

  GraphEdge(int id) : id = id;
  String toString() {
    var a = start.id, b = end.id;
    return '$id|$a-$b|' + JSON.encode(properties);
  }
}
