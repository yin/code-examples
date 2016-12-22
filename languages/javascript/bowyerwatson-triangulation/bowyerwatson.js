// Wikipedia: In computational geometry, the Bowyer–Watson algorithm is
// a method for computing the Delaunay triangulation of a finite set of points
// in any number of dimensions. The algorithm can be also used to obtain a
// Voronoi diagram of the points, which is the dual graph of the Delaunay triangulation.
//

const PAD = 25;

var BowyerWatson = function(points) {
	this.verts = points.slice(0);
	this.tris = listInit();
	this.num = points.length;
	this.computeSkeleton(points);
}

BowyerWatson.prototype = {};
BowyerWatson.prototype.triangulate = function(points) {
	if (points.length < 3) {
		return [];
	}
	for (var i = 0; i < points.length; i++) {
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
		if (loc < 0) {
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
	var delta = { x:box.max.x-box.min.x , y:box.max.y-box.min.y };
	this.verts.push({ x:box.min.x-PAD, y:box.min.y-PAD });
	this.verts.push({ x:box.min.x-PAD, y:box.max.y+PAD });
	this.verts.push({ x:box.max.x+PAD, y:box.min.y-PAD });
	this.verts.push({ x:box.max.x+PAD, y:box.max.y+PAD });
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
		[v[a].x, v[a].y, v[a].x*v[a].x + v[a].y*v[a].y, 1],
		[v[b].x, v[b].y, v[b].x*v[b].x + v[b].y*v[b].y, 1],
		[v[c].x, v[c].y, v[c].x*v[c].x + v[c].y*v[c].y, 1],
		[v[d].x, v[d].y, v[d].x*v[d].x + v[d].y*v[d].y, 1],
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
	return p1.x == p2.x && p1.y == p2.y;
}

function boundingBox(points) {
	var min = { x:null, y:null },
		max = { x:null, y:null };
	for (var i = 0; i < points.length; i++) {
		var p = points[i];
		if (min.x == null || min.x > p.x) {
			min.x = p.x
		}
		if (min.y == null || min.y > p.y) {
			min.y = p.y
		}
		if (max.x == null || max.x < p.x) {
			max.x = p.x
		}
		if (max.y == null || max.y < p.y) {
			max.y = p.y
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
