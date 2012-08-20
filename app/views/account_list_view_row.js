var ListViewRow = require('views/list_view_row');
var AccountDetail = require('views/account_detail');

module.exports = ListViewRow.extend({
	events: {
		"click .cell": "selectAccount"
	},
	selectAccount: function() {
		this.detail = new AccountDetail({el: $("#accountDetail"), model: this.model, fields: this.columns});
		this.detail.show();
	}
})