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