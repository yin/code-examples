
import {Vector2} from "../typescript/vector2";
import {GraphModel} from "../typescript/graph-model";
import {GraphCanvasSettings} from "../typescript/graph-canvas";
import {GraphNode} from "../typescript/graph-model";
enum CanvasArea {
  Inside, Left,  Right, Top, Bottom, Corner
}

interface InputStrategy {
  select(GraphNode node):void;
  mouseDown(Event event):void;
  mouseUp(Event event):void;
  mouseMove(Event event):void;
}
export class GraphCanvasInputHandler {
  private debug = false;

  constructor(private model:GraphModel, private settings:GraphCanvasSettings) {
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
    return this.model.forNodes((node) => {
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

class FreeInputState implements InputStrategy {
  mouseDown(event:Event):void {
  var mouseEvent = event as MouseEvent;
  var position = new Vector2(mouseEvent.offsetX, mouseEvent.offsetY);
  var area = graph.canvasArea(position);
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

}

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
