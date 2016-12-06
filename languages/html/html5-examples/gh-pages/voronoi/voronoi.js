var Voronoi = function(n, iterate, w, h, scr_w, scr_h) { 
  var scr_h2 = scr_h/2, scr_w2 = scr_w/2;
  this.w = w;
  this.h = h;
  this.scr_w = scr_w;
  this.scr_h = scr_h;
  this.points = [];
  this.dirty = [];
  this.cost = Voronoi.FastApproximateDistance && false || Voronoi.FastEuclidDistance;
 
  this.init = function() {
    this.points = [];
    for (var i = 0; i < n; i++) {
      var p = iterate(i);
      p[0] = (p[0]-.5) * w;
      p[1] = (p[1]-.5) * h;
      this.points.push(p)
    }
  }
  
  this.initModel = function() {
    var v = new Array();
    var c = new Array();
    var v_count;
    var add_vertex = function(x, y) {
      v.push(x); v.push(y); v.push(0);
    }
    var add_color = function(i) {
      var r = (i*23+5)%11*.09;
      var g = (i*19+7)%11*.09;
      var b = (i*17+9)%11*.09;
      c.push(r); c.push(g); c.push(b);
    }
    for (var y = -scr_h2; y < scr_h2; y++) {
      for (var x = -scr_w2; x < scr_w2; x++) {
        var p = this.nearest(x, y, this.cost);
        add_vertex(x, y);
        add_color(p[0]);
      }
    }
    this.model = { vertex: v, colors: c };
    this.markDirty(); 
  }

  this.nearest = function(x, y) {
    var cost = this.cost;
    var point = [x*1.0, y*1.0];
    var mini = -1, minc = -1;
    //TODO yin: Let a look-up strategy function decide how to iterate the set
    for (var i = 1, l = this.points.length; i < l; i++) {
      var p = this.points[i];
      var c = cost(point, p);
      if (mini < 0 || c < minc) {
        minc = c;
        mini = i;
      }
    }
    return [mini, minc];
  }
  
  this.getDirtyBit = function() {
    this.dirty.push(true);
    return this.dirty.length - 1;
  }
  
  this.markDirty = function() {
    for (var i = 0, l = this.dirty.length; i < l; i++) {
      this.dirty[i] = true;
    }
  }
}

Voronoi.Random2DGenerator = function(i) {
  return [Math.random(), Math.random()];
}

Voronoi.SpiralGenerator = function(i) {
  var a = i / 1.66;
  var b = i / 13.0;
  return [Math.sin(a) * b, Math.cos(a) * b];
}

Voronoi.FastEuclidDistance = function(a, b) {
  var dx = b[0]-a[0];
  var dy = b[1]-a[1];
  var d2 = dx*dx + dy*dy;
  return d2;
}
Voronoi.EuclidDistance = function(a, b) {
  var dx = b[0]-a[0];
  var dy = b[1]-a[1];
  var d2 = dx*dx + dy*dy;
  var d = Math.sqrt(d2);
  return d;
}
Voronoi.ManhattanDistance = function(a, b) {
  var dx = b[0]-a[0];
  var dy = b[1]-a[1];
  var d = Math.abs(dx) + Math.abs(dy);
  return d;
}
Voronoi.LargerCartesianDistance = function(a, b) {
  var dx = b[0]-a[0];
  var dy = b[1]-a[1];
  var d = Math.max(Math.abs(dx), Math.abs(dy));
  return d;
}
Voronoi.FastApproximateDistance = function(a, b) {
  // from http://www.flipcode.com/archives/Fast_Approximate_Distance_Functions.shtml
  var dx = Math.abs(b[0]-a[0]);
  var dy = Math.abs(b[1]-a[1]);
  var min, max;

  if (dx < dy) {
    min = dx;
    max = dy;
  } else {
    min = dy;
    max = dx;
  }

   // coefficients equivalent to ( 123/128 * max ) and ( 51/128 * min )
   return ((( max << 8 ) + ( max << 3 ) - ( max << 4 ) - ( max << 1 ) +
            ( min << 7 ) - ( min << 5 ) + ( min << 3 ) - ( min << 1 )) >> 8 );
}
