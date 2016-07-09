"use strict";
var CommandsImpl = (function () {
    function CommandsImpl() {
    }
    CommandsImpl.prototype.setControl = function (control) {
        this.control = control;
    };
    CommandsImpl.prototype.select = function (selection) {
        this.execute(new SetSelectionCommand(this.control, selection));
    };
    CommandsImpl.prototype.updateModel = function (transform) {
        this.execute(new EditCommand(this.control, transform));
    };
    CommandsImpl.prototype.execute = function (command) {
        // TODO: yin: Push the command into the undo stack/graph
        command.redo();
    };
    return CommandsImpl;
}());
exports.CommandsImpl = CommandsImpl;
var SetSelectionCommand = (function () {
    function SetSelectionCommand(control, after) {
        this.control = control;
        this.after = after;
    }
    SetSelectionCommand.prototype.redo = function () {
        this.before = this.control.selection;
        this.control.setSelection(this.after);
    };
    SetSelectionCommand.prototype.undo = function () {
        this.control.setSelection(this.before);
    };
    return SetSelectionCommand;
}());
var EditCommand = (function () {
    function EditCommand(control, transform) {
        this.control = control;
        this.transform = transform;
    }
    EditCommand.prototype.redo = function () {
        // TODO yin: For undo to work, we need to wap GraphEdit into a recording proxy.
        this.transform(this.control.edit);
    };
    EditCommand.prototype.undo = function () {
        // TODO yin: Undo function should use the proxy to restore affected parts of the _model
    };
    return EditCommand;
}());
var RecordingGraphEditProxy = (function () {
    function RecordingGraphEditProxy() {
        this.dirty = false;
    }
    RecordingGraphEditProxy.prototype.setModel = function (model) {
        this.edit = model.edit;
    };
    RecordingGraphEditProxy.prototype.createNode = function (properties) {
        var ret = this.edit.createNode(properties);
        ret && this.markDirty();
        return ret;
    };
    RecordingGraphEditProxy.prototype.removeNode = function (node) {
        var ret = this.edit.removeNode(node);
        ret && this.markDirty();
        return ret;
    };
    RecordingGraphEditProxy.prototype.mergeNode = function (node, properties) {
        this.edit.mergeNode(node, properties);
        this.markDirty();
    };
    RecordingGraphEditProxy.prototype.createEdge = function (start, end, properties) {
        var ret = this.edit.createEdge(start, end, properties);
        ret && this.markDirty();
        return ret;
    };
    RecordingGraphEditProxy.prototype.removeEdge = function (start, end) {
        var ret = this.edit.removeEdge(start, end);
        ret && this.markDirty();
        return ret;
    };
    RecordingGraphEditProxy.prototype.mergeEdge = function (edge, properties) {
        this.edit.mergeEdge(edge, properties);
        this.markDirty();
    };
    RecordingGraphEditProxy.prototype.markDirty = function () {
        this.dirty = true;
    };
    RecordingGraphEditProxy.prototype.unmarkDirty = function () {
        this.dirty = false;
    };
    return RecordingGraphEditProxy;
}());
//# sourceMappingURL=commands.js.map