/**
 * Created by olivier on 2017-01-21.
 */
import template from './ss.app.html'

SSAppController.$inject = [];
function SSAppController() {
	const ctrl = this;

	ctrl.name = 'Yann';
}

const SSApp = {
	controller: SSAppController,
	templateUrl: template,
	bindings: {}
};

export default SSApp;

angular.module('ss').component('ssApp', SSApp);
