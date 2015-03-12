//
// # Ampersand Controller Router
//
/* jshint browserify: true */
'use strict';

var AmpRouter = require('ampersand-router');
var defaults = require('amp-defaults');

module.exports = AmpRouter.extend({
  props: {
    controllers: 'object',
    controllerOptions: 'object',
    routeCallback: 'function',
  },

  //
  // ## Initialize
  //
  // * **options** object of options:
  //   * **controllers**, object of controllers. The key should be the name of
  //     the controller (as used in the routes) and the value should be a
  //     controller _constructor_.
  //   * **controllerOptions**, optional options passed to controller
  //     constructor.
  //   * **routeCallback**, passed as the last argument to the route action.
  //
  initialize: function initRouter(options) {
    this.controllers = options.controllers || {};
    this.controllerOptions = options.controllerOptions || {};
    this.routeCallback = options.routeCallback || function () {};
  },

  //
  // ## Start the Router
  //
  // Will start the router. This will parse the _current_ URL and start
  // monitoring the URL for changes.
  //
  // Options are the same as for the Ampersand router.
  //
  start: function (opts) {
    this.history.start(defaults(opts || {}, {
      pushState: true,
      hashChange: false,
      silent: false,
      root: '/',
    }));
  },

  //
  // ## Execute
  //
  // Internal function for handling the calling of the controller.
  //
  execute: function (cb, args, name) {
    var parts = name.split('.');
    if (parts.length !== 2) {
      throw new Error('Invalid route definition: ' + name);
    }
    var controller = new (this.controllers[parts[0]])(this.controllerOptions);
    var action = controller[parts[1]];

    args.push(this.routeCallback);

    if (typeof action === 'function') {
      action.apply(controller, args);
    }
  },
});
