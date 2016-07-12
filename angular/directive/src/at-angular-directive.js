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
  function getOfferPromise(options, promise) {
    var deferred = promise.defer();
    adobe.target.getOffer({
      mbox: options.mbox,
      params: options.params,
      timeout: options.timeout,
      success: function (response) {
        if (response && response.length > 0) {
          deferred.resolve(response, options);
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

  function applyOffer(offer, options) {
    adobe.target.applyOffer({
      offer: offer,
      selector: options.selector
    });
  }

  function getAndApplyOffers(options, promise, logger) {
    getOfferPromise(options, promise)
      .then(applyOffer, function (reason) {
        logger.log('getAndApplyOffers() failed: ' + reason);
      });
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

  adobe.target.registerExtension({
    name: 'angular.initDirective',
    modules: ['settings', 'logger'],
    register: function (settings, logger) {
      angular.module('target-angular.common', [])
        .constant('version', '0.3.0')
        .constant('settings', settings)
        .constant('logger', logger)
        .constant('customOptions', {})

        .factory('options', ['settings', 'customOptions', getOptions])

        .factory('getAndApplyOffers', ['options', '$q', 'logger', getAndApplyOffers]);
    }
  });
})();

