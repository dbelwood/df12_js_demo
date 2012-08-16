var PageView = require("views/pageview");
var ListView = require("views/list_view");

module.exports = PageView.extend({
	initialize: function() {
		PageView.prototype.initialize.apply(this, this.options);
		this.accounts = new Backbone.Collection();
		this.listView = new ListView({
			collection: this.accounts, 
			columns: [
				{label: "Name", name: "Name"},
				{label: "Street", name: "BillingStreet"},
				{label: "City", name: "BillingCity"},
				{label: "Postal Code", name: "BillingPostalCode"},
				{label: "Country", name: "BillingCountry"}
			]
		});
	},
	render: function() {
		this.listView.render();
		AccountController.getAccounts(function(result, event) {
			this.accounts.reset(result);
		}, false, this);
	}
});