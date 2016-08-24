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

'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/* global adobe, React */
(function (React, at) {
  'use strict';

  function appendMboxClass(className) {
    return (className ? className + ' ' : '') + 'mboxDefault';
  }

  function removeMboxClass(className) {
    return className.replace(/\bmboxDefault\b/, '');
  }

  function getParams(props) {
    props = props || {};
    var params = null;
    Object.keys(props).filter(function (k) {
      return k.startsWith('data-') && !['data-mbox', 'data-timeout'].includes(k);
    }).forEach(function (k, i) {
      if (i === 0) {
        params = {};
      }
      params[k] = props[k];
    });
    return params;
  }

  function atOptsHaveChanged(component, mbox, timeout, params) {
    return !Object.is(component.state.atParams, params) || mbox && component.state.mbox !== mbox || timeout && component.state.timeout !== timeout;
  }

  function getOffers(component, logger) {
    console.log('getOffers');
    at.getOffer({
      mbox: component.state.mbox,
      params: component.state.atParams,
      timeout: component.state.timeout,
      success: function success(response) {
        component.setState({
          gotOffers: true,
          offerData: response
        });
      },
      error: function error(status, _error) {
        logger.log('getOffer error: ', _error, status);
        component.mboxDiv.className = removeMboxClass(component.mboxDiv.className);
      }
    });
  }

  function _getInitialState(opts) {
    opts = opts || {};
    return {
      atParams: opts.params || null
    };
  }

  function _getDefaultProps(opts, settings) {
    opts = opts || {};
    return {
      'className': 'mboxDefault',
      'data-mbox': opts.mbox || settings.globalMboxName,
      'data-timeout': opts.timeout || settings.timeout
    };
  }

  function onRender(component) {
    return React.createElement(
      'div',
      _extends({
        ref: function ref(_ref) {
          component.mboxDiv = _ref;
        }
      }, component.props, {
        className: appendMboxClass(component.props.className) }),
      component.props.children
    );
  }

  function onComponentMounted(component, logger) {
    logger.log('MboxComponentDidMount');
  }

  function onComponentWillReceiveProps(component, newProps) {
    console.log('Mbox componentWillReceiveProps');
    var newMbox = newProps['data-mbox'];
    var newTimeout = parseInt(newProps['data-timeout'], 10);
    var newParams = getParams(newProps);
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
        console.log('Applying');
        adobe.target.applyOffer({
          mbox: component.state.mbox,
          offer: component.state.offerData,
          element: component.mboxDiv
        });
        component.mboxDiv.className = removeMboxClass(component.mboxDiv.className);
        component.setState({ gotOffers: false });
      }
      if (component.state.shouldRefresh) {
        console.log('Refreshing');
        getOffers(component, logger);
        component.setState({ shouldRefresh: false });
      }
    }
  }

  at.registerExtension({
    name: 'react.createMboxComponent',
    modules: ['settings', 'logger'],
    register: function register(settings, logger) {
      return function (opts) {
        return React.createClass({
          getInitialState: function getInitialState() {
            return _getInitialState(opts);
          },

          getDefaultProps: function getDefaultProps() {
            return _getDefaultProps(opts, settings);
          },

          render: function render() {
            return onRender(this);
          },

          componentDidMount: function componentDidMount() {
            return onComponentMounted(this, logger);
          },

          componentWillReceiveProps: function componentWillReceiveProps(newProps) {
            return onComponentWillReceiveProps(this, newProps);
          },

          componentDidUpdate: function componentDidUpdate() {
            return onComponentUpdated(this, logger);
          }
        });
      };
    }
  });
})(React, adobe.target);