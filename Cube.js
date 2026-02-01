class Cube {
    constructor() {
        this.type = 'cube';
        // this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        // this.size = 4.0;
        // this.segments = 10;
        this.matrix = new Matrix4();
    }

    render() {
        // var xy = this.position;
        var rgba = this.color;
        // var size = this.size;

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // // Pass the size of a point to u_Size variable
        // gl.uniform1f(u_Size, size);

        // // Draw
        // var d = size / 200.0;

        // let angleStep = 360 / this.segments;
        // for (var angle = 0; angle < 360; angle = angle + angleStep) {
        //     let centerPt = [xy[0], xy[1]];
        //     let angle1 = angle;
        //     let angle2 = angle + angleStep;
        //     let vec1 = [Math.cos(angle1 * Math.PI / 180) * d, Math.sin(angle1 * Math.PI / 180) * d];
        //     let vec2 = [Math.cos(angle2 * Math.PI / 180) * d, Math.sin(angle2 * Math.PI / 180) * d];
        //     let pt1 = [centerPt[0] + vec1[0], centerPt[1] + vec1[1]];
        //     let pt2 = [centerPt[0] + vec2[0], centerPt[1] + vec2[1]];

        //     drawTriangle([xy[0], xy[1], pt1[0], pt1[1], pt2[0], pt2[1]]);
        // }
        
        var M = new Matrix4();
        M.setTranslate(-0.5, -0.5, 0);
        M.rotate(30, 1, 0, 0);
        M.rotate(30, 0, 1, 0);
        // Draw
        drawCube(M);
    }
}

function drawCube(M) {
    gl.uniformMatrix4fv(u_ModelMatrix, false, M.elements);

    // Front and back
    drawTriangle3D( [0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0] );
    drawTriangle3D( [0.0,0.0,0.0, 1.0,1.0,0.0, 0.0,1.0,0.0] );

    drawTriangle3D( [0.0,0.0,1.0, 1.0,1.0,1.0, 1.0,0.0,1.0] );
    drawTriangle3D( [0.0,0.0,1.0, 1.0,1.0,1.0, 0.0,1.0,1.0] );

    // Top and bottom
    drawTriangle3D( [0.0,1.0,0.0, 1.0,1.0,1.0, 1.0,1.0,0.0] );
    drawTriangle3D( [0.0,1.0,0.0, 1.0,1.0,1.0, 0.0,1.0,1.0] );

    drawTriangle3D( [0.0,0.0,0.0, 1.0,0.0,1.0, 1.0,0.0,0.0] );
    drawTriangle3D( [0.0,0.0,0.0, 1.0,0.0,1.0, 0.0,0.0,1.0] );

    // Left and right
    drawTriangle3D( [0.0,0.0,0.0, 0.0,1.0,1.0, 0.0,0.0,1.0] );
    drawTriangle3D( [0.0,0.0,0.0, 0.0,1.0,1.0, 0.0,1.0,0.0] );

    drawTriangle3D( [1.0,0.0,0.0, 1.0,1.0,1.0, 1.0,0.0,1.0] );
    drawTriangle3D( [1.0,0.0,0.0, 1.0,1.0,1.0, 1.0,1.0,0.0] );
}