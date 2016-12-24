var math = require('mathjs');

const PAD = 25;
const X = 0, Y = 1;

/**
 * Wikipedia: In computational geometry, the Bowyer–Watson algorithm is
 * a method for computing the Delaunay triangulation of a finite set of points
 * in any number of dimensions. The algorithm can be also used to obtain a
 * Voronoi diagram of the points, which is the dual graph of the Delaunay triangulation.
 */
var BowyerWatson = function(points) {
	this.verts = points.slice(0);
	this.tris = listInit();
	this.num = points.length;
	this.computeSkeleton(points);
}

BowyerWatson.prototype = {};
BowyerWatson.prototype.triangulate = function() {
	this.triangulateUpTo(this.verts);
}
BowyerWatson.prototype.triangulateUpTo = function(num) {
	for (var i = 0; i < num; i++) {
		this.retriangulateForVertex(i);
	}
}

BowyerWatson.prototype.retriangulateForVertex = function(index) {
	this.markDirtyTriangles(index);
	this.fillDirty(index);
}

// Moves triangles, which will need t=retriangulation into `this.dirty` array
// That is every triangle, for which a given point `d` falls iside its circumcircle.
BowyerWatson.prototype.markDirtyTriangles = function(d) {
	this.dirty = [];
	var prev = this.tris;
	var cur = this.tris.next;
	for (; cur != null; cur = cur.next) {
		var tri = cur.data;
		var loc = locatePoint(this.verts, tri, d);

//		ctxGreen()
//		drawTriangle(this.verts, tri);

//		drawCircle(this.verts[tri[0]], this.verts[tri[1]], this.verts[tri[2]]);

		if (loc < 0) {
//			ctxRed();
//			drawTriangle(this.verts, tri);
			this.dirty.push(cur.data);
			listPop(prev);
		} else {
			prev = cur;
		}
	}
}

BowyerWatson.prototype.fillDirty = function(index) {
	var polygon = tracePolygon(this.dirty);
	for (var j = 0; j < polygon.length; j++) {
		var edge = polygon[j];
		listPush(this.tris, [index, edge[0], edge[1]]);
	}
	this.dirty = [];
}

BowyerWatson.prototype.computeSkeleton = function(points) {
	var box = boundingBox(points);
	var delta = [box.max[X]-box.min[X], box.max[Y]-box.min[Y]];
	this.verts.push([ box.min[X]-PAD, box.min[Y]-PAD ]);
	this.verts.push([ box.min[X]-PAD, box.max[Y]+PAD ]);
	this.verts.push([ box.max[X]+PAD, box.min[Y]-PAD ]);
	this.verts.push([ box.max[X]+PAD, box.max[Y]+PAD ]);
	listPush(this.tris, [this.num, this.num+1, this.num+2]);
	listPush(this.tris, [this.num+2, this.num+1, this.num+3]);
};


BowyerWatson.prototype.buildTriangles = function() {
	var triangles = [];
	for (var cur = this.tris.next; cur != null; prev= cur, cur = cur.next) {
		var tri = cur.data;
		if (tri[0] < this.num && tri[1] < this.num && tri[2] < this.num) {
			triangles.push(tri);
		}
	}
	return triangles;
}

BowyerWatson.prototype.buildDirtyTriangles = function() {
	var triangles = [];
	for (var i = 0; i < this.dirty.length; i++) {
		triangles.push(this.dirty[i]);
	}
	return triangles;
}

BowyerWatson.prototype.buildSkeletonTriangles = function() {
	var triangles = [];
	for (var cur = this.tris.next; cur != null; prev= cur, cur = cur.next) {
		var tri = cur.data;
		if (tri[0] >= this.num || tri[1] >= this.num || tri[2] >= this.num) {
			triangles.push(cur.data);
		}
	}
	return triangles;
}


// Merges triangles into a polygon - by removing duplicate edges.
function tracePolygon(tris) {
	var edges = listInit();
	var count = 0;
	function reduceEdge(edge) {
		if (polygonReduceEdge(edges, edge)) {
			count++;
			listPush(edges, edge);
		} else {
			count--;
		}
	}
	for (var i = 0; i < tris.length; i++) {
		var tri = tris[i];
		reduceEdge([tri[0], tri[1]]);
		reduceEdge([tri[1], tri[2]]);
		reduceEdge([tri[2], tri[0]]);
	}
	return listToArray(edges);
}

