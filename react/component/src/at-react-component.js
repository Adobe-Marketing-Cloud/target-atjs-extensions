'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/* global adobe, React */
(function (React, at) {
  'use strict';

  function _getDefaultProps(opts, settings) {
    return {
      'data-mbox': opts.mbox || settings.globalMboxName,
      'data-params': opts.params || null,
      'data-timeout': opts.timeout || settings.timeout
    };
  }

  function appendMboxClass(className) {
    return (className ? className + ' ' : '') + 'mboxDefault';
  }

  function removeMboxClass(className) {
    return className.replace(/\bmboxDefault\b/, '');
  }

  function onRender(component) {
    return React.createElement(
      'div',
      _extends({ ref: function ref(_ref) {
          component.mboxDiv = _ref;
        } }, component.props, { className: appendMboxClass(component.props.className) }),
      component.props.children
    );
  }

  function onComponentMounted(component, logger) {
    logger.log('MboxComponentDidMount');

    at.getOffer({
      mbox: component.props['data-mbox'],
      params: JSON.parse(component.props['data-params']),
      timeout: parseInt(component.props['data-timeout'], 10),
      success: function success(response) {
        component.setState({
          offerData: response
        });
      },
      error: function error(status, _error) {
        logger.log('getOffer error: ', _error, status);
        component.mboxDiv.className = removeMboxClass(component.mboxDiv.className);
      }
    });
  }

  function onComponentUpdated(component, logger) {
    logger.log('MboxComponentDidUpdate');

    adobe.target.applyOffer({
      mbox: component.props['data-mbox'],
      offer: component.state.offerData,
      element: component.mboxDiv
    });
    component.mboxDiv.className = removeMboxClass(component.mboxDiv.className);
  }

  at.registerExtension({
    name: 'react.createMboxComponent',
    modules: ['settings', 'logger'],
    register: function register(settings, logger) {
      return function (opts) {
        return React.createClass({
          getDefaultProps: function getDefaultProps() {
            return _getDefaultProps(opts, settings);
          },

          render: function render() {
            return onRender(this);
          },

          componentDidMount: function componentDidMount() {
            return onComponentMounted(this, logger);
          },

          componentDidUpdate: function componentDidUpdate() {
            return onComponentUpdated(this, logger);
          }
        });
      };
    }
  });
})(React, adobe.target);