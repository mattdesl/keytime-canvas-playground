attribute vec4 position;
attribute vec2 texcoord0;
attribute vec4 color;

uniform mat4 projection;
uniform mat4 view;
uniform mat4 model;
varying vec2 v_tex0;
varying vec4 v_color;

void main() {
   gl_Position = projection * view * model * position;
   v_tex0 = texcoord0;
   v_color = color;
   gl_PointSize = 1.0;
}
