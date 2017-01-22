import template from './ss.time_selector.html';

SSTimeSelectorController.$inject = [];
function SSTimeSelectorController() {
    let ctrl = this;

    ctrl.$onInit = function () {
        ctrl.availableTime = ['day', 'week', 'month', 'year'];
        ctrl.selectedTime = 'day';
    };

    ctrl.selectTime = function (time) {
        ctrl.selectedTime = time;
        ctrl.onTimeSelect(time);
    };
}

const SSTimeSelector = {
    controller: SSTimeSelectorController,
    templateUrl: template,
    bindings: {
        onTimeSelect: '<',
    },
};

export default SSTimeSelector;
angular.module('ss').component('ssTimeSelector', SSTimeSelector);
