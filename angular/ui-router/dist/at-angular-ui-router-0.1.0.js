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
    $delegate.applyTargetToStates = function (states) {
      states.forEach(function (state) {
        if ($delegate.isRouteAllowed(state.url, options)) {
          logger.log('location: ' + state.url);
          setStateOfferResolve(state, function () {
            return offerService.getOfferPromise(options);
          });
        }
      });
    };
    return $delegate;
  }

  function decorateRouteService() {
    angular.module('target.angular.common')
      .decorator('routeService', ['$delegate', 'options', 'offerService', 'logger', routeServiceDecorator]);
  }

  function initializeModule(module) {
    module.run(['$rootScope', '$state', 'routeService', 'offerService', 'options', 'logger',
      function ($rootScope, $state, routeService, offerService, options, logger) {
        routeService.applyTargetToStates($state.get());

        $rootScope.$on('$viewContentLoaded', function () {
          var offerData = $state.$current.locals.globals.offerData;
          if (offerData) {
            offerService.applyOfferPromise(offerData)
              .catch(function (reason) {
                logger.error('AT applyOffer error: ' + reason);
              });
          }
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
        addModuleDependencies(appModule, ['target.angular.common']);
        initializeModule(appModule);
      };
    }
  });
})(document, angular, adobe.target);
