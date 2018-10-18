/**
* The at.js extension Universal Router
* Version 0.1.0
* author Vadym Ustymenko @Adobe
* Purpose: to implement Adobe Target in any SPA framework by triggering Mbox calls via CustomEvent;
*   this is an optional extension for quick and simple implementation that goes with "Receiver" extension;
*   the extension listens for any DOM changes from MutationObserver and passes Mbox call data via CustomEvent;
*   you may want to use your own implementation instead to trigger Mbox calls, eg.: trigerring with data element update.
*   For your own implementation, use this call where needed:
*     var event = new CustomEvent('atx-target-call-ready',{detail: {mbox: 'target-global-mbox'} });document.dispatchEvent(event);
* Installation: below code should be placed right after at.js library and Universal "Receiver" extension
* Usage: adobe.target.ext.universal.router([mbox1ConfigObj,mbox2ConfigObj],beforeTargetRequest:func,afterTargetRequest:func);
*/
!(function(at){
    'use strict';

    var clientData = [],
        CUSTOM_EVENT_TARGET_CALL_READY = "atx-target-call-ready",
        CUSTOM_EVENT_TARGET_CALL_SENT = "atx-target-call-sent",
        CUSTOM_EVENT_DID_OBSERVE_MUTATION = "atx-mutation-observed",
        thisPageUrl = '',
        observerConfig = {childList: true, subtree: true },
        //observerConfig = {attributes: true, characterData: true, childList: true, subtree: true }, // Notify me of all children!
        log = function () {};

    // Polyfill Array.isArray
    if (!Array.isArray) {Array.isArray = function(arg) {return Object.prototype.toString.call(arg) === '[object Array]';};}
    // Polyfill Element.matches
    if (!Element.prototype.matches) {
        Element.prototype.matches =
        Element.prototype.matchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector ||
        Element.prototype.oMatchesSelector ||
        Element.prototype.webkitMatchesSelector ||
        function(s) {
            var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                i = matches.length;
            while (--i >= 0 && matches.item(i) !== this) {}
            return i > -1;
        };
    }

    // Utils
    var isNotEmptyArray = function(arr){
        return (Array.isArray(arr) && arr.length>0) || false;
    }

    var isStrInArray = function(str, arr){
        for (var i = arr.length - 1; i >= 0; i--) {
            var part = arr[i];//  ['/#']
            if (typeof part==='object' && part.test(str)===true)
                return true;
            else if (str.indexOf(part)!==-1)
                return true;
        };
        return false;
    }

    var isRouteAllowed = function (routeName, opts) {
        var result = true; //empty list - allow all
        if (isNotEmptyArray(opts.allow)) {
            result = isStrInArray(routeName, opts.allow);
        }
        if (isNotEmptyArray(opts.disallow)) {
            result = !isStrInArray(routeName, opts.disallow);
        };
        return result;
    };

    // Listens to DOM mutations
    var startListeningToDomMutations = function(){
        validateTargetCalls();//first time page load
        var observer = new MutationObserver(function(mutations) {
            // Fire custom event to notifiy that DOM update was detected to trigger Offer Queue in "Receiver"
            var event = new CustomEvent(CUSTOM_EVENT_DID_OBSERVE_MUTATION, { "detail": {} });
            document.dispatchEvent(event);
            validateTargetCalls();//consequent calls
        });
        var targetNode = document.body;
        if(!targetNode){
            document.addEventListener('DOMContentLoaded', function(){ //make sure DOM is ready
              targetNode = document.body;
              observer.observe(targetNode, observerConfig);
            }, false);
        }else{
            observer.observe(targetNode, observerConfig);
        }
    };

    var validateTargetCalls = function(){
        log('validateTargetCalls');
        var currentUrl = window.location.href;
        if (currentUrl !== thisPageUrl) {
            thisPageUrl = currentUrl;

            // TODO: reset listeners?

            // Loop thru all mbox rules and make a call if applicable
            var isCallSent = false;
            for (var i = 0; i < clientData.rules.length; i++) {
                var rule = clientData.rules[i];
                if (typeof rule.mbox === 'string') {
                    if(isRouteAllowed(thisPageUrl, rule)){
                        if (isCallSent === false) {//first valid call
                            clientData.before();
                        }
                        sendTargetCall(rule);
                        isCallSent = true;
                    }else{log('rule excluded',rule);}
                };
            }
            // Fire custom event to notifiy Target call was qualified to be fired
            // This is perfect for A4T to trigger Analytics call after Target
            if (isCallSent) {
                var event = new CustomEvent(CUSTOM_EVENT_TARGET_CALL_SENT);
                document.dispatchEvent(event);
                clientData.after();
                log('Target call sent',thisPageUrl);
            }

        };
    };

    var sendTargetCall = function(rule){
        log('sendTargetCall',rule);
        // This Custom Event is passing rule data that will be used in "Receiver" extension
        // to make Target calls
        var event = new CustomEvent(CUSTOM_EVENT_TARGET_CALL_READY, { detail: rule });
        document.dispatchEvent(event);
    };


    //TODO: test
    function delegate(el, evt, sel, handler) {
        el.addEventListener(evt, function(event) {
            var t = event.target;
            while (t && t !== this) {
                if (t.matches(sel)) {
                    handler.call(t, event);
                }
                t = t.parentNode;
            }
        });
    };

    var applyForceActions = function () {
        // Loop thru all mbox rules of domEventNotifications to add an event listener
        for (var i = 0; i < clientData.rules.length; i++) {
            (function(rule){//closure
                if ('domEventNotifications' in rule) {
                    var events = rule.domEventNotifications;
                    log('applying domEventNotifications',events);
                    for (var evt in events) {
                        if (events.hasOwnProperty(evt)) {
                            var actions = events[evt];
                            for (var j = 0; j < actions.length; j++) {
                                (function(action){
                                    var sel = action.selector;
                                    delegate(document, evt, sel, function(){
                                        if(isRouteAllowed(thisPageUrl, action)){
                                            log('delegate callback for action',action);
                                            sendTargetCall(rule);
                                        }
                                    });
                                })(actions[j]);
                            }
                        }
                    }
                };
            })(clientData.rules[i]);
        }
    };

    var init = function (settings, logger, rules, beforeFn, afterFn) {

        // Assign client specific settings and options to internal variable
        clientData = {
            rules: rules,
            globalMboxName: settings.globalMboxName,
            before: (typeof beforeFn==='function') ? beforeFn : function(){},
            after:  (typeof afterFn==='function') ? afterFn : function(){}
            //also available: clientCode, globalMboxAutoCreate, serverDomain, timeout
        };

        // Customize log
        log = function (s) { Array.prototype.unshift.call(arguments, 'ATX-router:'); logger.log.apply(this, arguments); };

        // Listen to DOM changes when new content is inserted on route change
        startListeningToDomMutations();

        // Apply domEventNotifications if we need to fire mbox calls while URL remains the same
        applyForceActions();

    };

    at.registerExtension({
        name: 'universal.router',
        modules: ['settings', 'logger'],
        register: function (settings, logger) {
            return function (data) {
                init(settings, logger, data.rules, data.beforeTargetRequest, data.afterTargetRequest);
            };
        }
    });

})(adobe.target);

