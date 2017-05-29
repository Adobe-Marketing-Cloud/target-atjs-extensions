/* global adobe, React */
'use strict';
import _ from 'lodash';

function appendMboxClass(component) {
  const className = component.props.className;
  const mboxName = component.props['data-mbox'];

  if (component.atState.editMode) {
    return 'mbox-name-' + mboxName;
  }
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
  let atState = component.atState;
  return !_.isEqual(atState.atParams, params) ||
    (mbox && atState.mbox !== mbox) ||
    (timeout && atState.timeout !== timeout);
}

function getOffers(component, at, logger) {
  logger.log('getOffers');
  at.getOffer({
    mbox: component.atState.mbox,
    params: component.atState.atParams,
    timeout: component.atState.timeout,
    success: function (response) {
      logger.log('Applying');
      at.applyOffer({
        mbox: component.atState.mbox,
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

function onRender(React, component, queryParams) {
  component.atState = {
    editMode: (queryParams.indexOf('mboxEdit') !== -1)
  };

  return <div
    ref={ref => {
      component.mboxDiv = ref;
    }}
    {...component.props}
    className={appendMboxClass(component)}>{component.props.children}
  </div>;
}

function onComponentMounted(component, at, logger) {
  logger.log('MboxComponentDidMount');
  let atState = component.atState;

  atState.atParams = getParams(component.props);
  atState.mbox = component.props['data-mbox'];
  atState.timeout = parseInt(component.props['data-timeout'], 10);

  if (!atState.editMode) {
    getOffers(component, at, logger);
  }
}

function onComponentWillReceiveProps(component, at, logger, newProps) {
  let newMbox = newProps['data-mbox'];
  let newTimeout = parseInt(newProps['data-timeout'], 10);
  let newParams = getParams(newProps);

  if (atOptsHaveChanged(component, newMbox, newTimeout, newParams)) {
    let atState = component.atState;
    atState.atParams = newParams || atState.atParams;
    atState.mbox = newMbox || atState.mbox;
    atState.timeout = newTimeout || atState.timeout;

    if (!atState.editMode) {
      getOffers(component, at, logger);
    }
  }
}

export default function createMboxComponent(React, opts) {
  const at = adobe.target;
  const logger = console;
  const queryParams = location.search;

  return React.createClass({
    getDefaultProps: function () {
      return getDefaultProps(opts);
    },

    render: function () {
      return onRender(React, this, queryParams);
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
