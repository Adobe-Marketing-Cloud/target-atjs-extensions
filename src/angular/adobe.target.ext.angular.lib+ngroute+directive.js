/*!
 * adobe.target.ext.lib.js v0.1.1
 *
 * Copyright 1996-2016. Adobe Systems Incorporated. All rights reserved.
 * 
 */
 !(function(A){
    "use strict";

    // Set up adobe.taregt.ext.lib namespace
    A.target = A.target || {};
    A.target.ext = A.target.ext || {};
    A.target.ext.lib = A.target.ext.lib || {};

    // Define default options
    A.target.ext.lib.getOptions = function(opts){
        return {
            mbox:                     opts.mbox     ||A.target.getSettings().globalMboxName,
            timeout:                  opts.timeout  ||A.target.getSettings().timeout,
            params:                   opts.params   ||null,
            selector:                 opts.selector ||null,
            allowedRoutesFilter:      opts.allowedRoutesFilter   ||[], 
            disallowedRoutesFilter:   opts.disallowedRoutesFilter||[],
            debug:                    opts.debug    ||false   
        }
        
    };

    // Define reusable service for Target calls.
    // Usage: var service = new adobe.target.ext.lib.Service(userOptions, promiseHandler, logFnReference)
    A.target.ext.lib.Service = function(options, $q, log){  
        var self = this;
        $q=$q||{'defer':function(){return {'resolve':function(){},'promise':function(){}}}};
        return {
            data: null, // temporarily store Target response
            // promise resolver
            getOffer: function() {
                log('service.getOffer');
                var defer = $q.defer();
                // adobe.target API call to get a Target offer
                var offer = {
                    mbox: options.mbox,
                    success: function(response) {
                        log('getOffer success')
                        self.data = response;
                        defer.resolve(response); //promise is resolved
                    },
                    error: function(status, error) {
                        log('getOffer error')
                        defer.resolve(); //promise is resolved to continue app execution
                    }
                };
                // Add optional properties
                if (options.params) offer.params = options.params;
                if (options.timeout) offer.timeout = options.timeout;
                A.target.getOffer(offer); // Target call
                return defer.promise;
            },
            applyOffer: function(){
                log('service.applyOffer');
                var data = self.data;
                if (data && data.length > 0) {
                    var offer = {'offer': data};
                    // add optional selector if defined
                    if (options.selector) offer.selector = options.selector;
                    // adobe.target API call method to inject data to DOM
                    A.target.applyOffer(offer);
                    // clear data after use
                    self.data = null;
                }
            }
        };        
    };

    A.target.ext.lib.Util = function(){         
        return {
            isRouteAllowed: function(routeName, allowed, disallowed){
                var result = (allowed.length==0) ? true : false;
                result = (allowed.length>0 && allowed.indexOf(routeName) != -1) ? true : result;
                result = (disallowed.length>0 && disallowed.indexOf(routeName) != -1) ? false : result;
                return result;
            },
            log: function(msg) {
                if (console && console.info) console.info('AT:' + msg);
            }
        }
    };

})(adobe);

/*!
 * adobe.target.ext.angular.ngroute.js v0.1.0
 *
 * Copyright 1996-2016. Adobe Systems Incorporated. All rights reserved.
 * 
 */

/*! 
 * Usage example
    adobe.target.ext.angular.initRoutes(app, // Angular module, object reference or string, required 
    {
        params:  targetPageParamsAll(),      // Target mbox parameters, optional
        //mbox: 'custom-mbox-name',          // Target mbox name, optional
        //selector: 'body',                  // CSS selector to inject Target content to, optional
        //timeout: 5000,                     // Target call timeout
        allowedRoutesFilter: [],             // Blank for all routes or restrict to specific routes: ['/','/about','/item/:id']
        disallowedRoutesFilter: [],          // Exclude specific routes: ['/login','/privacy']
        debug: true                          // Print console statements
    });
*/

