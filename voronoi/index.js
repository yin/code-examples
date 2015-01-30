var main = function($) {
  const N = 100
  var canvas = document.getElementById('canvas');
  var voronoi = new Voronoi(N, Voronoi.random2D, 200, 200);
  voronoi.init()
  console.log(voronoi.model.vertex.length)
  var voronoigl = new VoronoiWebGL(canvas, voronoi);
  voronoigl.init();
  voronoigl.animate();
}
