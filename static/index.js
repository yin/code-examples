var main=function() {
  var canvas=document.getElementById("canvas");

  canvas.width=window.innerWidth-25;
  canvas.height=window.innerHeight-25;


  /*========================= GET WEBGL CONTEXT ========================= */
  var gl;
  try {
    gl = canvas.getContext("experimental-webgl", {antialias: false});
  } catch (e) {
    alert("You are not webgl compatible :(") ;
    return false;
  }

  /*========================= SHADERS ========================= */
  /*jshint multistr: true */
  var shader_vertex_source="\n\
attribute vec2 position;\n\
attribute vec3 color;\n\
\n\
varying vec3 vColor;\n\
void main(void) {\n\
gl_Position = vec4(position, 0., 1.);\n\
vColor=color;\n\
}";

  var shader_fragment_source="\n\
precision mediump float;\n\
\n\
\n\
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

  var _color = gl.getAttribLocation(shader_program, "color");
  var _position = gl.getAttribLocation(shader_program, "position");

  gl.enableVertexAttribArray(_color);
  gl.enableVertexAttribArray(_position);

  gl.useProgram(shader_program);




  /*========================= THE TRIANGLE ========================= */
  //POINTS :
  var triangle_vertex=[
    -1,-1, //first summit -> bottom left of the viewport
    0,0,1,
    1,-1, //bottom right of the viewport
    1,1,0,
    1,1  //top right of the viewport
    ,1,0,0
    ,1,1,1
  ];

  var TRIANGLE_VERTEX= gl.createBuffer ();
  gl.bindBuffer(gl.ARRAY_BUFFER, TRIANGLE_VERTEX);
  gl.bufferData(gl.ARRAY_BUFFER,
                new Float32Array(triangle_vertex),
    gl.STATIC_DRAW);

  //FACES :
  var triangle_faces = [0,1,2];

  var TRIANGLE_FACES= gl.createBuffer ();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, TRIANGLE_FACES);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
                new Uint16Array(triangle_faces),
    gl.STATIC_DRAW);



  /*========================= DRAWING ========================= */
  gl.clearColor(0.0, 0.0, 0.0, 0.0);

  var animate=function() {

    gl.viewport(0.0, 0.0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, TRIANGLE_VERTEX);
    gl.vertexAttribPointer(_position, 2, gl.FLOAT, false,4*(2+3),0) ;
    gl.vertexAttribPointer(_color, 3, gl.FLOAT, false,4*(2+3),2*4) ;

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, TRIANGLE_FACES);
    gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_SHORT, 0);
    gl.flush();

    window.requestAnimationFrame(animate);
  };

  animate();
};

