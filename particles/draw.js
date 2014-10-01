var number = require('as-number')

module.exports = function(ctx, system, scale) {
	scale = Math.max(0, number(scale, 1))
	ctx.beginPath()
	system.particles.forEach(function(p) {
		var radius = p.radius
		ctx.moveTo(p.position[0], p.position[1])
		ctx.arc(p.position[0], p.position[1], radius*scale, 0, Math.PI*2, false)
	})
}