!(function(A){
    "use strict";

    // Set up adobe.taregt.ext.initRoutes namespace
    A.target = A.target || {};
    A.target.ext = A.target.ext || {};
    A.target.ext.angular = A.target.ext.angular || {};

    A.target.ext.angular.initRoutes = function(app,opts){
        
        // Define Angular module from string or object
        var appModule = (typeof app==='string') ? angular.module(app) : app;       
        var lib =       A.target.ext.lib;
        var utils =     new lib.Util();
        var options =   lib.getOptions(opts||{});
        var log =       (options.debug && utils.log) ? utils.log : function(){};

        // Angular Run Block
        appModule.run(
            ['adobeTargetOfferService', '$route', '$rootScope', 
                function(adobeTargetOfferService, $route, $rootScope) {
                    
                    // Apply route resolve for Target calls
                    adobeTargetOfferService.applyTargetToRoutes($route.routes);

                    // When DOM is updated, apply Target offer. This event controls the flicker
                    $rootScope.$on("$viewContentLoaded", function(event, next, current) {
                        adobeTargetOfferService.applyOffer();
                    });

                }
            ]
        );

        // Angular Service for Adobe Target calls
        appModule.factory('adobeTargetOfferService', ['$q', function($q) {

            // Initialize shared Service object 
            var service =  new lib.Service(options, $q, log);
            
            // Add ngRoute-specific implementation by assigning resolve to all valid routes
            service.applyTargetToRoutes = function(locations) {
                Object.keys(locations).forEach(function(obj) {
                    if (typeof obj === 'string') {
                        log('location:' + obj);
                        if (utils.isRouteAllowed(obj, options.allowedRoutesFilter, options.disallowedRoutesFilter)) {// Allowed Targets
                            var route = locations[obj];
                            route.resolve = route.resolve || {};
                            route.resolve.offerData = function(adobeTargetOfferService) {
                                return adobeTargetOfferService.getOffer();
                            };
                        };

                    };
                });
            };

            return service;
        }])

    };

})(adobe);

/*!
 * adobe.target.ext.angular.directive.js v0.0.1
 *
 * Copyright 1996-2016. Adobe Systems Incorporated. All rights reserved.
 * 
 */

/*! 
 * Usage example
    adobe.target.ext.angular.initDirective(app, // Angular module, object reference or string, required 
    {
        params:  targetPageParamsAll(),   // Target mbox parameters, optional
        mbox: 'custom-mbox-name',         // Target mbox name, optional
        selector: '.selector',            // CSS selector for mbox element, optional
        //timeout: 5000,                  // Target call timeout
        allowedRoutesFilter: [],          // Blank for all routes or restrict to specific routes: ['/','/about','/item/:id']
        disallowedRoutesFilter: [],       // Exclude specific routes: ['/login','/privacy']
        debug: true                       // Print console statements
    });
*/
!(function(A){

    // Set up adobe.target.ext.angular.initStates namespace
    A.target = A.target || {};
    A.target.ext = A.target.ext || {};
    A.target.ext.angular = A.target.ext.angular || {};

    A.target.ext.angular.initDirective = function(app,opts){

        // Define Angular module from string or object
        var appModule = (typeof app==='string') ? angular.module(app) : app;       
        var lib =       A.target.ext.lib;
        var utils =     new lib.Util();
        var options =   lib.getOptions(opts||{});
        var log =       (options.debug && utils.log) ? utils.log : function(){};

        appModule.directive('mbox', function() {
            return {
                restrict: 'AE',
                link: {
                    pre: function preLink(scope, element, attributes, controller) {
                        element.css('visibility', 'hidden');
                    },
                    post: function postLink(scope, element, attributes, controller) {
                        adobe.target.getOffer({
                            mbox: attributes.mboxname,
                            params: options.params,
                            timeout: options.timeout,
                            success: function(response) {
                                adobe.target.applyOffer({
                                    element: element[0],
                                    offer: response
                                });
                                element.css('visibility', 'visible');
                            },
                            error: function(status, response) {
                                element.css('visibility', 'visible');
                            }
                        });
                    }
                }
            };
        });

        // Angular Run Block
        appModule.run(
            ['$rootScope', '$injector',
                function($rootScope, $injector) {

                    // When DOM is updated, apply Target offer 
                    $rootScope.$on("$viewContentLoaded", function(event, next, current) {    
                        //log('in $viewContentLoaded for '+window.location.href)
                        
                        var mboxSelector = options.mbox+'-dir'; // set unique class name for mbox element so we do not re-inject 
                        if(angular.element(mboxSelector).size()==0 && // mbox does not exist
                            angular.element(options.selector).size()>0){ // mbox candidate exists
                            
                            // Turn element into mbox and compile
                            $injector.invoke(['$compile', function ($compile) {
                                var mboxEl = angular.element(options.selector);
                                mboxEl.attr('mbox',''); // makes mbox directive
                                mboxEl.attr('data-mboxname', options.mbox);
                                var $scope = mboxEl.scope();
                                var $compiled = $compile(mboxEl)($scope);
                                log('added mbox directive '+options.mbox+' for '+window.location.href);
                            }]);
                            
                        }

                    });

                }
            ]
        );

    };

})(adobe);