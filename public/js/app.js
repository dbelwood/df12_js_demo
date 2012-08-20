(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle) {
    for (var key in bundle) {
      if (has(bundle, key)) {
        modules[key] = bundle[key];
      }
    }
  }

  globals.require = require;
  globals.require.define = define;
  globals.require.brunch = true;
})();

window.require.define({"lib/page_utils": function(exports, require, module) {
  var PageUtils = {
  	getURLParameters: function(url) {
  		url = url.replace('?', '');
  		params = {};
  		_.each(url.split('&'), function(element) {
  			var items = element.split('=');
  			params[items[0]] = decodeURIComponent(items[1]);
  		});
  		return params;
  	}
  }

  module.exports = PageUtils;
}});

window.require.define({"lib/remote_stubs": function(exports, require, module) {
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
}});

window.require.define({"lib/remoting": function(exports, require, module) {
  var __slice = [].slice;

  var Remoting = {
    execute: function() {
      var args, callback, escapeResults, options, remotedFunction, scope, _i;
      remotedFunction = arguments[0], args = 5 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 3) : (_i = 1, []), callback = arguments[_i++], escapeResults = arguments[_i++], scope = arguments[_i++];
      callback = _.bind(callback, scope);
      if (escapeResults == null) {
        escapeResults = true;
      }
      args.push(callback);
      options = {
        escape: escapeResults
      };
      args.push(options);
      return remotedFunction.apply(scope, args);
    }
  };
  module.exports = Remoting;
}});

window.require.define({"lib/router": function(exports, require, module) {
  var application = require('application');

  module.exports = Backbone.Router.extend({
    routes: {
      '': 'home'
    },

    home: function() {
      $('body').html(application.homeView.render().el);
    }
  });
  
}});

window.require.define({"lib/view_helper": function(exports, require, module) {
  // Put your handlebars.js helpers here.
}});

window.require.define({"models/account": function(exports, require, module) {
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
}});

window.require.define({"models/account_collection": function(exports, require, module) {
  
}});

window.require.define({"models/collection": function(exports, require, module) {
  // Base class for all collections.
  module.exports = Backbone.Collection.extend({
    
  });
  
}});

window.require.define({"models/model": function(exports, require, module) {
  // Base class for all models.
  module.exports = Backbone.Model.extend({
    
  });
  
}});

window.require.define({"pages/accounts": function(exports, require, module) {
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
}});

window.require.define({"views/account_detail": function(exports, require, module) {
  var Detail = require('views/detail');

  module.exports = Detail.extend({
  	initialize: function() {
  		this.saveFunction = AccountController.save;
  		this.saveFunctionCallback = this.publishChanges;
  		Detail.prototype.initialize.apply(this, this.options);
  	},
  	publishChanges: function() {
  		Backbone.Mediator.publish("accounts:updated");
  	}
  });
}});

window.require.define({"views/account_list_view": function(exports, require, module) {
  var ListView = require('views/list_view');
  var AccountListViewRow = require('views/account_list_view_row');

  module.exports = ListView.extend({
  	rowView: AccountListViewRow
  });
}});

window.require.define({"views/account_list_view_row": function(exports, require, module) {
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
}});

window.require.define({"views/detail": function(exports, require, module) {
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
}});

window.require.define({"views/home_view": function(exports, require, module) {
  var View = require('./view');
  var template = require('./templates/home');

  module.exports = View.extend({
    id: 'home-view',
    template: template
  });
  
}});

window.require.define({"views/list_view": function(exports, require, module) {
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
}});

window.require.define({"views/list_view_row": function(exports, require, module) {
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
}});

window.require.define({"views/pageview": function(exports, require, module) {
  var PageUtils = require('lib/page_utils');
  var View = require('views/view');

  module.exports = View.extend({
  	initialize: function() {
  		this.urlParameters = new Backbone.Model(PageUtils.getURLParameters(window.location.search));
  		View.prototype.initialize.apply(this, this.options);
  	}
  });
}});

