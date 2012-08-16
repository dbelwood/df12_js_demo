var View = require('view/view');
var template = require('views/templates/list_contents');

module.exports = View.extend({
	template: template,
	initialize: function() {
		View.prototype.initialize.apply(this, this.options);
		this.collection.on("reset", this.render);
		this.columns = this.options.columns;
	},

	render: function() {
		this.el = $(this.el);
		records = this.collection.map(function(model){
			return model.attributes;
		});
		this.el.append(this.template({
			columns: this.columns,
			records: records
		}));
	}
});