"use strict";
var graph_adjacency_1 = require("./graph-adjacency");
(function (GraphOrientation) {
    GraphOrientation[GraphOrientation["Undirected"] = 1] = "Undirected";
    GraphOrientation[GraphOrientation["Directed"] = 2] = "Directed";
})(exports.GraphOrientation || (exports.GraphOrientation = {}));
var GraphOrientation = exports.GraphOrientation;
/**
 * Model class of a graph. The default graph representation is adjagcency
 * list - most algorithm are fastest on this repesentation, but substractive
 * modifications are much slower.
 */
var GraphModel = (function () {
    function GraphModel(orientation) {
        this.orientation = orientation;
        this.nodes = [];
        // TODO yin: Separate edges into a GraphRepresentation (adjacency list,
        // matrix, and edge list maybe) and provide interfaces to efficiently
        // work with them
        this.adjacency = new graph_adjacency_1.GraphAdjacencyListImpl(this);
        this._lastNodeId = 0;
        this._lastEdgeId = 0;
        this._nodeCount = 0;
        this._edgeCount = 0;
    }
    Object.defineProperty(GraphModel.prototype, "edit", {
        get: function () {
            return this;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GraphModel.prototype, "adjacencyList", {
        /** Returns adjacency list representation of Graph edges. There might be others implemented
         * in the future based as views, or rather synchronized independent data structures, but
         * having multiple representations caps performance to the worse case everytime.
         */
        get: function () {
            return this.adjacency;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GraphModel.prototype, "adjacencyEdit", {
        get: function () {
            return this.adjacency;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GraphModel.prototype, "isUndirected", {
        get: function () {
            return this.orientation == GraphOrientation.Undirected;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GraphModel.prototype, "isDirected", {
        get: function () {
            return this.orientation == GraphOrientation.Directed;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates a graph node and adds it into the graph.
     */
    GraphModel.prototype.createNode = function (properties) {
        if (properties['position'] != null) {
            var node = new GraphNode(++this._lastNodeId, properties);
            if (this.addNode(node)) {
                this._nodeCount++;
                return node;
            }
        }
        return null;
    };
    GraphModel.prototype.removeNode = function (node) {
        if (this.hasNode(node)) {
            this.adjacency.$removeEdgesInto(node);
            this._removeNode(node);
            this._nodeCount--;
            return true;
        }
        return false;
    };
    GraphModel.prototype._removeNode = function (node) {
        delete this.adjacency[node];
        delete this.nodes[node];
    };
    GraphModel.prototype.addNode = function (node) {
        if (node != null && !this.hasNode(node.id)) {
            this.nodes.push(node);
            return true;
        }
        return false;
    };
    GraphModel.prototype.mergeNode = function (node, properties) {
    };
    GraphModel.prototype.hasNode = function (node) {
        return true === this.forNodes(function (n) {
            if (n.id == node) {
                throw true;
            }
        });
    };
    GraphModel.prototype.getNode = function (node) {
        return this.nodes[node];
    };
    /** This function applies a lambda to all node in the graph, if the lambda
     * throws an expection, this value will be returned and loop stops.
     */
    GraphModel.prototype.forNodes = function (callback) {
        for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {
            var node = _a[_i];
            try {
                callback(node);
            }
            catch (result) {
                return result;
            }
        }
    };
    GraphModel.prototype.createEdge = function (start, end, properties) {
        var edge = new GraphEdge(this._lastEdgeId++, start, end, properties);
        if (this.adjacency.createEdge(edge)) {
            this._edgeCount++;
            return true;
        }
        return false;
    };
    GraphModel.prototype.removeEdge = function (start, end) {
        return this.adjacency.removeEdge(start, end);
    };
    GraphModel.prototype.mergeEdge = function (edge, properties) {
        this.merge(properties, edge.properties);
    };
    GraphModel.prototype.merge = function (from, into) {
        for (var i in from) {
            if (from.hasOwnProperty(i)) {
                into[i] = from[i];
            }
        }
    };
    GraphModel.prototype.toString = function () {
        return this.type;
    };
    Object.defineProperty(GraphModel.prototype, "type", {
        get: function () {
            return this.orientation == GraphOrientation.Directed ? +'directed' : 'undirected';
        },
        enumerable: true,
        configurable: true
    });
    return GraphModel;
}());
exports.GraphModel = GraphModel;
var GraphNode = (function () {
    function GraphNode(id, properties) {
        this.id = id;
        this.properties = properties;
    }
    GraphNode.prototype.toString = function () {
        var position = this.properties['position'];
        return '${id}|' + JSON.stringify(position);
    };
    return GraphNode;
}());
exports.GraphNode = GraphNode;
var GraphEdge = (function () {
    function GraphEdge(id, start, end, properties) {
        this.id = id;
        this.start = start;
        this.end = end;
        this.properties = properties;
    }
    GraphEdge.prototype.toString = function () {
        var position = this.properties['position'];
        return '${this.id}(${this.start}->${this.end}|' + JSON.stringify(position);
    };
    return GraphEdge;
}());
exports.GraphEdge = GraphEdge;
//# sourceMappingURL=graph-model.js.map