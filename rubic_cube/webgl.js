var WebGL = function(canvas) {
    var gl = null;
    this.canvas = canvas;

    var assertGL = function() {
        if (!gl) {
            throw "WebGL not initialized for canvas";
        }
    }

    var shaderName = function(type) {
        switch(type) {
        case gl.VERTEX_SHADER:
            return "vertex";
        case gl.FRAGMENT_SHADER:
            return "fragment";
        }
    }
    
    this.initGL = function() {
        try {
            gl = canvas.getContext("experimental-webgl", {antialias: true});
        } catch (e) {
            throw "You are not webgl compatible :(\n" + e;
        }
        canvas.width = window.innerWidth - 25;
        canvas.height = window.innerHeight - 25;
        return gl;
    }
    
    this.getShader = function(source, type) {
        assertGL();
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw "Error in " + shaderName(type) + " shader: " + gl.getShaderInfoLog(shader);
        }
        return shader;
    };
};      
