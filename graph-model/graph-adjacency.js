"use strict";
var GraphAdjacencyListImpl = (function () {
    function GraphAdjacencyListImpl(graph) {
        this.graph = graph;
        /** cache to speed up access to edge end points */
        this.adjacency = [];
        this.edges = [];
    }
    GraphAdjacencyListImpl.prototype.hasEdge = function (start, end) {
        function matchUndirected(s, e) {
            if (start == s && end == e || (start == e && end == s)) {
                throw true;
            }
        }
        function matchDirected(s, e) {
            if (start == s && end == e) {
                throw true;
            }
        }
        var match = this.graph.isUndirected ? matchUndirected : matchDirected;
        if (this.forNodeEdges(start, match))
            return true;
        return false;
    };
    GraphAdjacencyListImpl.prototype.getEdges = function (start) {
        return this.edges[start];
    };
    GraphAdjacencyListImpl.prototype.getEdge = function (start, end) {
        return this.forNodeEdges(start, function (edge, index) {
            if (edge.end == end) {
                throw edge;
            }
        });
    };
    GraphAdjacencyListImpl.prototype.getEdgeAtIndex = function (start, index) {
        return this.edges[start][index];
    };
    GraphAdjacencyListImpl.prototype.forAllEdges = function (callback) {
        for (var _i = 0, _a = this.edges; _i < _a.length; _i++) {
            var adj = _a[_i];
            for (var edgeIdx in adj) {
                try {
                    var edge = adj[edgeIdx];
                    callback(edge, edgeIdx);
                }
                catch (result) {
                    return result;
                }
            }
        }
    };
    GraphAdjacencyListImpl.prototype.forNodeEdges = function (start, callback) {
        var nodeEdges = this.adjacency[start];
        for (var _i = 0, nodeEdges_1 = nodeEdges; _i < nodeEdges_1.length; _i++) {
            var end = nodeEdges_1[_i];
            try {
                callback(start, end);
            }
            catch (result) {
                return result;
            }
        }
    };
    GraphAdjacencyListImpl.prototype.createEdge = function (edge) {
        if (edge.start != null && edge.end != null
            && this.graph.hasNode(edge.start) && this.graph.hasNode(edge.end)) {
            return this.addEdge(edge.start, edge.end, edge);
        }
        return null;
    };
    GraphAdjacencyListImpl.prototype.removeEdge = function (start, end) {
        this._removeEdge(start, end);
        if (this.graph.isUndirected) {
            this._removeEdge(end, start);
        }
        return false;
    };
    GraphAdjacencyListImpl.prototype.$removeEdgesInto = function (node) {
        var _this = this;
        this.forAllEdges(function (edge, index) {
            if (edge.end == node) {
                _this._removeEdgeAtIndex(edge.start, index);
            }
        });
    };
    GraphAdjacencyListImpl.prototype._removeEdge = function (start, end) {
        var startAdj = this.adjacency[start];
        for (var i in startAdj) {
            var index = Number(i);
            if (index === NaN)
                continue;
            if (startAdj[index] == end) {
                // We don't allow duplicate edges, cut it here
                return this._removeEdgeAtIndex(start, index);
            }
        }
        return false;
    };
    GraphAdjacencyListImpl.prototype._removeEdgeAtIndex = function (start, index) {
        var startAdj = this.adjacency[start];
        if (startAdj[index]) {
            delete startAdj[index];
            delete this.edges[index];
            // We don't allow duplicate edges, cut it here
            return true;
        }
        return false;
    };
    GraphAdjacencyListImpl.prototype.addEdge = function (start, end, edge) {
        if (!this.hasEdge(start, end)) {
            this.adjacency[start].push(end);
            this.edges[start].push(edge);
            // TODO yin: Separate directianality logic into strategies
            if (this.graph.isUndirected) {
                this.adjacency[end].push(start);
                this.edges[end].push(edge);
            }
            return true;
        }
        return false;
    };
    return GraphAdjacencyListImpl;
}());
exports.GraphAdjacencyListImpl = GraphAdjacencyListImpl;
//# sourceMappingURL=graph-adjacency.js.map