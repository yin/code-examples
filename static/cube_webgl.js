var CubeWebGL = function(canvas, cube) {
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
    
    var webgl = new WebGL(canvas);
    var gl = null;
    var matrix_proj, matrix_move, matrix_view;
    var vertexId, colorId, facesId;
    var _Pmatrix, _Vmatrix, _Mmatrix, _color, _position;
    var dirtyId = cube.getDirtyBit();

    this.init = function() {
        gl = webgl.initGL();
        // Camera
        matrix_proj = math.get_projection(40, canvas.width/canvas.height, 1, 100);
        matrix_move = math.get_I4();
        matrix_view = math.get_I4();
        math.translateZ(matrix_view, -16);
        // Render config
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clearColor(0.9, 0.9, 0.9, 1.0);
        gl.clearDepth(1.0);
        // Cube shaders
        var shader_vertex = webgl.getShader(shader_vertex_source, gl.VERTEX_SHADER);
        var shader_fragment = webgl.getShader(shader_fragment_source, gl.FRAGMENT_SHADER);
        var shader_program = gl.createProgram();
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
        gl.useProgram(shader_program);
        // Cube array buffers
        vertexId = gl.createBuffer();
        colorId = gl.createBuffer();
        facesId = gl.createBuffer();
    }

    var time_old = 0;
    this.animate = function(time) {
        var dt=time-time_old;
        time_old=time;
        math.rotateZ(matrix_move, (Math.sin(time/2000)*2*dt)*0.0003);
        math.rotateY(matrix_move, Math.sin(time/1900+1.8)*2*dt*0.0007);
        math.rotateX(matrix_move, Math.sin(time/1700+2.3)*2*dt*0.0005);
        draw();
        window.requestAnimationFrame(animate);
    }
    
    this.drag = function(dx, dy) {
        math.rotateY(matrix_move, dx);
        math.rotateX(matrix_move, dy);
    }

    this.draw_prepare_camera = function() {
        gl.viewport(0.0, 0.0, canvas.width, canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.uniformMatrix4fv(_Pmatrix, false, matrix_proj);
        gl.uniformMatrix4fv(_Vmatrix, false, matrix_view);
        gl.uniformMatrix4fv(_Mmatrix, false, matrix_move);
    }
    
    this.draw_prepare_cube = function() {
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexId);
        gl.bufferData(gl.ARRAY_BUFFER,
                      new Float32Array(cube.model.vertex), gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, colorId);
        gl.bufferData(gl.ARRAY_BUFFER,
                      new Float32Array(cube.model.colors), gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, facesId);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
                      new Uint16Array(cube.model.faces), gl.DYNAMIC_DRAW);
    }
    
    this.draw_cube = function() {
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexId);
        gl.vertexAttribPointer(_position, 3, gl.FLOAT, false,4*(3),0);
        gl.bindBuffer(gl.ARRAY_BUFFER, colorId);
        gl.vertexAttribPointer(_color, 3, gl.FLOAT, false,4*(3),0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, facesId);
        gl.drawElements(gl.TRIANGLES, cube.model.faces.length, gl.UNSIGNED_SHORT, 0);
        gl.flush();
    }
    
    this.draw = function() {
        this.draw_prepare_camera();
        if (cube.dirty[dirtyId]) {
            cube.dirty[dirtyId] = false;
            this.draw_prepare_cube();
        }
        this.draw_cube();
    }
};
