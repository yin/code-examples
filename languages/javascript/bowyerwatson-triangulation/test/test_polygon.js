var test = require('unit.js');
var bw = require('../bowyerwatson.js');

describe('BowyerWatson', function(){
	describe('polygon', function(){
		it('should find outer edges of all triangles', function(done) {
			var ary = bw.tracePolygon([[0,6,7],[0,7,5]])
			test.array(ary)
				.is([[5,0], [7,5], [6,7], [0,6]]);
		})
	})
});