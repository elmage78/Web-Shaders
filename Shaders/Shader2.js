
let canvas = document.getElementById("space");
let gl = canvas.getContext("webgl");

const FragmentShaderSource = `
precision mediump float;
uniform float time;
uniform float Resx;
uniform float Resy;

void main(void)
{
    vec2 uv = gl_FragCoord.xy - vec2(Resx,Resy)/2.0;
    uv /= min(Resx,Resy) / 2.;

    float z = length(uv);
    z = sqrt(1. - z*z);

    vec3 sphere = vec3(uv, z);
    sphere *= smoothstep(0.001, 0.1, z);

    vec3 light1 = vec3(cos(time) * 1.5, 2.0, sin(time) * 1.5);
    light1 *= 1. / pow(distance(light1, sphere), 2.);
    vec3 light2 = vec3(sin(time*1.5) * 0.5, sin(time*0.3)*2.0, cos(time*0.5) * 1.5);
    light2 *= 1. / pow(distance(light2, sphere), 2.);

    float lighting = dot(sphere, light1);
    float lighting2 = dot(sphere, light2);

    gl_FragColor = vec4(length(sphere)*0.1);
    gl_FragColor += vec4(lighting*0.3+lighting2*0.5,lighting*0.7,lighting2*0.32,1.);
}
`;
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
    Canvas.width = 800*2;
    Canvas.height= 600*2;
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