require('canvas-testbed')(render, start, {
    context: 'webgl'
})

var Vignette = require('gl-vignette-background')
var Sphere = require('./spinning-sphere')
var Particles = require('./particles')
var BasicShader = require('gl-basic-shader')
var events = require('dom-events')
var AudioViz = require('../audio-react/visualize')

var lerp = require('lerp')

var bg,
    sphere,
    particles,
    audioReact,
    animations = {},
    audioNode,
    editor


var time = 0

function render(gl, width, height, dt) {
    time += dt
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.clearColor(0, 0, 0, 1)

    bg.draw()

    particles.draw(width, height, dt)

    if (audioReact) {
        var reaction = audioReact()

        var innerAmt = animations.innerSphere.audio,
            outerAmt = animations.outerSphere.audio

        var innerScale = lerp(0.5, 1.0, reaction.value(0) * innerAmt),
            outerScale = lerp(0.5, 1.0, reaction.value(reaction.count - 1) * outerAmt),
            s3 = lerp(0.5, 4, reaction.value(reaction.count - 1))

        innerScale *= animations.innerSphere.scale
        outerScale *= animations.outerSphere.scale

        sphere.innerScale = [innerScale, innerScale, innerScale]
        sphere.outerScale = [outerScale, outerScale, outerScale]

        particles.scale = s3

        sphere.innerRotation = animations.innerSphere.rotation
        sphere.draw(width, height, dt)
    }
}

function start(gl, width, height) {
    var radius = Math.max(width, height) * 0.6
    bg = Vignette(gl, {
        scale: [1 / width * radius, 1 / height * radius],
        aspect: 1,
        color2: [0, 0, 0],
        color1: [30 / 255, 46 / 255, 58 / 255],
        smoothing: [-0.5, 1.0],
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
        loop: false,
        stereo: false
    }, function(err, react, audio, analyser) {
        if (err) {
            sphere.scale = [1, 1, 1]
            particles.scale = 1
        } else {
            audioReact = react
            audioNode = audio
            editor.duration = audio.duration
        }
        editor.run()
        // editor.show()
    })


    ensureScheme(animData, require('./anim'))
    update(0)
    setupEditor()
}

events.on(window, 'touchstart', function(ev) {
    ev.preventDefault()
})


var createEditor = require('keytime-basic-editor')
var createTimeline = require('keytime')
var animData = require('./anim-data.json')
var ensureScheme = require('../animation-scheme')

function setupEditor() {
    editor = createEditor(update, {
        // duration: 233
    })

    // editor.shy('color')
    editor.constraint(['rotation'], { min: -Math.PI*2, max: Math.PI*2, step: 0.05, decimals: 2 })
    editor.constraint(['scale'], { min: 0, max: 4, step: 0.05, decimals: 2 })
    editor.constraint(['audio'], { min: 0, max: 1, step: 0.05, decimals: 2 })
    editor.constraint('color', { min: 0, max: 255, step: 1 })
    editor.constraint('angle', { min: 0, max: 2, decimals: 0 })

    animData.forEach(function(a) {
        editor.add(a.timeline, a.name)
    })

    editor.on('play', function() {
        audioNode.currentTime = editor.playhead()
        audioNode.play()
    })
    editor.on('pause', function() {
        audioNode.pause()
    })

    editor.appendTo(document.body)
    editor.hide()
}

function update(time) {
    animData.forEach(function(a) {
        if (!animations[a.name])
            animations[a.name] = {}
        a.timeline.values(time, animations[a.name])
    })
}
