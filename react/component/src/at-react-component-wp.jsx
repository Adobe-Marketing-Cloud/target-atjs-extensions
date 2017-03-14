
/* global adobe */
'use strict';

import React from 'react';

const at = adobe.target;

if (!Array.prototype.includes) {
  Array.prototype.includes = function (searchElement) {
    'use strict';
    if (this === null) {
      throw new TypeError('Array.prototype.includes called on null or undefined');
    }

    var O = Object(this);
    var len = parseInt(O.length, 10) || 0;
    if (len === 0) {
      return false;
    }
    var n = parseInt(arguments[1], 10) || 0;
    var k;
    if (n >= 0) {
      k = n;
    } else {
      k = len + n;
      if (k < 0) {
        k = 0;
      }
    }
    var currentElement;
    while (k < len) {
      currentElement = O[k];
      if (searchElement === currentElement ||
         (searchElement !== searchElement && currentElement !== currentElement)) { // NaN !== NaN
        return true;
      }
      k++;
    }
    return false;
  };
}

function isEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function appendMboxClass(className) {
  if (className.indexOf('mboxDefault') === -1) {
    return (className ? className + ' ' : '') + 'mboxDefault';
  }
  return className;
}

function removeMboxClass(className) {
  return className.replace(/\bmboxDefault\b/, '');
}

function getParams(props) {
  props = props || {};
  let params = null;
  Object.keys(props)
    .filter(k => {
      return k.startsWith('data-') && !['data-mbox', 'data-timeout'].includes(k);
    })
    .forEach((k, i) => {
      if (i === 0) {
        params = {};
      }
      params[k.substring(5)] = props[k];
    });
  return params;
}

function atOptsHaveChanged(component, mbox, timeout, params) {
  return !isEqual(component.mboxState.atParams, params) ||
    (mbox && component.mboxState.mbox !== mbox) ||
    (timeout && component.mboxState.timeout !== timeout);
}

function getOffers(component, logger) {
  logger.log('getOffers');
  at.getOffer({
    mbox: component.mboxState.mbox,
    params: component.mboxState.atParams,
    timeout: component.mboxState.timeout,
    success: function (response) {
      logger.log('Applying');
      adobe.target.applyOffer({
        mbox: component.mboxState.mbox,
        offer: response,
        element: component.mboxDiv
      });
      component.mboxDiv.className = removeMboxClass(component.mboxDiv.className);
    },
    error: function (status, error) {
      logger.error('getOffer error: ', error, status);
      component.mboxDiv.className = removeMboxClass(component.mboxDiv.className);
    }
  });
}

function getDefaultProps(opts, settings) {
  opts = opts || {};
  return {
    'className': 'mboxDefault',
    'data-mbox': opts.mbox || settings.globalMboxName,
    'data-timeout': opts.timeout || settings.timeout
  };
}

function onRender(component) {
  return <div
    ref={ref => {
      component.mboxDiv = ref;
    }}
    {...component.props}
    className={appendMboxClass(component.props.className)}>{component.props.children}
    </div>;
}

function onComponentMounted(component, logger) {
  logger.log('MboxComponentDidMount');
  component.mboxState = {
    atParams: getParams(component.props),
    mbox: component.props['data-mbox'],
    timeout: parseInt(component.props['data-timeout'], 10)
  };
  getOffers(component, logger);
}

function onComponentWillReceiveProps(component, newProps, logger) {
  let newMbox = newProps['data-mbox'];
  let newTimeout = parseInt(newProps['data-timeout'], 10);
  let newParams = getParams(newProps);
  if (atOptsHaveChanged(component, newMbox, newTimeout, newParams)) {
    component.mboxState = {
      atParams: newParams || component.mboxState.atParams,
      mbox: newMbox || component.mboxState.mbox,
      timeout: newTimeout || component.mboxState.timeout
    };
    getOffers(component, logger);
  }
}

at.registerExtension({
  name: 'react.createMboxComponent',
  modules: ['settings', 'logger'],
  register: function (settings, logger) {
    return function (opts) {
      return React.createClass({
        getInitialState: function () {
          return null;
        },

        getDefaultProps: function () {
          return getDefaultProps(opts, settings);
        },

        render: function () {
          return onRender(this);
        },

        componentDidMount: function () {
          return onComponentMounted(this, logger);
        },

        shouldComponentUpdate: function () {
          return false;
        },

        componentWillReceiveProps: function (newProps) {
          return onComponentWillReceiveProps(this, newProps, logger);
        }
      });
    };
  }
});

export default adobe.target.ext.react.createMboxComponent;
