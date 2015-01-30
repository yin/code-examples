var VoronoiWebGL = function(canvas, voronoi) {
  /*jshint multistr: true */
  var shader_vertex_source="\n\
attribute vec3 position;\n\
uniform mat4 Pmatrix;\n\
uniform mat4 Vmatrix;\n\
uniform mat4 Mmatrix;\n\
attribute vec3 color; //the color of the point\n\
varying vec3 vColor;\n\
void main(void) { //pre-built function\n\
gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);\n\
gl_PointSize = 1.0;\n\
vColor=color;\n\
}";
  var shader_fragment_source="\n\
precision mediump float;\n\
varying vec3 vColor;\n\
void main(void) {\n\
gl_FragColor = vec4(vColor, 1.);\n\
}";
  
  var webgl = new WebGL(canvas);
  var gl = null;
  var matrix_proj, matrix_move, matrix_view;
  var vertexId, colorId, facesId;
  var shader_program;
  var _Pmatrix, _Vmatrix, _Mmatrix, _color, _position;
  var dirtyId = voronoi.getDirtyBit();

  this.init = function() {
    var cw = canvas.width = voronoi.scr_w;
    var ch = canvas.height = voronoi.scr_h;
    canvas.style['position'] = 'absolute';
    canvas.style.left = (window.innerWidth - cw - 25) / 2 + 'px';
    canvas.style.top = (window.innerHeight - ch - 25) / 2 + 'px';
    
    gl = webgl.initGL();
    // Orthogonal camera projection
    matrix_proj = math.get_ortho(-cw/2, cw/2, ch/2, -ch/2, .5, 10.0);
    matrix_move = math.get_I4();
    matrix_view = math.get_I4();
    math.translateZ(matrix_view, -1.0);
    // Render config
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clearColor(0.9, 0.9, 0.9, 1.0);
    gl.clearDepth(1.0);
    // Shaders
    var shader_vertex = webgl.getShader(shader_vertex_source, gl.VERTEX_SHADER);
    var shader_fragment = webgl.getShader(shader_fragment_source, gl.FRAGMENT_SHADER);
    shader_program = gl.createProgram();
    gl.attachShader(shader_program, shader_vertex);
    gl.attachShader(shader_program, shader_fragment);
    gl.linkProgram(shader_program);
    _Pmatrix = gl.getUniformLocation(shader_program, "Pmatrix");
    _Vmatrix = gl.getUniformLocation(shader_program, "Vmatrix");
    _Mmatrix = gl.getUniformLocation(shader_program, "Mmatrix");
    _color = gl.getAttribLocation(shader_program, "color");
    _position = gl.getAttribLocation(shader_program, "position");
    gl.enableVertexAttribArray(_color);
    gl.enableVertexAttribArray(_position);
    // Voronoi array buffers
    vertexId = gl.createBuffer();
    colorId = gl.createBuffer();
  }

  var self = this;
  this.animate = function(speed) {
    voronoi.morph(speed);
    this.draw();
    setTimeout(this.animate.bind(self), 10);
  }
  
  this.drag = function(dx, dy) {
    // no dragging
  }

  this.draw_prepare_camera = function() {
    gl.viewport(0.0, 0.0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // NOTE: useProgram() must go before setting up the camera.
    // Camera management must cooperate with the shader
    gl.useProgram(shader_program);
    gl.uniformMatrix4fv(_Pmatrix, false, matrix_proj);
    gl.uniformMatrix4fv(_Vmatrix, false, matrix_view);
    gl.uniformMatrix4fv(_Mmatrix, false, matrix_move);
  }
  
  this.draw_prepare_voronoi = function() {
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexId);
    gl.bufferData(gl.ARRAY_BUFFER,
                  new Float32Array(voronoi.model.vertex), gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorId);
    gl.bufferData(gl.ARRAY_BUFFER,
                  new Float32Array(voronoi.model.colors), gl.DYNAMIC_DRAW);
  }
  
  this.draw_voronoi = function(gl) {
    voronoi.initModel();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexId);
    gl.vertexAttribPointer(_position, 3, gl.FLOAT, false,4*(3),0);
    gl.enableVertexAttribArray(_position);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorId);
    gl.vertexAttribPointer(_color, 3, gl.FLOAT, false,4*(3),0);
    gl.enableVertexAttribArray(_color);

    var n = voronoi.model.vertex.length / 3;
    gl.drawArrays(gl.POINTS, 0, n);
    gl.flush();
  }
      
  this.draw = function() {
    this.draw_prepare_camera();
    if (voronoi.dirty[dirtyId]) {
      voronoi.dirty[dirtyId] = false;
      voronoi.initModel();
      this.draw_prepare_voronoi();
    }
    this.draw_voronoi(gl);
  }
};
