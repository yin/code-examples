"use strict";
var EmptySelection = (function () {
    function EmptySelection() {
    }
    Object.defineProperty(EmptySelection, "singleton", {
        get: function () { return this._singleton; },
        enumerable: true,
        configurable: true
    });
    EmptySelection.prototype.remove = function () {
        return EmptySelection._singleton;
    };
    EmptySelection.prototype.transform = function (transform) {
    };
    EmptySelection._singleton = new EmptySelection();
    return EmptySelection;
}());
exports.EmptySelection = EmptySelection;
var NodeSelection = (function () {
    function NodeSelection(model, node) {
        this.model = model;
        this.node = node;
    }
    NodeSelection.prototype.remove = function () {
        return EmptySelection.singleton;
    };
    NodeSelection.prototype.transform = function (transform) {
        if (this.model.edit) {
            transform.transformNode(this.node, this.model.edit);
        }
    };
    return NodeSelection;
}());
exports.NodeSelection = NodeSelection;
var EdgeSelection = (function () {
    function EdgeSelection(model, edge) {
        this.model = model;
        this.edge = edge;
    }
    EdgeSelection.prototype.remove = function () {
        if (this.model.adjacencyEdit.removeEdge(this.edge.start, this.edge.end)) {
            return EmptySelection.singleton;
        }
        else {
            return this;
        }
    };
    EdgeSelection.prototype.transform = function (transform) {
        if (this.model.edit) {
            transform.transformNode(this.edge, this.model.edit);
        }
    };
    return EdgeSelection;
}());
exports.EdgeSelection = EdgeSelection;
//# sourceMappingURL=selection.js.map