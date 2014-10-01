var Analyse = require('web-audio-analyser')
var Reaction = require('./')
var events = require('dom-events')

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
		events.once(audio, 'error', function(e) {
			callback(e)
			callback = noop
		})
		events.once(audio, 'canplay', function() {
			audio.play()
			analyser = Analyse(audio, opt)
			reaction = Reaction(opt)
			callback(null, function() {
				var frequencies = analyser.frequencies()
				reaction.update(frequencies)
				return reaction
			}, audio, analyser)
			callback = noop
		})
		audio.src = url
		audio.loop = opt.loop
	})
}