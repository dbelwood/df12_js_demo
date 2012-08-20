var View = require('views/view');
var template = require('views/templates/list_contents');
var ListViewRow = require('views/list_view_row');

module.exports = View.extend({
	template: template,
	rowView: ListViewRow,
	initialize: function() {
		View.prototype.initialize.apply(this, this.options);
		this.collection.on("reset", this.render, this);
		this.columns = this.options.columns;
		this.$el.append(this.template({columns: this.columns}));
		this.initializeCollectionBinding();
	},
	initializeCollectionBinding: function() {
		var columns = this.columns;
		var rowView = this.rowView;
		this.viewManagerFactory = new Backbone.CollectionBinder.ViewManagerFactory(function(model) {
			return new rowView({model: model, columns: columns});
		});
		this.collectionBinder = new Backbone.CollectionBinder(this.viewManagerFactory);
		this.collectionBinder.bind(this.collection, this.$("tbody"));
	},
	render: function() {
	}
});