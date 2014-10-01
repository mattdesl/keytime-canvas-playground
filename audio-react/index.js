var number = require('as-number')
var mixes = require('mixes')

function ease(t) {
	return Math.sin((t - 1.0) * Math.PI/2) + 1.0
}

function Reaction(opt) {
	if (!(this instanceof Reaction))
		return new Reaction(opt)
	opt = opt||{}
	this.low = number(opt.low, 50)
	this.high = number(opt.high, 80)
	var count = number(opt.count, 16)
	this.averages = new Float32Array(count)
	this.entries = new Float32Array(count)
	this.ease = opt.ease || ease
}

mixes(Reaction, {

	update: function(frequencies) {
		var low = this.low,
			high = this.high,
			entries = this.entries,
			averages = this.averages,
			count = this.count

		var freqs = frequencies.subarray(low, high)

		//clear arrays
		for (var i = 0; i < count; i++)
			entries[i] = averages[i] = 0

		//compute averages
		for (i = 0; i < freqs.length; i++) {
			var index = ~~(i / freqs.length * count),
				a = this.ease(freqs[i] / (256))
			averages[index] += a
			entries[index]++
		}
	},

	value: function(index) {
		return this.averages[index] / this.entries[index]
	},

	values: function(out) {
		if (!out)
			out = new Array(this.count)
		for (var i=0; i<out.length; i++)
			out[i] = this.value(i)
		return out
	},

	count: {
		get: function() {
			return this.entries.length
		}
	}
})

module.exports = Reaction