import template from './ss.emotion_view.html';

SSEmotionViewController.$inject = [];
function SSEmotionViewController() {
    let ctrl = this;
    let computedPositivity = 0.0;

    ctrl.$onInit = function () {
        ctrl.data = ctrl.data || [];
    };

    /*ctrl.$onChanges = function(changes) {
        console.log(changes);
        if(changes.data != undefined) {
            computedPositivity = changes.data.currentValue.reduce((acc, c) => (c.emotion == "joy" ? acc + 1 : acc), 0);
            console.log(computedPositivity);
        }
    };*/

    ctrl.computePositivity = function() {
        let computedPositivity = ctrl.data.reduce((acc, c) => (c.emotion == "joy" ? acc + 1 : acc), 0);
        return computedPositivity / ctrl.data.length;
    }
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
