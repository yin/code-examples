var test = require('unit.js');
var bw = require('../bowyerwatson.js');

describe('BowyerWatson', function(){
	describe('polygon', function(){
		it('should find outer edges of all triangles', function() {
			var ary = bw.tracePolygon([[0,6,7],[0,7,5]])
			test.array(ary)
				.is([[5,0], [7,5], [6,7], [0,6]]);
		})
	})
	describe('edgesEqual', function(){
		it('should match same edges', function() {
			test.bool(bw.edgesEqual([0, 5], [0, 5])).isTrue();
		})
		it('should match reverse edges', function() {
			test.bool(bw.edgesEqual([0, 5], [5, 0])).isTrue();
		})
		it('should not match distinct', function() {
			test.bool(bw.edgesEqual([0, 5], [0, 6])).isFalse();
		})
	})
});