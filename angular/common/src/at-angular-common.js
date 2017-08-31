
/* global adobe, angular */
(function (angular, at) {
  'use strict';

  function getOfferPromise(promise, options) {
    options = options || {};
    var atOpts = {
      mbox: options.mbox,
      params: options.params,
      timeout: options.timeout
    };
    var deferred = promise.defer();
    atOpts.success = function (response) {
      if (response && response.length > 0) {
        deferred.resolve({
          mbox: options.mbox,
          offer: response,
          selector: options.selector || options.element
        });
      } else {
        deferred.resolve({error: 'Empty offer'});
      }
    };
    atOpts.error = function (status, error) {
      deferred.resolve({error: error});
    };
    at.getOffer(atOpts);
    return deferred.promise;
  }

  function applyOfferPromise(promise, options) {
    return promise(function (resolve, reject) {
      if (!options) {
        options = {error: 'Missing offer param'};
      }
      if (options.error) {
        reject(options.error);
        return;
      }
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

  function isRouteAllowed(routeName, opts) {
    return (opts.allowedRoutesFilter.length === 0 || opts.allowedRoutesFilter.indexOf(routeName) !== -1) &&
      !(opts.disallowedRoutesFilter.length > 0 && opts.disallowedRoutesFilter.indexOf(routeName) !== -1);
  }

  function RouteService(options) {
    this.isRouteAllowed = function (routeName) {
      return isRouteAllowed(routeName, options);
    };
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
    angular.module('target.angular.common', [])
      .constant('version', '0.1.2')
      .constant('settings', settings)
      .constant('logger', logger)
      .constant('customOptions', opts || {})

      .factory('options', ['settings', 'customOptions', getOptions])

      .service('routeService', ['options', RouteService])
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
