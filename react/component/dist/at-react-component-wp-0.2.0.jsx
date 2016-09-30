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
import React from 'react';
import includes from 'lodash/includes';
import isEqual from 'lodash/isEqual';

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
    let params = null;
    Object.keys(props)
      .filter(k => {
        return k.startsWith('data-') && !includes(['data-mbox', 'data-timeout'], k);
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
})(React, adobe.target);

export default adobe.target.ext.react.createMboxComponent;
