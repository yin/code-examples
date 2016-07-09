
import {Vector2} from "../vector2";
import {GraphModel} from "../graph-model";
import {GraphControlSettings} from "control";
import {GraphNode} from "../graph-model";
import {CanvasControl} from "control";
import {GraphEdit} from "../graph-model";
import {NodeSelection} from "./selection";

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
  setState(inputHandler:InputHandler);
}
export class GraphCanvasInputHandler implements InputHandlerStrategy, GraphCanvasAccess {
  private debug = false;
  private inputHandler:InputHandler;

  public stateFree = new FreeInputState(this, this, this.control);
  public stateDragging = new DraggingInputState(this, this, this.control);
  public statePathStart = new PathStartInputState(this, this, this.control);
  public statePathEnd = new PathEndInputState(this, this, this.control);

  constructor(private control:CanvasControl, private settings:GraphControlSettings) {
  }

  onMouseDown(event:MouseEvent) {
    this.inputHandler.mouseDown(event);
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
    return this.control.model.forNodes((node) => {
      var delta:Vector2 = node.properties['position'].sub(position);
      var distanceSquared = delta.lengthSquared;
      if (this.debug) {
        var id = node.id;
        console.log('getNodeAt($position) node:$id delta:$delta dist^2:$distSquare '
            + 'dist:$distance');
      }
      if (distanceSquared <= 2 * this.settings.nodeRadius_none**2) {
        throw node;
      }
    });
  }
}

abstract class BaseInputState implements InputHandler {
  constructor(public inputHandler:GraphCanvasInputHandler, public access:GraphCanvasAccess,
              public control:CanvasControl) {}
}

class FreeInputState extends BaseInputState {
  constructor(inputHandler:GraphCanvasInputHandler, access:GraphCanvasAccess, control:CanvasControl) {
    super(inputHandler, access, control)
  }

  mouseDown(event:MouseEvent):void {
    var position = new Vector2(event.offsetX, event.offsetY);
    var area = this.access.canvasArea(position);
    if (area == CanvasArea.Inside) {
      var node = this.access.getNodeAt(position);
      if (node != null) {
        this.control.setSelection(new NodeSelection(this.control.model, node));
        this.inputHandler.setState(this.inputHandler.stateDragging);
      } else {
        this.control.commands.updateModel((edit:GraphEdit) => {
          edit.createNode({position:position});
        });
      }
    }
  }
  mouseUp(event:MouseEvent) {
  }
  mouseMove(event:MouseEvent) {
  }
}

class DraggingInputState extends BaseInputState {
  constructor(inputHandler:GraphCanvasInputHandler, access:GraphCanvasAccess, control:CanvasControl) {
    super(inputHandler, access, control)
  }

  mouseUp(event:MouseEvent) {
    this.inputHandler.setState(this.inputHandler.stateFree);
  }
  mouseMove(event:MouseEvent) {
    this.control.selection.transform({
      transformNode: (node, edit) => {
        var position = node.properties['position'];
        var newposition = position.add(new Vector2(event.movementX, event.movementY))
        edit.mergeNode(node, {position: newposition})
      },
      transformEdge: (edge, edit) => {}
    });
  }

  mouseDown(event:MouseEvent):void {
  }
}

/** State for selecting start node for path finding algorithm. This is TBD. */
class PathStartInputState extends BaseInputState {
  constructor(inputHandler:GraphCanvasInputHandler, access:GraphCanvasAccess, control:CanvasControl) {
    super(inputHandler, access, control)
  }
  mouseUp(event:MouseEvent) {
  }
  mouseMove(event:MouseEvent) {
  }
  mouseDown(event:MouseEvent):void {
  }
}

/** State for selecting start node for path finding algorithm. This is TBD. */
class PathEndInputState extends BaseInputState {
  constructor(inputHandler:GraphCanvasInputHandler, access:GraphCanvasAccess, control:CanvasControl) {
    super(inputHandler, access, control)
  }
  mouseUp(event:MouseEvent) {
  }
  mouseMove(event:MouseEvent) {
  }
  mouseDown(event:MouseEvent):void {
  }
}

/*

void start(event) {
  try {
    HtmlElement e = querySelector('#graph');
    graph = e as GraphCanvasTag;
    graph.initialize();
    graph.onMouseMove.listen(mouseMove);
    graph.onMouseDown.listen(mouseDown);
    graph.onMouseUp.listen(mouseUp);

    (querySelector('#new-directed') as ButtonElement).onClick.listen((e) {
      graph.model = new GraphModel(graphType: #oriented);
    });
    (querySelector('#new-undirected') as ButtonElement).onClick.listen((e) {
      graph.model = new GraphModel(graphType: #bidirectional);
    });
    (querySelector('#find-path') as ButtonElement).onClick.listen((e) {
      state = #path_start;
      graph.select(null);
      graph.renderer.draw();
    });
    (querySelector('#reset-path') as ButtonElement).onClick.listen((e) {
      graph.path = null;
      graph.renderer.draw();
    });
    window.onPopState.listen(onHashChanged);
    onHashChanged(null);
  } catch(e) {
    print (e);
  }
}

void mouseDown(Event event) {
  if (debug) {
    var selected = graph.selected;
    print('down $state $selected');
  }
  MouseEvent mouseEvent = event as MouseEvent;
  Point position = mouseEvent.offset;
  Symbol area = graph.canvasArea(position);
  if (graph.canvasArea(position) == #inside) {
    GraphNode node = graph.getNodeAt(position);
    if (node != null) {
      if (!mouseEvent.ctrlKey && !mouseEvent.altKey) {
        if (node != graph.selected) {
          select(node);
        } else {
          graph.select(null);
        }
      } else if (mouseEvent.ctrlKey || mouseEvent.altKey) {
        graph.createEdge(graph.selected, node);
        if (mouseEvent.altKey) {
          graph.select(node);
        }
      }
    } else {
      if (state != #path_start && state != #path.end) {
        state = #dragging;
        graph.createNode({'position': position});
        graph.select(graph.lastNode);
      }
    }
  }
  if (debug) {
    var selected = graph.selected;
    print('down > $state $selected');
  }
  graph.renderer.draw();
  window.location.hash = lastHash = graph.model.toString();
}

void select(GraphNode node) {
  if (state == #free || state == #selected) {
    state = #dragging;
    graph.select(node);
  } else if (state == #path_start) {
    state = #path_end;
    graph.select(node);
  } else if (state == #path_end) {
    state = #free;
    GraphNode start = graph.selected;
    graph.select(node);
    List<GraphNode> path = dijkstra(graph.model, start, node);
    graph.path = path;
  }
}


void mouseUp(Event event) {
  if (debug)  {
    var selected = graph.selected;
    print('up $state $selected');
  }
  if (state == #dragging) {
    state = #selected;
    graph.renderer.draw();
  }
  if (debug)  {
    var selected = graph.selected;
    print('up > $state $selected');
  }
}

void mouseMove(Event event) {
  if (state == #dragging && graph.selected != null) {
    Point delta = (event as MouseEvent).movement;
    graph.selected.properties['position'] = graph.selected.properties['position'] + delta;
    graph.renderer.draw();
  }
}

void onHashChanged(PopStateEvent event) {
  String hash = window.location.hash.toString().replaceFirst('#', '');
  if (hash != lastHash) {
    if (debug_hash) {
      print("onHashChanged: newHash = $hash");
    }
    if (graph.parseString(hash)) {
      state = #free;
      graph.renderer.draw();
    }
    lastHash = hash;
  }
}
//*/
