
/* global adobe, angular */
(function (document, angular, at) {
  'use strict';

  function addModuleDependencies(module, dependencies) {
    dependencies.forEach(function (dependency) {
      if (module.requires.indexOf(dependency) === -1) {
        module.requires.push(dependency);
      }
    });
  }

  function setRouteOfferResolve(route, offerPromiseFn) {
    route.resolve = route.resolve || {};
    route.resolve.offerData = offerPromiseFn;
  }

  function routeServiceDecorator($delegate, options, offerService, logger) {
    $delegate.applyTargetToRoutes = function (routes) {
      Object.keys(routes).forEach(function (routeName) {
        logger.log('location:' + routeName);
        if ($delegate.isRouteAllowed(routeName, options.allowedRoutesFilter, options.disallowedRoutesFilter)) {
          setRouteOfferResolve(routes[routeName], function () {
            return offerService.getOfferPromise(options);
          });
        }
      });
    };
    return $delegate;
  }

  function decorateRouteService() {
    angular.module('target-angular.common')
      .decorator('routeService', ['$delegate', 'options', 'offerService', 'logger', routeServiceDecorator]);
  }

  function initializeModule(module) {
    module.run(['$rootScope', '$route', 'routeService', 'offerService', 'options', 'logger',
      function ($rootScope, $route, routeService, offerService, options, logger) {
        routeService.applyTargetToRoutes($route.routes);
        $rootScope.$on('$viewContentLoaded', function () {
          var offerData = $route.current.locals.offerData;
          offerService.applyOfferPromise(offerData)
            .catch(function (reason) {
              logger.error('AT applyOffer error: ' + reason);
            });
        });
      }
    ]);
  }

  at.registerExtension({
    name: 'angular.initRoutes',
    modules: [],
    register: function () {
      return function (app, opts) {
        at.ext.angular.setupCommon(opts);
        decorateRouteService();
        var appModule = (typeof app === 'string') ? angular.module(app) : app;
        addModuleDependencies(appModule, ['target-angular.common']);
        initializeModule(appModule);
      };
    }
  });
})(document, angular, adobe.target);
