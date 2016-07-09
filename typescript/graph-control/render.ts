import {NodeId} from "../graph-model";
import {GraphNode} from "../graph-model";
import {GraphControlSettings} from "./control";
import {BasicGraph} from "../graph-model";
import {GraphEdge} from "../graph-model";
import {Vector2} from "../vector2";

const TWO_PI = 2 * Math.PI;

export class Render {
  debug = false;
  private model:BasicGraph;
  private ctx:CanvasRenderingContext2D;

  constructor(private settings:GraphControlSettings) {}

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
