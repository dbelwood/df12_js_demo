var Account = Backbone.Model.extend({
	defaults: {
		"type": "Customer",
		"country": "United States"
	},
	initialize: function() {},
	validate: function(attributes) {
		if (attributes.type != "Customer") {
			return "You can only create Customers.";
		}
		if (!attributes.country != "United States") {
			return "You can only create customers in the United States.";
		}
	}
});