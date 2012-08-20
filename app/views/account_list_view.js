var ListView = require('views/list_view');
var AccountListViewRow = require('views/account_list_view_row');

module.exports = ListView.extend({
	rowView: AccountListViewRow
});