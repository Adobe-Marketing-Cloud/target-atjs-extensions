/* global adobe, React */
'use strict';
import _ from 'lodash';

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
      return k.startsWith('data-') && !_.includes(['data-mbox', 'data-timeout'], k);
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
  return !_.isEqual(component.mboxState.atParams, params) ||
    (mbox && component.mboxState.mbox !== mbox) ||
    (timeout && component.mboxState.timeout !== timeout);
}

function getOffers(component, at, logger) {
  logger.log('getOffers');
  at.getOffer({
    mbox: component.mboxState.mbox,
    params: component.mboxState.atParams,
    timeout: component.mboxState.timeout,
    success: function (response) {
      logger.log('Applying');
      at.applyOffer({
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

function getDefaultProps(opts) {
  const DEFAULT_MBOX = 'target-global-mbox';
  const DEFAULT_TIMEOUT = 3000;
  opts = opts || {};
  return {
    'className': 'mboxDefault',
    'data-mbox': opts.mbox || DEFAULT_MBOX,
    'data-timeout': opts.timeout || DEFAULT_TIMEOUT
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

function onComponentMounted(component, at, logger) {
  logger.log('MboxComponentDidMount');
  component.mboxState = {
    atParams: getParams(component.props),
    mbox: component.props['data-mbox'],
    timeout: parseInt(component.props['data-timeout'], 10)
  };
  getOffers(component, at, logger);
}

function onComponentWillReceiveProps(component, at, logger, newProps) {
  let newMbox = newProps['data-mbox'];
  let newTimeout = parseInt(newProps['data-timeout'], 10);
  let newParams = getParams(newProps);
  if (atOptsHaveChanged(component, newMbox, newTimeout, newParams)) {
    component.mboxState = {
      atParams: newParams || component.mboxState.atParams,
      mbox: newMbox || component.mboxState.mbox,
      timeout: newTimeout || component.mboxState.timeout
    };
    getOffers(component, at, logger);
  }
}

export function createMboxComponent(opts) {
  const at = adobe.target;
  const logger = console;

  return React.createClass({
    getDefaultProps: function () {
      return getDefaultProps(opts);
    },

    render: function () {
      return onRender(this);
    },

    componentDidMount: function () {
      return onComponentMounted(this, at, logger);
    },

    shouldComponentUpdate: function () {
      return false;
    },

    componentWillReceiveProps: function (newProps) {
      return onComponentWillReceiveProps(this, at, logger, newProps);
    }
  });
}
