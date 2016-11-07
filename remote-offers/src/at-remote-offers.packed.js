/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	__webpack_require__(2);
	module.exports = __webpack_require__(3);


/***/ },
/* 1 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/* Polyfill service v3.11.0
	 * For detailed credits and licence information see http://github.com/financial-times/polyfill-service.
	 * 
	 * UA detected: chrome/54.0.0
	 * Features requested: WeakMap
	 * 
	 * - Object.defineProperty, License: CC0 (required by "WeakMap")
	 * - Array.prototype.forEach, License: CC0 (required by "WeakMap")
	 * - Date.now, License: CC0 (required by "WeakMap")
	 * - WeakMap, License: https://github.com/webcomponents/webcomponentsjs/blob/master/LICENSE.md */

	(function(undefined) {
	if (!(// In IE8, defineProperty could only act on DOM elements, so full support
	// for the feature requires the ability to set a property on an arbitrary object
	'defineProperty' in Object && (function() {
		try {
			var a = {};
			Object.defineProperty(a, 'test', {value:42});
			return true;
		} catch(e) {
			return false
		}
	}()))) {

	// Object.defineProperty
	(function (nativeDefineProperty) {

		var supportsAccessors = Object.prototype.hasOwnProperty('__defineGetter__');
		var ERR_ACCESSORS_NOT_SUPPORTED = 'Getters & setters cannot be defined on this javascript engine';
		var ERR_VALUE_ACCESSORS = 'A property cannot both have accessors and be writable or have a value';

		Object.defineProperty = function defineProperty(object, property, descriptor) {

			// Where native support exists, assume it
			if (nativeDefineProperty && (object === window || object === document || object === Element.prototype || object instanceof Element)) {
				return nativeDefineProperty(object, property, descriptor);
			}

			var propertyString = String(property);
			var hasValueOrWritable = 'value' in descriptor || 'writable' in descriptor;
			var getterType = 'get' in descriptor && typeof descriptor.get;
			var setterType = 'set' in descriptor && typeof descriptor.set;

			if (object === null || !(object instanceof Object || typeof object === 'object')) {
				throw new TypeError('Object must be an object (Object.defineProperty polyfill)');
			}

			if (!(descriptor instanceof Object)) {
				throw new TypeError('Descriptor must be an object (Object.defineProperty polyfill)');
			}

			// handle descriptor.get
			if (getterType) {
				if (getterType !== 'function') {
					throw new TypeError('Getter expected a function (Object.defineProperty polyfill)');
				}
				if (!supportsAccessors) {
					throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
				}
				if (hasValueOrWritable) {
					throw new TypeError(ERR_VALUE_ACCESSORS);
				}
				object.__defineGetter__(propertyString, descriptor.get);
			} else {
				object[propertyString] = descriptor.value;
			}

			// handle descriptor.set
			if (setterType) {
				if (setterType !== 'function') {
					throw new TypeError('Setter expected a function (Object.defineProperty polyfill)');
				}
				if (!supportsAccessors) {
					throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
				}
				if (hasValueOrWritable) {
					throw new TypeError(ERR_VALUE_ACCESSORS);
				}
				object.__defineSetter__(propertyString, descriptor.set);
			}

			// OK to define value unconditionally - if a getter has been specified as well, an error would be thrown above
			if ('value' in descriptor) {
				object[propertyString] = descriptor.value;
			}

			return object;
		};
	}(Object.defineProperty));

	}

	if (!('forEach' in Array.prototype)) {

	// Array.prototype.forEach
	Array.prototype.forEach = function forEach(callback) {
		if (this === undefined || this === null) {
			throw new TypeError(this + 'is not an object');
		}

		if (!(callback instanceof Function)) {
			throw new TypeError(callback + ' is not a function');
		}

		var
		object = Object(this),
		scope = arguments[1],
		arraylike = object instanceof String ? object.split('') : object,
		length = Math.max(Math.min(arraylike.length, 9007199254740991), 0) || 0,
		index = -1,
		result = [],
		element;

		while (++index < length) {
			if (index in arraylike) {
				callback.call(scope, arraylike[index], index, object);
			}
		}
	};

	}

	if (!('Date' in this && 'now' in this.Date && 'getTime' in this.Date.prototype)) {

	// Date.now
	Date.now = function now() {
		return new Date().getTime();
	};

	}

	if (!((function(global) {
		if (!("WeakMap" in global)) return false;
		var o = {};
		var wm = new WeakMap([[o, 'test']]);
		return (wm.get(o) === 'test');
	}(this)))) {

	// WeakMap

	 (function(global) {
		var defineProperty = Object.defineProperty;
		var counter = Date.now() % 1e9;

		var WeakMap = function(data) {
			var i, s;
			this.name = '__st' + (Math.random() * 1e9 >>> 0) + (counter++ + '__');

			// If data is iterable (indicated by presence of a forEach method), pre-populate the map
			data && data.forEach && data.forEach(function (item) {
				this.set.apply(this, item);
			}, this);
		};

		WeakMap.prototype["set"] = function(key, value) {
			if (typeof key !== 'object' && typeof key !== 'function')
				throw new TypeError('Invalid value used as weak map key');

			var entry = key[this.name];
			if (entry && entry[0] === key)
				entry[1] = value;
			else
				defineProperty(key, this.name, {value: [key, value], writable: true});
			return this;
		};
		WeakMap.prototype["get"] = function(key) {
			var entry;
			return (entry = key[this.name]) && entry[0] === key ?
					entry[1] : undefined;
		};
		WeakMap.prototype["delete"] = function(key) {
			var entry = key[this.name];
			if (!entry || entry[0] !== key) return false;
			entry[0] = entry[1] = undefined;
			return true;
		};
		WeakMap.prototype["has"] = function(key) {
			var entry = key[this.name];
			if (!entry) return false;
			return entry[0] === key;
		};

		this.WeakMap = WeakMap;
	})(this);

	}


	})
	.call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 2 */
