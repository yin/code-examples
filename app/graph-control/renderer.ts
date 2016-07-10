import {NodeId,GraphNode,BasicGraph,GraphEdge} from "../graph-model/graph-model";
import {GraphControlSettings} from "./control";
import {Vector2} from "./util/vector2";

const TWO_PI = 2 * Math.PI;
const SELECTED_CLASS = 'selected';
const PATH_SEGMENT_CLASS = 'path-seg';
const ARROW_PSEUDOCLASS = 'arrow';
const BACKGROUND_PSEUDOCLASS = 'background';

export class GraphRenderer {
  debug = false;
  private model:BasicGraph;
  private styleProcessor = new StyleProcessor();

  constructor(private settings:GraphControlSettings) {
  }

  draw(model:BasicGraph, ctx:CanvasRenderingContext2D) {
    if (this.debug) {
      var a = model.nodes.length;
      console.log("draw() nodes:${a}");
    }
    // Misusing instance fields here
    this.model = model;
    ctx['imageSmoothingEnabled'] = true;
    this.clear(ctx);

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
    this.styleProcessor.applyStyle(ctx, this.settings, node, null);
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
    this.styleProcessor.applyStyle(ctx, this.settings, edge, null);
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
      this.styleProcessor.applyStyle(ctx, this.settings, edge, ARROW_PSEUDOCLASS);
      ctx.stroke();
      if (this.model.isUndirected) {
        ctx.beginPath();
        var arrowBase = tangent.mult(-this.settings.arrowSize_none);
        this._drawRotatedLine(ctx, lineStart, arrowBase, angle);
        this._drawRotatedLine(ctx, lineStart, arrowBase, -angle);
        ctx.stroke();
      }
    }
  }

  _drawRotatedLine(ctx:CanvasRenderingContext2D, center:Vector2, base:Vector2, angle:number):void {
    var rotated = base.rotate(angle);
    var end = center.sub(rotated);
    ctx.moveTo(center.x, center.y);
    ctx.lineTo(end.x, end.y);
  }

  clear(ctx:CanvasRenderingContext2D):void {
    this.styleProcessor.applyStyle(ctx, this.settings, null, BACKGROUND_PSEUDOCLASS);
    ctx.clearRect(0, 1, this.settings.width - 1, this.settings.height - 1);
  }

  private getNode(node:NodeId):GraphNode {
    return this.model.getNode(node);
  }

  private get areArrowVisible() {
    return this.settings.arrowSize_none > 0 /*|| this.arrowSize_selected > 0|| this.arrowSize_path > 0*/;
  };
}

class StyleProcessor {
  applyStyle(ctx:CanvasRenderingContext2D, s:GraphControlSettings, object:any, pseudoclass:string) {
    var isSelected = (item:any) => {
      var classes = item.properties['classes']
      if (Array.isArray(classes)) {
        return (<Array<string>>classes).includes(SELECTED_CLASS);
      }
    };
    var isPathSegment = (item:any) => {
      var classes = item.properties['classes']
      if (Array.isArray(classes)) {
        return (<Array<string>>classes).includes(PATH_SEGMENT_CLASS);
      }
    };
    var isArrow = pseudoclass == ARROW_PSEUDOCLASS;

    if (object instanceof GraphEdge) {
      if (isArrow) {
        if (isSelected(object)) {
          ctx.strokeStyle = s.arrowStroke_selected;
          ctx.lineWidth = s.edgeWidth_none + s.arrowWidthIncrement_selected;
        } else if (isPathSegment(object)) {
          ctx.strokeStyle = s.arrowStroke_path;
          ctx.lineWidth = s.edgeWidth_path + s.arrowWidthIncrement_path;
        } else {
          ctx.strokeStyle = s.arrowStroke_none;
          ctx.lineWidth = s.edgeWidth_none + s.arrowWidthIncrement_none;
        }
      } else {
        if (isSelected(object)) {
          ctx.strokeStyle = s.edgeStroke_selected;
          ctx.lineWidth = s.edgeWidth_selected;
        } else if (isPathSegment(object)) {
          ctx.strokeStyle = s.edgeStroke_path;
          ctx.lineWidth = s.edgeWidth_path;
        } else {
          ctx.strokeStyle = s.edgeStroke_none;
          ctx.lineWidth = s.edgeWidth_none;
        }
      }
    } else if (object instanceof GraphNode) {
      if (isSelected(object)) {
        ctx.fillStyle = s.nodeFill_selected;
        ctx.strokeStyle = s.nodeStroke_selected;
        ctx.lineWidth = s.nodeWidth_selected;
      } else if (isPathSegment(object)) {
        ctx.fillStyle = s.nodeFill_path;
        ctx.strokeStyle = s.nodeStroke_path;
        ctx.lineWidth = s.nodeWidth_path;
      } else {
        ctx.fillStyle = s.nodeFill_none;
        ctx.strokeStyle = s.nodeStroke_none;
        ctx.lineWidth = s.nodeWidth_none;
      }
    } else if (object === null) {
      if (pseudoclass == BACKGROUND_PSEUDOCLASS) {
        ctx.fillStyle = s.backgroundFill;
      }
    }
  }
}
