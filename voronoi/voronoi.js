var Voronoi = function(n, iterate, w, h) {
  w = w * 1.0;
  h = h * 1.0;
  this.points = [];
  this.dirty = [];
 
  this.init = function() {
    var h2 = h/2, w2 = w/2;
    this.points = [];
    for (var i = 0; i < n; i++) {
      this.points.push(iterate(i, w, h))
    }
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
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var p = this.nearest(x, y);
        add_vertex(2*x/w-1, 2*y/h-1);
        add_color(p[0]);
      }
    }
    this.model = { vertex: v, colors: c };
    this.markDirty(); 
  }

  this.morph = function() {
    var len = this.points.length;
    var i = Math.floor(Math.random() * len);
    var dx = Math.random() * 10 - 5;
    var dy = Math.random() * 10 - 5;
    this.points[i][0] += dx;
    this.points[i][1] += dy;

    this.markDirty();
  }
  
  this.nearest = function(x, y) {
    var cost = function(a, b) {
      var dx = b[0]-a[0];
      var dy = b[1]-a[1];
      var d2 = dx*dx + dy*dy;
      var d = Math.sqrt(d2);
      return d;
    }
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

Voronoi.random2D = function(i, w, h) {
  return [Math.random()*w, Math.random()*h];
}

