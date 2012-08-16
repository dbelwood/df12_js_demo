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