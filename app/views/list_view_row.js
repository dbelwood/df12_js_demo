var View = require('views/view');

module.exports = View.extend({
	tagName: "tr",
	_modelBinder: undefined,
	events: {
		"click .cell": "rowSelect"
	},
	initialize: function() {
		this.columns = this.options.columns;
		this._modelBinder = new Backbone.ModelBinder();
		_.each(this.columns, function(column){
			this.rowHtml += "<td class='cell' data-name='"+column.name+"'></td>";
		}, this);
	},
	render: function() {
		this.$el.html(this.rowHtml);
        this._modelBinder.bind(this.model, this.el, Backbone.ModelBinder.createDefaultBindings(this.el, 'data-name'));
        this.delegateEvents();
		return this;
	},
	rowSelect: function() {
		console.log(this.model.get("Name") + " selected.");
	}
});