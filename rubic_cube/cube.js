var Cube3x3 = function() {
    this.dirty = [];

    const STATE_STEADY = 1 << 0;
    const STATE_MOVE = 1 << 1;
    const STATE_TMPL = {
      var state = STATE_STEADY;
      var r_progress = 0.0;
      var r_move = null;
    };


    // The rubic cube:
    //              _
    //            _/ \_
    //           /  `  \_
    //          / `' `'  \
    //         /\ ' `' `/'\
    //         \ '\ ' `/\ ,|
    //         |\' '\ /',' |
    //         \ '\' | , |,|
    //         |\' '`|/' / /
    //         \ '\' | ','/
    //          \' |`| ' /
    //           `\' |/'/
    //             `.| /
    //                '

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
        var emit_vertex = function(x, y, z, isCell) {
            v.push(x); v.push(y); v.push(z);
            if (isCell) {
                c.push(colors[i][0]); c.push(colors[i][1]); c.push(colors[i][2]);
            } else {
                c.push(0); c.push(0); c.push(0);
            }
            v_count++;
        }
        var emit_face = function(a, b, c) {
            f.push(a); f.push(b); f.push(c);
        }
        for (var i = 0; i < 6; i++) {
            generate_face(face_matrices[i], v_count, emit_vertex, emit_face);
        }
        this.model = { vertex: v, faces: f, colors: c, state: {} };
    }

    var generate_face = function(face_matrix, voff, emit_vertex, face) {
        var cellV = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
        var cellF = [0, 1, 2, 2, 1, 3];
        var cellScale = 0.95;
        // 3x3 cell grid
        for (var x = -1; x < 2; x++) {
            for (var y = -1; y < 2; y++) {
                for (var i = 0, l = cellV.length; i < l; i++) {
                    emit_vertex(3*face_matrix[0][0]
                                + (2*x+cellScale*cellV[i][0])*face_matrix[1][0]
                                + (2*y+cellScale*cellV[i][1])*face_matrix[2][0],
                         3*face_matrix[0][1]
                                + (2*x+cellScale*cellV[i][0])*face_matrix[1][1]
                                + (2*y+cellScale*cellV[i][1])*face_matrix[2][1],
                         3*face_matrix[0][2]
                                + (2*x+cellScale*cellV[i][0])*face_matrix[1][2]
                                + (2*y+cellScale*cellV[i][1])*face_matrix[2][2],
                          true);
                }
                for (var i = 0, l = cellF.length; i < l; i+=3) {
                    emit_face(offset + cellF[i], offset + cellF[i+1], offset + cellF[i+2]);
                }
                offset += cellV.length;
            }
        }
        // Cell edges/walls
        for (var i = 0, l = cellV.length; i < l; i++) {
            // TODO yin: If in move, emit vertices/faces for rotated cells
            emit_vertex(2.99*face_matrix[0][0]
                        + 3*cellV[i][0]*face_matrix[1][0]
                        + 3*cellV[i][1]*face_matrix[2][0],
                 2.99*face_matrix[0][1]
                        + 3*cellV[i][0]*face_matrix[1][1]
                        + 3*cellV[i][1]*face_matrix[2][1],
                 2.99*face_matrix[0][2]
                        + 3*cellV[i][0]*face_matrix[1][2]
                        + 3*cellV[i][1]*face_matrix[2][2],
                 false);
        }
        for (var i = 0, l = cellF.length; i < l; i+=3) {
            emit_face(offset + cellF[i], offset + cellF[i+1], offset + cellF[i+2]);
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
