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
  return !isEqual(component.state.atParams, params) ||
    (mbox && component.state.mbox !== mbox) ||
    (timeout && component.state.timeout !== timeout);
}

function getOffers(component, logger) {
  logger.log('getOffers');
  at.getOffer({
    mbox: component.state.mbox,
    params: component.state.atParams,
    timeout: component.state.timeout,
    success: function (response) {
      component.setState({
        gotOffers: true,
        offerData: response
      });
    },
    error: function (status, error) {
      logger.error('getOffer error: ', error, status);
      component.mboxDiv.className = removeMboxClass(component.mboxDiv.className);
    }
  });
}

function getInitialState(opts) {
  opts = opts || {};
  return {
    atParams: opts.params || null
  };
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
  component.setState({
    atParams: getParams(component.props),
    mbox: component.props['data-mbox'],
    timeout: parseInt(component.props['data-timeout'], 10),
    shouldRefresh: true
  });
}

function onComponentWillReceiveProps(component, newProps) {
  let newMbox = newProps['data-mbox'];
  let newTimeout = parseInt(newProps['data-timeout'], 10);
  let newParams = getParams(newProps);
  if (atOptsHaveChanged(component, newMbox, newTimeout, newParams)) {
    component.setState({
      atParams: newParams || component.state.atParams,
      mbox: newMbox || component.state.mbox,
      timeout: newTimeout || component.state.timeout,
      shouldRefresh: true
    });
  }
}

function onComponentUpdated(component, logger) {
  logger.log('MboxComponentDidUpdate');
  if (component.state) {
    if (component.state.gotOffers) {
      logger.log('Applying');
      adobe.target.applyOffer({
        mbox: component.state.mbox,
        offer: component.state.offerData,
        element: component.mboxDiv
      });
      component.mboxDiv.className = removeMboxClass(component.mboxDiv.className);
      component.setState({gotOffers: false});
    }
    if (component.state.shouldRefresh) {
      logger.log('Refreshing');
      getOffers(component, logger);
      component.setState({shouldRefresh: false});
    }
  }
}

at.registerExtension({
  name: 'react.createMboxComponent',
  modules: ['settings', 'logger'],
  register: function (settings, logger) {
    return function (opts) {
      return React.createClass({
        getInitialState: function () {
          return getInitialState(opts);
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

        componentWillReceiveProps: function (newProps) {
          return onComponentWillReceiveProps(this, newProps);
        },

        componentDidUpdate: function () {
          return onComponentUpdated(this, logger);
        }
      });
    };
  }
});

export default adobe.target.ext.react.createMboxComponent;
