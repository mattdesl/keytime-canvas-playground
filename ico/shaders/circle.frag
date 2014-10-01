#ifdef GL_ES
precision mediump float;
#endif

varying vec4 v_color;
varying vec2 v_tex0;
uniform sampler2D texture0;
uniform vec4 tint;

void main() {
	float len = length(v_tex0 - 0.5);
	len = smoothstep(0.5, -0.2, len);

	gl_FragColor = v_color * tint * len;
}