var main = function($) {
  var canvas = document.getElementById('canvas');
  const N = 15;
  var generator = Voronoi.Random2DGenerator;
  const scr_scale = 2.5;
  var w = 100, h = 100;
  var scr_w = w*scr_scale, scr_h = h*scr_scale;

  var voronoi = new Voronoi(N, generator, w, h, scr_w, scr_h);
  voronoi.init();
  voronoi.initModel();

  var voronoigl = new VoronoiWebGL(canvas, voronoi);
  voronoigl.init();
 
  var lx, ly;
  var grabbed = undefined;
  var update = {x:0, y:0, pending: 0};
  var morphing = false;
  var grab = function(ev) {
    var sx = canvas.width / w;
    var sy = canvas.height / h;
    lx = ev.offsetX;
    ly = ev.offsetY;
    var x = lx / sx - w/2;
    var y = ly / sy - h/2;
    grabbed = voronoi.nearest(x, y)[0];

    $(this).mousemove(function(ev) {
      dx = (ev.offsetX - lx);
      dy = (ev.offsetY - ly);
      lx = ev.offsetX;
      ly = ev.offsetY;
      update.x += dx;
      update.y += dy;
      update.pending++;
    });
    updater(false);
  };
  var letgo = function() {
    $(this).unbind('mousemove');
    delete grabbed;
  };
  var morph = function(voronoi, delta) {
    var len = voronoi.points.length;
    var i = Math.floor(Math.random() * len);
    var dx = (Math.random() - .5) * delta;
    var dy = (Math.random() - .5) * delta;
    voronoi.points[i][0] += dx;
    voronoi.points[i][1] += dy;
    voronoi.markDirty();
  }
  
  var jcanvas = $('#canvas');
  jcanvas.mousedown(grab);
  jcanvas.mouseup(letgo);
  $('#morph').click(function() {
    morphing = !morphing;
    console.log(morphing);
    if (morphing) {
      updater(false);
    }
  });

  var updater = function(draw) {
    var updateAndDraw = function() {
      updater(true);
    }
    if (update.pending > 0) {
      voronoi.points[grabbed][0] += update.x;
      voronoi.points[grabbed][1] += update.y;
      voronoi.markDirty();
      update.x = update.y = update.pending = 0;
    }
    if (draw) {
      voronoigl.draw();
    }
    delete updater.timeout;
    if (grabbed >= 0) {
      updater.timeout = setTimeout(updateAndDraw, 15);
    } else if (morphing) {
      morph(voronoi, 6);
      updater.timeout = setTimeout(updateAndDraw, 6);
    }
    return updater.timeout;
  }
  updater(true);
}

