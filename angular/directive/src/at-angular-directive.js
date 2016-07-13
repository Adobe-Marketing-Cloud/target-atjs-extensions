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
'use strict';
(function () {
  function getOfferPromise(options, promise, custParams) {
    custParams = custParams || {};
    var deferred = promise.defer();
    adobe.target.getOffer({
      mbox: custParams.mboxAttr || options.mbox,
      params: options.params,
      timeout: options.timeout,
      success: function (response) {
        if (response && response.length > 0) {
          deferred.resolve(response, options, custParams);
        } else {
          deferred.reject('Empty offer');
        }
      },
      error: function (status, error) {
        deferred.reject(error);
      }
    });
    return deferred.promise;
  }

  function applyOffer(offer, options, custParams) {
    custParams = custParams || {};
    adobe.target.applyOffer({
      offer: offer,
      selector: custParams.element ? undefined : options.selector,
      element: custParams.element
    });
  }

  function OfferService(options, promise, logger) {
    this.getAndApplyOffers = function (finalBlock, custParams) {
      getOfferPromise(options, promise, custParams)
        .done(applyOffer, function (reason) {
          logger.log('getOffer() failed: ' + reason);
        })
        .finally(finalBlock);
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

  function addDependencies(module, dependencies) {
    dependencies.forEach(function (dependency) {
      if (module.requires.indexOf(dependency) === -1) {
        module.requires.push(dependency);
      }
    });
  }

  adobe.target.registerExtension({
    name: 'angular.initDirective',
    modules: ['settings', 'logger'],
    register: function (settings, logger) {
      return function (app, opts) {
        angular.module('target-angular.common', [])
          .constant('version', '0.3.0')
          .constant('settings', settings)
          .constant('logger', logger)
          .constant('customOptions', opts)

          .factory('options', ['settings', 'customOptions', getOptions])

          .service('offerService', ['options', '$q', 'logger', OfferService]);

        var appModule = (typeof app === 'string') ? angular.module(app) : app;
        addDependencies(appModule, ['target-angular.common']);

        appModule.directive('mbox', function () {
          return {
            restrict: 'AE',
            link: {
              pre: function preLink(scope, element, attributes, controller) {
                element.css('visibility', 'hidden');
              },
              post: function postLink(scope, element, attributes, controller) {
                offerService.getAndApplyOffers(
                  function () {
                    element.css('visibility', 'visible');
                  }, {
                    mboxname: attributes.mboxname,
                    element: element[0]
                  });
              }
            }
          };
        });
      };
    }
  });
})();

