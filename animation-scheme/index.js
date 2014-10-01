var createTimeline = require('keytime')
var indexOf = require('indexof-property')('name')

function fit(timeline, timelineScheme) {
	timelineScheme.forEach(function(scheme) {
		var prop = timeline.property(scheme.name)
		if (!prop) {
			timeline.addProperty(scheme)
		}
	})


}

//transforms raw JSON to a list of timelines
module.exports = function(data, scheme) {
	scheme = scheme||[]

	//from the JSON data we need to build keytime objects
	data.forEach(function(a) {
		var timeline = createTimeline(a.timeline)
		a.timeline = timeline

		var idx = indexOf(scheme, a.name)
		if (idx !== -1) {
			fit(a.timeline, scheme[idx].timeline)
		}
	})

	//now add any remainders
	scheme.forEach(function(a) {
		var idx = indexOf(data, a.name)
		if (idx === -1) {
			var t = createTimeline(a.timeline)
			data.push({ name: a.name, timeline: t })
		}
	})
}

