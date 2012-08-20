var PageView = require("views/pageview");
var AccountListView = require("views/account_list_view");
var Remoting = require("lib/remoting");

module.exports = PageView.extend({
	subscriptions: {
		"accounts:updated": "fetchAccounts"
	},
	initialize: function() {
		PageView.prototype.initialize.apply(this, this.options);
		this.accounts = new Backbone.Collection();
		this.$el = $("body");
		this.listView = new AccountListView({
			collection: this.accounts, 
			columns: [
				{label: "Name", name: "Name"},
				{label: "Street", name: "BillingStreet"},
				{label: "City", name: "BillingCity"},
				{label: "Postal Code", name: "BillingPostalCode"},
				{label: "Country", name: "BillingCountry"}
			],
			el: this.$("#list")
		});
	},
	render: function() {
		this.fetchAccounts();
		this.delegateEvents();
	},
	fetchAccounts: function() {
		Remoting.execute(AccountController.getAll, function(result, event) {
			this.accounts.reset(result);
		}, false, this);
	}
});