var main = function($) {
    var canvas;
    canvas = document.getElementById('canvas');
    var c = cube(canvas);
    var lx, ly, dx, dy;
    var slide = function() {
        if (dx>0.01||dy>0.01) {
            dx *= .995;
            dy *= .995;
            c.drag(dx/2500, dy/2500);
            c.draw();
        }
        setTimeout(slide, 10);
    };
    var letgo = function() {
        $(this).unbind('mousemove');
        slide();
    };
    canvas = $('#canvas');
    canvas.mousedown(function(ev) {
        lx = ev.pageX;
        ly = ev.pageY;
        $(this).mousemove(function(ev) {
            dx = ev.pageX - lx;
            dy = ev.pageY - ly;
            lx = ev.pageX;
            ly = ev.pageY;
            c.drag(dx/250, dy/250);
            c.draw();
        });
    });
    canvas.mouseup(letgo);
    canvas.mouseout(letgo);
    c.draw();
}
