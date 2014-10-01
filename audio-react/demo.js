var setupDemo = require('canvas-testbed')
var analyse = require('web-audio-analyser')
var number = require('as-number')
var Reaction = require('./')

var url, analyser, reaction

require('soundcloud-badge')({
	client_id: '408617707914e767ff6e955669a1c4a8',
	song: 'https://soundcloud.com/ursula1000/01-kinda-kinky',
	dark: true,
	getFonts: true
}, function(err, src, json, div) {
	if (err) throw err
	url = src
	if (!analyser)
		setupDemo(render, start)
})

function render(ctx, width, height) {
	ctx.clearRect(0, 0, width, height)
	if (analyser) {
		var frequencies = analyser.frequencies()
		reaction.update(frequencies)
		
		var reactions = reaction.values()

		ctx.fillStyle = ctx.strokeStyle = '#353535'
		draw(ctx, reaction, width/2, height/2, 30, false)
		draw(ctx, reaction, width/2, height/2, 25, true)
	}
}

function draw(ctx, reaction, px, py, radius, fill) {
	var count = reaction.count
	var steps = 360

	ctx.beginPath()
    for (var i=0; i<=steps; i++) {
        var t = (i)/(steps-1),
            a = (t * Math.PI*2),
            idx = ~~(t * count) % count

        var v = reaction.value(idx)
        var r = Math.min(radius*3, radius + v * 75)

        var x = Math.cos(a) * r + px,
            y = Math.sin(a) * r + py
        ctx.lineTo(x, y)
    }

    if (fill) {
        ctx.lineTo(px, py)
        ctx.fill()
    }
    else ctx.stroke()
}

function start(ctx) {
	var audio = new Audio()
	audio.addEventListener('canplay', function() {
		audio.play()
		analyser = analyse(audio, {
			audible: true,
			stereo: false
		})

		reaction = Reaction({
			count: 16, // # of bins
			low: 50,   // frequency range
			high: 200
		})
	})
	audio.src = url
	audio.loop = true
	console.log(audio)
}