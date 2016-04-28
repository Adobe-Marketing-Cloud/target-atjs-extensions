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