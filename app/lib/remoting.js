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