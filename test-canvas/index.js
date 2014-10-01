var domify = require('domify')
var style = require('dom-style')

require('canvas-testbed')(function(ctx, width, height) {
	ctx.clearRect(0,0,width,height)
	ctx.globalAlpha = 0.5
	ctx.fillStyle = 'black'
	ctx.fillRect(0,0,width,height)
}, function(ctx) {
	var info = domify('<div>this is a <a href="google.com">test</a>')
	document.body.appendChild(info)


	style(ctx.canvas, {
		position: 'absolute',
		top: '0px',
		left: '0px'
	})

})

