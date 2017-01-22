/**
 * Created by olivier on 2017-01-21.
 */
import template from './ss.world_view.html'

import {
    geoOrthographic,
    geoPath,
    drag,
    mouse,
    json,
    select
} from 'd3'

var acos = Math.acos,
    asin = Math.asin,
    atan2 = Math.atan2,
    cos = Math.cos,
    max = Math.max,
    min = Math.min,
    PI = Math.PI,
    sin = Math.sin,
    sqrt = Math.sqrt,
    radians = PI / 180,
    degrees = 180 / PI;

// Returns the unit quaternion for the given Euler rotation angles [λ, φ, γ].
function versor(e) {
    var l = e[0] / 2 * radians, sl = sin(l), cl = cos(l), // λ / 2
        p = e[1] / 2 * radians, sp = sin(p), cp = cos(p), // φ / 2
        g = e[2] / 2 * radians, sg = sin(g), cg = cos(g); // γ / 2
    return [
        cl * cp * cg + sl * sp * sg,
        sl * cp * cg - cl * sp * sg,
        cl * sp * cg + sl * cp * sg,
        cl * cp * sg - sl * sp * cg
    ];
}

// Returns Cartesian coordinates [x, y, z] given spherical coordinates [λ, φ].
versor.cartesian = function(e) {
    var l = e[0] * radians, p = e[1] * radians, cp = cos(p);
    return [cp * cos(l), cp * sin(l), sin(p)];
};

// Returns the Euler rotation angles [λ, φ, γ] for the given quaternion.
versor.rotation = function(q) {
    return [
        atan2(2 * (q[0] * q[1] + q[2] * q[3]), 1 - 2 * (q[1] * q[1] + q[2] * q[2])) * degrees,
        asin(max(-1, min(1, 2 * (q[0] * q[2] - q[3] * q[1])))) * degrees,
        atan2(2 * (q[0] * q[3] + q[1] * q[2]), 1 - 2 * (q[2] * q[2] + q[3] * q[3])) * degrees
    ];
};

// Returns the quaternion to rotate between two cartesian points on the sphere.
versor.delta = function(v0, v1) {
    var w = cross(v0, v1), l = sqrt(dot(w, w));
    if (!l) return [1, 0, 0, 0];
    var t = acos(max(-1, min(1, dot(v0, v1)))) / 2, s = sin(t); // t = θ / 2
    return [cos(t), w[2] / l * s, -w[1] / l * s, w[0] / l * s];
};

// Returns the quaternion that represents q0 * q1.
versor.multiply = function(q0, q1) {
    return [
        q0[0] * q1[0] - q0[1] * q1[1] - q0[2] * q1[2] - q0[3] * q1[3],
        q0[0] * q1[1] + q0[1] * q1[0] + q0[2] * q1[3] - q0[3] * q1[2],
        q0[0] * q1[2] - q0[1] * q1[3] + q0[2] * q1[0] + q0[3] * q1[1],
        q0[0] * q1[3] + q0[1] * q1[2] - q0[2] * q1[1] + q0[3] * q1[0]
    ];
};

function cross(v0, v1) {
    return [
        v0[1] * v1[2] - v0[2] * v1[1],
        v0[2] * v1[0] - v0[0] * v1[2],
        v0[0] * v1[1] - v0[1] * v1[0]
    ];
}

function dot(v0, v1) {
    return v0[0] * v1[0] + v0[1] * v1[1] + v0[2] * v1[2];
}

SSWorldViewController.$inject = ['$element'];
function SSWorldViewController($element) {
    let ctrl = this;

    ctrl.$postLink = function () {

        const canvas = select($element.find('canvas').get(0));

        const
            width = canvas.property("width"),
            height = canvas.property("height"),
            context = canvas.node().getContext("2d");

        const projection = geoOrthographic()
            .scale((height - 10) / 2)
            .translate([width / 2, height / 2])
            .precision(0.1);

        const path = geoPath()
            .projection(projection)
            .context(context);

        let render = function() {},
            v0, // Mouse position in Cartesian coordinates at start of drag gesture.
            r0, // Projection rotation as Euler angles at start.
            q0; // Projection rotation as versor at start.

        canvas.call(drag()
            .on("start", dragstarted)
            .on("drag", dragged));

        function dragstarted() {
            v0 = versor.cartesian(projection.invert(mouse(this)));
            r0 = projection.rotate();
            q0 = versor(r0);
        }

        function dragged() {
            var v1 = versor.cartesian(projection.rotate(r0).invert(mouse(this))),
                q1 = versor.multiply(q0, versor.delta(v0, v1)),
                r1 = versor.rotation(q1);
            projection.rotate(r1);
            render();
        }

        json("https://unpkg.com/world-atlas@1/world/110m.json", function(error, world) {
            if (error) throw error;

            debugger;

            const sphere = {type: "Sphere"},
                land = topojson.feature(world, world.objects.land);

            const usaIndex = world.objects.countries.geometries.findIndex(x => x.id === '840');
            const usa = topojson.feature(world, world.objects.countries.geometries[usaIndex]);

            render = function() {
                context.clearRect(0, 0, width, height);
                context.beginPath(), path(sphere), context.fillStyle = "#011627", context.fill();
                context.beginPath(), path(land), context.fillStyle = "#FFF", context.fill();
                context.beginPath(), path(usa), context.fillStyle = '#2EC4B6', context.fill();
                context.beginPath(), path(sphere), context.stroke();
            };

            render();
        });

    }
}

const SSWorldView = {
    controller: SSWorldViewController,
    templateUrl: template,
    bindings: {}
};

export default SSWorldView;

angular.module('ss').component('ssWorldView', SSWorldView);
