 /**
 * Copyright 2016 Adobe Systems, Inc. http://www.adobe.com
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


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
          selector: options.selector,
          element: options.element
        });
      } else {
        deferred.reject('Empty offer');
      }
    };
    atOpts.error = function (status, error) {
      deferred.reject(error);
    };
    at.getOffer(atOpts);
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
      .constant('version', '0.3.0')
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
