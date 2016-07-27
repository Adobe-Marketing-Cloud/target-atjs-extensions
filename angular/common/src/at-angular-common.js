
/* global adobe, angular */
(function (angular, at) {
  'use strict';

  function getOfferPromise(promise, options) {
    options = options || {};
    var deferred = promise.defer();
    options.success = function (response) {
      if (response && response.length > 0) {
        options.offer = response;
        deferred.resolve({
          offer: response,
          selector: options.selector,
          element: options.element
        });
      } else {
        deferred.reject('Empty offer');
      }
    };
    options.error = function (status, error) {
      deferred.reject(error);
    };
    at.getOffer(options);
    return deferred.promise;
  }

  function applyOfferPromise(promise, options) {
    return promise(function (resolve, reject) {
      at.applyOffer(options);
      resolve();
    });
  }

  function OfferService(promise) {
    this.getOfferPromise = function (options) {
      return getOfferPromise(promise, options);
    };
    this.applyOfferPromise = function (options) {
      return applyOfferPromise(promise, options);
    };
  }

  function isRouteAllowed(routeName, allowed, disallowed) {
    return (allowed.length === 0 || allowed.indexOf(routeName) !== -1) &&
      !(disallowed.length > 0 && disallowed.indexOf(routeName) !== -1);
  }

  function RouteService() {
    this.isRouteAllowed = isRouteAllowed;
  }

  function getOptions(settings, opts) {
    return {
      mbox: opts.mbox || settings.globalMboxName,
      timeout: opts.timeout || settings.timeout,
      globalMboxAutoCreate: settings.globalMboxAutoCreate,
      params: opts.params || null,
      selector: opts.selector || null,
      allowedRoutesFilter: opts.allowedRoutesFilter || [],
      disallowedRoutesFilter: opts.disallowedRoutesFilter || [],
      appendToSelector: opts.appendToSelector || false
    };
  }

  function setupCommonModule(settings, logger, opts) {
    angular.module('target-angular.common', [])
      .constant('version', '0.3.0')
      .constant('settings', settings)
      .constant('logger', logger)
      .constant('customOptions', opts)

      .factory('options', ['settings', 'customOptions', getOptions])

      .service('routeService', RouteService)
      .service('offerService', ['$q', OfferService]);
  }

  at.registerExtension({
    name: 'angular.setupCommon',
    modules: ['settings', 'logger'],
    register: function (settings, logger) {
      return function (opts) {
        setupCommonModule(settings, logger, opts);
      };
    }
  });
})(angular, adobe.target);
