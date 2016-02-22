/*!
 * adobe.target.ext.angular.uirouter.js v0.0.3
 *
 * Copyright 1996-2016. Adobe Systems Incorporated. All rights reserved.
 * 
 */

/*! 
 * Usage example
    adobe.target.ext.angular.initStates(app,     // Angular module, object reference or string, required 
    {
        params:  targetPageParamsAll(),     // Target mbox parameters, optional
        //mbox: 'custom-mbox-name',         // Target mbox name, optional
        //selector: 'body',                 // CSS selector to inject Target content to, optional
        //timeout: 5000,                    // Target call timeout
        allowedRoutesFilter: [],            // Blank for all routes or restrict to specific routes: ['/','/about','/item/:id']
        disallowedRoutesFilter: [],         // Exclude specific routes: ['/login','/privacy']
        debug: true,                        // Print console statements
        autoRun: true
    });
*/

!(function(A){
    "use strict";

    // Set up adobe.target.ext.angular.initStates namespace
    A.target = A.target || {};
    A.target.ext = A.target.ext || {};
    A.target.ext.angular = A.target.ext.angular || {};

    A.target.ext.angular.initStates = function(app,opts){
        
        // Define Angular module from string or object
        var appModule = (typeof app==='string') ? angular.module(app) : app;       
        
        var self =  this;
        var lib =   (A.target.ext.lib) ? A.target.ext.lib : {};
        var utils = new lib.Util();
        
        // Set options or defaults
        opts = opts||{};
        var defopts = lib.defaultOptions;
        var options = {
                mbox:                     opts.mbox||defopts.mbox,
                params:                   opts.params||defopts.params,
                selector:                 opts.selector||defopts.selector,
                timeout:                  opts.timeout||defopts.timeout,
                allowedRoutesFilter:      opts.allowedRoutesFilter||defopts.allowedRoutesFilter, 
                disallowedRoutesFilter:   opts.disallowedRoutesFilter||defopts.disallowedRoutesFilter,
                debug:                    opts.debug||defopts.debug
            };

        // Set objects from library
        var log = (options.debug && utils.log) ? utils.log : function(){};

        // Angular Run Block
        appModule.run(
            ['$rootScope', '$state', 'adobeTargetOfferService',
                function($rootScope, $state, adobeTargetOfferService) {

                    // Apply state resolve for Target calls in $stateChangeStart event
                    $rootScope.$on('$stateChangeStart', function(event, next) {          
                        adobeTargetOfferService.applyTargetToState(next);
                    });

                    // When DOM is updated, apply Target offer (flicker control)
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
            
            // Add UI-Router-specific implementation by assigning resolve to a valid state
            service.applyTargetToState = function($state){
                if (utils.isRouteAllowed($state.url, options.allowedRoutesFilter, options.disallowedRoutesFilter)) {// Allowed Targets
                    log('location:'+$state.url)
                    $state.resolve = $state.resolve || {};
                    $state.resolve.offerData = function(adobeTargetOfferService) {
                        return adobeTargetOfferService.getOffer();
                    };
                };
            };

            return service;
        }])

    };

})(adobe);

