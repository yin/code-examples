var main=function() {
  var canvas=document.getElementById("canvas");
  canvas.width=window.innerWidth;
  canvas.height=window.innerHeight;

  /*========================= GET WEBGL CONTEXT ========================= */
  var gl;
  try {
    gl = canvas.getContext("experimental-webgl", {antialias: true});
  } catch (e) {
    alert("You are not webgl compatible :(") ;
    return false;
  }

  /*========================= SHADERS ========================= */
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
vColor=color;\n\
}";

  var shader_fragment_source="\n\
precision mediump float;\n\
varying vec3 vColor;\n\
void main(void) {\n\
gl_FragColor = vec4(vColor, 1.);\n\
}";

  var get_shader=function(source, type, typeString) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert("ERROR IN "+typeString+ " SHADER : " + gl.getShaderInfoLog(shader));
      return false;
    }
    return shader;
  };

  var shader_vertex=get_shader(shader_vertex_source, gl.VERTEX_SHADER, "VERTEX");
  var shader_fragment=get_shader(shader_fragment_source, gl.FRAGMENT_SHADER, "FRAGMENT");

  var shader_program=gl.createProgram();
  gl.attachShader(shader_program, shader_vertex);
  gl.attachShader(shader_program, shader_fragment);

  gl.linkProgram(shader_program);

  var _Pmatrix = gl.getUniformLocation(shader_program, "Pmatrix");
  var _Vmatrix = gl.getUniformLocation(shader_program, "Vmatrix");
  var _Mmatrix = gl.getUniformLocation(shader_program, "Mmatrix");

  var _color = gl.getAttribLocation(shader_program, "color");
  var _position = gl.getAttribLocation(shader_program, "position");

  gl.enableVertexAttribArray(_color);
  gl.enableVertexAttribArray(_position);

  gl.useProgram(shader_program);

  /*========================= THE CUBE ========================= */
  //POINTS :
  var cube_vertex=[
    -1,-1,0,
    0,0,1,
    1,-1,0,
    1,1,0,
    1,1,0,
    1,0,0
  ];

  var CUBE_VERTEX= gl.createBuffer ();
  gl.bindBuffer(gl.ARRAY_BUFFER, CUBE_VERTEX);
  gl.bufferData(gl.ARRAY_BUFFER,
                new Float32Array(cube_vertex),
    gl.STATIC_DRAW);

  //FACES :
  var cube_faces = [
    0,1,2
  ];
  var CUBE_FACES= gl.createBuffer ();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, CUBE_FACES);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
                new Uint16Array(cube_faces),
    gl.STATIC_DRAW);

  /*========================= MATRIX ========================= */

  var PROJMATRIX=math.get_projection(40, canvas.width/canvas.height, 1, 100);
  var MOVEMATRIX=math.get_I4();
  var VIEWMATRIX=math.get_I4();



  math.translateZ(VIEWMATRIX, -6);

  /*========================= DRAWING ========================= */
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clearColor(0.0, 0.0, 0.0, 0.0);
  gl.clearDepth(1.0);

  var time_old=0;
  var animate=function(time) {
    var dt=time-time_old;
    math.rotateZ(MOVEMATRIX, dt*0.001);
    math.rotateY(MOVEMATRIX, dt*0.002);
    math.rotateX(MOVEMATRIX, dt*0.003);
    time_old=time;

    gl.viewport(0.0, 0.0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniformMatrix4fv(_Pmatrix, false, PROJMATRIX);
    gl.uniformMatrix4fv(_Vmatrix, false, VIEWMATRIX);
    gl.uniformMatrix4fv(_Mmatrix, false, MOVEMATRIX);
    gl.bindBuffer(gl.ARRAY_BUFFER, CUBE_VERTEX);
    gl.vertexAttribPointer(_position, 3, gl.FLOAT, false,4*(3+3),0);
    gl.vertexAttribPointer(_color, 3, gl.FLOAT, false,4*(3+3),3*4);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, CUBE_FACES);
    gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_SHORT, 0);

    gl.flush();

    window.requestAnimationFrame(animate);
  };
  animate(0);
};
