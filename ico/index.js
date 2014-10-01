require('canvas-testbed')(render, start, { context: 'webgl' })

var Vignette = require('gl-vignette-background')
var Sphere = require('./spinning-sphere')
var Particles = require('./particles')
var BasicShader = require('gl-basic-shader')
var events = require('dom-events')
var AudioViz = require('../audio-react/visualize')

var lerp = require('lerp')

var bg, sphere, particles, audioReact
var time = 0

function render(gl, width, height, dt) {
    time += dt
	gl.clear(gl.COLOR_BUFFER_BIT)
	gl.clearColor(0,0,0,1)
	
	bg.draw()



    particles.draw(width, height, dt)

    if (audioReact) {
        var reaction = audioReact()

        var s1 = lerp(0.5, 1.0, reaction.value(0)),
            s2 = lerp(0.5, 1.0, reaction.value(reaction.count-1))
        sphere.innerScale = [s1,s1,s1]
        sphere.outerScale = [s2,s2,s2]
        sphere.draw(width, height, dt)

        var s3 = lerp(0.5, 4, reaction.value(reaction.count-1))
        particles.scale = s3
    }
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

    sphere.scale = [0, 0, 0]
    particles.scale = 0

    AudioViz({
        count: 16,
        low: 80,
        high: 150,
        client_id: '408617707914e767ff6e955669a1c4a8',
        song: 'https://soundcloud.com/ursula1000/01-kinda-kinky',
        dark: false,
        getFonts: true,
        audible: true,
        stereo: false   
    }, function(err, react) {
        if (err) {
            sphere.scale = [1, 1, 1]
            particles.scale = 1
        } else 
            audioReact = react
    })
}

events.on(window, 'touchstart', function(ev) {
    ev.preventDefault()
})