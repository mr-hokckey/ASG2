// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform float u_Size;
    uniform mat4 u_ModelMatrix;
    void main() {
        gl_Position = u_ModelMatrix * a_Position;
        gl_PointSize = u_Size;
    }`;

// Fragment shader program
var FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor;
    void main() {
        gl_FragColor = u_FragColor;
    }`;

// Global variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;
let u_ModelMatrix;

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// get the canvas and gl context
function setupWebGL() {
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    // enable depth test
    gl.enable(gl.DEPTH_TEST);
}

// compile the shader programs, attach the javascript variables to the GLSL variables
function connectVariablesToGLSL() {
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    // // Get the storage location of a_Position
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }

    // Get the storage location of u_Size
    u_Size = gl.getUniformLocation(gl.program, 'u_Size');
    if (!u_Size) {
        console.log('Failed to get the storage location of u_Size');
        return;
    }

    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log('Failed to get the storage location of u_ModelMatrix');
        return;
    }
}

let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 4;
let g_selectedType = POINT;
let g_selectedSegments = 10;

function addActionsForHtmlUI() {
    // Clear Canvas button
    document.getElementById("button_undo").onclick = function () { g_shapesList.pop(); renderAllShapes(); }
    document.getElementById("button_clearCanvas").onclick = function () { g_shapesList = []; renderAllShapes(); }


    // Shape buttons
    document.getElementById("button_squares").onclick = function () { g_selectedType = POINT; }
    document.getElementById("button_triangles").onclick = function () { g_selectedType = TRIANGLE; }
    document.getElementById("button_circles").onclick = function () { g_selectedType = CIRCLE; }

    // Slider Events
    document.getElementById("slider_red").addEventListener('mouseup', function () { g_selectedColor[0] = this.value / 100; });
    document.getElementById("slider_green").addEventListener('mouseup', function () { g_selectedColor[1] = this.value / 100; });
    document.getElementById("slider_blue").addEventListener('mouseup', function () { g_selectedColor[2] = this.value / 100; });

    document.getElementById("slider_size").addEventListener('mouseup', function () { g_selectedSize = this.value; });
    document.getElementById("slider_segments").addEventListener('mouseup', function () { g_selectedSegments = this.value; });
}

function main() {

    setupWebGL();

    connectVariablesToGLSL();

    addActionsForHtmlUI();

    // Register function (event handler) to be called on a mouse press
    canvas.onmousedown = click;
    // Held click only works when SHIFT is also held.
    canvas.onmousemove = function (ev) { if (ev.buttons && ev.shiftKey == 1) click(ev) };

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Render all shapes
    // gl.clear(gl.COLOR_BUFFER_BIT);
    renderAllShapes();
}

var g_shapesList = [];

function click(ev) {

    let [x, y] = convertCoordinatesEventToGL(ev);

    let point;

    if (g_selectedType == TRIANGLE) {
        point = new Triangle();
    } else if (g_selectedType == CIRCLE) {
        point = new Circle();
    } else {
        point = new Point();
    }

    point.position = [x, y];
    point.color = g_selectedColor.slice();
    point.size = g_selectedSize;
    if (g_selectedType == CIRCLE) {
        point.segments = g_selectedSegments;
    }
    g_shapesList.push(point);

    renderAllShapes();
}


function convertCoordinatesEventToGL(ev) {
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

    return ([x, y]);
}

function renderAllShapes() {
    // Clear <canvas>  AND clear the DEPTH_BUFFER
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Draw each shape in the list
    var len = g_shapesList.length;
    for (var i = 0; i < len; i++) {
        g_shapesList[i].render();
    }

    // Draw a test triangle
    drawTriangle3D( [-1.0,0.0,0.0, -0.5,-1.0,0.0, 0.0,0.0,0.0] );

    // Draw a cube
    var body = new Cube();
    body.color = [1.0,0.0,0.0,1.0];
    body.render();
}
