var Detail = require('views/detail');

module.exports = Detail.extend({
	initialize: function() {
		this.saveFunction = AccountController.save;
		this.saveFunctionCallback = this.publishChanges;
		Detail.prototype.initialize.apply(this, this.options);
	},
	publishChanges: function() {
		Backbone.Mediator.publish("accounts:updated");
	}
});