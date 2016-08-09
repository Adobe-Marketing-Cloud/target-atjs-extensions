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

  function setRouteOfferResolve(route, offerPromiseFn) {
    route.resolve = route.resolve || {};
    route.resolve.offerData = offerPromiseFn;
  }

  function routeServiceDecorator($delegate, options, offerService, logger) {
    $delegate.applyTargetToRoutes = function (routes) {
      Object.keys(routes).forEach(function (routeName) {
        if ($delegate.isRouteAllowed(routeName, options)) {
          logger.log('location: ' + routeName);
          setRouteOfferResolve(routes[routeName], function () {
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
    module.run(['$rootScope', '$route', 'routeService', 'offerService', 'options', 'logger',
      function ($rootScope, $route, routeService, offerService, options, logger) {
        routeService.applyTargetToRoutes($route.routes);

        $rootScope.$on('$viewContentLoaded', function () {
          var offerData = $route.current.locals.offerData;
          if (offerData) {
            offerService.applyOfferPromise(offerData)
              .catch(function (reason) {
                logger.error('AT applyOffer error: ' + reason);
              });
          }});
      }]);
  }

  at.registerExtension({
    name: 'angular.initRoutes',
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
