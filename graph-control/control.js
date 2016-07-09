"use strict";
var selection_1 = require("./selection");
var render_1 = require("./render");
var input_1 = require("./input");
var commands_1 = require("./commands");
/** Constructs CanvasControl and all associated services. This would be a good place to use DI. */
var ControlFactory = (function () {
    function ControlFactory() {
    }
    ControlFactory.prototype.create = function (canvas) {
        var settings = new GraphControlSettings();
        var render = new render_1.Render(settings);
        var commands = new commands_1.CommandsImpl();
        var control = new CanvasControl(canvas, render, commands);
        var inputHandler = new input_1.GraphCanvasInputHandler(control, settings);
        return control;
    };
    return ControlFactory;
}());
exports.ControlFactory = ControlFactory;
/** Holds all components of the graph canvas and ensures proper updating of the display.
 * This approach is not perfect, there are circular dependencies in the hierarchy.
 */
var CanvasControl = (function () {
    function CanvasControl(canvas, render, commands) {
        this.canvas = canvas;
        this.render = render;
        this.commands = commands;
        this.debug = false;
        this.selection = selection_1.EmptySelection.singleton;
    }
    Object.defineProperty(CanvasControl.prototype, "model", {
        get: function () { return this._model; },
        set: function (model) {
            this._model = model;
            this.edit = model.edit;
            this.selection = selection_1.EmptySelection.singleton;
        },
        enumerable: true,
        configurable: true
    });
    ;
    /** Refreshes the canvas screen */
    CanvasControl.prototype.update = function () {
        this.render.draw(this._model, this.canvas.getContext("2d"));
    };
    CanvasControl.prototype.setSelection = function (selection) {
        this.selection = selection;
    };
    return CanvasControl;
}());
exports.CanvasControl = CanvasControl;
var GraphControlSettings = (function () {
    function GraphControlSettings() {
        this.nodeRadius_none = 10;
        this.edgeWidth_none = 1;
        this.arrowSize_none = 16;
        this.arrowStroke_none = '#000000';
        this.arrowWidthIncrement_none = 0;
        this.arrowAngle = 20 / 180 * Math.PI;
    }
    return GraphControlSettings;
}());
exports.GraphControlSettings = GraphControlSettings;
//# sourceMappingURL=control.js.map