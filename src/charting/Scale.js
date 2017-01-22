import { scaleLinear, scaleOrdinal, scaleBand, scaleTime } from 'd3';

export const ScaleType = {
    Linear: scaleLinear,
    Ordinal: scaleOrdinal,
    Band: scaleBand,
    Time: scaleTime,
};
/**
 * Scale defines represents a d3js scale
 *
 * USAGE:
 *      let scale = new Scale(ScaleType.Linear, {
 *          domain: [[min, max]],
 *          range: [[800, 0]]
 *      })
 */
export class Scale {
    constructor(type, opts) {
        this._type = type;
        this._opts = opts;

        this._d3Obj = this._type();
        for (const method in this._opts) {
            this._d3Obj[method](...opts[method]);
        }
    }

    get ref() {
        return this._d3Obj;
    }

    set domain(value) {
        this._d3Obj.domain(value);
    }

    set range(value) {
        this._d3Obj.range(value);
    }

    set rangeRound(value) {
        this._d3Obj.rangeRound(value);
    }
}