function reduceSharedEdges(edges) {
	var count = 0;
	for (var cur = edges.next; cur != null; cur = cur.next) {
	}
	return count;
}

function polygonReduceEdge(edges, edge) {
	var one = edge;
	var prev = edges;
	var cur = edges.next;
	for (; cur != edge && cur != null; prev = cur, cur = cur.next) {
		var other = cur.data;
		if (edgesEqual(one, other)) {
			listPop(prev);
			return false;
		}
	}
	return true;
}


function listInit() {
	var list = {next: null, data:null};
	return list;
}

function listPush(list, data) {
	list.next = {next:list.next, data:data};
}

function listPop(list, data) {
	if (list.next) {
		list.next = list.next.next;
	}
}

function listToArray(list) {
	var ary = [];
	for (var cur = list.next; cur != null; cur = cur.next) {
		ary.push(cur.data);
	}
	return ary;
}

// v - vertex positions
// tri - triangle
// d - point to locate insede/outside crcumcircle of triangle `tri`
function locatePoint(v, tri, d) {
	var a = tri[0], b = tri[1], c = tri[2]
	var m = [
		[v[a][X], v[a][Y], v[a][X]*v[a][X] + v[a][Y]*v[a][Y], 1],
		[v[b][X], v[b][Y], v[b][X]*v[b][X] + v[b][Y]*v[b][Y], 1],
		[v[c][X], v[c][Y], v[c][X]*v[c][X] + v[c][Y]*v[c][Y], 1],
		[v[d][X], v[d][Y], v[d][X]*v[d][X] + v[d][Y]*v[d][Y], 1],
	];
	var detM = math.det(m);
	return detM;
}



// assuming `mat` is an NxN matrix
// not used, replaced by math.js
function determinant(mat) {
	if (mat.length == 1) {
		return mat[0][0];
	} else if (mat.length = 2) {
		return mat[0][0]*mat[1][1] - mat[1][0]*mat[0][1];
	} else {
		var det = 0;
		for (var i = 0; i < mat.length; i++) {
			var z = (i % 2) * 2 - 1;
			var m = minorMatrix(mat, i);
			det = det + z*det(m);
		}
	}
	return det;
}

function minorMatrix(mat, col) {
	var minor = [];
	for (var i = 0; i < mat.length-1; i++) {
		var r = [];
		for (var j = 0; j < mat.length; j++) {
			if (j == col ) {
				j++;
			}
			r.push[mat[i][j]];
		}
		minor.push(r);
	}
	return minor;
}

function triangle(a, b, c) {
	return [[a, b], [b, c], [c, a]];
}

function edgesEqual(edge1, edge2) {
	return edge1[0] == edge2[0] && edge1[1] == edge2[1]
		|| edge1[0] == edge2[1] && edge1[1] == edge2[0];
}

function pointsEqual(p1, p2) {
	return p1[X] == p2[X] && p1[Y] == p2[Y];
}

function boundingBox(points) {
	var min = [ null, null ],
		max = [ null, null ];
	for (var i = 0; i < points.length; i++) {
		var p = points[i];
		if (min[X] == null || min[X] > p[X]) {
			min[X] = p[X]
		}
		if (min[Y] == null || min[Y] > p[Y]) {
			min[Y] = p[Y]
		}
		if (max[X] == null || max[X] < p[X]) {
			max[X] = p[X]
		}
		if (max[Y] == null || max[Y] < p[Y]) {
			max[Y] = p[Y]
		}
	}
	return { min:min, max:max };
}

var mymodule = {
	BowyerWatson: BowyerWatson,
	tracePolygon: tracePolygon,
	edgesEqual: edgesEqual
};
 
if( typeof exports !== 'undefined' ) {
	if( typeof module !== 'undefined' && module.exports ) {
		// nodejs
		exports = module.exports = mymodule
	}
	exports.bw = mymodule
} else {
	//browser
}	
