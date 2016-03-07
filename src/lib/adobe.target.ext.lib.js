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