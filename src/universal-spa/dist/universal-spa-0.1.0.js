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

/**
* The at.js extension Universal Receiver
* Version 0.1.3
* author Vadym Ustymenko @Adobe
* Purpose: to integrate Adobe Target functionality in any SPA framework
* Installation: below code should be placed right after at.js library
* Usage: adobe.target.ext.universal.init();
*/
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

/*
 * Copyright 2012 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

if (typeof WeakMap === 'undefined') {
  (function() {
    var defineProperty = Object.defineProperty;
    var counter = Date.now() % 1e9;

    var WeakMap = function() {
      this.name = '__st' + (Math.random() * 1e9 >>> 0) + (counter++ + '__');
    };

    WeakMap.prototype = {
      set: function(key, value) {
        var entry = key[this.name];
        if (entry && entry[0] === key)
          entry[1] = value;
        else
          defineProperty(key, this.name, {value: [key, value], writable: true});
        return this;
      },
      get: function(key) {
        var entry;
        return (entry = key[this.name]) && entry[0] === key ?
            entry[1] : undefined;
      },
      delete: function(key) {
        var entry = key[this.name];
        if (!entry) return false;
        var hasValue = entry[0] === key;
        entry[0] = entry[1] = undefined;
        return hasValue;
      },
      has: function(key) {
        var entry = key[this.name];
        if (!entry) return false;
        return entry[0] === key;
      }
    };

    window.WeakMap = WeakMap;
  })();
}

/*
 * Copyright 2012 The Polymer Authors. All rights reserved.
 * Use of this source code is goverened by a BSD-style
 * license that can be found in the LICENSE file.
 */

