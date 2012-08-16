// Put your handlebars.js helpers here.
Handlebars.registerHandler("render_column_cell", function(record, column) {
	return Handlebars.SafeString(record[column.name]);
});