
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

  function setStateOfferResolve(state, offerPromiseFn) {
    state.resolve = state.resolve || {};
    state.resolve.offerData = offerPromiseFn;
  }

  function NgStateService(routeService, offerService, options, logger) {
    this.applyTargetToStates = function (states) {
      states.forEach(function (state) {
        if (routeService.isRouteAllowed(state.url)) {
          logger.log('location: ' + state.url);
          setStateOfferResolve(state, function () {
            return offerService.getOfferPromise(options);
          });
        }
      });
    };
  }

  function initializeModule(module) {
    module.service('ngStateService', ['routeService', 'offerService', 'options', 'logger', NgStateService]);
    module.run(['$rootScope', '$state', 'offerService', 'ngStateService', 'logger',
      function ($rootScope, $state, offerService, ngStateService, logger) {
        ngStateService.applyTargetToStates($state.get());

        $rootScope.$on('$viewContentLoaded', function () {
          var offerData = $state.$current.locals.globals.offerData;
          if (offerData) {
            offerService.applyOfferPromise(offerData)
              .catch(function (reason) {
                logger.error('AT applyOffer error: ' + reason);
              });
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
