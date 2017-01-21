import template from './ss.emotion_view.html';

SSEmotionViewController.$inject = ['$interval', '$timeout', '$element', '$document'];
function SSEmotionViewController($interval, $timeout, $element, $document) {
    let ctrl = this;

    ctrl.$onInit = function () {
        ctrl.nuanceResponses = [];
        // ctrl.nuanceResponses.push({ emotion: 'sadness', text: "All who desire a just society must oppose #DonaldTrump b/c he is a fascist & a danger to democracy All who desire a just society must oppose #DonaldTrump b/c he is a fascist & a danger to democracy All who desire a just society must oppose #DonaldTrump b/c he is a fascist & a danger to democracy" });
        // ctrl.nuanceResponses.push({ emotion: 'sadness', text: "All who desire a just society must oppose #DonaldTrump b/c he is a fascist & a danger to democracy" });
        // ctrl.nuanceResponses.push({ emotion: 'sadness', text: "All who desire a just society must oppose #DonaldTrump b/c he is a fascist & a danger to democracy" });
        // ctrl.nuanceResponses.push({ emotion: 'sadness', text: "All who desire a just society must oppose #DonaldTrump b/c he is a fascist & a danger to democracy" });
        // ctrl.nuanceResponses.push({ emotion: 'sadness', text: "All who desire a just society must oppose #DonaldTrump b/c he is a fascist & a danger to democracy" });
        // ctrl.nuanceResponses.push({ emotion: 'sadness', text: "All who desire a just society must oppose #DonaldTrump b/c he is a fascist & a danger to democracy" });
        // ctrl.nuanceResponses.push({ emotion: 'sadness', text: "All who desire a just society must oppose #DonaldTrump b/c he is a fascist & a danger to democracy" });
        // ctrl.nuanceResponses.push({ emotion: 'sadness', text: "All who desire a just society must oppose #DonaldTrump b/c he is a fascist & a danger to democracy" });
        // ctrl.nuanceResponses.push({ emotion: 'sadness', text: "All who desire a just society must oppose #DonaldTrump b/c he is a fascist & a danger to democracy" });
        // ctrl.nuanceResponses.push({ emotion: 'sadness', text: "All who desire a just society must oppose #DonaldTrump b/c he is a fascist & a danger to democracy" });
        // ctrl.nuanceResponses.push({ emotion: 'sadness', text: "All who desire a just society must oppose #DonaldTrump b/c he is a fascist & a danger to democracy" });
        // ctrl.nuanceResponses.push({ emotion: 'sadness', text: "All who desire a just society must oppose #DonaldTrump b/c he is a fascist & a danger to democracy" });
        // ctrl.nuanceResponses.push({ emotion: 'sadness', text: "All who desire a just society must oppose #DonaldTrump b/c he is a fascist & a danger to democracy" });
        // ctrl.nuanceResponses.push({ emotion: 'sadness', text: "All who desire a just society must oppose #DonaldTrump b/c he is a fascist & a danger to democracy" });
        // ctrl.nuanceResponses.push({ emotion: 'sadness', text: "All who desire a just society must oppose #DonaldTrump b/c he is a fascist & a danger to democracy" });

        ctrl.generateFakeDataAtRandomIntervals();
    };

    ctrl.generateFakeDataAtRandomIntervals = function () {
        ctrl.dataInterval = $interval(() => {
            const randomData = getRandomInt(0, 9);

            switch (randomData) {
            case 0:
                ctrl.nuanceResponses.unshift({ emotion: 'surprise', text: "In every way - class, intelligence, SHEER NUMBERS - the #WomensMarch has outdone #DonaldTrump's inauguration. Oops!! " });
                break;
            case 1:
                ctrl.nuanceResponses.unshift({ emotion: 'anger', text: "All who desire a just society must oppose #DonaldTrump b/c he is a fascist & a danger to democracy" });
                break;
            case 2:
                ctrl.nuanceResponses.unshift({ emotion: 'disgust', text: "All who desire a just society must oppose #DonaldTrump b/c he is a fascist & a danger to democracy" });
                break;
            case 3:
                ctrl.nuanceResponses.unshift({ emotion: 'fear', text: "All who desire a just society must oppose #DonaldTrump b/c he is a fascist & a danger to democracy" });
                break;
            case 4:
                ctrl.nuanceResponses.unshift({ emotion: 'guilt', text: "All who desire a just society must oppose #DonaldTrump b/c he is a fascist & a danger to democracy" });
                break;
            case 5:
                ctrl.nuanceResponses.unshift({ emotion: 'joy', text: "All who desire a just society must oppose #DonaldTrump b/c he is a fascist & a danger to democracy" });
                break;
            case 6:
                ctrl.nuanceResponses.unshift({ emotion: 'love', text: "All who desire a just society must oppose #DonaldTrump b/c he is a fascist & a danger to democracy" });
                break;
            case 7:
                ctrl.nuanceResponses.unshift({ emotion: 'releaf', text: "All who desire a just society must oppose #DonaldTrump b/c he is a fascist & a danger to democracy" });
                break;
            case 8:
                ctrl.nuanceResponses.unshift({ emotion: 'sadness', text: "All who desire a just society must oppose #DonaldTrump b/c he is a fascist & a danger to democracy" });
                break;
            case 9:
                ctrl.nuanceResponses.unshift({ emotion: 'shame', text: "All who desire a just society must oppose #DonaldTrump b/c he is a fascist & a danger to democracy" });
                break;
            }
        }, 500);
    };

    ctrl.$onDestroy = function () {
        $interval.cancel(ctrl.dataInterval);
    };

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

const SSEmotionView = {
    controller: SSEmotionViewController,
    templateUrl: template,
    bindings: {},
};

export default SSEmotionView;
angular.module('ss').component('ssEmotionView', SSEmotionView);
