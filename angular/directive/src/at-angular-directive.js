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

/* global adobe, angular, offerService, options */
'use strict';
(function (document, angular, at) {
  function getOfferPromise(promise, options) {
    options = options || {};
    var deferred = promise.defer();
    options.success = function (response) {
      if (response && response.length > 0) {
        deferred.resolve(response, options);
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

  function applyOfferPromise(promise, offer, options) {
    return promise(function (resolve, reject) {
      options = options || {};
      options.offer = offer;
      at.applyOffer(options);
      resolve();
    });
  }

  function OfferService(promise) {
    this.getOfferPromise = function (options) {
      return getOfferPromise(promise, options);
    };
    this.applyOfferPromise = function (offer, options) {
      return applyOfferPromise(promise, offer, options);
    };
  }

  function isRouteAllowed(routeName, allowed, disallowed) {
    return (allowed.length === 0 || allowed.indexOf(routeName) !== -1) &&
      !(disallowed.length > 0 && disallowed.indexOf(routeName) !== -1);
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
      .constant('routeUtil', {isRouteAllowed: isRouteAllowed})

      .factory('options', ['settings', 'customOptions', getOptions])

      .service('offerService', ['$q', OfferService]);
  }

  function addModuleDependencies(module, dependencies) {
    dependencies.forEach(function (dependency) {
      if (module.requires.indexOf(dependency) === -1) {
        module.requires.push(dependency);
      }
    });
  }

  function addMboxDirective(module) {
    module.directive('mbox',
      ['logger', 'options', 'offerService', function (logger, options, offerService) {
        return {
          restrict: 'AE',
          link: {
            pre: function preLink(scope, element, attributes, controller) {
              element.css('visibility', 'hidden');
            },
            post: function postLink(scope, element, attributes, controller) {
              offerService.getOfferPromise({
                mbox: attributes.mboxname,
                params: options.params,
                timeout: options.timeout,
                element: element[0]
              })
              .then(offerService.applyOfferPromise)
              .catch(function (reason) {
                logger.log('mboxDirective error: ' + reason);
              })
              .finally(function () {
                element.css('visibility', 'visible');
              });
            }
          }
        };
      }]);
  }

  function initializeModule(module) {
    module.run(['$rootScope', '$injector', '$location', '$compile',
      'routeUtil', 'options', 'logger',
      function ($rootScope, $injector, $location, $compile, routeUtil, options, logger) {
        // When DOM is updated, inject Mbox directive for Target call
        $rootScope.$on('$viewContentLoaded', function (event, next, current) {
          var currentPath = $location.path();
          logger.log('$viewContentLoaded ' + currentPath);

          // Set ID for mbox so it won't be injected more than once on page when $viewContentLoaded is fired
          var mboxId = options.mbox + '-dir';

          // Validate if mbox should be injected
          if (routeUtil.isRouteAllowed(currentPath, options.allowedRoutesFilter, options.disallowedRoutesFilter) && // allowed route
            document.getElementById(mboxId) === null && // mbox does not exist
            document.querySelectorAll(options.selector).length > 0) { // element to append to exists
            // Create mbox and compile
            var $el = angular.element(document.querySelector(options.selector));
            var $scope = $el.scope();
            var $compiled;
            if (options.appendToSelector) {
              $compiled = $compile('<div id="' + mboxId + '" mbox data-mboxname="' + options.mbox + '"></div>')($scope);
              $el.append($compiled);
            } else {
              $el.attr('mbox', ''); // turns el into mbox directive
              $el.attr('data-mboxname', options.mbox);
              $el.attr('id', mboxId);
              $compiled = $compile($el)($scope);
            }
            logger.log(((options.appendToSelector) ? 'appended' : 'created') + ' mbox directive', options.mbox);
          }
        });
      }
    ]);
  }

  at.registerExtension({
    name: 'angular.initDirective',
    modules: ['settings', 'logger'],
    register: function (settings, logger) {
      return function (app, opts) {
        setupCommonModule(settings, logger, opts);
        var appModule = (typeof app === 'string') ? angular.module(app) : app;
        addModuleDependencies(appModule, ['target-angular.common']);
        addMboxDirective(appModule);
        initializeModule(appModule);
      };
    }
  });
})(document, angular, adobe.target);

