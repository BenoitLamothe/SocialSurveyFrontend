import { extent, select, min } from 'd3';

import { BaseChart } from './BaseChart';
import { Scale, ScaleType } from './Scale';
import { Axis, AxisType } from './Axis';

export class BarChart extends BaseChart {
    constructor(target, width, height, margin, selector, dataset, opts) {
        super(target, width, height, margin, selector, dataset);

        // Find x domain
        const xDomain = this._dataset.map(d => this._selector.x(d));
        // Build x scale
        const xScale = new Scale(ScaleType.Band, {
            domain: [xDomain],
            rangeRound: [[0, this._width]],
            padding: [0.1],
        });
        // Build x axis
        this._xAxis = new Axis(AxisType.bottom, ['x', 'axis'], xScale, {
            add: (axis) => {
                axis._e.attr('transform', `translate(0, ${this.height})`);
            },
        });

        // Find y extent
        const yDomain = extent(this._dataset, d => this._selector.y(d));

        yDomain[0] -= (yDomain[0] * 0.5);
        yDomain[1] += (yDomain[1] * 0.05);
        // Build y scale
        const yScale = new Scale(ScaleType.Linear, {
            domain: [yDomain],
            range: [[this._height, 0]],
        });
        // Build x axis
        this._yAxis = new Axis(AxisType.left, ['y', 'axis'], yScale, {
            axis: {
                tickSize: [-this.width],
                ticks: [6],
                tickFormat: [this._selector.format],
            },
            redraw: (axis) => {
                axis.ref.tickSize(-this.width);
            },
        });

        this._xAxis.add(this._mainChart);
        this._yAxis.add(this._mainChart);

        const barSelector = {
            value: d => this._selector.format(this._selector.y(d)),
            x: d => this._xAxis.scale.ref(this._selector.x(d)),
            y: d => this._yAxis.scale.ref(this._selector.y(d)),
        };

        this._bars = new Bars(() => this._dataset, barSelector);
        this._bars.add(this, this._mainChart);
    }

    dataChanged() {
        // Find x domain
        const xDomain = this._dataset.map(d => this._selector.x(d));
        const yDomain = extent(this._dataset, d => this._selector.y(d));

        yDomain[0] -= (yDomain[0] * 0.5);
        yDomain[1] += (yDomain[1] * 0.05);

        this._yAxis.scale.domain = yDomain;
        this._xAxis.scale.domain = xDomain;

        this._xAxis.redraw();
        this._yAxis.redraw();
        this._bars.redraw();
    }

    redraw() {
        super.redraw();

        this._xAxis.scale.range = [0, this._width];
        this._yAxis.scale.rangeRound = [this._height, 0];

        this._xAxis.redraw();
        this._yAxis.redraw();
        this._bars.redraw();
    }

    get xAxis() {
        return this._xAxis;
    }
}

class Bars {
    constructor(dataFactory, selector) {
        this._dataFactory = dataFactory;
        this._selector = selector;
    }

    add(chart, target) {
        const maxWidth = 30;
        const barWidth = chart.xAxis.scale.ref.bandwidth();
        const newBarWidth = barWidth > maxWidth ? maxWidth : barWidth;
        const xDiff = barWidth > maxWidth ? (barWidth - newBarWidth) / 2 : 0;

        const baseline = min(this._dataFactory(), d => this._selector.y(d));

        const bars = target.selectAll('.bar')
            .data(this._dataFactory())
            .enter()
            .append('g')
            .attr('class', 'bar')
            .on('mouseenter', (d, i, n) => {
                select(n[i]).select('text')
                    .transition()
                    .duration(300)
                    .attr('font-size', 15)
                    .style('fill', this._getColor(d.emotion));
            })
            .on('mouseout', (d, i, n) => {
                select(n[i]).select('text')
                    .transition()
                    .duration(300)
                    .attr('font-size', 13)
                    .style('fill', '#FFF');
            });

        bars.append('rect')
            .attr('class', 'main')
            .attr('x', d => this._selector.x(d) + xDiff)
            .attr('y', d => this._selector.y(d))
            .style('fill', (d) => this._getColor(d.emotion))
            .attr('height', d => chart.height - this._selector.y(d))
            .attr('width', newBarWidth);

        bars.append('rect')
            .attr('class', 'diff')
            .attr('x', d => this._selector.x(d) + xDiff)
            .attr('y', baseline)
            .style('fill', 'transparent')
            .attr('height', d => this._selector.y(d) - baseline)
            .attr('width', newBarWidth);


        bars.append('text')
            .attr('x', d => this._selector.x(d) + (barWidth / 2))
            .attr('y', d => this._selector.y(d) - 10)
            .attr('text-anchor', 'middle')
            .attr('font-size', 13)
            .style('fill', '#FFF')
            .text(d => this._selector.value(d));

        // NOTE(Olivier): Let's bind the underlying _draw method
        this._redraw = this._redraw.bind(this, chart, target);
    }

