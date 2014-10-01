var number = require('as-number')
var rnd = require('./random')

module.exports = Particle
function Particle() {
	this.position = [0, 0]
	this.velocity = [0, 0]
	this.radius = rnd(0.5, 2)
	this.scale = 1
	this.noisePosition = [0, 0]
	this.life = 0
	this.totalLife = 1000
}

Particle.prototype.randomize = function(width, height) {
	this.position[0] = Math.random()*number(width)
	this.position[1] = Math.random()*number(height)
}	

Particle.prototype.scramble = function(width, height) {
	this.noisePosition[0] = Math.random()*number(width)
	this.noisePosition[1] = Math.random()*number(height)
}

