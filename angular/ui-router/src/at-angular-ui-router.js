
/* global adobe, angular */
(function (angular, at) {
  'use strict';

  function addModuleDependencies(module, dependencies) {
    dependencies.forEach(function (dependency) {
      if (module.requires.indexOf(dependency) === -1) {
        module.requires.push(dependency);
      }
    });
  }

  var getOfferResolve = {
    token: 'targetOfferData',
    policy: {
      when: 'EAGER',
      async: 'WAIT'
    },
    deps: ['offerService', 'options'],
    resolveFn: function (offerService, options) {
      return offerService.getOfferPromise(options);
    }
  };

  function applyOffer(offerService, offer, logger) {
    offerService.applyOfferPromise(offer)
      .catch(function (reason) {
        logger.error('AT applyOffer error: ' + reason);
      });
  }

  function initializeModule(module) {
    module.run(['$transitions', 'offerService', 'routeService', 'logger',
      function ($transitions, offerService, routeService, logger) {
        $transitions.onCreate({}, function (transition) {
          if (this.routeService.isRouteAllowed(transition.to().url)) {
            transition.addResolvable(getOfferResolve, transition.to().name);
          }
        }, {
          bind: {
            routeService: routeService
          }
        });

        $transitions.onSuccess({}, function (transition) {
          if (transition.getResolveTokens().indexOf('targetOfferData') > -1) {
            var offer = transition.injector().get('targetOfferData');
            applyOffer(this.offerService, offer, logger);
          }
        }, {
          bind: {
            offerService: offerService,
            logger: logger
          }
        });
      }]);
  }

  at.ext.angular.initStates = function (app, opts) {
    at.ext.angular.setupCommon(opts);
    var appModule = (typeof app === 'string') ? angular.module(app) : app;
    addModuleDependencies(appModule, ['target.angular.common']);
    initializeModule(appModule);
  };
})(angular, adobe.target);
