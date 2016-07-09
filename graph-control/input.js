"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var selection_1 = require("./selection");
var vector2_1 = require("./util/vector2");
var CanvasArea;
(function (CanvasArea) {
    CanvasArea[CanvasArea["Inside"] = 0] = "Inside";
    CanvasArea[CanvasArea["Left"] = 1] = "Left";
    CanvasArea[CanvasArea["Right"] = 2] = "Right";
    CanvasArea[CanvasArea["Top"] = 3] = "Top";
    CanvasArea[CanvasArea["Bottom"] = 4] = "Bottom";
    CanvasArea[CanvasArea["Corner"] = 5] = "Corner";
})(CanvasArea || (CanvasArea = {}));
var GraphCanvasInputHandler = (function () {
    function GraphCanvasInputHandler(control, settings) {
        this.control = control;
        this.settings = settings;
        this.debug = false;
        this.stateFree = new FreeInputState(this, this, this.control);
        this.stateDragging = new DraggingInputState(this, this, this.control);
        this.statePathStart = new PathStartInputState(this, this, this.control);
        this.statePathEnd = new PathEndInputState(this, this, this.control);
    }
    GraphCanvasInputHandler.prototype.onMouseDown = function (event) {
        this.inputHandler.mouseDown(event);
    };
    GraphCanvasInputHandler.prototype.onMouseUp = function (event) {
        this.inputHandler.mouseUp(event);
    };
    GraphCanvasInputHandler.prototype.onMouseMove = function (event) {
        this.inputHandler.mouseMove(event);
    };
    GraphCanvasInputHandler.prototype.setState = function (inputHandler) {
        this.inputHandler = inputHandler;
    };
    GraphCanvasInputHandler.prototype.canvasArea = function (position) {
        var x = position.x;
        var y = position.y;
        var minX = this.settings.nodeRadius_none;
        var minY = this.settings.nodeRadius_none;
        var maxX = this.settings.width - this.settings.nodeRadius_none;
        var maxY = this.settings.height - this.settings.nodeRadius_none;
        if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
            return CanvasArea.Inside;
        }
        else if (x < minX && y >= minY && y <= maxY) {
            return CanvasArea.Left;
        }
        else if (x > maxX && y >= minY && y <= maxY) {
            return CanvasArea.Right;
        }
        else if (y < minX && x >= minX && x <= maxX) {
            return CanvasArea.Top;
        }
        else if (y > maxY && x >= minX && x <= maxX) {
            return CanvasArea.Bottom;
        }
        else {
            return CanvasArea.Corner;
        }
    };
    GraphCanvasInputHandler.prototype.getNodeAt = function (position) {
        var _this = this;
        return this.control.model.forNodes(function (node) {
            var delta = node.properties['position'].sub(position);
            var distanceSquared = delta.lengthSquared;
            if (_this.debug) {
                var id = node.id;
                console.log('getNodeAt($position) node:$id delta:$delta dist^2:$distSquare '
                    + 'dist:$distance');
            }
            if (distanceSquared <= 2 * Math.pow(_this.settings.nodeRadius_none, 2)) {
                throw node;
            }
        });
    };
    return GraphCanvasInputHandler;
}());
exports.GraphCanvasInputHandler = GraphCanvasInputHandler;
var BaseInputState = (function () {
    function BaseInputState(inputHandler, access, control) {
        this.inputHandler = inputHandler;
        this.access = access;
        this.control = control;
    }
    BaseInputState.prototype.mouseDown = function (e) { };
    BaseInputState.prototype.mouseUp = function (e) { };
    BaseInputState.prototype.mouseMove = function (e) { };
    return BaseInputState;
}());
var FreeInputState = (function (_super) {
    __extends(FreeInputState, _super);
    function FreeInputState(inputHandler, access, control) {
        _super.call(this, inputHandler, access, control);
    }
    FreeInputState.prototype.mouseDown = function (event) {
        var position = new vector2_1.Vector2(event.offsetX, event.offsetY);
        var area = this.access.canvasArea(position);
        if (area == CanvasArea.Inside) {
            var node = this.access.getNodeAt(position);
            if (node != null) {
                this.control.setSelection(new selection_1.NodeSelection(this.control.model, node));
                this.inputHandler.setState(this.inputHandler.stateDragging);
            }
            else {
                this.control.commands.updateModel(function (edit) {
                    edit.createNode({ position: position });
                });
            }
        }
    };
    return FreeInputState;
}(BaseInputState));
var DraggingInputState = (function (_super) {
    __extends(DraggingInputState, _super);
    function DraggingInputState(inputHandler, access, control) {
        _super.call(this, inputHandler, access, control);
    }
    DraggingInputState.prototype.mouseUp = function (event) {
        this.inputHandler.setState(this.inputHandler.stateFree);
    };
    DraggingInputState.prototype.mouseMove = function (event) {
        this.control.selection.transform({
            transformNode: function (node, edit) {
                var position = node.properties['position'];
                var newposition = position.add(new vector2_1.Vector2(event.movementX, event.movementY));
                edit.mergeNode(node, { position: newposition });
            },
            transformEdge: function (edge, edit) { }
        });
    };
    return DraggingInputState;
}(BaseInputState));
/** State for selecting start node for path finding algorithm. This is TBD. */
var PathStartInputState = (function (_super) {
    __extends(PathStartInputState, _super);
    function PathStartInputState(inputHandler, access, control) {
        _super.call(this, inputHandler, access, control);
    }
    PathStartInputState.prototype.mouseUp = function (event) {
    };
    PathStartInputState.prototype.mouseMove = function (event) {
    };
    PathStartInputState.prototype.mouseDown = function (event) {
    };
    return PathStartInputState;
}(BaseInputState));
/** State for selecting start node for path finding algorithm. This is TBD. */
var PathEndInputState = (function (_super) {
    __extends(PathEndInputState, _super);
    function PathEndInputState(inputHandler, access, control) {
        _super.call(this, inputHandler, access, control);
    }
    PathEndInputState.prototype.mouseUp = function (event) {
    };
    PathEndInputState.prototype.mouseMove = function (event) {
    };
    PathEndInputState.prototype.mouseDown = function (event) {
    };
    return PathEndInputState;
}(BaseInputState));
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
      graph._model = new GraphModel(graphType: #oriented);
    });
    (querySelector('#new-undirected') as ButtonElement).onClick.listen((e) {
      graph._model = new GraphModel(graphType: #bidirectional);
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
  window.location.hash = lastHash = graph._model.toString();
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
    List<GraphNode> path = dijkstra(graph._model, start, node);
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
//# sourceMappingURL=input.js.map