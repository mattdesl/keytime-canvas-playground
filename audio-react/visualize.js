var Analyse = require('web-audio-analyser')
var Reaction = require('./')


var noop = function(){}

module.exports = function(opt, callback) {
	callback = callback || noop
	opt = opt||{}
	require('soundcloud-badge')(opt, function(err, url) {
		if (err) {
			callback(err)
			return
		}
		var audio = new Audio()
		audio.addEventListener('error', function(e) {
			callback(e)
			callback = noop
		})
		audio.addEventListener('canplay', function() {
			audio.play()
			analyser = Analyse(audio, opt)
			reaction = Reaction(opt)
			callback(null, function() {
				var frequencies = analyser.frequencies()
				reaction.update(frequencies)
				return reaction
			})
			callback = noop
		})
		audio.src = url
		audio.loop = opt.loop
	})
}