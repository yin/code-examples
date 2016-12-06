import {Inject,ElementRef} from "@angular/core";
import {GraphModel, GraphNode, GraphEdit, BasicGraph} from "../graph-model/graph-model";
import {GraphCanvasSettings, GraphCanvasModel} from "./control";
import {NodeSelection} from "./selection";
import {Vector2} from "./util/vector2";
import {Commands} from "./commands";
import {CommandsImpl} from "./commands";

enum CanvasArea {
  Inside, Left,  Right, Top, Bottom, Corner
}

interface InputHandler {
  mouseDown(event:MouseEvent):void;
  mouseUp(event:MouseEvent):void;
  mouseMove(event:MouseEvent):void;
}
interface GraphCanvasAccess {
  canvasArea(position:Vector2):CanvasArea;
  getNodeAt(position:Vector2):GraphNode;
}
interface InputHandlerStrategy {
  provider:GraphCanvasModel;
  access:GraphCanvasAccess;
  commands:Commands;
  setState(inputHandler:InputHandler);
}
export class EditorInputHandler implements InputHandlerStrategy, GraphCanvasAccess {
  public stateFree = new FreeInputState(this);
  public stateDragging = new DraggingInputState(this);
  public statePathStart = new PathStartInputState(this);
  public statePathEnd = new PathEndInputState(this);

  private inputHandler:InputHandler = this.stateFree;

  constructor(private _provider:GraphCanvasModel,
              @Inject(CommandsImpl) private _commands:CommandsImpl,
              @Inject(GraphCanvasSettings) public settings:GraphCanvasSettings) {}

  get provider() { return this._provider }
  get access():GraphCanvasAccess { return this }
  get commands() {return this._commands }

  onMouseDown(event:MouseEvent) {
    console.log("mdown", this.inputHandler)
    this.inputHandler.mouseDown(event);
    console.log(this.inputHandler)
  }
  onMouseUp(event:MouseEvent) {
    this.inputHandler.mouseUp(event);
  }
  onMouseMove(event:MouseEvent) {
    this.inputHandler.mouseMove(event);
  }
  setState(inputHandler:InputHandler) {
    this.inputHandler = inputHandler;
  }

  canvasArea(position:Vector2):CanvasArea {
    var x = position.x;
    var y = position.y;
    var minX = this.settings.nodeRadius_none;
    var minY = this.settings.nodeRadius_none;
    var maxX = this.settings.width - this.settings.nodeRadius_none;
    var maxY = this.settings.height - this.settings.nodeRadius_none;
    if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
      return CanvasArea.Inside;
    } else if (x < minX && y >= minY && y <= maxY) {
      return CanvasArea.Left;
    } else if (x > maxX && y >= minY && y <= maxY) {
      return CanvasArea.Right;
    } else if (y < minX && x >= minX && x <= maxX) {
      return CanvasArea.Top;
    } else if (y > maxY && x >= minX && x <= maxX) {
      return CanvasArea.Bottom;
    } else {
      return CanvasArea.Corner;
    }
  }

  getNodeAt(position:Vector2):GraphNode {
    return this.provider.model.forNodes((node) => {
      var delta:Vector2 = node.properties['position'].sub(position);
      var distanceSquared = delta.lengthSquared;
      if (distanceSquared <= 2 * this.settings.nodeRadius_none**2) {
        throw node;
      }
    });
  }

  install(element:ElementRef):void {
    var canvas = (<HTMLElement>element.nativeElement);
    canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
    canvas.addEventListener("mouseup", this.onMouseUp.bind(this));
    canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
  }
}

abstract class BaseInputState implements InputHandler {
  constructor(public inputHandler:EditorInputHandler) {}
  get provider() { return this.inputHandler.provider }
  get access() { return this.inputHandler.access }
  get commands() {return this.inputHandler.commands }
  mouseDown(e) {}
  mouseUp(e) {}
  mouseMove(e) {}
}

class FreeInputState extends BaseInputState {
  constructor(inputHandler:EditorInputHandler) {
    super(inputHandler)
  }

  mouseDown(event:MouseEvent):void {
    var position = new Vector2(event.offsetX, event.offsetY);
    var area = this.access.canvasArea(position);
    if (area == CanvasArea.Inside) {
      var node = this.access.getNodeAt(position);
      if (node != null) {
        this.provider.selection = new NodeSelection(this.provider.model, node);
        this.inputHandler.setState(this.inputHandler.stateDragging);
      } else {
        this.commands.updateModel((edit:GraphEdit) => {
          edit.createNode({position:position});
        });
      }
    }
  }
}

class DraggingInputState extends BaseInputState {
  constructor(inputHandler:EditorInputHandler) {
    super(inputHandler)
  }

  mouseUp(event:MouseEvent) {
    this.inputHandler.setState(this.inputHandler.stateFree);
  }
  mouseMove(event:MouseEvent) {
    this.provider.selection.transform({
      transformNode: (node, edit) => {
        var position = node.properties['position'];
        var newposition = position.add(new Vector2(event.movementX, event.movementY))
        edit.mergeNode(node, {position: newposition})
      },
      transformEdge: (edge, edit) => {}
    });
  }
}

/** State for selecting start node for path finding algorithm. This is TBD. */
class PathStartInputState extends BaseInputState {
  constructor(inputHandler:EditorInputHandler) {
    super(inputHandler)
  }
  mouseUp(event:MouseEvent) {
  }
  mouseMove(event:MouseEvent) {
  }
  mouseDown(event:MouseEvent) {
  }
}

/** State for selecting start node for path finding algorithm. This is TBD. */
class PathEndInputState extends BaseInputState {
  constructor(inputHandler:EditorInputHandler) {
    super(inputHandler)
  }
  mouseUp(event:MouseEvent) {
  }
  mouseMove(event:MouseEvent) {
  }
  mouseDown(event:MouseEvent) {
  }
}
