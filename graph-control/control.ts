import {BasicGraph,GraphNode,GraphEdge,NodeId,GraphModel,GraphEdit} from "./../graph-model/graph-model";
import {GraphSelection, EmptySelection} from "./selection";
import {Render} from "./render";
import {GraphCanvasInputHandler} from "./input";
import {Commands,CommandsImpl} from "./commands";
import {Vector2} from "./util/vector2";

/** Constructs CanvasControl and all associated services. This would be a good place to use DI. */
export class ControlFactory {
  create(canvas:HTMLCanvasElement) {
    var settings = new GraphControlSettings();
    var render = new Render(settings);
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

  constructor(private canvas:HTMLCanvasElement, private render:Render, public commands:Commands) {
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

  nodeRadius_none = 10
  edgeWidth_none = 1;
  arrowSize_none = 16;
  arrowStroke_none = '#000000';
  arrowWidthIncrement_none = 0;
  arrowAngle = 20/180*Math.PI;

  /*
   String backgroundFill = '#ffffff';
   String edgeStroke_none = '#000000';
   String edgeStroke_selected = '#606060';
   String edgeStroke_path = '#000000';
   num edgeWidth_none = 1;
   num edgeWidth_selected = 2;
   num edgeWidth_path = 2;
   String arrowStroke_none = '#000000';
   String arrowStroke_selected = '#000000';
   String arrowStroke_path = '#000000';
   num arrowSize_none = 16;
   num arrowSize_selected = 16;
   num arrowSize_path = 16;
   num arrowWidthIncrement_none = 0;
   num arrowWidthIncrement_selected = 1;
   num arrowWidthIncrement_path = 1;
   String nodeStroke_none = '#303030';
   String nodeStroke_selected = '#303030';
   String nodeStroke_path = '#303030';
   String nodeFill_none = '#d94040';
   String nodeFill_selected = '#80d080';
   String nodeFill_path = '#d94040';
   num nodeWidth_none = 1;
   num nodeWidth_selected = 2;
   num nodeWidth_path = 3;
   */
}