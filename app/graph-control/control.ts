import {BasicGraph,GraphNode,GraphEdge,NodeId,GraphModel,GraphEdit} from "../graph-model/graph-model";
import {GraphSelection, EmptySelection} from "./selection";
import {GraphRenderer} from "./renderer";
import {GraphCanvasInputHandler} from "./input";
import {Commands,CommandsImpl} from "./commands";
import {Vector2} from "./util/vector2";

/** Constructs CanvasControl and all associated services. This would be a good place to use DI. */
export class ControlFactory {
  create(canvas:HTMLCanvasElement) {
    var settings = new GraphControlSettings();
    var render = new GraphRenderer(settings);
    var commands = new CommandsImpl();
    var control = new CanvasControl(canvas, render, commands);
    var inputHandler = new GraphCanvasInputHandler(control, settings);
    return control;
  }
}

/** Holds all components of the graph canvas and ensures proper updating of the display.
 * This approach is not perfect, there are circular dependencies in the hierarchy.
 */
export class CanvasControl {
  debug = false;
  private _model:GraphModel;
  selection:GraphSelection = EmptySelection.singleton;
  edit:GraphEdit;

  constructor(private canvas:HTMLCanvasElement, private render:GraphRenderer, public commands:Commands) {
  }

  get model() { return this._model };
  set model(model:GraphModel) {
    this._model = model;
    this.edit = model.edit;
    this.selection = EmptySelection.singleton;
  }

  /** Refreshes the canvas screen */
  update() {
    this.render.draw(this._model, this.canvas.getContext("2d"));
  }

  setSelection(selection:GraphSelection):void {
    this.selection = selection;
  }
}

export class GraphControlSettings {
  width:number;
  height:number;
  backgroundFill = '#ffffff';

  nodeRadius_none = 10
  nodeStroke_none = '#303030';
  nodeStroke_selected = '#303030';
  nodeStroke_path = '#303030';
  nodeFill_none = '#d94040';
  nodeFill_selected = '#80d080';
  nodeFill_path = '#d94040';
  nodeWidth_none = 1;
  nodeWidth_selected = 2;
  nodeWidth_path = 3;

  edgeStroke_none = '#000000';
  edgeStroke_selected = '#606060';
  edgeStroke_path = '#000000';
  edgeWidth_none = 1;
  edgeWidth_selected = 2;
  edgeWidth_path = 2;

  arrowStroke_none = '#000000';
  arrowStroke_selected = '#000000';
  arrowStroke_path = '#000000';
  arrowSize_none = 16;
  arrowSize_selected = 16;
  arrowSize_path = 16;
  arrowWidthIncrement_none = 0;
  arrowWidthIncrement_selected = 1;
  arrowWidthIncrement_path = 1;
  arrowAngle = 20 / 180 * Math.PI;
}