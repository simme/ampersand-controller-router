# ampersand-controller-router

Allows you to map "controllers" to routes.

## Usage

```javascript
var AmpRouter = require('ampersand-controller-router');

var myRouter = new AmpRouter({
  // A map of controller constructors. Name is important.
  controllers: {
    index: require('index-controller'),
    profile: require('profile-controller'),
  },

  // Passed to the controller constructor. I use this to pass a reference to
  // my "app" object for example:
  controllerOptions: {
    app: appInstance,
  },

  // Function passed to the route action. I use this to update the current view
  // and stuff.
  routeCallback: appInstance.routeHandler.bind(appInstance),

  // And finally your actual routes. Remember that leading `/` is not necessary
  // and won't actually do what you think.
  routes: {
    '': 'index.home', // On `/` execute the `home` method on the `index` controller
    '/profile': 'profile.user',
  }
});

// Start the router.
// Accepts the same arguments as the original `ampersand-router`. But has
// slightly different defaults:
//
// pushState: true
// hashChange: false
// silent: false
// root: '/'
//
// This means that `start()` will execute the _current_ URL and won't use # for
// routing but rather "real" URLs.
myRouter.start();
```

This router extends the original ampersand-router and all the same events etc
should be emitted.

I usually make my "controllers" subclasses of `ampersand-state`. And the `action`
method will call the callback with an error or an instance of an `ampersand-view`.

So something like this:

```javascript
var AmpState = require('ampersand-state');

module.exports = AmpState.extend({
  app: null,

  // Constructor passed the `controllerOptions` given to the router.
  initialize: function (controllerOptions) {
    this.app = controllerOptions.app;
  },

  // A route handler
  // At the moment the controller action will _always_ be passed a query
  // argument, this is the query string. Should the route accept any parameters,
  // like: `user/:id` that parameter will come _before_ `query`.
  home: function (query, callback) {
    // This is where I configure models etc. The controller is often the "owner"
    // of those models. And the view's model will be the controller itself.
    var view = new HomeView({model: this });

    // The `routeCallback` will take this view object and replace the current
    // main view with this new view.
    callback(null /* no error occured */, view);
  }
});
```

That's a sample of how I use this. For some history on it's origins check out
my blog post [building an app with Ampersand](http://iamsim.me/building-an-app-with-ampersand-js/).

## Notes

This is a very thin wrapper (~70 LOC including comments) around `ampersand-router`.
It currently has no tests but have been working fine for me! :)

## License

MIT
