var number = require('as-number')
var dist = require('vectors/dist')(2)
var lerpvec = require('vectors/lerp')(2)
var lerp = require('lerp')

var tmp = [0,0]
var skip = []

module.exports = function(ctx, system, minDist) {
	minDist = number(minDist, 50)
	var particles = system.particles
	ctx.beginPath()

	// skip.length = 0
	// var count = 0
	// for (var i=0; i<particles.length; i++) {
	// 	for (var j=0; j<particles.length; j++) {
	// 		if (i === j)
	// 			continue
	// 		var p0 = particles[i].position,
	// 			p1 = particles[j].position,
	// 			d = dist(p0, p1)
	// 		if (d > minDist)
	// 			continue
	// 		if (skip.indexOf(j) !== -1)
	// 			continue
	// 		skip.push(j)

	// 		var t = d/minDist
	// 		// t *= 0.75

	// 		lerpvec(tmp, p0, p1, 0.5)
			
	// 		ctx.moveTo(p0[0], p0[1])
	// 		ctx.lineTo(tmp[0], tmp[1])
	// 	}
	// }

	var maxLine = minDist
	system.triangulate()
	for (var i=0; i<system.triangles.length; i++) {
		var t = system.triangles[i]
		var p0 = particles[t[0]].position,
			p1 = particles[t[1]].position,
			p2 = particles[t[2]].position
			d = dist(p0, p1) 

		// if (d > minDist)
		// 	continue
		
        //edge lengths
        var a = dist(p0, p1)
        var b = dist(p1, p2)
        var c = dist(p2, p0)

        if (a > maxLine || b > maxLine || c > maxLine)
        	continue

        //semiperimeter
        // var s = (a + b + c) * 0.5

        //area
        // var area = Math.sqrt(s * (s - a) * (s - b) * (s - c))

        // if (area > minDist)
        // 	continue	

        // var t = area/minDist
        // lerpvec(tmp, p0, p1, t)

		ctx.moveTo(p0[0], p0[1])
		ctx.lineTo(p1[0], p1[1])
		ctx.lineTo(p2[0], p2[1])
		ctx.lineTo(p0[0], p0[1])
	}
}