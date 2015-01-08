var main=function() {
    var canvas=document.getElementById("canvas");
    canvas.width=window.innerWidth - 25;
    canvas.height=window.innerHeight - 25;

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

    var generate_cube = function() {
        var v = new Array();
        var f = new Array();
        var c = new Array();
        var v_count = 0;
        var ms = [
            // F/B
            [[ 0, 0, -1],[ 1, 0, 0],[0, 1,0]],
            [[ 0, 0 , 1],[-1, 0, 0],[0,-1,0]],
            // U/D
            [[ 0,-1, 0],[ 1, 0, 0],[0, 0,-1]],
            [[ 0, 1, 0],[-1, 0, 0],[0, 0, 1]],
            // R/L
            [[-1, 0, 0],[ 0, 0, 1],[0,-1, 0]],
            [[ 1, 0, 0],[ 0, 0,-1],[0, 1, 0]],
        ];
        var colors = [ [1.0, 1.0, 1.0], [1.0, 1.0, 0.0],
                       [0.0, 1.0, 0.0], [0.0, 0.0, 1.0],
                       [1.0, 0.0, 0.0], [1.0, 0.5, 0.0]
                     ];
        for (var i = 0; i < 6; i++) {
            generate_face(ms[i], v_count,
                          function(x, y, z, a, b) {
                              v.push(x); v.push(y); v.push(z);
                              c.push(colors[i][0]); c.push(colors[i][1]); c.push(colors[i][2]);
                              v_count++;
                          },
                          function(a, b, c) {
                              f.push(a); f.push(b); f.push(c);
                          });
        }
        return { vertex: v, faces: f, colors: c };
    }

    var generate_face = function(m, voff, vert, face) {
        var cellV = [[-0.9, -0.9], [0.9, -0.9], [-0.9, 0.9], [0.9, 0.9]];
        var cellF = [0, 1, 2, 2, 1, 3];
        for (var x = -1; x < 2; x++) {
            for (var y = -1; y < 2; y++) {
                for (var i = 0, l = cellV.length; i < l; i++) {
                    vert(3*m[0][0] + (2*x+cellV[i][0])*m[1][0] + (2*y+cellV[i][1])*m[2][0],
                         3*m[0][1] + (2*x+cellV[i][0])*m[1][1] + (2*y+cellV[i][1])*m[2][1],
                         3*m[0][2] + (2*x+cellV[i][0])*m[1][2] + (2*y+cellV[i][1])*m[2][2], x, y);
                }
                for (var i = 0, l = cellF.length; i < l; i+=3) {
                    face(voff + cellF[i], voff + cellF[i+1], voff + cellF[i+2]);
                }
                voff+=cellV.length;
            }
        }
    };

    var cube = generate_cube();
    console.log(cube);
    
    cube.vertexId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cube.vertexId);
    gl.bufferData(gl.ARRAY_BUFFER,
                  new Float32Array(cube.vertex), gl.STATIC_DRAW);

    cube.colorId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cube.colorId);
    gl.bufferData(gl.ARRAY_BUFFER,
                  new Float32Array(cube.colors), gl.STATIC_DRAW);

    cube.facesId = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cube.facesId);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
                  new Uint16Array(cube.faces), gl.STATIC_DRAW);

    /*========================= MATRIX ========================= */

    var PROJMATRIX=math.get_projection(40, canvas.width/canvas.height, 1, 100);
    var MOVEMATRIX=math.get_I4();
    var VIEWMATRIX=math.get_I4();

    math.translateZ(VIEWMATRIX, -16);

    /*========================= DRAWING ========================= */
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clearColor(0.9, 0.9, 0.9, 1.0);
    gl.clearDepth(1.0);

    var time_old=0;
    var animate=function(time) {
        var dt=time-time_old;
        math.rotateZ(MOVEMATRIX, (Math.sin(time/2000)*2*dt)*0.0003);
        math.rotateY(MOVEMATRIX, Math.sin(time/1900+1.8)*2*dt*0.0007);
        math.rotateX(MOVEMATRIX, Math.sin(time/1700+2.3)*2*dt*0.0005);
        time_old=time;

        gl.viewport(0.0, 0.0, canvas.width, canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.uniformMatrix4fv(_Pmatrix, false, PROJMATRIX);
        gl.uniformMatrix4fv(_Vmatrix, false, VIEWMATRIX);
        gl.uniformMatrix4fv(_Mmatrix, false, MOVEMATRIX);
        gl.bindBuffer(gl.ARRAY_BUFFER, cube.vertexId);
        gl.vertexAttribPointer(_position, 3, gl.FLOAT, false,4*(3),0);
        gl.bindBuffer(gl.ARRAY_BUFFER, cube.colorId);
        gl.vertexAttribPointer(_color, 3, gl.FLOAT, false,4*(3),0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cube.facesId);

        gl.drawElements(gl.TRIANGLES, cube.faces.length, gl.UNSIGNED_SHORT, 0);

        gl.flush();

        window.requestAnimationFrame(animate);
    };
    animate(0);
};
