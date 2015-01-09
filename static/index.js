var main = function($) {
    var canvas;
    canvas = document.getElementById('canvas');
    var c = new Cube3x3();
    c.initModel();
    var cubegl = new CubeWebGL(canvas, c);
    cubegl.init();
    var sliding = false, lx, ly, dx, dy;
    var slide = function() {
        if(arguments.length > 0) {
            sliding = !!arguments[0];
        }
        if (sliding && (Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01)) {
            dx *= .995;
            dy *= .995;
            cubegl.drag(dx/2500, dy/2500);
            cubegl.draw();
            setTimeout(slide, 10);
        }
    };
    var grab = function(ev) {
        lx = ev.pageX;
        ly = ev.pageY;
        slide(false);
        $(this).mousemove(function(ev) {
            dx = ev.pageX - lx;
            dy = ev.pageY - ly;
            lx = ev.pageX;
            ly = ev.pageY;
            cubegl.drag(dx/250, dy/250);
            cubegl.draw();
        });
    };
    var letgo = function() {
        $(this).unbind('mousemove');
        slide(true);
    };
    canvas = $('#canvas');
    canvas.mousedown(grab);
    canvas.mouseup(letgo);
    canvas.mouseout(letgo);
    cubegl.draw();
}
