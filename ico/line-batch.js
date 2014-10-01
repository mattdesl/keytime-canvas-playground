var Mesh = require('gl-basic-mesh')
var number = require('as-number')

function Batch(gl, opt) {
	if (!(this instanceof Batch))
		return new Batch(gl,opt)
	opt = opt||{}

	this.mesh = Mesh(gl, {
		positions: opt.positions
	})
}
