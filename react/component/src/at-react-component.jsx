/* global adobe, React */
'use strict';
import _ from 'lodash';

function appendMboxClass(component) {
  const className = component.props.className;
  const mboxName = component.props['data-mbox'];

  if (component.state.editMode) {
    return (className ? className + ' ' : '') + 'mbox-name-' + mboxName;
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
  return !_.isEqual(component.state.atParams, params) ||
    (mbox && component.state.mbox !== mbox) ||
    (timeout && component.state.timeout !== timeout);
}

function getOffers(component, at, logger) {
  logger.log('getOffers');
  at.getOffer({
    mbox: component.state.mbox,
    params: component.state.atParams,
    timeout: component.state.timeout,
    success: function (response) {
      logger.log('Applying');
      at.applyOffer({
        mbox: component.state.mbox,
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
    className={appendMboxClass(component)}>{component.props.children}
  </div>;
}

function onComponentMounted(component, at, logger) {
  logger.log('MboxComponentDidMount');
  component.setState({
    atParams: getParams(component.props),
    mbox: component.props['data-mbox'],
    timeout: parseInt(component.props['data-timeout'], 10)
  });
  if (!component.state.editMode) {
    getOffers(component, at, logger);
  }
}

function onComponentWillReceiveProps(component, at, logger, newProps) {
  let newMbox = newProps['data-mbox'];
  let newTimeout = parseInt(newProps['data-timeout'], 10);
  let newParams = getParams(newProps);

  if (atOptsHaveChanged(component, newMbox, newTimeout, newParams)) {
    component.setState({
      atParams: newParams || component.state.atParams,
      mbox: newMbox || component.state.mbox,
      timeout: newTimeout || component.state.timeout
    });
    if (!component.state.editMode) {
      getOffers(component, at, logger);
    }
  }
}

export function createMboxComponent(opts) {
  const at = adobe.target;
  const logger = console;
  const queryParams = location.search;

  return React.createClass({
    getDefaultProps: function () {
      return getDefaultProps(opts);
    },

    getInitialState: function () {
      return {
        editMode: (queryParams.indexOf('mboxEdit') !== -1)
      };
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