window.require.define({"views/templates/detail_template": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n	<label for=";
    foundHelper = helpers.name;
    stack1 = foundHelper || depth0.name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "name", { hash: {} }); }
    buffer += escapeExpression(stack1) + ">";
    foundHelper = helpers.label;
    stack1 = foundHelper || depth0.label;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "label", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</label><span data-name=\"";
    foundHelper = helpers.name;
    stack1 = foundHelper || depth0.name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\"></span>\n	";
    return buffer;}

    buffer += "<div class=\"modal-header\">\n	<button type=\"button\" class=\"close\" data-dismiss=\"modal\">×</button>\n	<h3>";
    foundHelper = helpers.title;
    stack1 = foundHelper || depth0.title;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "title", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h3>\n</div>\n<div class=\"modal-body\">\n	";
    foundHelper = helpers.fields;
    stack1 = foundHelper || depth0.fields;
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n</div>\n<div class=\"modal-footer\">\n	<a href=\"#\" data-dismiss=\"modal\">Close</a>\n	<a href=\"#\" id=\"edit\" class=\"btn btn-primary\">Edit</a>\n</div>";
    return buffer;});
}});

window.require.define({"views/templates/edit_template": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n			<label for=";
    foundHelper = helpers.name;
    stack1 = foundHelper || depth0.name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "name", { hash: {} }); }
    buffer += escapeExpression(stack1) + ">";
    foundHelper = helpers.label;
    stack1 = foundHelper || depth0.label;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "label", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</label>\n			<input data-name=\"";
    foundHelper = helpers.name;
    stack1 = foundHelper || depth0.name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\"></input>\n			";
    return buffer;}

    buffer += "<div class=\"modal-header\">\n	<button type=\"button\" class=\"close\" data-dismiss=\"modal\">×</button>\n	<h3>";
    foundHelper = helpers.title;
    stack1 = foundHelper || depth0.title;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "title", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h3>\n</div>\n<div class=\"modal-body\">\n	<form class=\"form-vertical\">\n		<fieldset>\n			";
    foundHelper = helpers.fields;
    stack1 = foundHelper || depth0.fields;
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		</fieldset>\n	</form>\n</div>\n<div class=\"modal-footer\">\n	<a href=\"#\" data-dismiss=\"modal\">Close</a>\n	<a href=\"#\" id=\"save\" class=\"btn btn-primary\">Save</a>\n</div>";
    return buffer;});
}});

window.require.define({"views/templates/home": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<div id=\"content\">\n  <h1>brunch</h1>\n  <h2>Welcome!</h2>\n  <ul>\n    <li><a href=\"http://brunch.readthedocs.org/\">Documentation</a></li>\n    <li><a href=\"https://github.com/brunch/brunch/issues\">Github Issues</a></li>\n    <li><a href=\"https://github.com/brunch/twitter\">Twitter Example App</a></li>\n    <li><a href=\"https://github.com/brunch/todos\">Todos Example App</a></li>\n  </ul>\n</div>\n";});
}});

window.require.define({"views/templates/list_contents": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n		<th>";
    foundHelper = helpers.label;
    stack1 = foundHelper || depth0.label;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "label", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</th>\n		";
    return buffer;}

    buffer += "<thead>\n	<tr>\n		";
    foundHelper = helpers.columns;
    stack1 = foundHelper || depth0.columns;
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n	</tr>\n</thead>\n<tbody>\n</tbody>";
    return buffer;});
}});

window.require.define({"views/view": function(exports, require, module) {
  require('lib/view_helper');

  // Base class for all views.
  module.exports = Backbone.View.extend({
    initialize: function() {
      this.render = _.bind(this.render, this);
    },

    template: function() {},
    getRenderData: function() {},

    render: function() {
      this.$el.html(this.template(this.getRenderData()));
      this.afterRender();
      return this;
    },

    afterRender: function() {}
  });
  
}});

