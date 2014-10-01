var mixes = require('mixes')
var number = require('as-number')
var Particle = require('./Particle')
var NoiseSampler = require('simplex-sampler')
var add = require('vectors/add')(2)
var normalize = require('vectors/normalize')(2)
var mult = require('vectors/mult')(2)
var sub = require('vectors/sub')(2)
var delaunay = require('delaunay-triangulate')
var rnd = require('./random')

var tmp = [0, 0]
var tmp2 = [0, 0]
var center = [0, 0]


function Particles(opt) {
	if (!(this instanceof Particles))
		return new Particles(opt)
	opt = opt||{}

	var count = number(opt.count, 300)
	this.particles = []

	for (var i=0; i<count; i++) 
		this.particles.push(new Particle())

	this.noise = new NoiseSampler(256)
    this.noise.scale = number(opt.noiseScale, 0.5)
    this.noise.seamless = true
    this.noise.smoothing = false
    this.noise.generate()
    this.noiseOffset = opt.noiseOffset || [0, 0]
	this.angle = number(opt.angle, 2)
	this.explode = number(opt.explode, 0)
	this.randomize(opt.width, opt.height)
	this.triangles = []
	this.triangulate()
	this.speed = number(opt.speed, 1)

	this.lifeDelay = opt.lifeDelay || {
		min: 2000,
		max: 3500
	}
}	


mixes(Particles, {

	triangulate: function triangulate() {
		var points = this.particles.map(function(p) {
			return p.position
		})

		this.triangles = delaunay(points)
	},

	randomize: function randomize(width, height) {
		this.particles.forEach(function(p) {
			p.randomize(width, height)
			p.scramble(width, height, 1000)
		})
	},

	update: function update(width, height, dt) {
		dt = Math.min(dt, 30)
		var scale = 1
		var noiseStrength = 20
		var noise = this.noise
		var xoff = this.noiseOffset[0]
		var yoff = this.noiseOffset[1]
		var particles = this.particles
		var explode = this.explode
		var lifeDelay = this.lifeDelay
		
		tmp2[0] = width/2
		tmp2[1] = height/2

		for (var i=0; i<particles.length; i++) {
			var p = particles[i],
				x = p.position[0],
				y = p.position[1]
			var sx = (x*scale) * (noise.size/width),
				sy = (y*scale) * (noise.size/height)

			var n1 = noise.sample(sx+xoff, sy);
			var n2 = noise.sample(sx + n1*noiseStrength, sy+yoff);

			// var n = noise.sample(sx, sy)
			p.scale = 2 * (n2/2+0.5) * (p.life/p.totalLife)

			//unit vector for noise
			var angle = n2 * Math.PI * this.angle
			tmp[0] = Math.cos(angle) * this.speed
			tmp[1] = Math.sin(angle) * this.speed

			//move it baby
			add(p.position, tmp)

			center[0] = p.position[0]
			center[1] = p.position[1]

			//explode from center
			sub(center, tmp2)
			normalize(center)
			mult(center, explode)

			add(p.position, center)

			p.life -= dt
			if (p.life <= 0) {
				p.totalLife = p.life = rnd(lifeDelay.min, lifeDelay.max)
				// if (p.position[0] < 0 || p.position[1] < 0
				// 		|| p.position[0] > width || p.position[1] > height)
				p.randomize(width, height)
			}

		}
	}
})

module.exports = Particles