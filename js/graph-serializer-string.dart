class GraphSerializer {
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