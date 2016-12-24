var bw = require('bowyerwatson.js')
var draw = require('draw.js')

var ts;
var canvas;
var ctx;
function randomXY(offx, offy, x, y){
	return [ Math.random()*x+offx, Math.random()*y+offy ];
}
/*
var p = [
	];
for (var i = 0; i < 2500; i++) {
	p.push(randomXY(30, 30, 580, 420));
}
setInterval(doStep, 5);
/*/
//*/
var d = 2;
p[538][0] -=d;
p[538][1] -=d;
p[539][0] -=d;
p[539][1] -=d;
var start = 536;
	function onInit() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(5.0, 5.0);
    ctx.translate(-410, -150);

    ts = new bw.BowyerWatson(p);
    ts.triangulateUpTo(start);
	ctx.strokeStyle = '#0000FF';
	ctx.globalAplha = 0.1;
	drawTriangles(ts.verts, ts.buildSkeletonTriangles());
}
var actions = [
	function(cycle, p, ts, ctx) {
		drawPoint(p[cycle]);
		ts.markDirtyTriangles(cycle);
		ctx.strokeStyle = '#0000FF';
		ctx.globalAlpha = 0.05;
		drawTriangles(ts.verts, ts.buildSkeletonTriangles());
		ctx.strokeStyle = '#000000';
		ctx.globalAlpha = 0.5;
		drawTriangles(ts.verts, ts.buildTriangles());
		ctx.strokeStyle = '#FF0000';
		ctx.globalAlpha = 0.5;
		drawTriangles(ts.verts, ts.buildDirtyTriangles());
		drawPoint(p[cycle]);
	},
	function(cycle, p, ts, ctx) {
		ctx.strokeStyle = '#0000FF';
		ctx.globalAlpha = 0.05;
		drawTriangles(ts.verts, ts.buildSkeletonTriangles());
		ctx.strokeStyle = '#000000';
		ctx.globalAlpha = 0.5;
		drawTriangles(ts.verts, ts.buildTriangles());
		drawPoint(p[cycle]);
	},
	function(cycle, p, ts, ctx) {
		ts.fillDirty(cycle);
		ctx.strokeStyle = '#0000FF';
		ctx.globalAlpha = 0.05;
		drawTriangles(ts.verts, ts.buildSkeletonTriangles());
		ctx.strokeStyle = '#000000';
		ctx.globalAlpha = 0.5;
		drawTriangles(ts.verts, ts.buildTriangles());
		drawPoint(p[cycle]);
	},
];

var maxCycles = p.length
var step = start*actions.length;
function doStep() {
	var cycle = Math.floor(step / actions.length);
	var actionNum = step % actions.length;
	if (cycle < maxCycles) {
		console.log("cycle:" + cycle + " action:" + actionNum);
		doClear();
	    actions[actionNum](cycle, p, ts, ctx);
		step++;
	}
}
