import {BasicGraph, NodeId, GraphNode, GraphEdge} from './graph-model';

export interface GraphAdjacency {
    hasEdge(start:NodeId, end:NodeId):boolean;
    getEdge(start:NodeId, end:NodeId):GraphEdge;
    forAllEdges(callback:(edge:GraphEdge, index:number) => any):any;
    forNodeEdges(start : NodeId, callback:(edge:GraphEdge, index:number) => any):any;
}

export interface GraphAdjacencyEdit {
    createEdge(graphEdge:GraphEdge):boolean;
    removeEdge(start:NodeId, end:NodeId):boolean;
    $removeEdgesInto(node:NodeId);
}

export interface GraphAdjacencyList extends GraphAdjacency {
    getEdge(start:NodeId, index:number):GraphEdge;
}

export interface GraphAdjacencyListEdit extends GraphAdjacencyEdit {
    _removeEdgeAtIndex(start:NodeId, endIndex:number):boolean;
}

export class GraphAdjacencyListImpl implements GraphAdjacencyList, GraphAdjacencyListEdit {
    /** cache to speed up access to edge end points */
    adjacency:NodeId[][] = [];
    edges:GraphEdge[][] = [];

    constructor(private graph:BasicGraph) {
    }

    hasEdge(start : NodeId, end : NodeId) : boolean {
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
    }

    getEdges(start:NodeId):GraphEdge[] {
        return this.edges[start]
    }

    getEdge(start:NodeId, end:NodeId):GraphEdge {
        return this.forNodeEdges(start, (edge, index) => {
            if (edge.end == end) {
                throw edge;
            }
        })
    }

    getEdgeAtIndex(start:NodeId, index:number):GraphEdge {
        return this.edges[start][index]
    }

    forAllEdges(callback : (GraphEdge, number) => any) {
        for (var adj of this.edges) {
            for (var edgeIdx in adj) {
                try {
                    var edge = adj[edgeIdx];
                    callback(edge, edgeIdx);
                } catch (result) {
                    return result;
                }
            }
        }
    }

    forNodeEdges(start : NodeId, callback : (GraphEdge, number) => any) {
        var nodeEdges = this.adjacency[start];
        for (var end of nodeEdges) {
            try {
                callback(start, end);
            } catch (result) {
                return result;
            }
        }
    }

    createEdge(edge:GraphEdge):boolean {
        if (edge.start != null && edge.end != null
            && this.graph.hasNode(edge.start) && this.graph.hasNode(edge.end)) {
            return this.addEdge(edge.start, edge.end, edge);
        }
        return null;
    }
    removeEdge(start:NodeId, end:NodeId):boolean {
        this._removeEdge(start, end)
        if (this.graph.isUndirected) {
            this._removeEdge(end, start);
        }
        return false;
    }
    $removeEdgesInto(node:NodeId):void {
        this.forAllEdges((edge, index) => {
            if (edge.end == node) {
                this._removeEdgeAtIndex(edge.start, index);
            }
        })
    }

    private _removeEdge(start:NodeId, end:NodeId):boolean {
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
    }

    _removeEdgeAtIndex(start:NodeId, index:number):boolean {
        var startAdj = this.adjacency[start];
        if (startAdj[index]) {
            delete startAdj[index];
            delete this.edges[index];
            // We don't allow duplicate edges, cut it here
            return true;
        }
        return false;
    }


    private addEdge(start:NodeId, end:NodeId, edge:GraphEdge):boolean {
        if (!this.hasEdge(start, end)) {
            this.adjacency[start].push(end);
            this.edges[start].push(edge);
            // TODO yin: Separate directianality logic into strategies
            if (this.graph.isUndirected) {
                this.adjacency[end].push(start)
                this.edges[end].push(edge);
            }
            return true;
        }
        return false;
    }
}
