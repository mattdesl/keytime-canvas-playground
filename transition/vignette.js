var equal = require('array-equal')
var number = require('as-number')

function Vignette(context, opt) {
	if (!(this instanceof Vignette))
		return new Vignette(context, opt)
	opt = opt||{}
	this.context = context

	this.bounds = [0, 0, 0, 0]
	this.colors = opt.colors || [ 'black', 'white' ]
	this.radius = opt.radius
	this.scale = opt.scale || [1, 1]
	this.gradient = null
	this.update()
}

Vignette.prototype.reset = function() {
	this.gradient = null
}

Vignette.prototype.update = function() {
	if (!this.gradient) {
		var w = this.bounds[2],
			h = this.bounds[3],
			x = w/2,
			y = h/2,
			max = Math.max(w,h),
			r = number(this.radius, max)

		var grd = this.context.createRadialGradient(x, y, 0, x, y, r)
		this.gradient = grd
		this.colors.forEach(function(c, i, list) {
			grd.addColorStop(i/(list.length-1), c)
		})
	}
}

Vignette.prototype.draw = function(bounds) {
	if (typeof bounds === 'number') {
		bounds = Array.prototype.slice.call(arguments, 0, 4)
		if (bounds.length<4)
			throw new Error('draw() must be called with an array or x, y, width, height')	
	}
	if (!equal(bounds, this.bounds)) {
		this.bounds = bounds.slice()
		this.gradient = null
	}

	this.update()

	var sx = this.scale[0],
		sy = this.scale[1],
		w = bounds[2],
		h = bounds[3]

	var context = this.context
	context.save()

	context.scale(sx, sy)
	context.fillStyle = this.gradient
	context.fillRect(bounds[0], bounds[1], w/sx, h/sy)

	context.restore()
}

module.exports = Vignette