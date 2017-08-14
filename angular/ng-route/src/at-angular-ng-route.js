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

  function setRouteOfferResolve(route, offerPromiseFn) {
    route.resolve = route.resolve || {};
    route.resolve.offerData = offerPromiseFn;
  }

  function NgRouteService(routeService, offerService, options, logger) {
    this.applyTargetToRoutes = function (routes) {
      Object.keys(routes).forEach(function (routeName) {
        if (routeService.isRouteAllowed(routeName)) {
          logger.log('location: ' + routeName);
          setRouteOfferResolve(routes[routeName], function () {
            return offerService.getOfferPromise(options);
          });
        }
      });
    };
  }

  function initializeModule(module) {
    module.service('ngRouteService', ['routeService', 'offerService', 'options', 'logger', NgRouteService]);
    module.run(['$rootScope', '$route', 'offerService', 'ngRouteService', 'logger',
      function ($rootScope, $route, offerService, ngRouteService, logger) {
        ngRouteService.applyTargetToRoutes($route.routes);

        $rootScope.$on('$viewContentLoaded', function () {
          var offerData = $route.current.locals.offerData;
          if (offerData) {
            offerService.applyOfferPromise(offerData)
              .catch(function (reason) {
                logger.error('AT applyOffer error: ' + reason);
              });
          }
        });
      }]);
  }

  at.ext.angular.initRoutes = function (app, opts) {
    at.ext.angular.setupCommon(opts);
    var appModule = (typeof app === 'string') ? angular.module(app) : app;
    addModuleDependencies(appModule, ['target.angular.common']);
    initializeModule(appModule);
  };
})(angular, adobe.target);