    _redraw(chart, target) {
        const bars = target.selectAll('.bar')
            .data(this._dataFactory());

        bars.exit()
            .remove();

        const maxWidth = 30;
        const barWidth = chart.xAxis.scale.ref.bandwidth();
        const newBarWidth = barWidth > maxWidth ? maxWidth : barWidth;
        const xDiff = barWidth > maxWidth ? (barWidth - newBarWidth) / 2 : 0;
        const baseline = min(this._dataFactory(), d => this._selector.y(d));

        const newBars = bars.enter()
            .append('g')
            .attr('class', 'bar')
            .on('mouseenter', (d, i, n) => {
                select(n[i]).select('text')
                    .transition()
                    .duration(300)
                    .attr('font-size', 15)
                    .style('fill', this._getColor(d.emotion));
            })
            .on('mouseout', (d, i, n) => {
                select(n[i]).select('text')
                    .transition()
                    .duration(300)
                    .attr('font-size', 13)
                    .style('fill', '#FFF');
            });;

        // NOTE(Olivier): Add new bars
        newBars.append('rect')
            .transition()
            .duration(300)
            .attr('class', 'main')
            .attr('x', d => this._selector.x(d) + xDiff)
            .attr('y', d => this._selector.y(d))
            .style('fill', (d, i) => this._getColor(i))
            .attr('height', d => chart.height - this._selector.y(d))
            .attr('width', newBarWidth);

        newBars.append('rect')
            .attr('class', 'diff')
            .attr('x', d => this._selector.x(d) + xDiff)
            .attr('y', baseline)
            .style('fill', 'transparent')
            .attr('height', d => this._selector.y(d) - baseline)
            .attr('width', newBarWidth);

        newBars.append('text')
            .transition()
            .duration(300)
            .attr('x', d => this._selector.x(d) + (barWidth / 2))
            .attr('y', d => this._selector.y(d) - 10)
            .attr('text-anchor', 'middle')
            .style('opacity', 0)
            .text(d => this._selector.value(d));

        // NOTE(Olivier): Lets update existing bars
        bars.selectAll('rect.main')
            .transition()
            .duration(300)
            .attr('x', d => this._selector.x(d) + xDiff)
            .attr('y', d => this._selector.y(d))
            .attr('height', d => chart.height - this._selector.y(d))
            .attr('width', newBarWidth);

        bars.selectAll('rect.diff')
            .transition()
            .duration(300)
            .attr('x', d => this._selector.x(d) + xDiff)
            .attr('y', baseline)
            .attr('height', d => this._selector.y(d) - baseline)
            .attr('width', newBarWidth);

        bars.selectAll('text')
            .transition()
            .duration(300)
            .attr('x', d => this._selector.x(d) + (barWidth / 2))
            .attr('y', d => this._selector.y(d) - 10);
    }

    _getColor(emotion) {
        switch (emotion){
        case 'surprise':
            return '#FFDF00';
        case 'afraid':
            return '#E87A0C';
        case 'anger':
            return '#FF0000';
        case 'disgusted':
            return '#910CE8';
        case 'sadness':
            return '#0D5AFF';
        case 'joy':
            return '#2CFF00';
        case 'relieve':
            return '#4CE8D0';
        case 'shame':
            return '#360F0C';
        case 'fear':
            return '#000';
        case 'guilt':
            return '#06374F';
        case 'love':
            return '#E700FF';
        }
    }

    redraw() {
        // NOTE(Olivier): Lets ensure that the _redraw method has been bound.
        if (!this._redraw.hasOwnProperty('prototype')) {
            this._redraw();
        }
    }
}
