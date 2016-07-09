"use strict";
var TWO_PI = 2 * Math.PI;
var Render = (function () {
    function Render(settings) {
        this.settings = settings;
        this.debug = false;
    }
    Render.prototype.draw = function (model, ctx) {
        var _this = this;
        if (this.debug) {
            var a = model.nodes.length;
            console.log("draw() nodes:${a}");
        }
        // Misusing instance fields here
        this.model = model;
        ctx['imageSmoothingEnabled'] = true;
        this.clear();
        model.forNodes(function (node) {
            _this.drawNode(ctx, node);
        });
        model.adjacencyList.forAllEdges(function (edge) {
            _this.drawEdge(ctx, edge);
        });
    };
    Render.prototype.drawNode = function (ctx, node) {
        var pos = node.properties['position'];
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, this.settings.nodeRadius_none, 0, TWO_PI);
        ctx.closePath();
        this.applyStyle(ctx, node);
        ctx.fill();
        ctx.stroke();
    };
    Render.prototype.drawEdge = function (ctx, edge) {
        var start = this.getNode(edge.start).properties['position'];
        var end = this.getNode(edge.end).properties['position'];
        var delta = end.sub(start);
        //TODO yin: Test sqrt(Pitagoras) vs. Point.distanceTo() approach fo speed
        var distance = delta.length;
        var tangent = delta.div(distance);
        var scaledTangent = tangent.mult(this.settings.nodeRadius_none);
        var lineStart = start.add(scaledTangent);
        var lineEnd = end.sub(scaledTangent);
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
    };
    Render.prototype.drawArrow = function (ctx, edge, tangent, lineStart, lineEnd) {
        if (this.areArrowVisible) {
            //TODO yin: account for arrowWidth
            var arrowBase = tangent.mult(this.settings.arrowSize_none);
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
                var arrowBase = tangent.mult(-this.settings.arrowSize_none);
                this._drawRotatedLine(ctx, lineStart, arrowBase, angle);
                this._drawRotatedLine(ctx, lineStart, arrowBase, -angle);
                ctx.stroke();
            }
        }
    };
    Render.prototype._drawRotatedLine = function (ctx, center, base, angle) {
        var rotated = base.rotate(angle);
        var end = center.sub(rotated);
        ctx.moveTo(center.x, center.y);
        ctx.lineTo(end.x, end.y);
    };
    //TODO yin: Move to a separate class GRStyleManager
    Render.prototype.applyStyle = function (ctx, object, subStyle) {
        if (subStyle === void 0) { subStyle = null; }
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
    };
    Render.prototype.clear = function () {
        this.ctx.clearRect(0, 1, this.settings.width - 1, this.settings.height - 1);
    };
    Render.prototype.getNode = function (node) {
        return this.model.getNode(node);
    };
    Object.defineProperty(Render.prototype, "areArrowVisible", {
        get: function () {
            return this.settings.arrowSize_none > 0 /*|| this.arrowSize_selected > 0|| this.arrowSize_path > 0*/;
        },
        enumerable: true,
        configurable: true
    });
    ;
    return Render;
}());
exports.Render = Render;
//# sourceMappingURL=render.js.map