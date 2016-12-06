var Cube3x3 = function() {
    this.dirty = [];

    this.initModel = function() {
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
        var add_vertex = function(x, y, z, isCell) {
            v.push(x); v.push(y); v.push(z);
            if (isCell) {
                c.push(colors[i][0]); c.push(colors[i][1]); c.push(colors[i][2]);
            } else {
                c.push(0); c.push(0); c.push(0);
            }
            v_count++;
        }
        var add_face = function(a, b, c) {
            f.push(a); f.push(b); f.push(c);
        }
        for (var i = 0; i < 6; i++) {
            generate_face(ms[i], v_count, add_vertex, add_face);
        }
        this.model = { vertex: v, faces: f, colors: c };
    }

    var generate_face = function(m, voff, vert, face) {
        var cellV = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
        var cellF = [0, 1, 2, 2, 1, 3];
        var cellScale = 0.95;
        // 3x3 cell grid
        for (var x = -1; x < 2; x++) {
            for (var y = -1; y < 2; y++) {
                for (var i = 0, l = cellV.length; i < l; i++) {
                    vert(3*m[0][0] + (2*x+cellScale*cellV[i][0])*m[1][0] + (2*y+cellScale*cellV[i][1])*m[2][0],
                         3*m[0][1] + (2*x+cellScale*cellV[i][0])*m[1][1] + (2*y+cellScale*cellV[i][1])*m[2][1],
                         3*m[0][2] + (2*x+cellScale*cellV[i][0])*m[1][2] + (2*y+cellScale*cellV[i][1])*m[2][2], true);
                }
                for (var i = 0, l = cellF.length; i < l; i+=3) {
                    face(voff + cellF[i], voff + cellF[i+1], voff + cellF[i+2]);
                }
                voff += cellV.length;
            }
        }
        // Cell edges/walls
        for (var i = 0, l = cellV.length; i < l; i++) {
            vert(2.99*m[0][0] + 3*cellV[i][0]*m[1][0] + 3*cellV[i][1]*m[2][0],
                 2.99*m[0][1] + 3*cellV[i][0]*m[1][1] + 3*cellV[i][1]*m[2][1],
                 2.99*m[0][2] + 3*cellV[i][0]*m[1][2] + 3*cellV[i][1]*m[2][2],
                 false);
        }
        for (var i = 0, l = cellF.length; i < l; i+=3) {
            face(voff + cellF[i], voff + cellF[i+1], voff + cellF[i+2]);
        }
    }

    this.getDirtyBit = function() {
        this.dirty.push(true);
        return this.dirty.length - 1;
    }

    this.markDirty = function() {
        for (var i = 0, l = this.dirty.length; i < l; i++) {
            this.dirty[i] = true;
        }
    }
};
