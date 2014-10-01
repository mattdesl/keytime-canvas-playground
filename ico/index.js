require('canvas-testbed')(render, start, { context: 'webgl' })

var Vignette = require('gl-vignette-background')
var Sphere = require('./spinning-sphere')
var Particles = require('./particles')
var BasicShader = require('gl-basic-shader')
var events = require('dom-events')

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
	var radius = Math.max(width, height) * 0.6
	bg = Vignette(gl, {
        scale: [ 1/width * radius, 1/height * radius],
        aspect: 1,
        color2: [0, 0, 0],
        color1: [30/255, 46/255, 58/255],
        smoothing: [ -0.5, 1.0 ],
        noiseAlpha: 0.2,
    })

    var basicShader = BasicShader(gl)

	sphere = Sphere(gl, {
        shader: basicShader
    })

    particles = Particles(gl, {
        count: 50,
        noiseScale: 0.5,
        speed: 0.3,
        driftSpeed: 0.03,
        width: width, 
        height: height
    })
}


events.on(window, 'touchstart', function(ev) {
    ev.preventDefault()
})