// Initialize
adobe.target.ext.universal.router({
  rules:[
    {
        mbox: 'target-global-mbox'
        /* // The below code is helpful when we need a Mbox call if URL never changes;
        // in this case we set up DOM Event listener(s) to listen to event notifications and trigger the Target call where applicable
        ,domEventNotifications: {
          click: [         //list of actions to fire calls when URL never changes
            {
              allow: ['#/'],
              selector: '#myCarousel > a.right.carousel-control'
            },
            {
              allow: ['#/'],
              selector: '#myCarousel > a.left.carousel-control'
            }
          ]
        }*/
    }
    /* // Regional Mbox example with all options (selector, allow, disallow)
    ,{
        mbox: 'regional-mbox-1',         //name for mbox
        selector: '.section > .container > .row > div.col-lg-4.col-md-4:nth-child(1)',
        allow: ['#/'],
        disallow: ['#/services','#/pricing','#/about','#/contact']
    }*/
  ]
  // This routine is perfect for resetting Visitor Id state to renew SDID values
  ,beforeTargetRequest: function(){
      console&&console.log('ATX-router beforeTargetRequest');
      if(typeof Visitor==='function'){
        var visitor = Visitor.getInstance("Marketing_Cloud_organization_ID@AdobeOrg");
        if(typeof visitor.resetState==='function'){
          visitor.resetState();
          console&&console.log('ATX-router A4T SDID Renew: visitor.resetState');
        }
      }
    }
  // This routine is perfect for triggering Analytics call which must follow Target call for A4T
  ,afterTargetRequest: function(){
      console&&console.log('ATX-router afterTargetRequest');
    }
});
