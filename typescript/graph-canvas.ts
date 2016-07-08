import {BasicGraph, GraphNode} from "graph-model"
import {GraphEdge} from "./graph-model";
import {NodeId} from "./graph-model";
import {Vector2} from "./vector2";
import {GraphModel} from "./graph-model";
import {GraphEdit} from "./graph-model";

interface Selection {
  remove():Selection;
  setProperty(key:string, value:Object);
}
class EmptySelection implements Selection {
  private static singleton:Selection = new EmptySelection();
  static get singleton() { return this.singleton }

  remove():Selection {
    return EmptySelection.singleton;
  }
  setProperty(key:string, value:Object) {
  }
}
class NodeSelection implements Selection {
  constructor(public model:BasicGraph, public node:GraphNode) {}

  remove():Selection {
    return EmptySelection.singleton;
  }
  setProperty(key:string, value:Object) {
    this.node.properties[key] = value;
  }
}
class EdgeSelection implements Selection {
  constructor(public model:BasicGraph, public edge:GraphEdge) {}

  remove():Selection {
    if (this.model.adjacencyEdit.removeEdge(this.edge.start, this.edge.end)) {
      return EmptySelection.singleton;
    } else {
      return this;
    }
  }
  setProperty(key:string, value:Object) {
    this.edge.properties[key] = value;
  }
}

export class GraphCanvasControl {
  debug = false;
  model:GraphModel;
  selection:Selection = EmptySelection.singleton;

  /*
  List<dynamic> path;
  GraphNode lastNode;
  GraphEdge lastEdge;
*/
  constructor(private canvas:HTMLCanvasElement, private renderer:GraphRenderer) {
  }

  get model() { return this.model };
  set model(model:GraphModel) {
    this.model = model;
    this.selection = EmptySelection.singleton;
  }

  /** Refreshes the canvas screen */
  update() {
    this.renderer.draw(this.model, this.canvas.getContext("2d"));
  }
/*
  @override
  void attached() {
    super.attached();
    canvas = $['graph'];
    if (debug)
      print("GraphCanvasTag.attached()");
  }

  void initialize({renderer, model}) {
    if (renderer != null) {
      this.renderer = renderer;
    } else {
      this.renderer = new GraphRenderer(this);
    }
    if (model != null) {
      this.model = model;
    } else {
      this.model = new GraphModel();
    }
  }

  bool createNode(Map properties) {
    lastNode = model.createNode(properties);
    if (lastNode != null) {
      return model.addNode(lastNode);
    }
    return false;
  }

  bool createEdge(GraphNode start, GraphNode end, {num weight : 1.0}) {
    //TODO yin: Make Dijkstra's algo work for edge weight == 0
    if (start != null && end != null && weight > 0) {
      Map prop = { "weight": weight };
      lastEdge = model.createEdge(start, end, properties: prop);
      if (lastEdge != null) {
        return model.addEdge(lastEdge);
      }
    }
    return false;
  }

  void select(GraphNode node) {
    selected = node;
  }

  bool parseString(String string) {
    GraphModel model = new GraphModel.parse(string);
    if (model != null) {
      this.model = model;
      selected = null;
      return true;
    }
    return false;
  }
  */
  setSelection(selection:Selection):void {
    this.selection = selection;
  }
}

export class GraphCanvasEdit implements GraphEdit {
  constructor(private control:GraphCanvasControl) {}

  createNode(properties:Object):GraphNode {
    var ret = this.control.model.createNode(properties);
    this.control.update();
    return
  }

  removeNode(node:NodeId):boolean {
    return undefined;
  }

  createEdge(start:NodeId, end:NodeId, properties:Object):boolean {
    return undefined;
  }

  removeEdge(start:NodeId, end:NodeId):boolean {
    return undefined;
  }

}

const TWO_PI = 2*Math.PI;

class GraphRenderer {
  debug = false;
  private model:BasicGraph;
  private ctx:CanvasRenderingContext2D;

  constructor(private settings:GraphCanvasSettings) {}

  draw(model:BasicGraph, ctx:CanvasRenderingContext2D) {
    if (this.debug) {
      var a = model.nodes.length;
      console.log("draw() nodes:${a}");
    }
    // Misusing instance fields here
    this.model = model;
    ctx['imageSmoothingEnabled'] = true;
    this.clear();

    model.forNodes((node) => {
      this.drawNode(ctx, node);
    });
    model.adjacencyList.forAllEdges((edge) => {
      this.drawEdge(ctx, edge);
    });
  }

