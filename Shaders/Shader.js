
let canvas = document.getElementById("space");
let gl = canvas.getContext("webgl");

const FragmentShaderSource = `
precision mediump float;
uniform float time;
uniform float Resx;
uniform float Resy;

void main(void) {
    vec2 u = gl_FragCoord.xy / vec2(Resx,Resy) * 2.0 - 1.0;
    u.x *= Resx / Resy;
    
    for (int i = 0; i < 20; i++) {
        vec2 pos = vec2(cos(time * 0.5 + float(i) * 0.3) * 0.5, sin(time * 0.3 + float(i) * 0.7) * 0.5);
        float radius = 0.1 + sin(time + float(i)) * 0.1;
        vec3 color = vec3(sin(float(i) * 0.2 + time * 0.5) * 0.5 + 0.5, sin(float(i) * 0.3 + time * 0.6) * 0.5 + 0.5, sin(float(i) * 0.4 + time * 0.7) * 0.5 + 0.5);
        float dist = length(u - pos);
        gl_FragColor += vec4(color, 1.0) * smoothstep(radius, radius * 0.9, dist);
    }
}`;
const vertexShaderSource = `
attribute vec4 aVertexPosition;

void main(void) {
   gl_Position = vec4(aVertexPosition.xy,0.0,1.0);
}
`;

let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
let FragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FragmentShaderSource);
let program = createProgram(gl, vertexShader,FragmentShader);

//define shader variables
const timeLocation = gl.getUniformLocation(program, "time");
const ResolutionX = gl.getUniformLocation(program, "Resx");
const ResolutionY = gl.getUniformLocation(program, "Resy");

// Define the full-screen quad vertices
const vertices = new Float32Array([
    -1, -1,
    -1, 1,
    1, 1,
    1, 1,
    1, -1,
    -1, -1,
]);

const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

// Transfer vertex data to the buffer object
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

// Get the attribute location and enable it
const positionAttributeLocation = gl.getAttribLocation(program, 'aVertexPosition');
gl.enableVertexAttribArray(positionAttributeLocation);

function render(time) {
    resizeCanvas(gl, canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)
  
    gl.uniform1f(timeLocation, time * 0.001);
    gl.uniform1f(ResolutionX, canvas.width);
    gl.uniform1f(ResolutionY, canvas.height);
    // // draw  
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 6;
    gl.drawArrays(primitiveType, offset, count);
    
    requestAnimationFrame(render);
}
requestAnimationFrame(render);

function resizeCanvas(gl,Canvas) {
    Canvas.width = 800;
    Canvas.height= 600;
}

function createProgram(gl, vs, fs) {
const p = gl.createProgram();
gl.attachShader(p, vs);
gl.attachShader(p, fs);
gl.linkProgram(p);
// should check for error here!
return p;
}

function createShader(gl, type, src) {
const s = gl.createShader(type);
gl.shaderSource(s, src);
gl.compileShader(s);
// should check for error here
return s;
}

/*
// Clear the canvas with a transparent color
gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);

// Draw the full-screen quad
const numVertices = 4;
gl.drawArrays(gl.TRIANGLE_STRIP, 0, numVertices);*/