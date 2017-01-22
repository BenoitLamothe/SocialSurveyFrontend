import template from './ss.emotion_chart.html';
import {BarChart} from '../../charting/BarChart';

SSEmotionChartController.$inject = ['$element', '$timeout'];
function SSEmotionChartController($element, $timeout) {
    const ctrl = this;
    let chart = null;

    const margin = {top: 20, right: 20, bottom: 30, left: 40};

    ctrl.$onInit = function () {
        ctrl.selector = {
            x: d => d.emotion,
            y: d => d.count,
            format: x => x,
        };
    };

    ctrl.$onChanges = function(changes) {
        if(changes.dataset) {
            if(chart) {
                chart.dataset = changes.dataset.currentValue;
            }
        }
    };

    ctrl.$postLink = function() {
        $timeout(() => {
            ctrl.target = $element.find('#chart').get(0);
            const width = ctrl.target.clientWidth - margin.left - margin.right;
            const height = ctrl.target.clientHeight - margin.top - margin.bottom;

            chart = new BarChart(ctrl.target, width, height, margin, ctrl.selector, ctrl.dataset, {});
        });
    }
}

const SSEmotionChart = {
    controller: SSEmotionChartController,
    templateUrl: template,
    bindings: {
        dataset: '<',
    },
};

export default SSEmotionChart;
angular.module('ss').component('ssEmotionChart', SSEmotionChart);
