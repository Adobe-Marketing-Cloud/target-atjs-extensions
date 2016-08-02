
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

  function setStateOfferResolve(state, offerPromiseFn) {
    state.resolve = state.resolve || {};
    state.resolve.offerData = offerPromiseFn;
  }

  function routeServiceDecorator($delegate, options, offerService, logger) {
    $delegate.applyTargetToState = function (state) {
      if ($delegate.isRouteAllowed(state.url, options)) {
        logger.log('location: ' + state.url);
        setStateOfferResolve(state, function () {
          return offerService.getOfferPromise(options);
        });
      }
    };
    return $delegate;
  }

  function decorateRouteService() {
    angular.module('target-angular.common')
      .decorator('routeService', ['$delegate', 'options', 'offerService', 'logger', routeServiceDecorator]);
  }

  function initializeModule(module) {
    module.run(['$rootScope', '$state', 'routeService', 'offerService', 'options', 'logger',
      function ($rootScope, $state, routeService, offerService, options, logger) {
        $rootScope.$on('$stateChangeStart', function (event, nextState) {
          routeService.applyTargetToState(nextState);
        });

        $rootScope.$on('$viewContentLoaded', function () {
          var offerData = $state.$current.locals['@'].offerData;
          offerService.applyOfferPromise(offerData)
            .catch(function (reason) {
              logger.error('AT applyOffer error: ' + reason);
            });
        });
      }
    ]);
  }

  at.registerExtension({
    name: 'angular.initStates',
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
