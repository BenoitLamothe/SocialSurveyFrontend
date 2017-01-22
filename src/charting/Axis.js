import { axisBottom, axisRight, axisLeft, axisTop } from 'd3';

export const AxisType = {
    left: axisLeft,
    right: axisRight,
    bottom: axisBottom,
    top: axisTop,
};

/**
 * Axis represents a d3js axis
 *
 * USAGE:
 *      let axis = new Axis(AxisPosition.bottom, scale, {
 *          ticks: [6]
 *      })
 */
export class Axis {
    constructor(type, classes, scale, opts) {
        this._type = type;
        this._classes = classes;
        this._scale = scale;
        this._opts = opts;

        this._d3Obj = this._type(this._scale.ref);

        if (this._opts.axis) {
            for (const method in this._opts.axis) {
                this._d3Obj[method](...this._opts.axis[method]);
            }
        }
    }

    get ref() {
        return this._d3Obj;
    }

    get scale() {
        return this._scale;
    }

    add(target) {
        this._e = target.append('g')
            .attr('class', this._classes.join(' '));

        if (this._opts.add) {
            this._opts.add(this);
        }

        this._e.call(this.ref);

        // NOTE(Olivier): Let's bind the underlying _draw method
        this._redraw = this._redraw.bind(this, target);
    }

    _redraw(target) {
        this._e
            .transition()
            .duration(300);

        if (this._opts.redraw) {
            this._opts.redraw(this);
        }

        this._e.call(this.ref);
    }

    redraw() {
        // NOTE(Olivier): Lets ensure that the _redraw method has been bound.
        if (!this._redraw.hasOwnProperty('prototype')) {
            this._redraw();
        }
    }

}
