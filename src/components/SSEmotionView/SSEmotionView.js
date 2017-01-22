import template from './ss.emotion_view.html';

SSEmotionViewController.$inject = [];
function SSEmotionViewController() {
    let ctrl = this;
    let computedPositivity = 0.0;

    ctrl.$onInit = function () {
        ctrl.data = ctrl.data || [];
    };
}

const SSEmotionView = {
    controller: SSEmotionViewController,
    templateUrl: template,
    bindings: {
        data: '<',
    },
};

export default SSEmotionView;
angular.module('ss').component('ssEmotionView', SSEmotionView);
