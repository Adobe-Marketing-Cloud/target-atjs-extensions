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
  function ServiceFunction(options, promise, log) {
    var self = this;
    return {
      data: null, // temporarily store Target response
      // promise resolver
      getOffer: function () {
        log('service.getOffer');
        var defer = promise.defer();
        // adobe.target API call to get a Target offer
        var offer = {
          mbox: options.mbox,
          success: function (response) {
            log('getOffer success', response);
            self.data = response;
            defer.resolve(response); // promise is resolved
          },
          error: function (status, error) {
            log('getOffer error', error);
            defer.resolve(); // promise is resolved to continue app execution
          }
        };
        // Add optional properties
        if (options.params) {
          offer.params = options.params;
        }
        if (options.timeout) {
          offer.timeout = options.timeout;
        }
        adobe.target.getOffer(offer); // Target call
        return defer.promise;
      },
      applyOffer: function () {
        log('service.applyOffer');
        var data = self.data;
        if (data && data.length > 0) {
          var offer = {offer: data};
          // add optional selector if defined
          if (options.selector) {
            offer.selector = options.selector;
          }
          log('applyOffer', offer);
          // adobe.target API call method to inject data to DOM
          adobe.target.applyOffer(offer);
          // clear data after use
          self.data = null;
        }
      }
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

  adobe.target.registerExtension({
    name: 'angular.directive',
    modules: ['settings', 'logger'],
    register: function (settings, logger) {
      angular.module('angular.directive.lib', [])
        .constant('version', '0.3.0')
        .constant('settings', settings)
        .constant('logger', logger)
        .constant('customOptions', {})

        .factory('options', ['settings', 'customOptions', getOptions])

        .service('service', ['options', '$q', 'logger', ServiceFunction]);
    }
  });
})();

