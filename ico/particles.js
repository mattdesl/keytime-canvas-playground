var Base = require('../particles')
var inherits = require('inherits')
var Batch = require('gl-quad-batch')
var WhiteTex = require('gl-white-texture')
var createShader = require('gl-basic-shader')
var premult = require('premultiplied-rgba')
var number = require('as-number')

var mat4 = require('gl-mat4')

var glslify = require('glslify')


var tmp4 = [0,0,0,0]

module.exports = Particles
function Particles(gl, opt) {
	if (!(this instanceof Particles))
		return new Particles(gl, opt)
	opt = opt||{}
	Base.call(this, opt)

	this.projection = mat4.create()
	this.batch = Batch(gl)
	this.texture = WhiteTex(gl)

	var source = glslify({
		vertex: './shaders/circle.vert',
		fragment: './shaders/circle.frag',
		sourceOnly: true
	})

	this.driftSpeed = number(opt.driftSpeed, 0.025)
	this.scale = number(opt.scale, 1)
	this.color = opt.color || [1,1,1,0.8]
	this.shader = opt.shader || createShader(gl, source)
}

inherits(Particles, Base)

Particles.prototype.draw = function(width, height, dt) {
	this.noiseOffset[0] += dt*this.driftSpeed
	this.noiseOffset[1] += dt*this.driftSpeed

	Base.prototype.update.call(this, width, height, dt)
    mat4.ortho(this.projection, 0, width, height, 0, 0, 1)

    this.texture.bind()
    this.shader.bind()
    this.shader.uniforms.projection = this.projection
	this.shader.uniforms.tint = premult(this.color)
	this.batch.clear()
	this.batch.color(1, 1, 1, 1)

	for (var i=0; i<this.particles.length; i++) {
		var p = this.particles[i],
			pos = p.position,
			r = p.radius * p.scale * this.scale

		this.batch.add(this.texture, pos[0]-r, pos[1]-r, r*2, r*2)
	}

	this.batch.bind()
	this.batch.draw()
	this.batch.unbind()
}