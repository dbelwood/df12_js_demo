var View = require('views/view');
var detailTemplate = require('views/templates/detail_template');
var editTemplate = require('views/templates/edit_template');
var Remoting = require('lib/remoting');

module.exports = View.extend({
	detailTemplate: detailTemplate,
	editTemplate: editTemplate,
	_modelBinder: undefined,
	saveFunction: undefined,
	saveFunctionCallback: undefined,
	events: {
		"click #edit": "edit",
		"click #save": "save"
	},
	initialize: function() {
		this.fields = this.options.fields;
		this._modelBinder = new Backbone.ModelBinder();
	},
	show: function() {
		this.$el.children().remove();
		this.$el.append(this.detailTemplate({title: this.model.get("Name"), fields: this.fields}));
		this._modelBinder.bind(this.model, this.el, Backbone.ModelBinder.createDefaultBindings(this.el, 'data-name'));
        this.delegateEvents();
		this.$el.modal('show');
	},
	edit: function() {
		this.$el.children().remove();
		this.$el.append(this.editTemplate({title: "Edit " + this.model.get("Name"), fields: this.fields}));
		this._modelBinder.bind(this.model, this.el, Backbone.ModelBinder.createDefaultBindings(this.el, 'data-name'));
        this.delegateEvents();
	},
	save: function() {
		Remoting.execute(this.saveFunction, this.model.toJSON(), function(result, event) {
			this.$el.modal('hide');
			this.$el.children().remove();
			this.saveFunctionCallback(result);
			this._modelBinder.unbind();
		}, false, this);
	}
});