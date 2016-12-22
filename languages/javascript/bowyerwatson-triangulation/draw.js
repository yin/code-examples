
	function doClear() {
	    ctx.clearRect(0, 0, canvas.width, canvas.height);
	}

	function drawTriangles(verts, tris) {
	    for (var i = 0; i < tris.length; i++) {
	    	drawTriangle(verts, tris[i]);
	    }
	}

	function drawTriangle(verts, t) {
    	ctx.beginPath();

    	var p0 = verts[t[2]];
		ctx.moveTo(p0[X], p0[Y]);
		for (var j = 0; j < 3; j++) {
	    	p0 = verts[t[j]];
			ctx.lineTo(p0[X], p0[Y]);
		}
  		ctx.stroke();
	}

	function drawCircle(p0, p1, p2) {

		var x1 = p1[X]-p0[X];
		var y1 = p1[Y]-p0[Y];
		var x2 = p2[X]-p0[X];
		var y2 = p2[Y]-p0[Y];

		var z1 = x1*x1 + y1*y1;
        var z2 = x2*x2 + y2*y2;
        var d= 2 * (x1*y2 - x2*y1);

        var x = (z1*y2 - z2*y1) / d + p0[X];
        var y = (x1*z2 - x2*z1) / d + p0[Y];
		var r = math.distance([x, y], p0);

    	ctx.beginPath();
		ctx.arc(x, y, r, 0, 2 * Math.PI, true);
  		ctx.stroke();
  	}

	function drawPoint(p) {
    	ctx.beginPath();
		ctx.arc(p[X], p[Y], 4, 0, 2 * Math.PI, true);
  		ctx.stroke();
  	}

	function ctxRed() {
		ctx.strokeStyle = '#FF0000';
	}

	function ctxGreen() {
		ctx.strokeStyle = '#00FF00';
	}