  drawNode(ctx:CanvasRenderingContext2D, node:GraphNode) {
    var pos = node.properties['position'];
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, this.settings.nodeRadius_none, 0, TWO_PI);
    ctx.closePath();
    this.applyStyle(ctx, node);
    ctx.fill();
    ctx.stroke();
  }

  drawEdge(ctx:CanvasRenderingContext2D, edge:GraphEdge):void {
    var start:Vector2 = this.getNode(edge.start).properties['position'];
    var end:Vector2 = this.getNode(edge.end).properties['position'];
    var delta = end.sub(start);
    //TODO yin: Test sqrt(Pitagoras) vs. Point.distanceTo() approach fo speed
    var distance = delta.length;
    var tangent = delta.div(distance);
    var scaledTangent = tangent.mult(this.settings.nodeRadius_none);
    var lineStart:Vector2 = start.add(scaledTangent);
    var lineEnd:Vector2 = end.sub(scaledTangent);
    ctx.beginPath();
    ctx.moveTo(lineStart.x, lineStart.y);
    ctx.lineTo(lineEnd.x, lineEnd.y);
    this.applyStyle(ctx, edge);
    ctx.stroke();
    this.drawArrow(ctx, edge, tangent, lineStart, lineEnd);
    if (this.debug) {
      console.log("draw.edge($edge) delta:${delta} dist:${distance} norm:${tangent}");
      console.log("         S:${start} E:${end}");
      console.log("         s:${lineStart} e:${lineEnd}");
    }
  }

  drawArrow(ctx:CanvasRenderingContext2D, edge:GraphEdge, tangent:Vector2, lineStart:Vector2, lineEnd:Vector2):void {
    if (this.areArrowVisible) {
      //TODO yin: account for arrowWidth
      var arrowBase:Vector2 = tangent.mult(this.settings.arrowSize_none);
      var angle = this.settings.arrowAngle;
      ctx.beginPath();
      // TODO(yin): compute angle here
      // ... no better compute the tranform paramters, which ever they are...
      // e.g.:    ctx.transform(matrix); ...; ctx.identity();
      this._drawRotatedLine(ctx, lineEnd, arrowBase, angle);
      this._drawRotatedLine(ctx, lineEnd, arrowBase, -angle);
      this.applyStyle(ctx, edge);
      ctx.stroke();
      if (this.model.isUndirected) {
        ctx.beginPath();
        arrowBase = tangent * - this.settings.arrowSize_none;
        this._drawRotatedLine(ctx, lineStart, arrowBase, angle);
        this._drawRotatedLine(ctx, lineStart, arrowBase, -angle);
        ctx.stroke();
      }
    }
  }

  _drawRotatedLine(ctx:CanvasRenderingContext2D, center:Vector2, base:Vector2, angle:number):void {
    var rotated = base.rotate(angle);
    var end = center - rotated;
    ctx.moveTo(center.x, center.y);
    ctx.lineTo(end.x, end.y);
  }

  //TODO yin: Move to a separate class GRStyleManager
  applyStyle(ctx:CanvasRenderingContext2D, object:any, subStyle = null) {
    ctx.strokeStyle = this.settings.arrowStroke_none;
    ctx.lineWidth = this.settings.edgeWidth_none + this.settings.arrowWidthIncrement_none;
  /*
    if (object instanceof GraphEdge) {
      if (subStyle == #arrow) {
        if (tag.selected == object) {
          ctx.strokeStyle = arrowStroke_selected;
          ctx.lineWidth = edgeWidth_none + arrowWidthIncrement_selected;
        } else if (tag.path != null && tag.path.contains(object)) {
          ctx.strokeStyle = arrowStroke_path;
          ctx.lineWidth = edgeWidth_path + arrowWidthIncrement_path;
        } else {
          ctx.strokeStyle = arrowStroke_none;
          ctx.lineWidth = edgeWidth_none + arrowWidthIncrement_none;
        }
      } else {
        if (tag.selected == object) {
          ctx.strokeStyle = edgeStroke_selected;
          ctx.lineWidth = edgeWidth_selected;
        } else if (tag.path != null && tag.path.contains(object)) {
          ctx.strokeStyle = edgeStroke_path;
          ctx.lineWidth = edgeWidth_path;
        } else {
          ctx.strokeStyle = edgeStroke_none;
          ctx.lineWidth = edgeWidth_none;
        }
      }
    } else if (object is GraphNode) {
      if (tag.selected == object) {
        ctx.fillStyle = nodeFill_selected;
        ctx.strokeStyle = nodeStroke_selected;
        ctx.lineWidth = nodeWidth_selected;
      } else if (tag.path != null && tag.path.contains(object)) {
        ctx.fillStyle = nodeFill_path;
        ctx.strokeStyle = nodeStroke_path;
        ctx.lineWidth = nodeWidth_path;
      } else {
        ctx.fillStyle = nodeFill_none;
        ctx.strokeStyle = nodeStroke_none;
        ctx.lineWidth = nodeWidth_none;
      }
    }
    */
  }

  clear():void {
    this.ctx.clearRect(0, 1, this.settings.width-1, this.settings.height-1);
  }

  private getNode(node:NodeId):GraphNode {
    return this.model.getNode(node);
  }

  private get areArrowVisible() {
    return this.settings.arrowSize_none > 0 /*|| this.arrowSize_selected > 0|| this.arrowSize_path > 0*/;
  };
}

export class GraphCanvasSettings {
  width:number;
  height:number;

  nodeRadius_none = 10
  edgeWidth_none = 1;
  arrowSize_none = 16;
  arrowStroke_none = '#000000';
  arrowWidthIncrement_none = 0;
  arrowAngle = 20/180*Math.PI;

  /*
   GraphCanvasTag tag;
   GraphRenderer(GraphCanvasTag tag) : tag = tag;
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