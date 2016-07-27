
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

  function setTargetOfferResolve(route, offerPromise) {
    route.resolve = route.resolve || {};
    route.resolve.offerData = offerPromise;
  }

  function routeServiceDecorator($delegate, options, offerService, logger) {
    $delegate.applyTargetToRoutes = function (locations) {
      Object.keys(locations).forEach(function (routeName) {
        logger.debug('location:' + routeName);
        if ($delegate.isRouteAllowed(routeName, options.allowedRoutesFilter, options.disallowedRoutesFilter)) {
          setTargetOfferResolve(locations[routeName], offerService.getOfferPromise);
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