(function(global) {

  var registrationsTable = new WeakMap();

  // We use setImmediate or postMessage for our future callback.
  var setImmediate = window.msSetImmediate;

  // Use post message to emulate setImmediate.
  if (!setImmediate) {
    var setImmediateQueue = [];
    var sentinel = String(Math.random());
    window.addEventListener('message', function(e) {
      if (e.data === sentinel) {
        var queue = setImmediateQueue;
        setImmediateQueue = [];
        queue.forEach(function(func) {
          func();
        });
      }
    });
    setImmediate = function(func) {
      setImmediateQueue.push(func);
      window.postMessage(sentinel, '*');
    };
  }

  // This is used to ensure that we never schedule 2 callas to setImmediate
  var isScheduled = false;

  // Keep track of observers that needs to be notified next time.
  var scheduledObservers = [];

  /**
   * Schedules |dispatchCallback| to be called in the future.
   * @param {MutationObserver} observer
   */
  function scheduleCallback(observer) {
    scheduledObservers.push(observer);
    if (!isScheduled) {
      isScheduled = true;
      setImmediate(dispatchCallbacks);
    }
  }

  function wrapIfNeeded(node) {
    return window.ShadowDOMPolyfill &&
        window.ShadowDOMPolyfill.wrapIfNeeded(node) ||
        node;
  }

  function dispatchCallbacks() {
    // http://dom.spec.whatwg.org/#mutation-observers

    isScheduled = false; // Used to allow a new setImmediate call above.

    var observers = scheduledObservers;
    scheduledObservers = [];
    // Sort observers based on their creation UID (incremental).
    observers.sort(function(o1, o2) {
      return o1.uid_ - o2.uid_;
    });

    var anyNonEmpty = false;
    observers.forEach(function(observer) {

      // 2.1, 2.2
      var queue = observer.takeRecords();
      // 2.3. Remove all transient registered observers whose observer is mo.
      removeTransientObserversFor(observer);

      // 2.4
      if (queue.length) {
        observer.callback_(queue, observer);
        anyNonEmpty = true;
      }
    });

    // 3.
    if (anyNonEmpty)
      dispatchCallbacks();
  }

  function removeTransientObserversFor(observer) {
    observer.nodes_.forEach(function(node) {
      var registrations = registrationsTable.get(node);
      if (!registrations)
        return;
      registrations.forEach(function(registration) {
        if (registration.observer === observer)
          registration.removeTransientObservers();
      });
    });
  }

  /**
   * This function is used for the "For each registered observer observer (with
   * observer's options as options) in target's list of registered observers,
   * run these substeps:" and the "For each ancestor ancestor of target, and for
   * each registered observer observer (with options options) in ancestor's list
   * of registered observers, run these substeps:" part of the algorithms. The
   * |options.subtree| is checked to ensure that the callback is called
   * correctly.
   *
   * @param {Node} target
   * @param {function(MutationObserverInit):MutationRecord} callback
   */
  function forEachAncestorAndObserverEnqueueRecord(target, callback) {
    for (var node = target; node; node = node.parentNode) {
      var registrations = registrationsTable.get(node);

      if (registrations) {
        for (var j = 0; j < registrations.length; j++) {
          var registration = registrations[j];
          var options = registration.options;

          // Only target ignores subtree.
          if (node !== target && !options.subtree)
            continue;

          var record = callback(options);
          if (record)
            registration.enqueue(record);
        }
      }
    }
  }

  var uidCounter = 0;

  /**
   * The class that maps to the DOM MutationObserver interface.
   * @param {Function} callback.
   * @constructor
   */
  function JsMutationObserver(callback) {
    this.callback_ = callback;
    this.nodes_ = [];
    this.records_ = [];
    this.uid_ = ++uidCounter;
  }

  JsMutationObserver.prototype = {
    observe: function(target, options) {
      target = wrapIfNeeded(target);

      // 1.1
      if (!options.childList && !options.attributes && !options.characterData ||

          // 1.2
          options.attributeOldValue && !options.attributes ||

          // 1.3
          options.attributeFilter && options.attributeFilter.length &&
              !options.attributes ||

          // 1.4
          options.characterDataOldValue && !options.characterData) {

        throw new SyntaxError();
      }

      var registrations = registrationsTable.get(target);
      if (!registrations)
        registrationsTable.set(target, registrations = []);

      // 2
      // If target's list of registered observers already includes a registered
      // observer associated with the context object, replace that registered
      // observer's options with options.
      var registration;
      for (var i = 0; i < registrations.length; i++) {
        if (registrations[i].observer === this) {
          registration = registrations[i];
          registration.removeListeners();
          registration.options = options;
          break;
        }
      }

      // 3.
      // Otherwise, add a new registered observer to target's list of registered
      // observers with the context object as the observer and options as the
      // options, and add target to context object's list of nodes on which it
      // is registered.
      if (!registration) {
        registration = new Registration(this, target, options);
        registrations.push(registration);
        this.nodes_.push(target);
      }

      registration.addListeners();
    },

    disconnect: function() {
      this.nodes_.forEach(function(node) {
        var registrations = registrationsTable.get(node);
        for (var i = 0; i < registrations.length; i++) {
          var registration = registrations[i];
          if (registration.observer === this) {
            registration.removeListeners();
            registrations.splice(i, 1);
            // Each node can only have one registered observer associated with
            // this observer.
            break;
          }
        }
      }, this);
      this.records_ = [];
    },

    takeRecords: function() {
      var copyOfRecords = this.records_;
      this.records_ = [];
      return copyOfRecords;
    }
  };

  /**
   * @param {string} type
   * @param {Node} target
   * @constructor
   */
  function MutationRecord(type, target) {
    this.type = type;
    this.target = target;
    this.addedNodes = [];
    this.removedNodes = [];
    this.previousSibling = null;
    this.nextSibling = null;
    this.attributeName = null;
    this.attributeNamespace = null;
    this.oldValue = null;
  }

  function copyMutationRecord(original) {
    var record = new MutationRecord(original.type, original.target);
    record.addedNodes = original.addedNodes.slice();
    record.removedNodes = original.removedNodes.slice();
    record.previousSibling = original.previousSibling;
    record.nextSibling = original.nextSibling;
    record.attributeName = original.attributeName;
    record.attributeNamespace = original.attributeNamespace;
    record.oldValue = original.oldValue;
    return record;
  };

  // We keep track of the two (possibly one) records used in a single mutation.
  var currentRecord, recordWithOldValue;

  /**
   * Creates a record without |oldValue| and caches it as |currentRecord| for
   * later use.
   * @param {string} oldValue
   * @return {MutationRecord}
   */
  function getRecord(type, target) {
    return currentRecord = new MutationRecord(type, target);
  }

  /**
   * Gets or creates a record with |oldValue| based in the |currentRecord|
   * @param {string} oldValue
   * @return {MutationRecord}
   */
  function getRecordWithOldValue(oldValue) {
    if (recordWithOldValue)
      return recordWithOldValue;
    recordWithOldValue = copyMutationRecord(currentRecord);
    recordWithOldValue.oldValue = oldValue;
    return recordWithOldValue;
  }

  function clearRecords() {
    currentRecord = recordWithOldValue = undefined;
  }

  /**
   * @param {MutationRecord} record
   * @return {boolean} Whether the record represents a record from the current
   * mutation event.
   */
  function recordRepresentsCurrentMutation(record) {
    return record === recordWithOldValue || record === currentRecord;
  }

  /**
   * Selects which record, if any, to replace the last record in the queue.
   * This returns |null| if no record should be replaced.
   *
   * @param {MutationRecord} lastRecord
   * @param {MutationRecord} newRecord
   * @param {MutationRecord}
   */
  function selectRecord(lastRecord, newRecord) {
    if (lastRecord === newRecord)
      return lastRecord;

    // Check if the the record we are adding represents the same record. If
    // so, we keep the one with the oldValue in it.
    if (recordWithOldValue && recordRepresentsCurrentMutation(lastRecord))
      return recordWithOldValue;

    return null;
  }

  /**
   * Class used to represent a registered observer.
   * @param {MutationObserver} observer
   * @param {Node} target
   * @param {MutationObserverInit} options
   * @constructor
   */
  function Registration(observer, target, options) {
    this.observer = observer;
    this.target = target;
    this.options = options;
    this.transientObservedNodes = [];
  }

  Registration.prototype = {
    enqueue: function(record) {
      var records = this.observer.records_;
      var length = records.length;

      // There are cases where we replace the last record with the new record.
      // For example if the record represents the same mutation we need to use
      // the one with the oldValue. If we get same record (this can happen as we
      // walk up the tree) we ignore the new record.
      if (records.length > 0) {
        var lastRecord = records[length - 1];
        var recordToReplaceLast = selectRecord(lastRecord, record);
        if (recordToReplaceLast) {
          records[length - 1] = recordToReplaceLast;
          return;
        }
      } else {
        scheduleCallback(this.observer);
      }

      records[length] = record;
    },

    addListeners: function() {
      this.addListeners_(this.target);
    },

    addListeners_: function(node) {
      var options = this.options;
      if (options.attributes)
        node.addEventListener('DOMAttrModified', this, true);

      if (options.characterData)
        node.addEventListener('DOMCharacterDataModified', this, true);

      if (options.childList)
        node.addEventListener('DOMNodeInserted', this, true);

      if (options.childList || options.subtree)
        node.addEventListener('DOMNodeRemoved', this, true);
    },

    removeListeners: function() {
      this.removeListeners_(this.target);
    },

    removeListeners_: function(node) {
      var options = this.options;
      if (options.attributes)
        node.removeEventListener('DOMAttrModified', this, true);

      if (options.characterData)
        node.removeEventListener('DOMCharacterDataModified', this, true);

      if (options.childList)
        node.removeEventListener('DOMNodeInserted', this, true);

      if (options.childList || options.subtree)
        node.removeEventListener('DOMNodeRemoved', this, true);
    },

    /**
     * Adds a transient observer on node. The transient observer gets removed
     * next time we deliver the change records.
     * @param {Node} node
     */
    addTransientObserver: function(node) {
      // Don't add transient observers on the target itself. We already have all
      // the required listeners set up on the target.
      if (node === this.target)
        return;

      this.addListeners_(node);
      this.transientObservedNodes.push(node);
      var registrations = registrationsTable.get(node);
      if (!registrations)
        registrationsTable.set(node, registrations = []);

      // We know that registrations does not contain this because we already
      // checked if node === this.target.
      registrations.push(this);
    },

    removeTransientObservers: function() {
      var transientObservedNodes = this.transientObservedNodes;
      this.transientObservedNodes = [];

      transientObservedNodes.forEach(function(node) {
        // Transient observers are never added to the target.
        this.removeListeners_(node);

        var registrations = registrationsTable.get(node);
        for (var i = 0; i < registrations.length; i++) {
          if (registrations[i] === this) {
            registrations.splice(i, 1);
            // Each node can only have one registered observer associated with
            // this observer.
            break;
          }
        }
      }, this);
    },

    handleEvent: function(e) {
      // Stop propagation since we are managing the propagation manually.
      // This means that other mutation events on the page will not work
      // correctly but that is by design.
      e.stopImmediatePropagation();

      switch (e.type) {
        case 'DOMAttrModified':
          // http://dom.spec.whatwg.org/#concept-mo-queue-attributes

          var name = e.attrName;
          var namespace = e.relatedNode.namespaceURI;
          var target = e.target;

          // 1.
          var record = new getRecord('attributes', target);
          record.attributeName = name;
          record.attributeNamespace = namespace;

          // 2.
          var oldValue =
              e.attrChange === MutationEvent.ADDITION ? null : e.prevValue;

          forEachAncestorAndObserverEnqueueRecord(target, function(options) {
            // 3.1, 4.2
            if (!options.attributes)
              return;

            // 3.2, 4.3
            if (options.attributeFilter && options.attributeFilter.length &&
                options.attributeFilter.indexOf(name) === -1 &&
                options.attributeFilter.indexOf(namespace) === -1) {
              return;
            }
            // 3.3, 4.4
            if (options.attributeOldValue)
              return getRecordWithOldValue(oldValue);

            // 3.4, 4.5
            return record;
          });

          break;

        case 'DOMCharacterDataModified':
          // http://dom.spec.whatwg.org/#concept-mo-queue-characterdata
          var target = e.target;

          // 1.
          var record = getRecord('characterData', target);

          // 2.
          var oldValue = e.prevValue;


          forEachAncestorAndObserverEnqueueRecord(target, function(options) {
            // 3.1, 4.2
            if (!options.characterData)
              return;

            // 3.2, 4.3
            if (options.characterDataOldValue)
              return getRecordWithOldValue(oldValue);

            // 3.3, 4.4
            return record;
          });

          break;

        case 'DOMNodeRemoved':
          this.addTransientObserver(e.target);
          // Fall through.
        case 'DOMNodeInserted':
          // http://dom.spec.whatwg.org/#concept-mo-queue-childlist
          var target = e.relatedNode;
          var changedNode = e.target;
          var addedNodes, removedNodes;
          if (e.type === 'DOMNodeInserted') {
            addedNodes = [changedNode];
            removedNodes = [];
          } else {

            addedNodes = [];
            removedNodes = [changedNode];
          }
          var previousSibling = changedNode.previousSibling;
          var nextSibling = changedNode.nextSibling;

          // 1.
          var record = getRecord('childList', target);
          record.addedNodes = addedNodes;
          record.removedNodes = removedNodes;
          record.previousSibling = previousSibling;
          record.nextSibling = nextSibling;

          forEachAncestorAndObserverEnqueueRecord(target, function(options) {
            // 2.1, 3.2
            if (!options.childList)
              return;

            // 2.2, 3.3
            return record;
          });

      }

      clearRecords();
    }
  };

  global.JsMutationObserver = JsMutationObserver;

  if (!global.MutationObserver)
    global.MutationObserver = JsMutationObserver;


})(this);

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
