/* Polyfill service v3.11.0
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