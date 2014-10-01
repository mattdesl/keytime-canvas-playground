require('canvas-testbed')(render, start, { context: 'webgl' })

var Vignette = require('gl-vignette-background')
var Sphere = require('./spinning-sphere')
var Particles = require('./particles')

var bg, sphere, particles
var time = 0

function render(gl, width, height, dt) {
    time += dt
	gl.clear(gl.COLOR_BUFFER_BIT)
	gl.clearColor(0,0,0,1)
	
	bg.draw()
    particles.draw(width, height, dt)

    sphere.draw(width, height, dt)
}

function start(gl, width, height) {
	var radius = Math.max(width, height) * 0.5
	bg = Vignette(gl, {
        scale: [ 1/width * radius, 1/height * radius],
        aspect: 1,
        color2: [0, 0, 0],
        color1: [30/255, 46/255, 58/255],
        smoothing: [ -0.5, 1.0 ],
        noiseAlpha: 0.2,
    })

	sphere = Sphere(gl)

    particles = Particles(gl, {
        count: 80,
        noiseScale: 0.5,
        speed: 0.3,
        driftSpeed: 0.03,
        width: width, 
        height: height
    })
}