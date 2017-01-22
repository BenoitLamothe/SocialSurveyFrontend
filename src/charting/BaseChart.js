import * as d3 from 'd3';
import { GUID } from './Utilities';

export class BaseChart {
    constructor(target, width, height, margin, selector, dataset) {
        /* if (new.target === BaseChart) {
         throw new TypeError('Cannot construct Abstract instances directly');
         }*/
        this._target = target;
        this._width = width;
        this._height = height;
        this._margin = margin;
        this._selector = selector;
        this._dataset = dataset;

        this._svg = d3.select(this._target).append('svg')
            .attr('width', this._width + this._margin.left + this._margin.right)
            .attr('height', this._height + this._margin.top + this._margin.bottom);

        this._mainChart = this._svg.append('g')
            .attr('class', 'chart')
            .attr('transform', `translate(${this._margin.left}, ${this._margin.top})`);

        this._defs = this._svg.append('defs');

        this._clipId = GUID();
        this._clipPath = this._defs
            .append('clipPath')
            .attr('id', this._clipId);

        this._clipRect = this._clipPath.append('rect')
            .attr('width', this._width)
            .attr('height', this._height);
    }

    redraw() {
        this._clipRect
            .attr('width', this._width)
            .attr('height', this._height);
        this._svg
            .attr('width', this._width + this._margin.left + this._margin.right)
            .attr('height', this._height + this._margin.bottom + this._margin.top);
    }

    dataChanged() {

    }

    get width() {
        return this._width;
    }

    set width(value) {
        this._width = value;
        this.redraw();
    }

    get height() {
        return this._height;
    }

    set height(value) {
        console.log(value);
        this._height = value;
        this.redraw();
    }

    get margin() {
        return this._margin;
    }

    set margin(value) {
        this._margin = value;
        this.redraw();
    }

    set dataset(value) {
        this._dataset = value;
        this.dataChanged();
        this.redraw();
    }

    set selector(value) {
        this._selector = value;
        this.dataChanged();
        this.redraw();
    }
}
