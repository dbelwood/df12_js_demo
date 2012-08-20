var PageUtils = require('lib/page_utils');
var View = require('views/view');

module.exports = View.extend({
	initialize: function() {
		this.urlParameters = new Backbone.Model(PageUtils.getURLParameters(window.location.search));
		View.prototype.initialize.apply(this, this.options);
	}
});