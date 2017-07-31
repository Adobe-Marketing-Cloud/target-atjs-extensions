/**
* The at.js extension Universal Receiver
* Version 0.1.3
* author Vadym Ustymenko @Adobe
* Purpose: to integrate Adobe Target functionality in any SPA framework
* Installation: below code should be placed right after at.js library
* Usage: adobe.target.ext.universal.init();
*/
/* global adobe */
!(function(at){
    'use strict';

    var settings = {},
        CUSTOM_EVENT_TARGET_CALL_READY = "atx-target-call-ready",
        CUSTOM_EVENT_DID_OBSERVE_MUTATION = "atx-mutation-observed",
        offerQueue = [],
        log = function () {};

    var applyCSS = function(css){
        var head = document.getElementsByTagName("head")[0];
        if (head) {
            var style = document.createElement("style");
            style.setAttribute("type", "text/css");
            if (style.styleSheet)
                style.styleSheet.cssText = css.join('\n');
            else
                style.appendChild(document.createTextNode(css.join('\n')));
            head.insertBefore(style, head.firstChild);
        };
    };

    var prehideElement = function(rule){
        if (typeof rule.selector === 'string' && rule.mbox !== settings.globalMboxName) {
            var css = [//rule.selector+':not(.atx-success){visibility:hidden}',
                       //rule.selector+'.atx-success{visibility:visible}',
                       rule.selector+'{visibility:hidden}'];
            applyCSS(css);
        };
    };

    var revealElement = function(selector){
        var el = document.querySelector(selector);
        log('revealElement',selector,el);
        if (el) {
            el.style.visibility = 'visible';
        };
    };

    // If element exists, execute callback immediately,
    // otherwise add to mutationobserver listener list to execute once element appears in DOM
    var applyOnElementReady = function(selector, callback){
        log('applyOnElementReady',selector);
        if (document.querySelector(selector))
            callback();
        else offerQueue.push({selector: selector, callback: callback});
    };

    var checkOfferQueue = function(){
        var i = offerQueue.length;
        while (i--){
            var listener = offerQueue[i];
            var el = document.querySelector(listener.selector);
            if(el){
                listener.callback(el);
                offerQueue.splice(i, 1);//remove element from list
            }
        };
    };

    var sendTargetCall = function(rule){
        log('sendTargetCall',rule);

        var isGlobalMbox = (rule.mbox===settings.globalMboxName) ? true : false;

        if (!isGlobalMbox)
            prehideElement(rule);

        at.getOffer({
            mbox: rule.mbox,
            params: rule.params || {},
            success: function(response) {
                // Global mbox has no pre-hiding (yet) so apply ASAP
                if (isGlobalMbox) {
                    at.applyOffer({offer: response});
                // Regional mbox has to wait for available container
                }else{
                    var selector = rule.selector;
                    var callback = function(){
                        at.applyOffer({
                            offer: response,
                            selector: selector
                        });
                        revealElement(selector);
                        log('done apply offer and reveal element',selector);
                    };
                    applyOnElementReady(selector, callback);
                };
                log('getOffer success response', response);
            },
            error: function(status, error) {
                if (!isGlobalMbox) {
                    applyOnElementReady(rule.selector, function(){
                        revealElement(rule.selector);
                    });
                }
                log('Error', status, error);
            }
        });
    };

    var init = function (globalSettings, logger, rules) {

        settings = globalSettings;

        // Customize log
        log = function (s) { Array.prototype.unshift.call(arguments, 'ATX-receiver:'); logger.log.apply(this, arguments); };

        document.addEventListener(CUSTOM_EVENT_TARGET_CALL_READY, function(e){
	         log("Custom event notification", e);
           sendTargetCall(e.detail);
        }, false);

        document.addEventListener(CUSTOM_EVENT_DID_OBSERVE_MUTATION, function(e){
	         log("Custom event notification", e);
           checkOfferQueue();
        }, false);

    };

    at.registerExtension({
        name: 'universal.receiver',
        modules: ['settings', 'logger'],
        register: function (settings, logger) {
            return function (rules) {
                init(settings, logger, rules);
            };
        }
    });

})(adobe.target);

// Initialize
adobe.target.ext.universal.receiver();