/***/ function(module, exports) {

	/**
	 * @license
	 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
	 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
	 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
	 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
	 * Code distributed by Google as part of the polymer project is also
	 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
	 */

	(function(global) {

	  // Don't allow this object to be redefined.
	  if (global.JsMutationObserver) {
	    return;
	  }

	  var registrationsTable = new WeakMap();

	  var setImmediate;

	  // As much as we would like to use the native implementation, IE
	  // (all versions) suffers a rather annoying bug where it will drop or defer
	  // callbacks when heavy DOM operations are being performed concurrently.
	  //
	  // For a thorough discussion on this, see:
	  // http://codeforhire.com/2013/09/21/setimmediate-and-messagechannel-broken-on-internet-explorer-10/
	  if (/Trident|Edge/.test(navigator.userAgent)) {
	    // Sadly, this bug also affects postMessage and MessageQueues.
	    //
	    // We would like to use the onreadystatechange hack for IE <= 10, but it is
	    // dangerous in the polyfilled environment due to requiring that the
	    // observed script element be in the document.
	    setImmediate = setTimeout;

	  // If some other browser ever implements it, let's prefer their native
	  // implementation:
	  } else if (window.setImmediate) {
	    setImmediate = window.setImmediate;

	  // Otherwise, we fall back to postMessage as a means of emulating the next
	  // task semantics of setImmediate.
	  } else {
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
	          var record = getRecord('childList', e.target.parentNode);
	          record.addedNodes = addedNodes;
	          record.removedNodes = removedNodes;
	          record.previousSibling = previousSibling;
	          record.nextSibling = nextSibling;

	          forEachAncestorAndObserverEnqueueRecord(e.relatedNode, function(options) {
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

	  if (!global.MutationObserver) {
	    global.MutationObserver = JsMutationObserver;
	    // Explicltly mark MO as polyfilled for user reference.
	    JsMutationObserver._isPolyfilled = true;
	  }

	})(window);

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	 /* global adobe */
	(function (window, document, at) {
	  'use strict';
	  var nanoajax = __webpack_require__(4);
	  var logger;
	  var offers;
	  var observing = false;

	  function unhideElements(hideCss) {
	    if (hideCss && hideCss.parentNode) {
	      hideCss.parentNode.removeChild(hideCss);
	    }
	  }

	  function execHandler(name, handler) {
	    if (typeof handler === 'function') {
	      logger.log(name, 'handler');
	      handler();
	    }
	  }

	  function applyOffer(offer) {
	    at.applyOffer({
	      offer: [{
	        type: 'actions',
	        content: [{
	          selector: offer.selector,
	          content: offer.responseText,
	          action: (offer.method ? offer.method : 'append') + 'Content'
	        }]
	      }]
	    });
	    execHandler('Success', offer.success);
	    unhideElements(offer.hideCss);
	    offer.applied = true;
	    logger.log('Offer applied to ', offer.selector);
	  }

	  function onMutation(mutations) {
	    offers
	      .filter(function (offer) {
	        return offer.fetched && !offer.applied;
	      })
	      .forEach(function (offer) {
	        if (document.querySelectorAll(offer.selector).length) {
	          applyOffer(offer);
	        }
	      });
	  }

	  function setupObserver() {
	    observing = true;

	    var timeout = 30000;
	    var observerConfig = {
	      childList: true,
	      subtree: true
	    };
	    var observer = new window.MutationObserver(onMutation);

	    observer.observe(document.documentElement, observerConfig);
	    window.setTimeout(function () {
	      logger.log('Observer timed out');
	      observer.disconnect();
	      offers.forEach(function (offer) {
	        unhideElements(offer.hideCss);
	      });
	      observing = false;
	    }, timeout);
	  }

	  // injecting CSS to hide containers
	  function addHideCssToHead(selector) {
	    var hideCss = selector + '{visibility:hidden}';
	    var head = document.getElementsByTagName('head')[0];

	    if (head) {
	      var style = document.createElement('style');
	      style.setAttribute('type', 'text/css');
	      if (style.styleSheet) {
	        style.styleSheet.cssText = hideCss;
	      } else {
	        style.appendChild(document.createTextNode(hideCss));
	      }
	      return head.insertBefore(style, head.firstChild);
	    }
	  }

	  function fetchOffer(offer) {
	    nanoajax.ajax({url: offer.url},
	      function (code, responseText) {
	        if (code === 200 && responseText) {
	          offer.fetched = true;
	          offer.responseText = responseText;
	          if (document.querySelectorAll(offer.selector).length) {
	            applyOffer(offer);
	          } else if (!observing) {
	            setupObserver();
	          }
	        } else {
	          logger.error('Error loading content for', offer.url, ', status:', code);
	          unhideElements(offer.hideCss);
	          execHandler('Error', offer.error);
	        }
	      });
	  }

	  function fetchOffers() {
	    offers
	      .filter(function (offer) {
	        if (!offer.url || !offer.selector) {
	          logger.error('Missing URL or selector');
	          return false;
	        }
	        return true;
	      })
	      .forEach(function (offer) {
	        offer.hideCss = addHideCssToHead(offer.selector);
	        offer.fetched = false;
	        fetchOffer(offer);
	      });
	  }

	  adobe.target.registerExtension({
	    name: 'getRemoteOffers',
	    modules: ['logger'],
	    register: function (pLogger) {
	      return function (data) {
	        logger = pLogger;
	        offers = data;
	        fetchOffers();
	      };
	    }
	  });
	})(window, document, adobe.target);


/***/ },
/* 4 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {// Best place to find information on XHR features is:
	// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest

	var reqfields = [
	  'responseType', 'withCredentials', 'timeout', 'onprogress'
	]

	// Simple and small ajax function
	// Takes a parameters object and a callback function
	// Parameters:
	//  - url: string, required
	//  - headers: object of `{header_name: header_value, ...}`
	//  - body:
	//      + string (sets content type to 'application/x-www-form-urlencoded' if not set in headers)
	//      + FormData (doesn't set content type so that browser will set as appropriate)
	//  - method: 'GET', 'POST', etc. Defaults to 'GET' or 'POST' based on body
	//  - cors: If your using cross-origin, you will need this true for IE8-9
	//
	// The following parameters are passed onto the xhr object.
	// IMPORTANT NOTE: The caller is responsible for compatibility checking.
	//  - responseType: string, various compatability, see xhr docs for enum options
	//  - withCredentials: boolean, IE10+, CORS only
	//  - timeout: long, ms timeout, IE8+
	//  - onprogress: callback, IE10+
	//
	// Callback function prototype:
	//  - statusCode from request
	//  - response
	//    + if responseType set and supported by browser, this is an object of some type (see docs)
	//    + otherwise if request completed, this is the string text of the response
	//    + if request is aborted, this is "Abort"
	//    + if request times out, this is "Timeout"
	//    + if request errors before completing (probably a CORS issue), this is "Error"
	//  - request object
	//
	// Returns the request object. So you can call .abort() or other methods
	//
	// DEPRECATIONS:
	//  - Passing a string instead of the params object has been removed!
	//
	exports.ajax = function (params, callback) {
	  // Any variable used more than once is var'd here because
	  // minification will munge the variables whereas it can't munge
	  // the object access.
	  var headers = params.headers || {}
	    , body = params.body
	    , method = params.method || (body ? 'POST' : 'GET')
	    , called = false

	  var req = getRequest(params.cors)

	  function cb(statusCode, responseText) {
	    return function () {
	      if (!called) {
	        callback(req.status === undefined ? statusCode : req.status,
	                 req.status === 0 ? "Error" : (req.response || req.responseText || responseText),
	                 req)
	        called = true
	      }
	    }
	  }

	  req.open(method, params.url, true)

	  var success = req.onload = cb(200)
	  req.onreadystatechange = function () {
	    if (req.readyState === 4) success()
	  }
	  req.onerror = cb(null, 'Error')
	  req.ontimeout = cb(null, 'Timeout')
	  req.onabort = cb(null, 'Abort')

	  if (body) {
	    setDefault(headers, 'X-Requested-With', 'XMLHttpRequest')

	    if (!global.FormData || !(body instanceof global.FormData)) {
	      setDefault(headers, 'Content-Type', 'application/x-www-form-urlencoded')
	    }
	  }

	  for (var i = 0, len = reqfields.length, field; i < len; i++) {
	    field = reqfields[i]
	    if (params[field] !== undefined)
	      req[field] = params[field]
	  }

	  for (var field in headers)
	    req.setRequestHeader(field, headers[field])

	  req.send(body)

	  return req
	}

	function getRequest(cors) {
	  // XDomainRequest is only way to do CORS in IE 8 and 9
	  // But XDomainRequest isn't standards-compatible
	  // Notably, it doesn't allow cookies to be sent or set by servers
	  // IE 10+ is standards-compatible in its XMLHttpRequest
	  // but IE 10 can still have an XDomainRequest object, so we don't want to use it
	  if (cors && global.XDomainRequest && !/MSIE 1/.test(navigator.userAgent))
	    return new XDomainRequest
	  if (global.XMLHttpRequest)
	    return new XMLHttpRequest
	}

	function setDefault(obj, key, value) {
	  obj[key] = obj[key] || value
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }
/******/ ]);