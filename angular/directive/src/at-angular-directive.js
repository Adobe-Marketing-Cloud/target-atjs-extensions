
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

  function addMboxDirective(module) {
    module.directive('mbox',
      ['logger', 'options', 'offerService', function (logger, options, offerService) {
        return {
          restrict: 'AE',
          link: {
            pre: function preLink(scope, element) {
              element.addClass('mboxDefault');
            },
            post: function postLink(scope, element, attributes) {
              offerService.getOfferPromise({
                mbox: attributes.mboxname,
                params: options.params,
                timeout: options.timeout,
                selector: options.selector || element[0]
              })
              .then(offerService.applyOfferPromise)
              .catch(function (reason) {
                logger.error('mboxDirective error: ' + reason);
              })
              .finally(function () {
                element.removeClass('mboxDefault');
              });
            }
          }
        };
      }]);
  }

  function select(selector) {
    return document.querySelectorAll(selector);
  }

  function isMboxInjectionAllowed(routeService, path, options, mboxId) {
    return routeService.isRouteAllowed(path) && // allowed route
      !select('#' + mboxId).length && // mbox does not exist
      select(options.selector).length > 0; // element to append to exists
  }

  function compileMbox($compile, element, scope, options, mboxId) {
    if (options.appendToSelector) {
      var compiled = $compile('<div id="' + mboxId + '" mbox data-mboxname="' + options.mbox + '"></div>')(scope);
      element.append(compiled);
    } else {
      element.attr('mbox', ''); // turns element into mbox directive
      element.attr('data-mboxname', options.mbox);
      element.attr('id', mboxId);
      $compile(element)(scope);
    }
  }

  function initializeModule(module) {
    module.run(['$rootScope', '$injector', '$location', '$compile',
      'routeService', 'options', 'logger',
      function ($rootScope, $injector, $location, $compile, routeService, options, logger) {
        // When DOM is updated, inject Mbox directive for Target call
        $rootScope.$on('$viewContentLoaded', function (event, next, current) {
          var currentPath = $location.path();
          logger.log('$viewContentLoaded ' + currentPath);
          // Set ID for mbox so it won't be injected more than once on page when $viewContentLoaded is fired
          var mboxId = options.mbox + '-dir';
          if (isMboxInjectionAllowed(routeService, currentPath, options, mboxId)) {
            var el = angular.element(select(options.selector));
            compileMbox($compile, el, el.scope(), options, mboxId);
            logger.log(((options.appendToSelector) ? 'appended' : 'created') + ' mbox directive', options.mbox);
          }
        });
      }
    ]);
  }

  at.ext.angular.initDirective = function (app, opts) {
    at.ext.angular.setupCommon(opts);
    var appModule = (typeof app === 'string') ? angular.module(app) : app;
    addModuleDependencies(appModule, ['target.angular.common']);
    addMboxDirective(appModule);
    initializeModule(appModule);
  };
})(document, angular, adobe.target);
