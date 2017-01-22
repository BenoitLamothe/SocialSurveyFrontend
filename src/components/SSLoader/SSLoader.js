import template from './ss.loader.html';

SSLoaderController.$inject = [];
function SSLoaderController() {
	let ctrl = this;

	ctrl.$onInit = function () {

	};
}

const SSLoader = {
	controller: SSLoaderController,
	templateUrl: template,
	bindings: {},
};

export default SSLoader;
angular.module('ss').component('ssLoader', SSLoader);
