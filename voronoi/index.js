var main = function($) {
  const N = 25
  var canvas = document.getElementById('canvas');
  var w = 100, h = 100;
  var voronoi = new Voronoi(N, Voronoi.random2D, w, h, w*2, h*2);
  voronoi.init()
  voronoi.initModel()
  var voronoigl = new VoronoiWebGL(canvas, voronoi);
  voronoigl.init();
 
  var lx, ly;
  var grabbed = -1;
  var grab = function(ev) {
    var sx = canvas.width / w;
    var sy = canvas.height / h;
    lx = ev.offsetX;
    ly = ev.offsetY;
    var x = (lx - (canvas.width/2)) / sx;
    var y = (ly - (canvas.height/2)) / sy;
    grabbed = voronoi.nearest(x, y)[0];

    $(this).mousemove(function(ev) {
      dx = (ev.offsetX - lx);
      dy = (ev.offsetY - ly);
      lx = ev.offsetX;
      ly = ev.offsetY;
      voronoi.points[grabbed][0] += dx;
      voronoi.points[grabbed][1] += dy;
      voronoi.markDirty();
      voronoigl.draw();
    });
  };
  var letgo = function() {
    $(this).unbind('mousemove');
  };
  voronoigl.draw();
  var jcanvas = $('#canvas');
  jcanvas.mousedown(grab);
  jcanvas.mouseup(letgo);
}

