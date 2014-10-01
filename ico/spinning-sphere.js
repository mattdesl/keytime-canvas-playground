var Vignette = require('gl-vignette-background')
var defaultShader = require('gl-basic-shader')
var Icosphere = require('icosphere')
var Geom = require('gl-geometry')
var Wire = require('gl-wireframe')
var mat4 = require('gl-mat4')
var premult = require('premultiplied-rgba')

var scaleMat = mat4.create()
var tmp4 = [0, 0, 0, 0]

module.exports = Sphere

function Sphere(gl, opt) {
    if (!(this instanceof Sphere))
        return new Sphere(gl, opt)
    opt = opt || {}
    this.shader = opt.shader || defaultShader(gl)
    this.gl = gl


    var complex = Icosphere(1)

    this.highpoly = Geom(gl)
        .attr('position', complex.positions)
        .faces(Wire(complex.cells))

    complex = Icosphere(0)
    this.lowpoly = Geom(gl)
        .attr('position', complex)
        .faces(complex)

    //and a view matrix
    var view = mat4.create()
    mat4.translate(view, view, [0, 0, -20])
    mat4.scale(view, view, [1, -1, 1])

    this.view = view
    this.spin = mat4.create()
    this.projection = mat4.create()

    this.innerScale = [1,1,1]
    this.outerScale = [1,1,1]

    this.innerColor = opt.innerColor || [1, 0, 0, 0.1]
    this.strokeColor = opt.strokeColor || [1, 0, 0, 0.5]
    this.outerColor = opt.outerColor || [1, 1, 1, 0.05]
}

Sphere.prototype.draw = function(width, height, dt) {
    var shader = this.shader,
        gl = this.gl,
        view = this.view,
        spin = this.spin,
        projection = this.projection,
        highpoly = this.highpoly,
        lowpoly = this.lowpoly

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
    gl.lineWidth(3)

    mat4.perspective(projection, 50, width / height, 1, 1000)

    //rotate our view transform
    mat4.rotateX(view, view, dt / 1000 * 0.5)
    mat4.rotateY(view, view, dt / 1000 * 0.25)

    //also rotate the transform a little bit more
    mat4.rotateY(spin, spin, dt / 1000 * 0.5)

    shader.bind()
    shader.uniforms.view = view
    shader.uniforms.projection = projection

    //scale the outer sphere 
    mat4.identity(scaleMat)
    mat4.scale(scaleMat, scaleMat, this.outerScale)

    //draw the outer sphere
    highpoly.bind(shader)
    shader.uniforms.model = scaleMat
    shader.uniforms.tint = premult(this.outerColor, tmp4)
    highpoly.draw(gl.LINES)
    highpoly.unbind()

    //scale the inner sphere
    mat4.identity(scaleMat)
    mat4.scale(scaleMat, spin, this.innerScale)

    //draw the inner sphere
    lowpoly.bind(shader)
    shader.uniforms.model = scaleMat

    //draw opaque
    shader.uniforms.tint = premult(this.innerColor, tmp4)
    lowpoly.draw(gl.TRIANGLES)
    
    //draw lines
    shader.uniforms.tint = premult(this.strokeColor, tmp4)
    lowpoly.draw(gl.LINES)
    
    lowpoly.unbind()
}