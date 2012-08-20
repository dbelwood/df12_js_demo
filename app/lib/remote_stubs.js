module.exports = {
	AccountController: {
		getAll: function(callback, options) {
			callback(
			[
				{Name: "GenePoint", BillingStreet: "345 Shoreline Park", BillingCity: "Mountain View", BillingPostalCode: "", BillingCountry: ""},
				{Name: "Edge Communications", BillingStreet: "312 Constitution Place", BillingCity: "Austin", BillingPostalCode: "", BillingCountry: ""},
				{Name: "Pyramid Construction Inc.", BillingStreet: "2 Place Jussieu", BillingCity: "Paris", BillingPostalCode: "75251", BillingCountry: "France"},
				{Name: "Dickenson plc", BillingStreet: "1301 Hoch Drive", BillingCity: "Lawrence", BillingPostalCode: "66045", BillingCountry: "USA"},
			]
			, {status: 200});
		},
		save: function(model, callback, options) {
			callback({status: 200});
		}
	}
}