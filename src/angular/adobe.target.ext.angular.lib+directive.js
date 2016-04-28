/*!
 * adobe.target.ext.lib.js v0.2.0
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
    A.target.ext.lib.VERSION = '0.2.0';

    // Define user set or default options
    A.target.ext.lib.getOptions = function(opts){
        var settings = A.target.getSettings();
        return {
            mbox:                     opts.mbox     ||settings.globalMboxName,
            timeout:                  opts.timeout  ||settings.timeout,  
            globalMboxAutoCreate:     settings.globalMboxAutoCreate,
            params:                   opts.params   ||null,
            selector:                 opts.selector ||null,
            allowedRoutesFilter:      opts.allowedRoutesFilter   ||[], 
            disallowedRoutesFilter:   opts.disallowedRoutesFilter||[],
            appendToSelector:         opts.appendToSelector ||false, 
            debug:                    opts.debug            ||false
        }
    };

    // Define reusable service for Target calls.
    // Usage: var service = new adobe.target.ext.lib.Service(userOptions, promiseHandler, logFnReference)
    A.target.ext.lib.Service = function(options, promise, log){  
        var self = this;
        promise=promise||{'defer':function(){return {'resolve':function(){},'promise':function(){}}}}; //empty promise
        return {
            data: null, // temporarily store Target response
            // promise resolver
            getOffer: function() {
                log('service.getOffer');
                var defer = promise.defer();
                // adobe.target API call to get a Target offer
                var offer = {
                    mbox: options.mbox,
                    success: function(response) {
                        log('getOffer success',response)
                        self.data = response;
                        defer.resolve(response); //promise is resolved
                    },
                    error: function(status, error) {
                        log('getOffer error',error)
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
                    log('applyOffer',offer);
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
            log: function() {
                Array.prototype.unshift.call(arguments, 'ATX:');
                if (window.console && console.info) console.info.apply(console,arguments);
            }
        }
    };

})(adobe);

/*!
 * adobe.target.ext.angular.directive.js v0.0.3
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
        allowedRoutesFilter: [],          // Blank for all path names or restrict to specific path names: ['/','/about','/item/:id']
        disallowedRoutesFilter: [],       // Exclude specific path names: ['/login','/privacy']
        appendToSelector: false,          // true appends mbox as a child to selector, otherwise selector becomes mbox directive 
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
                        log('getOffer');
                        adobe.target.getOffer({
                            mbox: attributes.mboxname,
                            params: options.params,
                            timeout: options.timeout,
                            success: function(response) {
                                log('applyOffer',response);
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

                    // When DOM is updated, inject Mbox directive for Target call 
                    $rootScope.$on("$viewContentLoaded", function(event, next, current) {    
                        
                        // Get path from hash or pretty url
                        var currentPath = window.location.hash.substr(1);
                        if (currentPath.indexOf('?') !== -1) 
                            currentPath = currentPath.substr(0, currentPath.indexOf('?')); // Remove params from route
                        if(currentPath === '') 
                            currentPath = window.location.pathname;// for Angular pretty url on

                        log('$viewContentLoaded '+currentPath);

                        // Set ID for mbox so it won't be injected more than once on page when $viewContentLoaded is fired
                        var mboxId = options.mbox+'-dir';

                        // Validate if mbox should be injected
                        if(utils.isRouteAllowed(currentPath, options.allowedRoutesFilter, options.disallowedRoutesFilter) && //allowed route
                            document.getElementById(mboxId) == null && // mbox does not exist
                            document.querySelectorAll(options.selector).length > 0 // element to append to exists
                        ){

                            // Create mbox and compile
                            $injector.invoke(['$compile', function ($compile) {
                                
                                var el = document.querySelector( options.selector )
                                var $el = angular.element( el );
                                if (options.appendToSelector) {
                                    var $scope = $el.scope();
                                    var $compiled = $compile('<div id="'+mboxId+'" mbox data-mboxname="'+options.mbox+'"></div>')($scope);
                                    $el.append($compiled);
                                }else{
                                    $el.attr('mbox',''); // turns el into mbox directive
                                    $el.attr('data-mboxname', options.mbox);
                                    $el.attr('id',mboxId);
                                    var $scope = $el.scope();
                                    var $compiled = $compile($el)($scope);
                                };
                                log( ((options.appendToSelector)?'appended':'created') + ' mbox directive',options.mbox);                                

                            }]);

                        }
                    });

                }
            ]
        );
    };

})(adobe);