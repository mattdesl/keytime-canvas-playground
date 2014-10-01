require('canvas-testbed')(render, start)

var createEditor = require('keytime-basic-editor')
var createTimeline = require('keytime')
var animations = require('./data.json')
var rgba = require('color-style')

var createVignette = require('./vignette')
var createParticles = require('../particles')
var drawParticles = require('../particles/draw')
var drawLines = require('../particles/draw-triangulated')

var vignette, timeline, editor, particleSystem

var widgets = {}


function render(ctx, width, height, dt) {
	ctx.clearRect(0,0,width,height)
	ctx.fillStyle = rgba(widgets.bg1.color)
	ctx.fillRect(0, 0, width, height)

	ctx.fillStyle = rgba(widgets.bg0.color)
	ctx.fillRect(0, 0, width*widgets.bg0.scale[0], height*widgets.bg0.scale[1])
	ctx.fillStyle = rgba(widgets.bg1.color)
	ctx.fillRect(0, 0, width*widgets.bg1.scale[0], height*widgets.bg1.scale[1])

	var pColor = rgba(widgets.particles.color)
	ctx.fillStyle = pColor
	particleSystem.angle = widgets.particles.angle
	particleSystem.explode = widgets.particles.explode
	particleSystem.update(width, height, dt)
	particleSystem.noiseOffset[0] += dt*0.05
	particleSystem.noiseOffset[1] += dt*0.05

	ctx.strokeStyle = pColor
	drawLines(ctx, particleSystem, widgets.particles.lines)
	ctx.stroke()

	drawParticles(ctx, particleSystem, widgets.particles.scalar)
	ctx.fill()
}

function start(ctx, width, height) {
	particleSystem = createParticles({
		width: width,
		height: height,
		count: 100
	})

	editor = createEditor(update)

	// editor.shy('color')
	editor.constraint('scale', { min: 0, max: 1, step: 0.05, decimals: 2 })
	editor.constraint('color', { min: 0, max: 255, step: 1 })
	editor.constraint('angle', { min: 0, max: 2, decimals: 0 })

	require('../animation-scheme')(animations, require('./scheme'))
	animations.forEach(function(a) {
		editor.add(a.timeline, a.name)
	})

	editor.appendTo(document.body)
	update(0)
	editor.hide()
	editor.run()
}

function update(time) {
	animations.forEach(function(a) {
		if (!widgets[a.name])
			widgets[a.name] = {}
		a.timeline.values(time, widgets[a.name])
	})
}