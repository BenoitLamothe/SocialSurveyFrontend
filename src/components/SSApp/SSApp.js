/**
 * Created by olivier on 2017-01-21.
 */
import template from './ss.app.html'

SSAppController.$inject = ['$interval', '$scope'];
function SSAppController($interval, $scope) {
    const ctrl = this;

    ctrl.$onInit = function () {
        ctrl.wsClient = new WebSocket('ws://172.31.195.115:8080/');
        ctrl.wsClient.onmessage = ctrl.onWebSocketMessage;
        ctrl.searchRequest = {
            command: 'search',
            providers: ['twitter', 'reddit'],
            args: {
                query: {
                    text: 'Obama',
                    type: 'mixed',
                    time: 'day',
                    max: 50,
                }
            }
        };
        ctrl.availableEmotions = ['surprise', 'anger', 'disgust', 'fear', 'guilt', 'joy', 'love', 'relieve', 'sadness', 'shame'];
        ctrl.emotionData = [];
        ctrl.aggregateData = [];
    };

    ctrl.addOrRemoveProvider = function (provider) {
        const providerIndex = ctrl.searchRequest.providers.indexOf(provider);
        if (providerIndex === -1) {
            ctrl.searchRequest.providers.push(provider);
        } else {
            ctrl.searchRequest.providers.splice(providerIndex, 1)
        }
    };

    ctrl.selectTime = function (time) {
        ctrl.searchRequest.args.query.time = time;
    };

    ctrl.submitSearch = function () {
        ctrl.isSearchSuccessfull = true;
        ctrl.emotionData = [];
        ctrl.generateFakeDataAtRandomIntervals();
        // ctrl.wsClient.send(JSON.stringify(ctrl.searchRequest));
    };

    ctrl.onWebSocketMessage = function (event) {
        const eventData = JSON.parse(event.data);
        let data = Object.assign(eventData, {
            text: eventData.raw_text,
            emotion: eventData.sentiment[0].sentiment.toLowerCase().replace('emotion_', ''),
        });
        ctrl.emotionData.unshift(data);

        const emotionIndex = ctrl.aggregateData.findIndex(x => x.emotion === data.emotion);
        if(emotionIndex > -1) {
            ctrl.aggregateData[emotionIndex].count++;
            ctrl.aggregateData = [...ctrl.aggregateData];
        } else {
            ctrl.aggregateData = [...ctrl.aggregateData, {
                emotion: data.emotion,
                count: 1
            }];
        }
        console.log(eventData);
        $scope.$apply();
    };

    ctrl.$onDestroy = function () {
        ctrl.wsClient.close();
        $interval.cancel(ctrl.dataInterval);
    };

    // fake data generation
    ctrl.generateFakeDataAtRandomIntervals = function () {
        ctrl.dataInterval = $interval(() => {
            const randomData = getRandomInt(0, 9);

            switch (randomData) {
            case 0:
                ctrl.emotionData.unshift({ provider: 'twitter', emotion: 'surprise', text: "In every way - class, intelligence, SHEER NUMBERS - the #WomensMarch has outdone #DonaldTrump's inauguration. Oops!! " });
                break;
            case 1:
                ctrl.emotionData.unshift({ provider: 'twitter', emotion: 'anger', text: "All who desire a just society must oppose #DonaldTrump b/c he is a fascist & a danger to democracy" });
                break;
            case 2:
                ctrl.emotionData.unshift({ provider: 'twitter', emotion: 'disgust', text: "All who desire a just society must oppose #DonaldTrump b/c he is a fascist & a danger to democracy" });
                break;
            case 3:
                ctrl.emotionData.unshift({ provider: 'twitter', emotion: 'fear', text: "All who desire a just society must oppose #DonaldTrump b/c he is a fascist & a danger to democracy" });
                break;
            case 4:
                ctrl.emotionData.unshift({ provider: 'twitter', emotion: 'guilt', text: "All who desire a just society must oppose #DonaldTrump b/c he is a fascist & a danger to democracy" });
                break;
            case 5:
                ctrl.emotionData.unshift({ provider: 'twitter', emotion: 'joy', text: "All who desire a just society must oppose #DonaldTrump b/c he is a fascist & a danger to democracy" });
                break;
            case 6:
                ctrl.emotionData.unshift({ provider: 'reddit', emotion: 'love', text: "All who desire a just society must oppose #DonaldTrump b/c he is a fascist & a danger to democracy" });
                break;
            case 7:
                ctrl.emotionData.unshift({ provider: 'reddit', emotion: 'relieve', text: "All who desire a just society must oppose #DonaldTrump b/c he is a fascist & a danger to democracy" });
                break;
            case 8:
                ctrl.emotionData.unshift({ provider: 'reddit', emotion: 'sadness', text: "All who desire a just society must oppose #DonaldTrump b/c he is a fascist & a danger to democracy" });
                break;
            case 9:
                ctrl.emotionData.unshift({ provider: 'reddit', emotion: 'shame', text: "All who desire a just society must oppose #DonaldTrump b/c he is a fascist & a danger to democracy" });
                break;
            }
        }, 500);
    };

    ctrl.stopGettingData = function () {
        $interval.cancel(ctrl.dataInterval);
        ctrl.wsClient.close();
    };

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

const SSApp = {
    controller: SSAppController,
    templateUrl: template,
    bindings: {}
};

export default SSApp;

angular.module('ss').component('ssApp', SSApp);
