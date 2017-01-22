import template from './ss.emotion_chart.html';
import * as d3 from 'd3';

SSEmotionChartController.$inject = [];
function SSEmotionChartController() {
    let ctrl = this;

    ctrl.$onInit = function () {
        ctrl.setup('#chart');
    };

    ctrl.setup = function (targetID) {
        var margin          = { top: 0, right: 0, bottom: 0, left: 0 },
            width           = 600 - margin.left - margin.right,
            height          = 400 - margin.top - margin.bottom,
            categoryIndent  = 4 * 15 + 5,
            defaultBarWidth = 2000;

        //Set up scales
        var x = d3.scaleLinear()
        .domain([0, defaultBarWidth])
        .range([0, width]);
        var y = d3.scaleOrdinal();

        //Create SVG element
        d3.select(targetID).selectAll("svg").remove()
        var svg = d3.select(targetID).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        //Package and export settings
        var settings = {
            margin: margin, width: width, height: height, categoryIndent: categoryIndent,
            svg: svg, x: x, y: y
        };

        return settings;
    };

    ctrl.redrawChart = function (targetID, newdata) {
        console.log(settings)
        //Import settings
        var margin = settings.margin, width = settings.width, height = settings.height, categoryIndent = settings.categoryIndent,
            svg                                                                                        = settings.svg, x = settings.x, y = settings.y;

        //Reset domains
        y.domain(newdata.sort(function (a, b) {
            return b.value - a.value;
        })
        .map(function (d) {
            return d.key;
        }));
        var barmax = d3.max(newdata, function (e) {
            return e.value;
        });
        x.domain([0, barmax]);

    }
}

const SSEmotionChart = {
    controller: SSEmotionChartController,
    templateUrl: template,
    bindings: {
        availableEmotions: '<',
        data: '<',
    },
};

export default SSEmotionChart;
angular.module('ss').component('ssEmotionChart', SSEmotionChart);
