    /**
 * Created by olivier on 2017-01-21.
 */
import template from './ss.app.html'

SSAppController.$inject = [];
function SSAppController() {
	const ctrl = this;

	ctrl.$onInit = function () {
        ctrl.isSearchSuccessfull = true;
    };

	ctrl.submitSearch = function () {
	    ctrl.isSearchSuccessfull = !ctrl.isSearchSuccessfull;
    };
}

const SSApp = {
	controller: SSAppController,
	templateUrl: template,
	bindings: {}
};

export default SSApp;

angular.module('ss').component('ssApp', SSApp);
